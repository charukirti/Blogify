const conf = {
    appEndpoint: import.meta.env.VITE_APP_ENDPOINT,
    appProjectID: import.meta.env.VITE_APP_PROJECT_ID,
    appDatabaseID: import.meta.env.VITE_APP_DATABASE_ID,
    userCollectionID: import.meta.env.VITE_APP_USER_COLLECTION_ID,
    blogsCollectionID: import.meta.env.VITE_APP_BLOGS_COLLECTION_ID,
    analyticsCollectionID: import.meta.env.VITE_APP_ANALYTICS_COLLECTION_ID,
    commentsCollectionID: import.meta.env.VITE_APP_COMMENTS_COLLECTION_ID,
    likesCollectionID: import.meta.env.VITE_APP_LIKES_COLLECTION_ID,
    viewsCollectionID: import.meta.env.VITE_APP_VIEWS_COLLECTION_ID,
    thumbnailStoreID: import.meta.env.VITE_APP_THUMBNAIL_STORE_ID,
    avatarStoreID: import.meta.env.VITE_APP_AVATARS_STORE_ID,
    tinyMceApiKey: import.meta.env.VITE_APP_VITE_APP_TINY_MCE
};

export default conf;