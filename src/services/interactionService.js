import { Query } from "appwrite";
import { databases, account, ID } from "./appwrite";
import conf from "../conf/conf";

class InteractionService {

    getCurrentDate() {
        return new Date().toISOString();
    }

    async getCurrentUser() {
        try {
            const user = await account.get();
            if (!user) throw new Error('User not authenticated');
            return user;
        } catch (error) {
            console.log('Appwrite service :: getCurrentUser :: error', error);
            throw new Error('Please login to continue');
        }
    }

    async addLike(blogId) {
        try {
            const user = await this.getCurrentUser();
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

            const user = await this.getCurrentUser();
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
            const user = await this.getCurrentUser();

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
            const user = await this.getCurrentUser();
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
            const user = await this.getCurrentUser();

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

            if (existingViews) {
                return await databases.updateDocument(
                    conf.appDatabaseID,
                    conf.viewsCollectionID,
                    existingViews.$id,
                    {
                        views: existingViews.views + 1,
                        lastViewed: this.getCurrentDate()
                    }
                );
            } else {
                return await databases.createDocument(
                    conf.appDatabaseID,
                    conf.viewsCollectionID,
                    blogId,
                    {
                        blog_id: blogId,
                        views: 1,
                        lastViewed: this.getCurrentDate()
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




}

const interactionService = new InteractionService();
export default interactionService;