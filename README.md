# SociaaNet

A full-stack social media platform built with modern web technologies. SociaaNet delivers a complete social networking experience featuring posts, reels, real-time messaging, notifications, follow system, explore feed, and a full moderator dashboard — all with a responsive, mobile-first UI.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Express](https://img.shields.io/badge/Express-5-000?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_9-47A248?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socket.io)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Features](#features)
  - [Authentication & Security](#authentication--security)
  - [User Profiles](#user-profiles)
  - [Posts](#posts)
  - [Reels](#reels)
  - [Feed & Explore](#feed--explore)
  - [Comments](#comments)
  - [Social Interactions](#social-interactions)
  - [Real-Time Chat](#real-time-chat)
  - [Notifications](#notifications)
  - [Search](#search)
  - [Settings](#settings)
  - [Reporting System](#reporting-system)
  - [Moderator Dashboard](#moderator-dashboard)
  - [Activity & History Tracking](#activity--history-tracking)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [API Overview](#api-overview)
- [Socket.IO Events](#socketio-events)

---

## Overview

SociaaNet is a monorepo social media application consisting of three services:

| Service | Description | Port |
|---------|-------------|------|
| **server** | Main API server — handles authentication, users, posts, reels, chat, notifications, feed, moderation | `8000` |
| **client** | Next.js frontend — responsive SPA with App Router, server components, and real-time features | `3000` |
| **file-service** | Media microservice — handles image uploads/resizing, video uploads, and thumbnail generation | configurable |

---

## Architecture

```
┌─────────────┐     HTTP/WS      ┌─────────────┐     HTTP      ┌──────────────┐
│   Client    │◄────────────────►│   Server    │◄────────────►│ File Service │
│  (Next.js)  │                  │  (Express)  │               │  (Express)   │
│  Port 3000  │                  │  Port 8000  │               │   Storage    │
└─────────────┘                  └──────┬──────┘               └──────────────┘
                                        │
                                        │ Mongoose
                                        ▼
                                 ┌─────────────┐
                                 │   MongoDB   │
                                 └─────────────┘
```

- **Client ↔ Server**: RESTful APIs + Socket.IO WebSocket for real-time features (chat, notifications, online status)
- **Server ↔ File Service**: Internal HTTP calls with API key authentication for media processing
- **Server ↔ MongoDB**: Mongoose 9 ODM with indexed collections
- **File Service**: Sharp for image processing, FFmpeg for video transcoding and thumbnail extraction

---

## Tech Stack

### Backend (Server)
| Technology | Purpose |
|------------|---------|
| **Express 5** | HTTP framework |
| **TypeScript 5** | Type safety |
| **Mongoose 9** | MongoDB ODM |
| **Socket.IO 4** | Real-time WebSocket communication |
| **bcryptjs** | Password hashing |
| **Nodemailer** | Email service (OTP, password reset) |
| **Multer** | File upload handling |
| **Pino** | Structured logging |
| **uuid** | Session ID generation |
| **ua-parser-js** | Device/browser detection for sessions |

### Backend (File Service)
| Technology | Purpose |
|------------|---------|
| **Express 5** | HTTP framework |
| **Sharp** | Image resizing and optimization |
| **fluent-ffmpeg** | Video transcoding and thumbnail generation |
| **Multer** | File upload handling |

### Frontend (Client)
| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript 5** | Type safety |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui + Radix UI** | Accessible component primitives |
| **Socket.IO Client** | Real-time communication |
| **Axios** | HTTP client |
| **React Hook Form + Zod** | Form handling and validation |
| **Sonner** | Toast notifications |
| **Lucide React** | Icon library |
| **next-themes** | Dark/light/system theme support |

---

## Features

### Authentication & Security

- **Email & Password Registration** with form validation (Zod schemas)
- **Cookie-Based Session Authentication** — sessions stored in MongoDB with expiry, revocation, and device tracking
- **Session Validation** — server-side session check on every protected route
- **Password Change** — authenticated password update with current password verification
- **Forgot Password** — OTP sent via email (Nodemailer + Gmail), verified before password reset
- **Logout** — session invalidation and cookie cleanup
- **Role-Based Access Control** — three roles: `user`, `moderator`, `system_admin`
- **Moderator Route Protection** — dedicated middleware (`moderatorAuthenticate`) guards all moderation endpoints

### User Profiles

- **Public Profile Pages** (`/u/[username]`) — avatar, bio, full name, follower/following counts, post/reel/repost grids
- **Edit Profile** — update username, full name, bio via inline modal editing
- **Avatar Upload** — image upload with server-side processing via file service
- **Profile Tabs** — toggle between Posts, Reels, and Reposts grids on profile
- **Private Accounts** — content hidden from non-followers when enabled
- **Online Status Indicator** — real-time green dot on avatars (respects activity status privacy setting)

### Posts

- **Create Posts** — multi-image upload with caption and hashtag support
- **Post Detail Page** (`/posts/[postId]`) — full post view with comments section
- **Like / Unlike** — optimistic UI with server sync
- **Repost / Unrepost** — share posts to your profile with instant counter updates
- **Save / Unsave** — bookmark posts for later viewing
- **Double-Tap to Like** — Instagram-style heart animation on image double-click
- **Image Carousel** — swipe/click navigation for multi-image posts with dot indicators
- **Visibility Control** — set posts to Public, Followers Only, or Private
- **View Tracking** — automatic view registration via Intersection Observer
- **Report Posts** — flag inappropriate content with categorized reasons
- **Keyboard Shortcuts** — `L` to like, `S` to save when post is focused

### Reels

- **Create Reels** — video upload with automatic thumbnail generation and duration detection
- **Reels Feed** (`/reels`) — vertical scroll viewer with autoplay on focus
- **Reel Detail Page** (`/reels/[reelId]`) — individual reel view
- **Like / Unlike, Repost, Save** — same interaction set as posts
- **View Count Tracking** — automatic view registration
- **Visibility Control** — Public, Followers Only, or Private
- **Duration Display** — formatted duration overlay on thumbnails
- **Comments Bottom Sheet** — slide-up comment panel on reels

### Feed & Explore

- **Algorithmic Home Feed** — engagement-weighted scoring with recency decay:
  - Unseen posts from followed users ranked first
  - Seen/older posts fill remaining slots
  - Fallback to trending public content for new users with no follows
  - Reels interspersed every ~3 posts
  - Suggested posts from non-followed users mixed in
- **"All Caught Up" Divider** — visual separator between new and seen content
- **Explore Page** (`/explore`) — discover trending public posts and reels from users you don't follow
  - Engagement-weighted trending algorithm
  - 60/40 post-to-reel ratio with interleaved layout
- **Reels Feed** — dedicated vertical scroll feed prioritizing unseen reels with engagement scoring
- **Suggested Users Sidebar** — recommended users to follow based on popularity, excluding moderators/admins
- **Feed Mode Setting** — switch between Algorithmic and Chronological feed ordering
- **Sensitive Content Filter** — option to hide or show sensitive content in feeds
- **Moderator/Admin Content Exclusion** — moderator and system admin content is hidden from all public feeds

### Comments

- **Threaded Comments** — top-level comments on posts and reels
- **Nested Replies** — reply to any comment with expandable reply threads
- **Like / Unlike Comments** — with like count display
- **Delete Comments** — remove your own comments
- **Paginated Loading** — load more comments and replies on demand
- **Real-Time Count Updates** — comment counts update across feed cards

### Social Interactions

- **Follow / Unfollow** — instant follow for public accounts
- **Follow Requests** — pending approval system for private accounts
- **Accept / Reject Requests** — manage incoming follow requests on a dedicated page
- **Cancel Sent Requests** — withdraw pending follow requests
- **Remove Followers** — remove users from your followers list
- **Followers & Following Lists** — paginated dialogs showing followers/following with follow-back buttons
- **Follow State Context** — global React context tracks follow states for consistent UI across the app

### Real-Time Chat

- **Direct Messages** — one-on-one conversations between users
- **Group Chats** — create group conversations with multiple participants
  - Group name and avatar customization
  - Admin controls: add/remove participants, rename group
- **Real-Time Messaging** — instant message delivery via Socket.IO
- **Message Types** — text, image, video, mixed media
- **Share to Chat** — forward posts and reels directly into conversations
- **Reply to Messages** — quote-reply to specific messages in threads
- **Emoji Reactions** — react to messages with emojis (add/remove, reaction details dialog)
- **Read Receipts** — see who has read messages with timestamps
- **Typing Indicators** — real-time "typing..." display per conversation
- **Message Deletion** — delete your own messages
- **Media Upload** — send images and videos in chat (up to 100MB, max 10 files)
- **Unread Count Badge** — global unread message count in navigation
- **Message Requests** — conversations from non-followers go to a separate request inbox
  - Accept or reject message requests
  - Request count badge
- **Conversation Deletion** — delete conversations from your inbox
- **Online Status** — real-time online/offline indicators (respects privacy settings)
- **Chat Media Upload** — dedicated endpoint for uploading chat media with processing

### Notifications

- **Real-Time Notifications** — instant delivery via Socket.IO
- **Notification Types**:
  - `follow` — someone followed you
  - `follow_request` — someone requested to follow you
  - `follow_request_accepted` — your follow request was accepted
  - `like_post` / `like_reel` / `like_comment` — someone liked your content
  - `comment_post` / `comment_reel` — someone commented on your content
  - `reply_comment` — someone replied to your comment
  - `repost_post` / `repost_reel` — someone reposted your content
  - `mention` — someone mentioned you
  - `mod_post_removed` / `mod_reel_removed` — moderator removed your content
  - `mod_account_disabled` / `mod_account_enabled` — moderator changed your account status
  - `mod_warning` — moderator sent you a warning
- **Unread Count Badge** — real-time unread notification count in navigation
- **Mark as Read** — mark individual or all notifications as read
- **Delete Notifications** — remove individual notifications
- **Clear All** — bulk clear all notifications
- **Notification Settings** — toggle notifications per type (likes, comments, mentions, follows, messages)
- **Duplicate Prevention** — unique compound index prevents duplicate notifications for the same event

### Search

- **User Search** — search users by username or full name
- **Search Dialog** — accessible search modal with real-time results
- **User Search Results** — avatar, name, username, and follow button in results

### Settings

- **Privacy Settings**:
  - Private account toggle
  - Control who can message you (Everyone / Followers Only / No One)
  - Control who can comment (Everyone / Followers Only / No One)
  - Control who can mention you (Everyone / Followers Only / No One)
  - Show/hide online activity status
  - Block/unblock users
- **Notification Preferences** — toggle per-type notification delivery (likes, comments, mentions, follows, messages)
- **Appearance** — theme selection: Light, Dark, or System
- **Feed Preferences**:
  - Algorithmic vs. Chronological mode
  - Show/hide sensitive content
- **Security**:
  - Change password (with current password verification)
  - Login alerts toggle
- **Activity History**:
  - Like history (posts, reels, comments you've liked)
  - Comment history
  - Watch history
  - Repost history
  - Saved items

### Reporting System

- **Report Content** — report posts, reels, comments, or users
- **Report Reasons** — categorized: Spam, Harassment, Hate Speech, Violence, Nudity, False Information, Intellectual Property, Self Harm, Other
- **Optional Description** — add details to your report
- **Duplicate Prevention** — unique index prevents reporting the same content twice
- **Report Dialog** — reusable modal component rendered via React Portal for proper viewport positioning

### Moderator Dashboard

- **Role-Gated Access** — only `moderator` and `system_admin` roles can access `/moderator/*` routes
- **Dashboard Overview** — 11 real-time statistics:
  - Total users, active users, disabled users, moderator count
  - Total posts, removed posts
  - Total reels, removed reels
  - Total comments
  - Pending reports, total reports
- **User Management**:
  - Browse all users with search and filters (All / Active / Disabled / Moderators)
  - View user profiles (linked to `/u/[username]`)
  - Disable / Enable user accounts
  - Send warnings to users (creates a notification)
- **Posts Moderation**:
  - Browse all posts with filter (All / Active / Removed)
  - View post content, author, stats, hashtags
  - View original post (linked to `/posts/[postId]`)
  - Remove / Restore posts (sets `is_removed_by_moderator`)
- **Reels Moderation**:
  - Browse all reels with thumbnails, duration, stats
  - View original reel (linked to `/reels/[reelId]`)
  - Remove / Restore reels
- **Reports Management**:
  - Browse all reports with status and type filters
  - View reporter profile and reported content via direct links
  - Review / Resolve / Dismiss reports with optional moderator notes
- **Audit Log**:
  - Complete history of all moderator actions
  - Filter by action type (user disabled/enabled/warned, post/reel removed/restored, comment removed, report resolved/dismissed)
  - Moderator name and timestamp for each action
- **Moderation Notifications** — users receive notifications when moderators take action on their content or account

### Activity & History Tracking

- **Activity Feed** — log of user actions (likes, comments, follows, reposts)
- **Watch History** — track viewed posts and reels (powers "unseen" feed logic)
- **Like History** — browse all content you've liked
- **Comment History** — browse all comments you've made
- **Repost History** — browse all content you've reposted
- **Saved Items** — browse all bookmarked posts and reels

---

## Project Structure

```
sociaa/
├── client/                     # Next.js 16 Frontend
│   ├── app/
│   │   ├── (auth)/             # Auth pages (login, register, forgot-password)
│   │   ├── (protected)/        # Authenticated user pages
│   │   │   ├── create-post/    # Post creation
│   │   │   ├── create-reel/    # Reel creation
│   │   │   ├── explore/        # Explore/discover page
│   │   │   ├── follow-requests/# Follow request management
│   │   │   ├── inbox/          # Chat inbox & conversations
│   │   │   ├── notifications/  # Notifications page
│   │   │   ├── posts/[postId]/ # Post detail page
│   │   │   ├── reels/          # Reels feed & detail
│   │   │   ├── settings/       # User settings
│   │   │   └── u/[username]/   # User profile page
│   │   ├── (public)/           # Public landing page
│   │   └── moderator/          # Moderator dashboard
│   │       ├── posts/          # Post moderation
│   │       ├── reels/          # Reel moderation
│   │       ├── reports/        # Report management
│   │       ├── users/          # User management
│   │       └── audit-log/      # Audit log viewer
│   ├── components/             # React components
│   │   ├── chat/               # Chat UI components
│   │   ├── comments/           # Comment components
│   │   ├── explore/            # Search dialog
│   │   ├── feed/               # Post card, reel card, feed skeletons
│   │   ├── follow/             # Follow button, follower/following dialogs
│   │   ├── profile/            # Profile header, edit modals, grids
│   │   ├── reels/              # Reel viewer
│   │   ├── report/             # Report dialog
│   │   ├── settings/           # Settings sections
│   │   └── ui/                 # shadcn/ui primitives
│   ├── contexts/               # React contexts (auth, chat, follow, notification, theme, ui)
│   ├── features/               # API layer per domain
│   └── hooks/                  # Custom React hooks
│
├── server/                     # Express 5 Backend
│   └── src/
│       ├── config/             # Environment config
│       ├── constants/          # App constants
│       ├── controllers/        # Route handlers (grouped by domain)
│       ├── dtos/               # Data transfer objects
│       ├── middlewares/        # Auth, moderator auth, request logger
│       ├── models/             # Mongoose schemas (20 models)
│       ├── repositories/       # Data access layer
│       ├── routes/             # Express routers (14 route files)
│       ├── services/           # Business logic layer
│       ├── socket/             # Socket.IO setup and event handlers
│       ├── types/              # TypeScript type definitions
│       └── utils/              # Helpers, error handling
│
└── file-service/               # Media Processing Microservice
    └── src/
        ├── controllers/        # Image, video, thumbnail handlers
        ├── middlewares/        # API key auth
        ├── routes/             # File upload/serving routes
        └── utils/              # File processing helpers
    └── storage/                # Local file storage
        ├── images/             # Processed images
        ├── thumbnails/         # Video thumbnails
        └── videos/             # Uploaded videos
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or Atlas)
- **FFmpeg** (required by file-service for video processing)
- **npm** or **yarn**

### Environment Variables

#### Server (`server/.env`)

```env
PORT=8000
NODE_ENV=development
SESSION_EXPIRY_IN_MINUTES=10080
FILE_SERVICE_URL=http://localhost:5000
FILE_SERVICE_INTERNAL_API_KEY=your-secret-api-key
LOG_LEVEL=info
BASE_URL=http://localhost:8000
GMAIL_ADDRESS=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
MONGODB_URI=mongodb://localhost:27017/sociaanet
```

#### File Service (`file-service/.env`)

```env
PORT=5000
INTERNAL_API_KEY=your-secret-api-key
```

#### Client (`client/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Installation

```bash
# Clone the repository
git clone https://github.com/niii-san/SociaaNet.git
cd SociaaNet

# Install server dependencies
cd server
npm install

# Install file-service dependencies
cd ../file-service
npm install

# Install client dependencies
cd ../client
npm install
```

### Running the App

Start all three services (each in a separate terminal):

```bash
# Terminal 1 — File Service
cd file-service
npm run dev

# Terminal 2 — API Server
cd server
npm run dev

# Terminal 3 — Client
cd client
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Overview

Base URL: `http://localhost:8000/api/v1`

| Route Prefix | Description |
|--------------|-------------|
| `/auth` | Signup, login, logout, session validation, password reset |
| `/users` | Profiles, follow/unfollow, search, avatar upload, activity history |
| `/users/me/settings` | Privacy, notifications, appearance, feed, security settings |
| `/posts` | Get post, like, unlike, repost, save, view, visibility, comments |
| `/reels` | Get reel, like, unlike, repost, save, view, visibility, comments |
| `/comments` | Reply, get replies, like, unlike, delete comments |
| `/chat` | Conversations, messages, reactions, read receipts, media upload, message requests |
| `/feed` | Home feed, explore, reels feed, suggested users |
| `/notifications` | Get, mark read, delete, clear notifications |
| `/reports` | Submit content reports |
| `/moderators` | Dashboard stats, user/post/reel management, reports, warnings, audit log |
| `/media` | Media serving routes |
| `/files` | File upload routes |

---

## Socket.IO Events

### Client → Server

| Event | Description |
|-------|-------------|
| `conversation:join` | Join a chat room and mark messages as read |
| `conversation:leave` | Leave a chat room |
| `message:send` | Send a message (text, media, shared post/reel, reply) |
| `typing:start` | Broadcast typing indicator |
| `typing:stop` | Stop typing indicator |
| `messages:read` | Mark conversation messages as read |
| `message:react` | Add emoji reaction to a message |
| `message:unreact` | Remove emoji reaction from a message |
| `message:delete` | Delete a message |
| `user:check-online` | Check online status of user(s) |

### Server → Client

| Event | Description |
|-------|-------------|
| `message:new` | New message received in conversation |
| `message:reacted` | Reaction added to a message |
| `message:unreacted` | Reaction removed from a message |
| `message:deleted` | Message deleted in conversation |
| `messages:read` | Read receipt update |
| `typing:start` / `typing:stop` | Typing indicator updates |
| `user:online` / `user:offline` | User online status changes |
| `user:online-status` | Bulk online status response |
| `conversation:updated` | Conversation list update (new message) |
| `unread:update` | Unread message count update |
| `notification:new` | New notification received |
| `notification:count` | Unread notification count update |

---


