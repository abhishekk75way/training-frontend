# Audio Trim Frontend

This is a **React + TypeScript frontend** for an **Audio Trimming / Conversion system**.
It provides a UI to upload audio files, send them to a backend for processing, track job status, and download the trimmed audio.

The frontend communicates with a **Go (Gin) backend API** using JWT-based authentication.

## Features

* Upload files (mp4, wav, etc.)
* Multiple files upload support
* Drag & drop file upload
* Send audio for backend processing
* Job-based processing with status tracking
* Download processed audio files
* Protected routes (JWT required)
* Axios API service with interceptor
* Light / Dark theme support
* Error boundary handling

## Tech Stack

* React
* TypeScript
* Vite
* Axios
* Bun
* HTML5 Audio API

## Project Structure

```
src/
 ├─ api/
 │   └─ api.ts              # Axios instance & audio APIs
 ├─ components/
 │   ├─ AudioTrim.tsx       # Main audio trim UI
 │   ├─ UploadAudio.tsx     # File upload
 │   ├─ AudioPlayer.tsx     # Audio preview
 │   ├─ Loader.tsx          # Loading indicator
 │   └─ ThemeToggle.tsx
 ├─ layouts/
 │   └─ AppLayout.tsx
 ├─ routes/
 │   ├─ ProtectedRoute.tsx
 │   └─ AdminRoute.tsx
 ├─ styles/
 │   └─ global.css
 ├─ main.tsx
 └─ vite-env.d.ts
```

## Requirements

* Node.js (LTS recommended)
* bun
* Running Go backend (Audio API)
* Valid JWT token (login handled elsewhere)

## Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:8080
```

Optional:

```env
VITE_APP_NAME=Audio Trim
```

## Install Dependencies

```bash
bun install
```

## Run Development Server

```bash
bun run dev
```

Open in browser:

```
http://localhost:5173/audio
```

## How Audio Trimming Works

1. User navigates to `/audio`
2. Uploads an audio file
3. Frontend sends file to backend
4. Backend creates a processing job
5. Frontend polls job status
6. Once completed, user downloads processed audio

## API Endpoints Used

> All endpoints require **JWT authentication**

| Action               | Method | Endpoint             |
| -------------------- | ------ | -------------------- |
| Convert / Trim audio | POST   | `/auth/convert`      |
| Job status           | GET    | `/auth/jobs/:id`     |
| Download result      | GET    | `/auth/download/:id` |
