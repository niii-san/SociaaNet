# SociaaNet — Server Setup Guide

Complete setup instructions for all three SociaaNet services.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure Overview](#project-structure-overview)
- [1. API Server (server/)](#1-api-server-server)
  - [Environment Variables](#server-environment-variables)
  - [Environment Setup](#server-environment-setup)
  - [Install Dependencies](#server-install-dependencies)
  - [Running the Server](#running-the-server)
  - [Build for Production](#server-build-for-production)
- [2. File Service (file-service/)](#2-file-service-file-service)
  - [System Dependencies](#file-service-system-dependencies)
  - [Environment Variables](#file-service-environment-variables)
  - [Environment Setup](#file-service-environment-setup)
  - [Install Dependencies](#file-service-install-dependencies)
  - [Storage Directories](#storage-directories)
  - [Running the File Service](#running-the-file-service)
  - [Build for Production](#file-service-build-for-production)
- [3. Client (client/)](#3-client-client)
  - [Configuration](#client-configuration)
  - [Install Dependencies](#client-install-dependencies)
  - [Running the Client](#running-the-client)
  - [Build for Production](#client-build-for-production)
- [Running All Services Together](#running-all-services-together)
- [Startup Order](#startup-order)
- [Verifying the Setup](#verifying-the-setup)
- [Common Issues](#common-issues)

---

## Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | ≥ 18 | Runtime for all three services |
| **npm** | ≥ 9 | Package management |
| **MongoDB** | ≥ 6.0 | Database (local install or MongoDB Atlas) |
| **FFmpeg** | Latest | Video processing and thumbnail generation (file-service) |
| **Git** | Latest | Clone the repository |

### Installing FFmpeg

FFmpeg is required by the file-service for video processing (thumbnail generation, metadata extraction).

**Ubuntu / Debian:**

```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS (Homebrew):**

```bash
brew install ffmpeg
```

**Verify installation:**

```bash
ffmpeg -version
ffprobe -version
```

Both commands should print version information.

---

## Project Structure Overview

```
SociaaNet/
├── server/           # Express 5 API server (port 8000)
├── file-service/     # Media processing microservice (port 8001)
├── client/           # Next.js 16 frontend (port 3000)
└── docs/             # Documentation
```

All three services run independently and communicate as follows:

```
Client (3000) ──HTTP/WS──▶ Server (8000) ──HTTP──▶ File Service (8001)
                                │
                                ▼
                           MongoDB
```

- The **client** communicates with the **server** via REST API and Socket.IO.
- The **server** communicates with the **file-service** via internal HTTP API (authenticated with a shared API key).
- The **file-service** does NOT connect to MongoDB — it only handles file storage and processing.

---

## 1. API Server (`server/`)

The main API server handles all business logic, authentication, database operations, and real-time Socket.IO communication.

**Tech:** Express 5, Mongoose 9, Socket.IO 4, TypeScript

### Server Environment Variables

The server requires a `.env` file in the `server/` directory. A sample is provided at `server/.env.sample`.

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `PORT` | ✅ | Port the server runs on | `8000` |
| `NODE_ENV` | ✅ | Environment mode | `development` or `production` |
| `SESSION_EXPIRY_IN_MINUTES` | ✅ | Session lifetime in minutes | `10080` (7 days) |
| `MONGODB_URL` | ✅ | MongoDB connection string | `mongodb://localhost:27017/sociaanet` |
| `FILE_SERVICE_URL` | ✅ | URL of the file-service microservice | `http://localhost:8001` |
| `FILE_SERVICE_INTERNAL_API_KEY` | ✅ | Shared secret key to authenticate with the file-service | `your-secret-api-key` |
| `LOG_LEVEL` | ✅ | Pino log level | `info`, `debug`, `warn`, `error` |
| `BASE_URL` | ✅ | Public base URL of the API server | `http://localhost:8000` |
| `GMAIL_ADDRESS` | ✅ | Gmail address for sending OTP emails | `your-email@gmail.com` |
| `GMAIL_APP_PASSWORD` | ✅ | Gmail App Password (not regular password) | `abcd efgh ijkl mnop` |

> **Note:** `GMAIL_APP_PASSWORD` is a Google App Password, not your regular Gmail password. You can generate one at [Google App Passwords](https://myaccount.google.com/apppasswords). You need 2FA enabled on your Google account.

### Server Environment Setup

```bash
cd server

# Copy the sample env file
cp .env.sample .env
```

Open `server/.env` in your editor and fill in all the values:

```env
PORT=8000
SESSION_EXPIRY_IN_MINUTES=10080
NODE_ENV=development
MONGODB_URL=mongodb://localhost:27017/sociaanet
FILE_SERVICE_INTERNAL_API_KEY=your-secret-api-key
FILE_SERVICE_URL=http://localhost:8001
LOG_LEVEL=info
BASE_URL=http://localhost:8000
GMAIL_ADDRESS=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
```

> ⚠️ **Important:** The `FILE_SERVICE_INTERNAL_API_KEY` value must match the `INTERNAL_API_KEY` in the file-service `.env`. This shared secret is used to authenticate internal API calls between the server and file-service.

> ⚠️ **Important:** The `.env.sample` uses `SESSION_EXPIRY_MINUTES` but the code expects `SESSION_EXPIRY_IN_MINUTES`. Make sure to use `SESSION_EXPIRY_IN_MINUTES` in your `.env` file.

### Server Install Dependencies

```bash
cd server
npm install
```

### Running the Server

**Development mode** (with auto-restart via nodemon):

```bash
npm run dev
```

The server starts at `http://localhost:8000`. You should see:

```
SERVER RUNNING ON PORT: 8000
ENVIRONMENT: development
```

The server connects to MongoDB on startup. If MongoDB is not running, the server will fail to start with a connection error.

### Server Build for Production

```bash
# Compile TypeScript to JavaScript
npm run build

# Run the compiled output
npm start
```

The compiled output is written to `server/dist/`.

**Available npm scripts:**

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `nodemon ... ts-node src/server.ts` | Development mode with hot reload |
| `build` | `tsc` | Compile TypeScript |
| `start` | `node dist/server.js` | Run production build |
| `lint` | `eslint 'src/**/*.ts'` | Lint source files |

---

## 2. File Service (`file-service/`)

A standalone microservice that handles all file operations — image uploading/processing (via Sharp), video uploading, and thumbnail generation (via FFmpeg).

**Tech:** Express 5, Sharp, Fluent-FFmpeg, TypeScript

### File Service System Dependencies

The file-service depends on two native tools:

| Tool | Used For | Required |
|------|----------|----------|
| **Sharp** (npm) | Image processing — resize, convert to JPEG | ✅ Auto-installed via npm |
| **FFmpeg** (system) | Video thumbnail generation, metadata extraction | ✅ Must be installed on system |

Sharp is installed automatically with `npm install`. FFmpeg must be installed separately on your system (see [Prerequisites](#prerequisites)).

### File Service Environment Variables

The file-service requires a `.env` file in the `file-service/` directory. A sample is provided at `file-service/.env.sample`.

| Variable | Required | Default | Description | Example |
|----------|----------|---------|-------------|---------|
| `PORT` | No | `8001` | Port the file-service runs on | `8001` |
| `INTERNAL_API_KEY` | ✅ | `""` | Shared secret for authenticating requests from the main server | `your-secret-api-key` |
| `LOG_LEVEL` | No | `info` | Pino log level | `info`, `debug`, `warn`, `error` |

### File Service Environment Setup

```bash
cd file-service

# Copy the sample env file
cp .env.sample .env
```

Open `file-service/.env` in your editor and fill in the values:

```env
PORT=8001
INTERNAL_API_KEY=your-secret-api-key
LOG_LEVEL=info
```

> ⚠️ **Critical:** The `INTERNAL_API_KEY` value here **must exactly match** the `FILE_SERVICE_INTERNAL_API_KEY` in the server's `.env` file. If they don't match, the server will receive `403 Forbidden` errors when trying to upload files.

### File Service Install Dependencies

```bash
cd file-service
npm install
```

### Storage Directories

The file-service stores files locally in the `file-service/storage/` directory with three subdirectories:

```
file-service/
└── storage/
    ├── images/       # Processed JPEG images (avatars, post images)
    ├── videos/       # Uploaded video files
    └── thumbnails/   # Auto-generated video thumbnails
```

These directories are included in the repository (with `.gitkeep` or as empty dirs). If they don't exist, they should be created:

```bash
cd file-service
mkdir -p storage/images storage/videos storage/thumbnails
```

### Running the File Service

**Development mode** (with auto-restart via nodemon):

```bash
npm run dev
```

The file-service starts at `http://localhost:8001`. You should see:

```
file_service microservice running on port 8001
```

### File Service Build for Production

```bash
# Compile TypeScript to JavaScript
npm run build

# Run the compiled output
npm start
```

The compiled output is written to `file-service/dist/`.

**Available npm scripts:**

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `nodemon ... ts-node src/server.ts` | Development mode with hot reload |
| `build` | `tsc` | Compile TypeScript |
| `start` | `node dist/server.js` | Run production build |
| `lint` | `eslint 'src/**/*.ts'` | Lint source files |

### How the File Service Works

The file-service acts as an internal microservice and is **not** exposed to the client directly. All file operations go through the main API server:

1. **Client** uploads a file to the **server** (e.g., `POST /api/v1/media/post`).
2. The **server** forwards the file buffer to the **file-service** via an internal HTTP call with the `x-internal-api-key` header.
3. The **file-service** processes and stores the file, returning a file key.
4. The **server** constructs a public URL using its `BASE_URL` + the file key and stores it in MongoDB.
5. When the client requests the file, it goes through the **server** route (e.g., `GET /api/v1/files/images/:imageKey`), which streams the file from the file-service's storage.

Authentication between server and file-service is done via the `x-internal-api-key` header, validated against the `INTERNAL_API_KEY` environment variable.

---

## 3. Client (`client/`)

The Next.js 16 frontend application with React 19, Tailwind CSS 4, and Socket.IO client.

**Tech:** Next.js 16, React 19, Tailwind CSS 4, Socket.IO Client, Radix UI, shadcn/ui

### Client Configuration

The client does **not** use environment variables. The API endpoint is hardcoded in `client/lib/constants.ts`:

```typescript
export const API_ENDPOINT = "http://localhost:8000/api/v1";
```

If you need to change the server URL, edit this file directly.

The `next.config.ts` is configured to allow loading images from the API server:

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/v1/files/images/**',
      },
    ],
  },
};
```

If your server runs on a different host/port, update both `client/lib/constants.ts` and `client/next.config.ts`.

### Client Install Dependencies

```bash
cd client
npm install
```

### Running the Client

**Development mode** (with hot reload):

```bash
npm run dev
```

The client starts at `http://localhost:3000`.

### Client Build for Production

```bash
# Create an optimized production build
npm run build

# Start the production server
npm start
```

**Available npm scripts:**

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Development mode with HMR |
| `build` | `next build` | Create production build |
| `start` | `next start` | Run production build |
| `lint` | `eslint` | Lint source files |

---

## Running All Services Together

You need **three separate terminals** to run all services:

```bash
# Terminal 1 — File Service (start this first)
cd file-service
npm run dev

# Terminal 2 — API Server (start after file-service is up)
cd server
npm run dev

# Terminal 3 — Client (start after server is up)
cd client
npm run dev
```

### Quick Setup Script

For convenience, you can run this from the project root to set up all environment files at once:

```bash
# From the project root (SociaaNet/)

# Copy server env sample
cp server/.env.sample server/.env

# Copy file-service env sample
cp file-service/.env.sample file-service/.env

# Create storage directories
mkdir -p file-service/storage/images file-service/storage/videos file-service/storage/thumbnails

# Install all dependencies
(cd server && npm install)
(cd file-service && npm install)
(cd client && npm install)

echo "✅ Setup complete! Edit server/.env and file-service/.env with your values."
```

---

## Startup Order

The recommended startup order is:

1. **MongoDB** — Must be running before the server starts
2. **File Service** — Should be running before the server handles media uploads
3. **API Server** — Connects to MongoDB and communicates with file-service
4. **Client** — Connects to the API server

> The server will fail to start if MongoDB is not reachable. The file-service can start independently (no database dependency). The client can start without the server but will show errors for any API call.

---

## Verifying the Setup

After starting all three services, verify they are running correctly:

### 1. File Service Health Check

```bash
curl http://localhost:8001/
```

Expected response:

```json
{
  "message": "file_service microservice is running",
  "status": "success"
}
```

### 2. API Server Health Check

```bash
curl http://localhost:8000/
```

Expected response:

```json
{
  "status_code": 200,
  "success": true,
  "message": "SociaaNet server",
  "data": null
}
```

### 3. Client

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the SociaaNet landing page.

---

## Common Issues

### Server fails to start with "Environment variable X is required"

All server environment variables are **required**. Make sure your `server/.env` has all variables set. The server validates all env vars on startup and will crash immediately if any are missing.

### Server fails to connect to MongoDB

- Ensure MongoDB is running: `mongosh` or `mongod --version`
- Check your `MONGODB_URL` in `server/.env` — it should be a valid MongoDB connection string
- For MongoDB Atlas, ensure your IP is whitelisted and the connection string includes username/password

### File uploads fail with 403 Forbidden

The `FILE_SERVICE_INTERNAL_API_KEY` in `server/.env` must **exactly match** the `INTERNAL_API_KEY` in `file-service/.env`. The file-service checks the `x-internal-api-key` header on every request.

### Video upload/processing fails

- Ensure FFmpeg is installed: `ffmpeg -version`
- Ensure `ffprobe` is also available: `ffprobe -version`
- The `fluent-ffmpeg` npm package requires the system FFmpeg binary to be in your `PATH`

### Client can't connect to the server (CORS errors)

The server CORS is configured to allow `http://localhost:3000` only. If your client runs on a different origin, update the CORS origin in `server/src/app.ts`.

### OTP emails not sending

- Enable 2-Step Verification on your Google account
- Generate an App Password at [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Use the App Password (not your Google password) as `GMAIL_APP_PASSWORD`
- Ensure `GMAIL_ADDRESS` matches the account used to generate the App Password

### `.env.sample` vs actual variable names

There is a known discrepancy in `server/.env.sample`: it uses `SESSION_EXPIRY_MINUTES` but the code expects `SESSION_EXPIRY_IN_MINUTES`. Always use `SESSION_EXPIRY_IN_MINUTES` in your actual `.env` file.

### Port conflicts

Default ports used:

| Service | Default Port |
|---------|-------------|
| Client | 3000 |
| Server | 8000 |
| File Service | 8001 |

If any of these ports are in use, change them in the respective `.env` / config files and update all cross-references.
