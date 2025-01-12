import { Query } from "appwrite";
import { databases, ID } from "./appwrite";
import conf from "../conf/conf";
import authservice from "./auth";

class InteractionService {

    getCurrentDate() {
        return new Date().toISOString();
    }

    async addLike(blogId) {
        try {
            const user = await authservice.getCurrentUser();
            const existingLike = await this.hasLiked(blogId, user.$id);

            if (existingLike) {
                throw new Error('You have already liked this blog');
            }

            return await databases.createDocument(
                conf.appDatabaseID,
                conf.likesCollectionID,
                ID.unique(),
                {
                    user_id: user.$id,
                    blog_id: blogId,
                    created_at: this.getCurrentDate()
                }
            );
        } catch (error) {
            console.log('Appwrite service :: addLike :: error', error);
            throw error;
        }
    }

    async removeLike(blogId) {
        try {

            const user = await authservice.getCurrentUser();
            if (!user) throw new Error('User not found');


            if (!blogId) throw new Error('Blog ID is required');

            const likes = await databases.listDocuments(
                conf.appDatabaseID,
                conf.likesCollectionID,
                [
                    Query.equal('user_id', [user.$id]),
                    Query.equal('blog_id', [blogId])
                ]
            );

            if (likes.documents.length > 0) {
                await databases.deleteDocument(
                    conf.appDatabaseID,
                    conf.likesCollectionID,
                    likes.documents[0].$id
                );
                return true;
            }
            return false;

        } catch (error) {
            console.log('Appwrite service :: removeLike :: error', error);
            throw error;
        }
    }

    async hasLiked(blogId, userId) {
        try {
            const likes = await databases.listDocuments(
                conf.appDatabaseID,
                conf.likesCollectionID,
                [
                    Query.equal('user_id', userId),
                    Query.equal('blog_id', blogId),
                ]
            );
            return likes.total > 0;
        } catch (error) {
            console.log('Appwrite service :: hasLiked :: error', error);
            return false;
        }
    }

    async getLikesCount(blogId) {
        try {
            const likes = await databases.listDocuments(
                conf.appDatabaseID,
                conf.likesCollectionID,
                [
                    Query.equal('blog_id', blogId),
                ]
            );
            return likes.total;
        } catch (error) {
            console.log('Appwrite service :: getLikesCount :: error', error);
            return 0;
        }
    }

    // comments

    async addComment(blogId, content, parentId = null) {
        try {
            const user = await authservice.getCurrentUser();

            return await databases.createDocument(
                conf.appDatabaseID,
                conf.commentsCollectionID,
                ID.unique(),
                {
                    user_id: user.$id,
                    username: user.name,
                    blog_id: blogId,
                    content: content,
                    parent_id: parentId,
                    created_at: this.getCurrentDate()
                }
            );
        } catch (error) {
            console.log('Appwrite service :: addComment :: error', error);
            throw new Error('Unable to add comment');
        }
    }

    async removeComment(commentId) {
        try {
            const user = await authservice.getCurrentUser();
            const comment = await databases.getDocument(
                conf.appDatabaseID,
                conf.commentsCollectionID,
                commentId,
            );

            // avoid deleting others comment

            if (comment.user_id !== user.$id) {
                throw new Error('You can delete your own comments!');
            }

            await databases.deleteDocument(
                conf.appDatabaseID,
                conf.commentsCollectionID,
                commentId,
            );
            return true;
        } catch (error) {
            console.log('Appwrite service :: removeCommentId :: error', error);
            throw new Error('Unable to remove comment, try again later.');
        }
    }

    async editComment(commentId, editedContent) {
        try {
            const user = await authservice.getCurrentUser();

            const comment = await databases.getDocument(
                conf.appDatabaseID,
                conf.commentsCollectionID,
                commentId,
            );

            if (comment.user_id !== user.$id) {
                throw new Error('You can edit your own comment');
            }

            return await databases.updateDocument(
                conf.appDatabaseID,
                conf.commentsCollectionID,
                commentId,
                {
                    content: editedContent,
                }
            );
        } catch (error) {
            console.log('Appwrite service :: editComment :: error', error);
            throw new Error('Unable to edit comment, try again later');
        }
    }


    async getBlogComments(blogId) {
        try {
            const comments = await databases.listDocuments(
                conf.appDatabaseID,
                conf.commentsCollectionID,
                [
                    Query.equal('blog_id', blogId),
                    Query.orderDesc('created_at')
                ]
            );

            return comments;
        } catch (error) {
            console.log('Appwrite service :: getBlogComments :: error', error);
            throw new Error('Unable to fetch comments, try again later');
        }
    }

    async getCommentsReplies(parentId) {
        try {
            const replies = await databases.listDocuments(
                conf.appDatabaseID,
                conf.commentsCollectionID,
                [
                    Query.equal('parent_id', parentId),
                    Query.orderDesc('created_at')
                ]
            );

            return replies;
        } catch (error) {
            console.log('Appwrite service :: getCommentsReplies :: error', error);
            throw new Error('Unable to fetch replies, try again later');
        }
    }

    async getCommentsCount(blogId) {
        try {
            const comments = await databases.listDocuments(
                conf.appDatabaseID,
                conf.commentsCollectionID,
                [
                    Query.equal('blog_id', blogId)
                ]
            );
            return comments.total;
        } catch (error) {
            console.log('Appwrite service :: getCommentsCount :: error', error);
            return 0;
        }
    }

    async incrementViewsCount(blogId) {
        try {
            const existingViews = await this.getViewsCount(blogId);
            const currentDate = new Date();
            const todayKey = currentDate.toISOString().split('T')[0];

            const getDayCount = (viewHistory, date) => {
                const entry = viewHistory.find(e => e.startsWith(date));
                return entry ? parseInt(entry.split(':')[1]) : 0;
            };

            if (existingViews) {
                const lastViewed = new Date(existingViews.lastViewed);
                const timeDefference = (currentDate - lastViewed) / (1000 * 60);

                if (timeDefference < 1) {
                    console.log('Wait for 1 minute for view count change');
                    return existingViews;
                }

                let viewHistory = existingViews.viewHistory || [];


                const existingCount = getDayCount(viewHistory, todayKey);
                const todayEntry = `${todayKey}:${existingCount + 1}`;
                const existingTodayIndex = viewHistory.findIndex(entry => entry.startsWith(todayKey));

                if (existingTodayIndex !== -1) {

                    viewHistory[existingTodayIndex] = todayEntry;
                } else {

                    viewHistory.push(todayEntry);
                }


                viewHistory = viewHistory
                    .filter(entry => {
                        const entryDate = new Date(entry.split(':')[0]);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return entryDate >= thirtyDaysAgo;
                    })
                    .sort((a, b) => new Date(a.split(':')[0]) - new Date(b.split(':')[0]));

                return await databases.updateDocument(
                    conf.appDatabaseID,
                    conf.viewsCollectionID,
                    existingViews.$id,
                    {
                        views: existingViews.views + 1,
                        lastViewed: this.getCurrentDate(),
                        viewHistory: viewHistory
                    }
                );
            } else {

                return await databases.createDocument(
                    conf.appDatabaseID,
                    conf.viewsCollectionID,
                    ID.unique(),
                    {
                        blog_id: blogId,
                        views: 1,
                        lastViewed: this.getCurrentDate(),
                        viewHistory: [`${todayKey}:1`]
                    }
                );
            }
        } catch (error) {
            console.log('Error in incrementing views', error);
            throw new Error('Error in incrementing views');
        }
    }


    async getViewsCount(blogId) {
        try {
            const data = await databases.listDocuments(
                conf.appDatabaseID,
                conf.viewsCollectionID,
                [
                    Query.equal('blog_id', blogId)
                ]
            );

            return data.documents.length > 0 ? data.documents[0] : null;
        } catch (error) {
            if (error.code === 404) {
                return null;
            }
            console.error('Error getting view count:', error);
            throw error;
        }
    }

    async deleteDocuments(collectionId, queries) {
        try {
            const { documents } = await databases.listDocuments(
                conf.appDatabaseID,
                collectionId,
                queries,
            );
            return await Promise.all(documents.map(doc => databases.deleteDocument(
                conf.appDatabaseID,
                collectionId,
                doc.$id
            )));
        } catch (error) {
            console.log('Error deleting document', error);
        }
    }


    async deleteComments(blogId) {
        try {
            return await this.deleteDocuments(
                conf.commentsCollectionID,
                [Query.equal('blog_id', blogId)]
            );
        } catch (error) {
            console.log('Error deleting comments', error);
        }
    }

    async deleteLikes(blogId) {
        try {
            return await this.deleteDocuments(
                conf.likesCollectionID,
                [Query.equal('blog_id', blogId)]
            );
        } catch (error) {
            console.log('Error deleting Likes', error);
        }
    }

    async deleteViews(blogId) {
        try {
            return await this.deleteDocuments(
                conf.viewsCollectionID,
                [Query.equal('blog_id', blogId)]
            );
        } catch (error) {
            console.log('Error deleting views', error);
        }
    }

    async deleteInteractions(blogId) {
        try {
            await Promise.all([

                this.deleteComments(blogId),
                this.deleteLikes(blogId),
                this.deleteViews(blogId)
            ]);
        } catch (error) {
            console.log('Error deleting interactions', error);
        }
    }
}

const interactionService = new InteractionService();
export default interactionService;