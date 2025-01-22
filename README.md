# Blogify
A full-featured blogging platform built with React, Redux Toolkit, Appwrite, and Tailwind CSS.

## 🚀 Features
- ### Authentication & Authorization

    - Secure user registration and login
    - Social media authentication (Google)
    - Protected routes 
    
- ### Blog management
    - Create, read, update, and delete blog posts
    - Rich text editor for content creation (tinyMCE)
    - Image upload and management
    
- ### Interactive features
    - Nested comments
    - Like and dislike posts
    - filter by tags

- ### Analytics
    - Time period selection
      - Weekly, Monthly, and Yearly
    - Data visualization with graphs
    - Key metrics tracked
        - Post views 
        - Likes 
        - Comments
    - Realtime analytics 


## 🛠️ Tech Stack
- Frontend: React.js + Vite
- State management: Redux toolkit
- Styling: Tailwind CSS 
- Backend & Auth: Appwrite Cloud
- Database: Appwrite Database
- File Storage: Appwrite Storage
- Graphs: Recharts

## 📦 Installation
### 1. Clone Repository
```bash
git clone https://github.com/charukirti/blogify
cd Blogify
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Set up environment variables
```env
VITE_APP_ENDPOINT='https://cloud.appwrite.io/v1'
VITE_APP_PROJECT_ID='Your project id'
VITE_APP_DATABASE_ID='Your database id'
VITE_APP_THUMBNAIL_STORE_ID = 'Your store id'  
VITE_APP_BLOGS_COLLECTION_ID='Your blogs collection id'  
VITE_APP_COMMENTS_COLLECTION_ID='Your comments collection id' 
VITE_APP_VIEWS_COLLECTION_ID = 'Your views collection id'
VITE_APP_LIKES_COLLECTION_ID='Likes collection id' 
VITE_APP_TINY_MCE='TinyMCE API key'

```
### 4. Start development server
```bash
npm run dev
```

## Contributing

- Fork the repository
- Create a feature branch (git checkout -b feature/amazing-feature)
- Commit your changes (git commit -m 'Add amazing feature')
- Push to the branch (git push origin feature/amazing-feature)
- Open a Pull Request