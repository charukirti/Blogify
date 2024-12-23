import { Query } from "appwrite";
import { databases, ID, bucket } from "./appwrite";
import conf from "../conf/conf";
import { validatePostData } from "../utils/validatePosts";


export class DatabaseService {


    // Create a new document in the database

    async createPost({ title, slug, content, featuredImage, author_id, created_at, status, tags }) {
        try {
            validatePostData({ title, slug, content, tags });
            return await databases.createDocument(
                conf.appDatabaseID,
                conf.blogsCollectionID,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    status,
                    created_at: created_at || Date.now(),
                    author_id,
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
    async updatePost(slug, { title, content, featuredImage, updated_at, status, tags }) {
        try {
            validatePostData({ title, slug, content, tags });
            return await databases.updateDocument(
                conf.appDatabaseID,
                conf.blogsCollectionID,
                slug,
                {
                    title,
                    content,
                    featuredImage,
                    tags,
                    status,
                    updated_at: updated_at || Date.now(),
                }
            );
        } catch (error) {
            console.log('Appwrite service :: updatePost :: error', error);
            throw new Error('Error while updating post');
        }
    }

    // delete post

    async deletePost(slug) {
        try {
            await databases.deleteDocument(
                conf.appDatabaseID,
                conf.blogsCollectionID,
                slug
            );
            return true;
        } catch (error) {
            console.log('Appwrite service :: deletePost :: error', error);
            return false;

        }
    }

    // get single post
    async getPost(slug) {
        try {
            return await databases.getDocument(
                conf.appDatabaseID,
                conf.blogsCollectionID,
                slug
            );
        } catch (error) {
            console.log('Appwrite service :: getPost :: error', error);
            throw new Error('Error while fetching post');
        }
    }

    // get all posts

    async getPosts(queries = [Query.equal('status', 'active')]) {
        try {
            return await databases.listDocuments(
                conf.appDatabaseID,
                conf.blogsCollectionID,
                queries,
            );
        } catch (error) {
            console.log('Appwrite service :: getAllPosts :: error', error);
            throw new Error('Error while fetching posts');
        }
    }

    // 

}

const dbService = new DatabaseService();
export default dbService;