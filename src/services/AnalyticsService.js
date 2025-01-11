import { Query } from "appwrite";
import { databases } from "./appwrite";
import conf from "../conf/conf";

class AnalyticsService {
    constructor() {
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000;
    }

    getCacheKey(blogId, period) {
        return `${blogId}-${period}`;
    }

    getCachedData(blogId, period) {
        const key = this.getCacheKey(blogId, period);
        const cached = this.cache.get(key);

        if (cached && Date.now() - cached.timeStamp < this.cacheTimeout) {
            return cached.data;
        }
        return null;
    }

    setCacheData(blogId, period, data) {
        const key = this.getCacheKey(blogId, period);
        this.cache.set(key, {
            data,
            timeStamp: Date.now()
        });
    }

    getDateKey(date, period) {
        const dateObj = new Date(date);

        switch (period) {
            case 'weekly':
                return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            case 'monthly':
                const weekNum = Math.ceil(dateObj.getDate() / 7);
                return `Week ${weekNum}`;
            case 'yearly':
                return dateObj.toLocaleDateString('en-US', { month: 'long' });
            default:
                return date.split('T')[0];
        }
    }

    initializeTimeSeries(startDate, endDate, period) {
        const series = new Map();
        let current = new Date(startDate);

        while (current <= endDate) {
            const dateKey = this.getDateKey(current.toISOString(), period);
            series.set(dateKey, {
                name: dateKey,
                likes: 0,
                comments: 0,
                views: 0
            });

            switch (period) {
                case 'weekly':
                    current.setDate(current.getDate() + 1);
                    break;
                case 'monthly':
                    current.setDate(current.getDate() + 7);
                    break;
                case 'yearly':
                    current.setMonth(current.getMonth() + 1);
                    break;
            }
        }
        return series;
    }

    compareDates(a, b, period) {
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        switch (period) {
            case 'weekly':
                return weekdays.indexOf(a) - weekdays.indexOf(b);
            case 'monthly':
                return parseInt(a.split(' ')[1]) - parseInt(b.split(' ')[1]);
            case 'yearly':
                return months.indexOf(a) - months.indexOf(b);
            default:
                return new Date(a) - new Date(b);
        }
    }

    async fetchAggregatedData(blogId, period) {
        try {
            const cached = this.getCachedData(blogId, period);
            if (cached) return cached;

            let queries = [Query.equal('blog_id', blogId)];
            const now = new Date();
            let startDate;

            switch (period) {
                case 'weekly':
                    startDate = new Date(now);
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'monthly':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'yearly':
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
                default:
                    throw new Error('Invalid period');
            }

            queries.push(Query.greaterThanEqual('created_at', startDate.toISOString()));

            const [likes, comments, views] = await Promise.all([
                databases.listDocuments(
                    conf.appDatabaseID,
                    conf.likesCollectionID,
                    queries
                ),
                databases.listDocuments(
                    conf.appDatabaseID,
                    conf.commentsCollectionID,
                    queries
                ),
                databases.listDocuments(
                    conf.appDatabaseID,
                    conf.viewsCollectionID,
                    [
                        Query.equal('blog_id', blogId),
                        Query.greaterThanEqual('lastViewed', startDate.toISOString())
                    ]
                )
            ]);

            const graphTimeSeries = this.initializeTimeSeries(startDate, now, period);

            likes.documents.forEach(like => {
                const dateKey = this.getDateKey(like.created_at, period);
                if (graphTimeSeries.has(dateKey)) {
                    graphTimeSeries.get(dateKey).likes++;
                }
            });

            comments.documents.forEach(comment => {
                const dateKey = this.getDateKey(comment.created_at, period);
                if (graphTimeSeries.has(dateKey)) {
                    graphTimeSeries.get(dateKey).comments++;
                }
            });

            views.documents.forEach(view => {
                if (view.viewHistory) {
                    view.viewHistory.forEach(historyEntry => {
                        const [date, count] = historyEntry.split(':');
                        const dateKey = this.getDateKey(date, period);
                        if (graphTimeSeries.has(dateKey)) {
                            graphTimeSeries.get(dateKey).views += parseInt(count);
                        }
                    });
                }
            });

            const result = {
                totals: {
                    likes: likes.total,
                    comments: comments.total,
                    views: views.documents.reduce((sum, view) => sum + view.views, 0)
                },
                timeSeries: Array.from(graphTimeSeries.values())
                    .sort((a, b) => this.compareDates(a.name, b.name, period))
            };

            this.setCacheData(blogId, period, result);
            return result;

        } catch (error) {
            console.log('Appwrite service :: getAggregatedData :: error', error);
            throw error;
        }
    }

    async fetchAnalytics(blog_ids, period) {
        try {
            const aggregatedData = await Promise.all(blog_ids.map((blogId) => {
                return this.fetchAggregatedData(blogId, period);
            }));

            const totals = aggregatedData.reduce((acc, data) => {
                acc.likes += data.totals.likes;
                acc.comments += data.totals.comments;
                acc.views += data.totals.views;
                return acc;
            }, { likes: 0, comments: 0, views: 0 });

            const timeSeriesMap = new Map();
            aggregatedData.forEach(data => {
                data.timeSeries.forEach(point => {
                    if (!timeSeriesMap.has(point.name)) {
                        timeSeriesMap.set(point.name, { ...point });
                    } else {
                        const existingData = timeSeriesMap.get(point.name);
                        existingData.likes += point.likes;
                        existingData.comments += point.comments;
                        existingData.views += point.views;
                    }
                });
            });

            return {
                totals,
                timeSeries: Array.from(timeSeriesMap.values())
                    .sort((a, b) => new Date(a.name) - new Date(b.name))
            };

        } catch (error) {
            console.log('Appwrite service :: fetchAnalytics :: error', error);
            throw error;
        }
    }
}

const analyticsService = new AnalyticsService();
export default analyticsService;