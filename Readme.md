# Multimedia Upload & Search (MERN)

A MERN stack application that allows authenticated users to upload and preview multimedia files (images, videos, audio, PDFs), search uploaded files by filename/tags, and rank results by relevance (views + recency + keyword match).

## Tech Stack
- **Frontend:** React (Hooks), Redux Toolkit, SASS/CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Atlas) for metadata
- **Media Storage:** Cloudinary
- **Auth:** JWT (HTTP-only cookies)
- **Docs:** Swagger (OpenAPI)
- **Testing:** Jest + Supertest + mongodb-memory-server

---

## Features
- User registration/login/logout with JWT cookies
- Upload (image/video/audio/pdf) to Cloudinary
- Store file metadata in MongoDB (URL, type, size, tags, views)
- Preview media directly from Cloudinary URLs
- Search by **single search bar** across **filename + tags**
- Filters: type (All/image/video-audio/pdf-raw) + sort (relevance/newest/most viewed)
- Ranking: keyword hit + view count + recency
- Swagger API docs at `/api/docs`
- Basic backend tests with Jest


## Run Locally

- **Frontend run command:** 
    cd frontend
    npm install
    npm start
    Runs on :- http://localhost:3000
- **Backend run command:** 
    cd backend
    npm install
    npm run dev
    Runs on :-  http://localhost:5000

- **Live URL:** https://multimedia-upload-search.vercel.app/

- **Run Tests:**
    npm test
- **Swagger UI:** http://localhost:5000/api/docs
