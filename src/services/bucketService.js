import conf from "../conf/conf";
import { bucket, ID } from "./appwrite";

class BucketService {

    async uploadFile(file) {
        try {
            return await bucket.createFile(
                conf.thumbnailStoreID,
                ID.unique(),
                file
            );
        } catch (error) {
            console.log('Appwrite Service :: uploadFile :: error', error);
        }
    }

    async deleteFile(fileID) {
        try {
            return await bucket.deleteFile(
                conf.thumbnailStoreID,
                fileID
            );
        } catch (error) {
            console.log('Appwrite Service :: deleteFile :: error', error);
        }
    }

    getFilePreview(fileID) {
        return bucket.getFilePreview(
            conf.thumbnailStoreID,
            fileID
        );
    }
}

const bucketService = new BucketService();

export default bucketService;