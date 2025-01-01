import { ID, Query } from "appwrite";
import { account, databases } from "./appwrite";
import conf from "../conf/conf";
import { validatePostData } from "../utils/validatePosts";
import interactionService from "./interactionService";


export class DatabaseService {

    // function to get userId

    async getUserId(userId) {
        try {
            return await account.get(userId);
        } catch (error) {
            console.log('Appwrite service :: getUserId :: error', error);
        }
    }

    // function to get current date
    getCurrentDate() {
        return new Date().toISOString();
    }

    // Create a new document in the database

    async createPost({ title, slug, content, featuredImage, author_id, author_name, description, created_at, status, tags }) {
        try {
            validatePostData({ title, slug, content, tags });
            return await databases.createDocument(
                conf.appDatabaseID,
                conf.blogsCollectionID,
                ID.unique(),
                {
                    title,
                    content,
                    description,
                    slug,
                    featuredImage,
                    status,
                    created_at: this.getCurrentDate(),
                    author_id,
                    author_name,
                    tags,
                }
            );
        }
        catch (error) {
            console.log('Appwrite service :: createPost :: error', error);
            throw new Error('Error while creating post');
        }
    }
    // update post
    async updatePost(documentId, { title, slug, content, featuredImage, description, updated_at, status, tags }) {
        try {
            validatePostData({ title, slug, content, tags });
            return await databases.updateDocument(
                conf.appDatabaseID,
                conf.blogsCollectionID,
                documentId,
                {
                    title,
                    content,
                    description,
                    slug,
                    featuredImage,
                    tags,
                    status,
                    updated_at: this.getCurrentDate(),
                }
            );
        } catch (error) {
            console.log('Appwrite service :: updatePost :: error', error);
            throw new Error('Error while updating post');
        }
    }

    // delete post

    async deletePost(documentId) {
        try {
            await databases.deleteDocument(
                conf.appDatabaseID,
                conf.blogsCollectionID,
                documentId
            );
            return true;
        } catch (error) {
            console.log('Appwrite service :: deletePost :: error', error);
            return false;

        }
    }

    // get single post
    async getPost(documentId) {
        try {
            const post = await databases.getDocument(
                conf.appDatabaseID,
                conf.blogsCollectionID,
                documentId
            );
            
            const likes_count = await interactionService.getLikesCount(documentId);
            return {
                ...post,
                likes_count
            };
        } catch (error) {
            console.log('Appwrite service :: getPost :: error', error);
            throw new Error('Error while fetching post');
        }
    }

    // get all posts

    async getPosts(queries = [Query.equal('status', 'active')]) {
        try {
            const posts = await databases.listDocuments(
                conf.appDatabaseID,
                conf.blogsCollectionID,
                queries,
            );
            
            const postsWithLikes = await Promise.all(
                posts.documents.map(async (post) => {
                    const likes_count = await interactionService.getLikesCount(post.$id);
                    return {
                        ...post,
                        likes_count
                    };
                })
            );
            
            return {
                ...posts,
                documents: postsWithLikes
            };
        } catch (error) {
            console.log('Appwrite service :: getAllPosts :: error', error);
            throw new Error('Error while fetching posts');
        }
    }
}

    // 



const dbService = new DatabaseService();
export default dbService;