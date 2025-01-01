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

}

const interactionService = new InteractionService();
export default interactionService;