# SociaaNet API Documentation

Complete API reference for the SociaaNet backend server.

**Base URL:** `http://localhost:8000/api/v1`

---

## Table of Contents

- [Response Format](#response-format)
- [Error Codes](#error-codes)
- [Authentication](#authentication)
  - [POST /auth/signup](#post-authsignup)
  - [POST /auth/login](#post-authlogin)
  - [GET /auth/validate-session](#get-authvalidate-session)
  - [GET /auth/forgot-password-otp/:email](#get-authforgot-password-otpemail)
  - [POST /auth/change-password-with-otp](#post-authchange-password-with-otp)
  - [PATCH /auth/change-password](#patch-authchange-password)
  - [DELETE /auth/logout](#delete-authlogout)
- [Users](#users)
  - [GET /users/me](#get-usersme)
  - [GET /users/profile/:username](#get-usersprofileusername)
  - [POST /users/me/avatar](#post-usersmeavatar)
  - [PATCH /users/me/bio](#patch-usersmebio)
  - [PATCH /users/me/username](#patch-usersmeusername)
  - [PATCH /users/me/fullname](#patch-usersmefullname)
  - [GET /users/search](#get-userssearch)
  - [GET /users/me/activities](#get-usersmeactivities)
  - [GET /users/me/history/likes](#get-usersmehistorylikes)
  - [GET /users/me/history/comments](#get-usersmehistorycomments)
  - [GET /users/me/history/watches](#get-usersmehistorywatches)
  - [GET /users/me/history/reposts](#get-usersmehistoryreposts)
  - [GET /users/me/saved](#get-usersmesaved)
- [Social Interactions (Follow System)](#social-interactions-follow-system)
  - [POST /users/me/:followeeId/follow](#post-usersmefolloweidfollow)
  - [DELETE /users/me/:followeeId/follow](#delete-usersmefolloweidfollow)
  - [DELETE /users/me/:followeeId/follow-request/cancel](#delete-usersmefolloweidfollow-requestcancel)
  - [DELETE /users/me/followers/:followerId](#delete-usersmefollowersfollowerid)
  - [GET /users/:userId/following](#get-usersuseridfolowing)
  - [GET /users/:userId/followers](#get-usersuseridfollowers)
  - [GET /users/me/follow-requests](#get-usersmefollow-requests)
  - [GET /users/me/following-requests](#get-usersmefollowing-requests)
  - [PATCH /users/me/:followerId/follow-request](#patch-usersmefolloweridfollow-request)
  - [DELETE /users/me/:followerId/follow-request](#delete-usersmefolloweridfollow-request)
- [Posts](#posts)
  - [GET /posts/:postId](#get-postspostid)
  - [PATCH /posts/:postId/visibility](#patch-postspostidvisibility)
  - [POST /posts/:postId/view](#post-postspostidview)
  - [POST /posts/:postId/like](#post-postspostidlike)
  - [DELETE /posts/:postId/like](#delete-postspostidlike)
  - [POST /posts/:postId/repost](#post-postspostidrepost)
  - [DELETE /posts/:postId/repost](#delete-postspostidrepost)
  - [POST /posts/:postId/save](#post-postspostidsave)
  - [DELETE /posts/:postId/save](#delete-postspostidsave)
  - [GET /posts/:postId/comments](#get-postspostidcomments)
  - [POST /posts/:postId/comments](#post-postspostidcomments)
- [Reels](#reels)
  - [GET /reels/:reelId](#get-reelsreelid)
  - [PATCH /reels/:reelId/visibility](#patch-reelsreelidvisibility)
  - [POST /reels/:reelId/view](#post-reelsreelidview)
  - [POST /reels/:reelId/like](#post-reelsreelidlike)
  - [DELETE /reels/:reelId/like](#delete-reelsreelidlike)
  - [POST /reels/:reelId/repost](#post-reelsreelidrepost)
  - [DELETE /reels/:reelId/repost](#delete-reelsreelidrepost)
  - [POST /reels/:reelId/save](#post-reelsreelidsave)
  - [DELETE /reels/:reelId/save](#delete-reelsreelidsave)
  - [GET /reels/:reelId/comments](#get-reelsreelidcomments)
  - [POST /reels/:reelId/comments](#post-reelsreelidcomments)
- [Comments](#comments)
  - [POST /comments/:commentId/reply](#post-commentscommentidreply)
  - [GET /comments/:commentId/replies](#get-commentscommentidreplies)
  - [POST /comments/:commentId/like](#post-commentscommentidlike)
  - [DELETE /comments/:commentId/like](#delete-commentscommentidlike)
  - [DELETE /comments/:commentId](#delete-commentscommentid)
- [Chat](#chat)
  - [POST /chat/upload](#post-chatupload)
  - [GET /chat/conversations](#get-chatconversations)
  - [POST /chat/conversations/direct](#post-chatconversationsdirect)
  - [POST /chat/conversations/group](#post-chatconversationsgroup)
  - [GET /chat/conversations/:conversationId](#get-chatconversationsconversationid)
  - [DELETE /chat/conversations/:conversationId](#delete-chatconversationsconversationid)
  - [GET /chat/conversations/:conversationId/messages](#get-chatconversationsconversationidmessages)
  - [POST /chat/conversations/:conversationId/messages](#post-chatconversationsconversationidmessages)
  - [POST /chat/conversations/:conversationId/read](#post-chatconversationsconversationidread)
  - [POST /chat/messages/:messageId/react](#post-chatmessagesmessageidreact)
  - [DELETE /chat/messages/:messageId/react](#delete-chatmessagesmessageidreact)
  - [GET /chat/messages/:messageId/reactions](#get-chatmessagesmessageidreactions)
  - [DELETE /chat/messages/:messageId](#delete-chatmessagesmessageid)
  - [POST /chat/conversations/:conversationId/participants](#post-chatconversationsconversationidparticipants)
  - [DELETE /chat/conversations/:conversationId/participants/:userId](#delete-chatconversationsconversationidparticipantsuserid)
  - [PATCH /chat/conversations/:conversationId/name](#patch-chatconversationsconversationidname)
  - [GET /chat/unread-count](#get-chatunread-count)
  - [GET /chat/friends](#get-chatfriends)
  - [POST /chat/users/activity](#post-chatusersactivity)
  - [GET /chat/message-requests](#get-chatmessage-requests)
  - [GET /chat/message-requests/count](#get-chatmessage-requestscount)
  - [POST /chat/message-requests/:conversationId/accept](#post-chatmessage-requestsconversationidaccept)
  - [POST /chat/message-requests/:conversationId/reject](#post-chatmessage-requestsconversationidreject)
- [Feed](#feed)
  - [GET /feed/home](#get-feedhome)
  - [GET /feed/explore](#get-feedexplore)
  - [GET /feed/reels](#get-feedreels)
  - [GET /feed/suggested-users](#get-feedsuggested-users)
- [Notifications](#notifications)
  - [GET /notifications](#get-notifications)
  - [GET /notifications/unread-count](#get-notificationsunread-count)
  - [POST /notifications/mark-read](#post-notificationsmark-read)
  - [POST /notifications/:notificationId/read](#post-notificationsnotificationidread)
  - [DELETE /notifications/:notificationId](#delete-notificationsnotificationid)
  - [DELETE /notifications](#delete-notifications)
- [Reports](#reports)
  - [POST /reports](#post-reports)
- [Settings](#settings)
  - [GET /users/me/settings](#get-usersmesettings)
  - [PATCH /users/me/settings/privacy](#patch-usersmesettingsprivacy)
  - [PATCH /users/me/settings/notifications](#patch-usersmesettingsnotifications)
  - [PATCH /users/me/settings/appearance](#patch-usersmesettingsappearance)
  - [PATCH /users/me/settings/feed](#patch-usersmesettingsfeed)
- [Media (Content Upload)](#media-content-upload)
  - [POST /media/post](#post-mediapost)
  - [POST /media/reel](#post-mediareel)
- [Files (Static Asset Serving)](#files-static-asset-serving)
  - [GET /files/images/:imageKey](#get-filesimagesimagekey)
  - [GET /files/videos/:videoKey](#get-filesvideosvideokey)
  - [GET /files/thumbnails/:thumbnailKey](#get-filesthumbnailsthumbnailkey)
- [Moderators](#moderators)
  - [GET /moderators/dashboard/stats](#get-moderatorsdashboardstats)
  - [GET /moderators/users](#get-moderatorsusers)
  - [GET /moderators/users/:userId](#get-moderatorsusersuserid)
  - [PATCH /moderators/users/:userId/disable](#patch-moderatorsusersuseriddisable)
  - [PATCH /moderators/users/:userId/enable](#patch-moderatorsusersuseridenable)
  - [POST /moderators/users/:userId/warn](#post-moderatorsusersuseridwarn)
  - [GET /moderators/posts](#get-moderatorsposts)
  - [PATCH /moderators/posts/:postId/remove](#patch-moderatorspostspostidremove)
  - [PATCH /moderators/posts/:postId/restore](#patch-moderatorspostspostidrestore)
  - [GET /moderators/reels](#get-moderatorsreels)
  - [PATCH /moderators/reels/:reelId/remove](#patch-moderatorsreelsreelidremove)
  - [PATCH /moderators/reels/:reelId/restore](#patch-moderatorsreelsreelidrestore)
  - [DELETE /moderators/comments/:commentId](#delete-moderatorscommentscommentid)
  - [GET /moderators/reports](#get-moderatorsreports)
  - [GET /moderators/reports/counts](#get-moderatorsreportscounts)
  - [PATCH /moderators/reports/:reportId/status](#patch-moderatorsreportsreportidstatus)
  - [GET /moderators/audit-log](#get-moderatorsaudit-log)
- [Socket.IO Events](#socketio-events)
  - [Connection & Authentication](#connection--authentication)
  - [Client → Server Events](#client--server-events)
  - [Server → Client Events](#server--client-events)

---

## Response Format

### Success Response

All successful responses follow this structure:

```json
{
  "status_code": 200,
  "success": true,
  "message": "Descriptive success message",
  "data": { }
}
```

Some paginated responses include extra fields merged at the top level:

```json
{
  "status_code": 200,
  "success": true,
  "message": "Users fetched",
  "data": [ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "status_code": 400,
  "success": false,
  "message": "Descriptive error message",
  "error": {
    "code": "ERR_INVALID_INPUT"
  }
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `ERR_INVALID_INPUT` | Input is not given, not valid, or does not meet criteria |
| `ERR_NOT_FOUND` | Requested resource was not found |
| `ERR_FORBIDDEN` | User does not have permission to access the resource |
| `ERR_DUPLICATE` | Resource already exists and cannot be created again |
| `ERR_UNAUTHORIZED` | Authentication is required and has failed or not been provided |
| `ERR_SERVER_ERROR` | General server-side error |
| `ERR_TIMEOUT` | Request timed out |

---

## Authentication

All endpoints except `/auth/signup`, `/auth/login`, `/auth/forgot-password-otp/:email`, `/auth/change-password-with-otp`, and `/files/*` require a valid `session_id` cookie.

---

### POST /auth/signup

Create a new user account.

**Request Body:**

```json
{
  "full_name": "John Doe",
  "email_address": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response (201):**

```json
{
  "status_code": 201,
  "success": true,
  "message": "User created",
  "data": {
    "_id": "ObjectId",
    "full_name": "John Doe",
    "username": "john_doe_a1b2",
    "email": "john@example.com",
    "role": "user",
    "is_private_account": false,
    "is_email_verified": false,
    "followers_count": 0,
    "following_count": 0
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Full name is required / Email address is required / Password too short or too long |
| 409 | `ERR_DUPLICATE` | User with this email already exists |

---

### POST /auth/login

Log in and receive a session cookie.

**Request Body:**

```json
{
  "email_address": "john@example.com",
  "password": "securePassword123"
}
```

**Request Headers (optional):**

| Header | Description |
|--------|-------------|
| `x-app-platform` | App platform (if mobile) |
| `x-device-model` | Device model (if mobile) |
| `user-agent` | Browser user agent (auto-detected if no platform header) |

**Success Response (200):**

Sets `session_id` cookie (httpOnly, secure).

```json
{
  "status_code": 200,
  "success": true,
  "message": "User login success",
  "data": {
    "session_id": "uuid-session-id",
    "expires_at": "2026-03-13T12:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Email address is required / Password is required |
| 401 | `ERR_UNAUTHORIZED` | Invalid email or password |
| 403 | `ERR_FORBIDDEN` | User account has been disabled |

---

### GET /auth/validate-session

Validate the current session cookie. 🔒 **Requires authentication.**

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Session is valid",
  "data": {
    "username": "john_doe",
    "full_name": "John Doe"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 401 | `ERR_UNAUTHORIZED` | Invalid or expired session |

---

### GET /auth/forgot-password-otp/:email

Request an OTP for password reset. Sends an OTP to the provided email if it exists.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `email` | string | The email address to send OTP to |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "OTP sent to the provided email address if it exists in our system",
  "data": null
}
```

> Note: Always returns 200 to prevent email enumeration.

---

### POST /auth/change-password-with-otp

Change password using the OTP received via email.

**Request Body:**

```json
{
  "email_address": "john@example.com",
  "otp": "123456",
  "new_password": "newSecurePassword456"
}
```

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Password changed successfully! Now you can use your new password to login.",
  "data": null
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Invalid or expired OTP / Password too short or too long |
| 404 | `ERR_NOT_FOUND` | User not found |

---

### PATCH /auth/change-password

Change password for the authenticated user. 🔒 **Requires authentication.**

**Request Body:**

```json
{
  "current_password": "oldPassword123",
  "new_password": "newPassword456"
}
```

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Password changed successfully",
  "data": null
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Current password is required / New password too short or too long |
| 401 | `ERR_UNAUTHORIZED` | Current password is incorrect |

---

### DELETE /auth/logout

Log out and invalidate the current session. 🔒 **Requires authentication.**

**Success Response (200):**

Clears `session_id` cookie.

```json
{
  "status_code": 200,
  "success": true,
  "message": "User logged out successfully",
  "data": null
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Failed to log out user |

---

## Users

All user endpoints require authentication (🔒).

---

### GET /users/me

Get the currently authenticated user's profile.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "_id": "ObjectId",
    "full_name": "John Doe",
    "username": "john_doe",
    "email": "john@example.com",
    "bio": "Hello world",
    "avatar_url": "http://localhost:8000/api/v1/files/images/abc123.jpg",
    "role": "user",
    "is_private_account": false,
    "is_email_verified": true,
    "followers_count": 42,
    "following_count": 50,
    "is_online": true,
    "last_active_at": "2026-03-06T12:00:00.000Z",
    "createdAt": "2026-01-15T08:30:00.000Z"
  }
}
```

---

### GET /users/profile/:username

Get a user's public profile by username.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `username` | string | Target user's username |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "john_doe profile retrieved",
  "data": {
    "_id": "ObjectId",
    "full_name": "John Doe",
    "username": "john_doe",
    "bio": "Hello world",
    "avatar_url": "http://...",
    "is_private_account": false,
    "followers_count": 42,
    "following_count": 50,
    "is_following": true,
    "is_follow_request_pending": false,
    "posts": [ ],
    "reels": [ ],
    "reposts": [ ]
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `ERR_NOT_FOUND` | User not found |

---

### POST /users/me/avatar

Upload or update the authenticated user's avatar.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `avatar` | File | Image file (max 20MB) |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "avatar_url": "http://localhost:8000/api/v1/files/images/newkey123.jpg"
  }
}
```

---

### PATCH /users/me/bio

Update the authenticated user's bio.

**Request Body:**

```json
{
  "bio": "New bio text here"
}
```

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Bio updated successfully",
  "data": {
    "bio": "New bio text here"
  }
}
```

---

### PATCH /users/me/username

Update the authenticated user's username.

**Request Body:**

```json
{
  "username": "new_username"
}
```

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Username updated successfully",
  "data": {
    "username": "new_username"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Username too short / too long / invalid characters |
| 409 | `ERR_DUPLICATE` | Username already taken |

---

### PATCH /users/me/fullname

Update the authenticated user's full name.

**Request Body:**

```json
{
  "full_name": "Jane Doe"
}
```

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "FullName updated successfully",
  "data": {
    "full_name": "Jane Doe"
  }
}
```

---

### GET /users/search

Search for users by username or full name.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `query` | string | — | Search query (required) |
| `page` | number | 1 | Page number |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Showing search results for \"john\"",
  "data": [
    {
      "_id": "ObjectId",
      "full_name": "John Doe",
      "username": "john_doe",
      "avatar_url": "http://..."
    }
  ],
  "page": 1,
  "totalPages": 1,
  "total": 1
}
```

---

### GET /users/me/activities

Get the authenticated user's activity feed.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Activities retrieved successfully",
  "data": [
    {
      "_id": "ObjectId",
      "actor": { "_id": "...", "username": "john_doe", "avatar_url": "..." },
      "verb": "like_post",
      "target_id": "ObjectId",
      "metadata": { },
      "createdAt": "2026-03-06T10:00:00.000Z"
    }
  ]
}
```

---

### GET /users/me/history/likes

Get the authenticated user's like history.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Like history retrieved successfully",
  "data": {
    "items": [ ],
    "pagination": { "page": 1, "limit": 20, "total": 50 }
  }
}
```

---

### GET /users/me/history/comments

Get the authenticated user's comment history.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Comment history retrieved successfully",
  "data": {
    "items": [ ],
    "pagination": { "page": 1, "limit": 20, "total": 30 }
  }
}
```

---

### GET /users/me/history/watches

Get the authenticated user's watch history.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Watch history retrieved successfully",
  "data": {
    "items": [ ],
    "pagination": { "page": 1, "limit": 20, "total": 100 }
  }
}
```

---

### GET /users/me/history/reposts

Get the authenticated user's repost history.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Repost history retrieved successfully",
  "data": {
    "items": [ ],
    "pagination": { "page": 1, "limit": 20, "total": 10 }
  }
}
```

---

### GET /users/me/saved

Get the authenticated user's saved items (bookmarks).

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Saved items retrieved successfully",
  "data": {
    "items": [ ],
    "pagination": { "page": 1, "limit": 20, "total": 5 }
  }
}
```

---

## Social Interactions (Follow System)

All endpoints require authentication (🔒).

---

### POST /users/me/:followeeId/follow

Follow a user. If the target user has a private account, a follow request is sent instead.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `followeeId` | string | ID of the user to follow |

**Success Response (200) — Direct follow:**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Followed User Successfully",
  "data": {
    "is_follow_request": false,
    "followerId": "ObjectId",
    "followeeId": "ObjectId"
  }
}
```

**Success Response (200) — Follow request sent:**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Follow Request Sent Successfully",
  "data": {
    "is_follow_request": true,
    "followerId": "ObjectId",
    "followeeId": "ObjectId"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Cannot follow yourself |
| 409 | `ERR_DUPLICATE` | Already following this user / Follow request already pending |
| 404 | `ERR_NOT_FOUND` | User not found |

---

### DELETE /users/me/:followeeId/follow

Unfollow a user.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `followeeId` | string | ID of the user to unfollow |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Successfully unfollowed the user",
  "data": {
    "followerId": "ObjectId",
    "followeeId": "ObjectId"
  }
}
```

---

### DELETE /users/me/:followeeId/follow-request/cancel

Cancel a pending follow request you sent.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `followeeId` | string | ID of the user whose follow request to cancel |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Follow request deleted",
  "data": {
    "followerId": "ObjectId",
    "followeeId": "ObjectId"
  }
}
```

---

### DELETE /users/me/followers/:followerId

Remove a user from your followers list.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `followerId` | string | ID of the follower to remove |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Follower removed successfully",
  "data": null
}
```

---

### GET /users/:userId/following

Get the list of users that a user is following.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `userId` | string | ID of the user |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Successfully retrieved followings",
  "data": [
    {
      "_id": "ObjectId",
      "full_name": "Jane Doe",
      "username": "jane_doe",
      "avatar_url": "http://..."
    }
  ]
}
```

---

### GET /users/:userId/followers

Get the list of users following a user.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `userId` | string | ID of the user |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Successfully retrieved followers",
  "data": [
    {
      "_id": "ObjectId",
      "full_name": "Jane Doe",
      "username": "jane_doe",
      "avatar_url": "http://..."
    }
  ]
}
```

---

### GET /users/me/follow-requests

Get incoming follow requests for the authenticated user (for private accounts).

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Follow requests retrieved successfully",
  "data": [
    {
      "_id": "ObjectId",
      "full_name": "Jane Doe",
      "username": "jane_doe",
      "avatar_url": "http://..."
    }
  ]
}
```

---

### GET /users/me/following-requests

Get outgoing follow requests you have sent that are still pending.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Following Requests Retrieved Successfully",
  "data": [
    {
      "_id": "ObjectId",
      "full_name": "Private User",
      "username": "private_user",
      "avatar_url": "http://..."
    }
  ]
}
```

---

### PATCH /users/me/:followerId/follow-request

Accept a follow request.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `followerId` | string | ID of the user whose follow request to accept |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Follow request accepted successfully",
  "data": null
}
```

---

### DELETE /users/me/:followerId/follow-request

Reject a follow request.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `followerId` | string | ID of the user whose follow request to reject |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Follow request rejected successfully",
  "data": null
}
```

---

## Posts

All endpoints require authentication (🔒).

---

### GET /posts/:postId

Get a single post by ID.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Post retrieved successfully",
  "data": {
    "_id": "ObjectId",
    "author": {
      "_id": "ObjectId",
      "full_name": "John Doe",
      "username": "john_doe",
      "avatar_url": "http://..."
    },
    "caption": "Beautiful sunset!",
    "hashtags": ["sunset", "nature"],
    "media_urls": ["http://localhost:8000/api/v1/files/images/abc.jpg"],
    "likes_count": 15,
    "comments_count": 3,
    "reposts_count": 2,
    "visibility": "public",
    "is_sensitive_content": false,
    "is_removed_by_moderator": false,
    "is_liked": true,
    "is_reposted": false,
    "is_saved": true,
    "createdAt": "2026-03-05T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `ERR_NOT_FOUND` | Post not found |
| 403 | `ERR_FORBIDDEN` | You don't have permission to view this post |

---

### PATCH /posts/:postId/visibility

Update the visibility of a post. Only the post author can do this.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Request Body:**

```json
{
  "visibility": "public"
}
```

> Accepted values: `"public"`, `"private"`, `"followers"`

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Post visibility updated successfully",
  "data": null
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | visibility is required |
| 403 | `ERR_FORBIDDEN` | You can only update your own posts |
| 404 | `ERR_NOT_FOUND` | Post not found |

---

### POST /posts/:postId/view

Record a view on a post.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Post view recorded successfully",
  "data": null
}
```

---

### POST /posts/:postId/like

Like a post.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "likes_count": 16
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 409 | `ERR_DUPLICATE` | Already liked this post |

---

### DELETE /posts/:postId/like

Unlike a post.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Post unliked successfully",
  "data": {
    "likes_count": 15
  }
}
```

---

### POST /posts/:postId/repost

Repost a post.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Success Response (201):**

```json
{
  "status_code": 201,
  "success": true,
  "message": "Post reposted successfully",
  "data": {
    "reposts_count": 3
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 409 | `ERR_DUPLICATE` | Already reposted this post |

---

### DELETE /posts/:postId/repost

Remove a repost.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Post unreposted successfully",
  "data": {
    "reposts_count": 2
  }
}
```

---

### POST /posts/:postId/save

Save/bookmark a post.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Success Response (201):**

```json
{
  "status_code": 201,
  "success": true,
  "message": "Post saved successfully",
  "data": null
}
```

---

### DELETE /posts/:postId/save

Remove a saved/bookmarked post.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Post removed from saved",
  "data": null
}
```

---

### GET /posts/:postId/comments

Get comments on a post.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Comments retrieved successfully",
  "data": {
    "comments": [
      {
        "_id": "ObjectId",
        "author": {
          "_id": "ObjectId",
          "username": "jane_doe",
          "full_name": "Jane Doe",
          "avatar_url": "http://..."
        },
        "content": "Beautiful!",
        "likes_count": 2,
        "is_liked": false,
        "replies_count": 1,
        "createdAt": "2026-03-06T10:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 20, "total": 3 }
  }
}
```

---

### POST /posts/:postId/comments

Add a comment to a post.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Request Body:**

```json
{
  "content": "Great post!"
}
```

**Success Response (201):**

```json
{
  "status_code": 201,
  "success": true,
  "message": "Comment added successfully",
  "data": {
    "_id": "ObjectId",
    "author": { "_id": "ObjectId", "username": "john_doe", "avatar_url": "..." },
    "content": "Great post!",
    "target_id": "ObjectId",
    "target_type": "post",
    "likes_count": 0,
    "createdAt": "2026-03-06T12:00:00.000Z"
  }
}
```

---

## Reels

All endpoints require authentication (🔒). Reels endpoints mirror the posts endpoints with `reelId` instead of `postId`.

---

### GET /reels/:reelId

Get a single reel by ID.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `reelId` | string | Reel ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reel retrieved successfully",
  "data": {
    "_id": "ObjectId",
    "author": {
      "_id": "ObjectId",
      "full_name": "John Doe",
      "username": "john_doe",
      "avatar_url": "http://..."
    },
    "caption": "Check this out!",
    "hashtags": ["funny", "viral"],
    "video_url": "http://localhost:8000/api/v1/files/videos/video123.mp4",
    "thumbnail_url": "http://localhost:8000/api/v1/files/thumbnails/thumb123.jpg",
    "duration_seconds": 30,
    "likes_count": 50,
    "comments_count": 10,
    "reposts_count": 5,
    "views_count": 200,
    "visibility": "public",
    "is_sensitive_content": false,
    "is_removed_by_moderator": false,
    "is_liked": false,
    "is_reposted": false,
    "is_saved": false,
    "createdAt": "2026-03-04T09:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 404 | `ERR_NOT_FOUND` | Reel not found |

---

### PATCH /reels/:reelId/visibility

Update the visibility of a reel. Only the reel author can do this.

**Request Body:**

```json
{
  "visibility": "followers"
}
```

> Accepted values: `"public"`, `"private"`, `"followers"`

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reel visibility updated successfully",
  "data": null
}
```

---

### POST /reels/:reelId/view

Record a view on a reel.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reel view recorded successfully",
  "data": null
}
```

---

### POST /reels/:reelId/like

Like a reel.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reel liked successfully",
  "data": { "likes_count": 51 }
}
```

---

### DELETE /reels/:reelId/like

Unlike a reel.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reel unliked successfully",
  "data": { "likes_count": 50 }
}
```

---

### POST /reels/:reelId/repost

Repost a reel.

**Success Response (201):**

```json
{
  "status_code": 201,
  "success": true,
  "message": "Reel reposted successfully",
  "data": { "reposts_count": 6 }
}
```

---

### DELETE /reels/:reelId/repost

Remove a repost of a reel.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reel unreposted successfully",
  "data": { "reposts_count": 5 }
}
```

---

### POST /reels/:reelId/save

Save/bookmark a reel.

**Success Response (201):**

```json
{
  "status_code": 201,
  "success": true,
  "message": "Reel saved successfully",
  "data": null
}
```

---

### DELETE /reels/:reelId/save

Remove a saved reel.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reel removed from saved",
  "data": null
}
```

---

### GET /reels/:reelId/comments

Get comments on a reel. Same format as [GET /posts/:postId/comments](#get-postspostidcomments) with `target_type: "reel"`.

---

### POST /reels/:reelId/comments

Add a comment to a reel. Same format as [POST /posts/:postId/comments](#post-postspostidcomments) with `target_type: "reel"`.

---

## Comments

All endpoints require authentication (🔒).

---

### POST /comments/:commentId/reply

Reply to a comment (creates a nested/threaded reply).

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `commentId` | string | ID of the parent comment to reply to |

**Request Body:**

```json
{
  "content": "I agree!"
}
```

**Success Response (201):**

```json
{
  "status_code": 201,
  "success": true,
  "message": "Reply added successfully",
  "data": {
    "_id": "ObjectId",
    "author": { "_id": "ObjectId", "username": "john_doe", "avatar_url": "..." },
    "content": "I agree!",
    "parent_comment_id": "ObjectId",
    "likes_count": 0,
    "createdAt": "2026-03-06T12:30:00.000Z"
  }
}
```

---

### GET /comments/:commentId/replies

Get replies to a comment.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `commentId` | string | Parent comment ID |

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Replies retrieved successfully",
  "data": {
    "replies": [
      {
        "_id": "ObjectId",
        "author": { "_id": "...", "username": "...", "avatar_url": "..." },
        "content": "I agree!",
        "likes_count": 1,
        "is_liked": false,
        "createdAt": "2026-03-06T12:30:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 3 }
  }
}
```

---

### POST /comments/:commentId/like

Like a comment.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `commentId` | string | Comment ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Comment liked successfully",
  "data": { "likes_count": 3 }
}
```

---

### DELETE /comments/:commentId/like

Unlike a comment.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `commentId` | string | Comment ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Comment unliked successfully",
  "data": { "likes_count": 2 }
}
```

---

### DELETE /comments/:commentId

Delete a comment. Only the comment author can delete it.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `commentId` | string | Comment ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Comment deleted successfully",
  "data": null
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 403 | `ERR_FORBIDDEN` | You can only delete your own comments |
| 404 | `ERR_NOT_FOUND` | Comment not found |

---

## Chat

All endpoints require authentication (🔒).

---

### POST /chat/upload

Upload media files for use in chat messages.

**Request:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `files` | File[] | Up to 10 files (images/videos), max 100MB each |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Media uploaded",
  "data": {
    "media": [
      { "key": "img_abc123.jpg", "url": "http://localhost:8000/api/v1/files/images/img_abc123.jpg", "type": "image" },
      { "key": "vid_xyz789.mp4", "url": "http://localhost:8000/api/v1/files/videos/vid_xyz789.mp4", "type": "video" }
    ],
    "keys": ["img_abc123.jpg", "vid_xyz789.mp4"],
    "urls": ["http://...", "http://..."]
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | — | No files provided |

---

### GET /chat/conversations

Get all conversations for the authenticated user.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Conversations fetched",
  "data": [
    {
      "_id": "ObjectId",
      "type": "direct",
      "participants": [
        { "_id": "...", "username": "jane_doe", "full_name": "Jane Doe", "avatar_url": "..." }
      ],
      "last_message": {
        "content": "Hey!",
        "sender_id": "ObjectId",
        "createdAt": "2026-03-06T11:00:00.000Z"
      },
      "unread_count": 2,
      "request_status": "none",
      "updatedAt": "2026-03-06T11:00:00.000Z"
    }
  ]
}
```

---

### POST /chat/conversations/direct

Create or get an existing direct conversation with a user. If the target user is not a follower, creates a message request.

**Request Body:**

```json
{
  "target_user_id": "ObjectId"
}
```

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Conversation ready",
  "data": {
    "_id": "ObjectId",
    "type": "direct",
    "participants": ["ObjectId", "ObjectId"],
    "request_status": "none",
    "createdAt": "2026-03-06T11:00:00.000Z"
  }
}
```

> If `request_status` is `"pending"`, the recipient receives a `message-request:new` socket event.

---

### POST /chat/conversations/group

Create a new group conversation.

**Request Body:**

```json
{
  "participant_ids": ["ObjectId1", "ObjectId2", "ObjectId3"],
  "group_name": "My Group"
}
```

**Success Response (201):**

```json
{
  "status_code": 201,
  "success": true,
  "message": "Group created",
  "data": {
    "_id": "ObjectId",
    "type": "group",
    "participants": ["ObjectId1", "ObjectId2", "ObjectId3", "ObjectId_creator"],
    "group_name": "My Group",
    "group_admin": "ObjectId_creator",
    "createdAt": "2026-03-06T11:00:00.000Z"
  }
}
```

---

### GET /chat/conversations/:conversationId

Get a specific conversation by ID.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Conversation fetched",
  "data": {
    "_id": "ObjectId",
    "type": "direct",
    "participants": [
      { "_id": "...", "username": "...", "full_name": "...", "avatar_url": "..." }
    ],
    "last_message": { },
    "request_status": "none"
  }
}
```

---

### DELETE /chat/conversations/:conversationId

Delete a conversation (soft delete, only for the requesting user).

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Conversation deleted",
  "data": null
}
```

---

### GET /chat/conversations/:conversationId/messages

Get messages in a conversation (paginated, newest first).

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID |

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 50 | Messages per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Messages fetched",
  "data": {
    "messages": [
      {
        "_id": "ObjectId",
        "conversation_id": "ObjectId",
        "sender": { "_id": "...", "username": "...", "avatar_url": "..." },
        "content": "Hello!",
        "message_type": "text",
        "media_urls": [],
        "reactions": [
          { "user_id": "ObjectId", "emoji": "❤️" }
        ],
        "read_by": [
          { "user_id": "ObjectId", "read_at": "2026-03-06T11:05:00.000Z" }
        ],
        "reply_to": null,
        "is_deleted": false,
        "createdAt": "2026-03-06T11:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 50, "total": 120 }
  }
}
```

---

### POST /chat/conversations/:conversationId/messages

Send a message in a conversation (via REST, alternatively use Socket.IO `message:send`).

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID |

**Request Body:**

```json
{
  "content": "Hello there!",
  "message_type": "text",
  "media_keys": [],
  "reply_to": null
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | No (depends on type) | Text content of the message |
| `message_type` | string | No (default `"text"`) | `"text"`, `"image"`, `"video"`, `"mixed"`, `"shared_post"`, `"shared_reel"` |
| `media_keys` | string[] | No | Media file keys from upload endpoint |
| `reply_to` | string | No | Message ID being replied to |

**Success Response (201):**

```json
{
  "status_code": 201,
  "success": true,
  "message": "Message sent",
  "data": {
    "_id": "ObjectId",
    "conversation_id": "ObjectId",
    "sender_id": "ObjectId",
    "content": "Hello there!",
    "message_type": "text",
    "createdAt": "2026-03-06T11:10:00.000Z"
  }
}
```

---

### POST /chat/conversations/:conversationId/read

Mark all messages in a conversation as read.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Marked as read",
  "data": null
}
```

---

### POST /chat/messages/:messageId/react

Add an emoji reaction to a message.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `messageId` | string | Message ID |

**Request Body:**

```json
{
  "emoji": "❤️"
}
```

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reaction added",
  "data": null
}
```

---

### DELETE /chat/messages/:messageId/react

Remove your emoji reaction from a message.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `messageId` | string | Message ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reaction removed",
  "data": null
}
```

---

### GET /chat/messages/:messageId/reactions

Get all reactions on a message.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `messageId` | string | Message ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reactions fetched",
  "data": [
    {
      "user_id": { "_id": "...", "username": "...", "avatar_url": "..." },
      "emoji": "❤️"
    }
  ]
}
```

---

### DELETE /chat/messages/:messageId

Delete a message (soft delete). Only the sender can delete their own message.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `messageId` | string | Message ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Message deleted",
  "data": null
}
```

---

### POST /chat/conversations/:conversationId/participants

Add a participant to a group conversation. Only the group admin can do this.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID |

**Request Body:**

```json
{
  "user_id": "ObjectId"
}
```

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Participant added",
  "data": { }
}
```

---

### DELETE /chat/conversations/:conversationId/participants/:userId

Remove a participant from a group conversation. Only the group admin can do this.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID |
| `userId` | string | User ID to remove |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Participant removed",
  "data": { }
}
```

---

### PATCH /chat/conversations/:conversationId/name

Update the group conversation name. Only the group admin can do this.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID |

**Request Body:**

```json
{
  "name": "New Group Name"
}
```

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Group name updated",
  "data": { }
}
```

---

### GET /chat/unread-count

Get total unread message count across all conversations.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Unread count",
  "data": {
    "count": 7
  }
}
```

---

### GET /chat/friends

Get list of friends (mutual follows) for starting new conversations.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Friends fetched",
  "data": [
    {
      "_id": "ObjectId",
      "full_name": "Jane Doe",
      "username": "jane_doe",
      "avatar_url": "http://..."
    }
  ]
}
```

---

### POST /chat/users/activity

Get online/activity status for a batch of user IDs. Respects activity status privacy settings.

**Request Body:**

```json
{
  "user_ids": ["ObjectId1", "ObjectId2", "ObjectId3"]
}
```

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Activity status fetched",
  "data": {
    "ObjectId1": {
      "is_online": true,
      "last_active_at": "2026-03-06T11:00:00.000Z",
      "show_activity_status": true
    },
    "ObjectId2": {
      "is_online": false,
      "last_active_at": null,
      "show_activity_status": false
    }
  }
}
```

---

### GET /chat/message-requests

Get pending message requests (conversations from non-followers).

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Message requests fetched",
  "data": [
    {
      "_id": "ObjectId",
      "type": "direct",
      "participants": [ ],
      "request_status": "pending",
      "last_message": { },
      "createdAt": "2026-03-06T10:00:00.000Z"
    }
  ]
}
```

---

### GET /chat/message-requests/count

Get the count of pending message requests.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Request count",
  "data": {
    "count": 3
  }
}
```

---

### POST /chat/message-requests/:conversationId/accept

Accept a message request.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Message request accepted",
  "data": null
}
```

> Also emits `message-request:accepted` and `conversation:updated` socket events to the sender.

---

### POST /chat/message-requests/:conversationId/reject

Reject a message request.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Message request rejected",
  "data": null
}
```

---

## Feed

All endpoints require authentication (🔒).

---

### GET /feed/home

Get the home feed for the authenticated user. Returns an algorithmic mix of posts and reels from followed users, with unseen content prioritized.

**Query Parameters:**

| Param | Type | Default | Max | Description |
|-------|------|---------|-----|-------------|
| `page` | number | 1 | — | Page number |
| `limit` | number | 10 | 30 | Items per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Home feed fetched",
  "data": {
    "items": [
      {
        "type": "post",
        "data": { "_id": "...", "author": { }, "caption": "...", "media_urls": [ ], "likes_count": 5, "is_liked": false, "is_saved": false }
      },
      {
        "type": "reel",
        "data": { "_id": "...", "author": { }, "caption": "...", "video_url": "...", "thumbnail_url": "..." }
      },
      {
        "type": "divider",
        "data": { "message": "You're all caught up" }
      }
    ],
    "pagination": { "page": 1, "limit": 10, "hasMore": true }
  }
}
```

---

### GET /feed/explore

Get trending public content from users you don't follow.

**Query Parameters:**

| Param | Type | Default | Max | Description |
|-------|------|---------|-----|-------------|
| `page` | number | 1 | — | Page number |
| `limit` | number | 20 | 40 | Items per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Explore content fetched",
  "data": {
    "items": [
      { "type": "post", "data": { } },
      { "type": "reel", "data": { } }
    ],
    "pagination": { "page": 1, "limit": 20, "hasMore": true }
  }
}
```

---

### GET /feed/reels

Get the reels feed for vertical scroll viewing.

**Query Parameters:**

| Param | Type | Default | Max | Description |
|-------|------|---------|-----|-------------|
| `page` | number | 1 | — | Page number |
| `limit` | number | 10 | 20 | Items per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reels feed fetched",
  "data": {
    "reels": [
      {
        "_id": "ObjectId",
        "author": { },
        "caption": "...",
        "video_url": "...",
        "thumbnail_url": "...",
        "duration_seconds": 15,
        "likes_count": 100,
        "comments_count": 20,
        "views_count": 500,
        "is_liked": false,
        "is_saved": false
      }
    ],
    "pagination": { "page": 1, "limit": 10, "hasMore": true }
  }
}
```

---

### GET /feed/suggested-users

Get suggested users to follow (based on popularity, excludes moderators/admins).

**Query Parameters:**

| Param | Type | Default | Max | Description |
|-------|------|---------|-----|-------------|
| `limit` | number | 5 | 20 | Number of suggestions |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Suggested users fetched",
  "data": [
    {
      "_id": "ObjectId",
      "full_name": "Popular User",
      "username": "popular_user",
      "avatar_url": "http://...",
      "followers_count": 1000
    }
  ]
}
```

---

## Notifications

All endpoints require authentication (🔒).

---

### GET /notifications

Get notifications for the authenticated user (paginated, newest first).

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 30 | Items per page |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Notifications fetched",
  "data": {
    "notifications": [
      {
        "_id": "ObjectId",
        "recipient": "ObjectId",
        "sender": {
          "_id": "ObjectId",
          "username": "jane_doe",
          "full_name": "Jane Doe",
          "avatar_url": "http://..."
        },
        "type": "like_post",
        "target_id": "ObjectId",
        "target_type": "post",
        "content": "",
        "is_read": false,
        "createdAt": "2026-03-06T10:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 30, "total": 50 }
  }
}
```

**Notification Types:**

| Type | Description |
|------|-------------|
| `follow` | Someone followed you |
| `follow_request` | Someone requested to follow you |
| `follow_request_accepted` | Your follow request was accepted |
| `like_post` | Someone liked your post |
| `like_reel` | Someone liked your reel |
| `like_comment` | Someone liked your comment |
| `comment_post` | Someone commented on your post |
| `comment_reel` | Someone commented on your reel |
| `reply_comment` | Someone replied to your comment |
| `repost_post` | Someone reposted your post |
| `repost_reel` | Someone reposted your reel |
| `mention` | Someone mentioned you |
| `mod_post_removed` | A moderator removed your post |
| `mod_reel_removed` | A moderator removed your reel |
| `mod_account_disabled` | A moderator disabled your account |
| `mod_account_enabled` | A moderator re-enabled your account |
| `mod_warning` | A moderator sent you a warning |

---

### GET /notifications/unread-count

Get the count of unread notifications.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Unread count",
  "data": {
    "count": 12
  }
}
```

---

### POST /notifications/mark-read

Mark all notifications as read.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "All notifications marked as read",
  "data": null
}
```

---

### POST /notifications/:notificationId/read

Mark a single notification as read.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `notificationId` | string | Notification ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Notification marked as read",
  "data": null
}
```

---

### DELETE /notifications/:notificationId

Delete a single notification.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `notificationId` | string | Notification ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Notification deleted",
  "data": null
}
```

---

### DELETE /notifications

Clear all notifications.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "All notifications cleared",
  "data": null
}
```

---

## Reports

All endpoints require authentication (🔒).

---

### POST /reports

Submit a report against a post, reel, comment, or user.

**Request Body:**

```json
{
  "target_id": "ObjectId",
  "target_type": "post",
  "reason": "spam",
  "description": "This post is spam content"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `target_id` | string | Yes | ID of the content being reported |
| `target_type` | string | Yes | `"post"`, `"reel"`, `"comment"`, or `"user"` |
| `reason` | string | Yes | `"spam"`, `"harassment"`, `"hate_speech"`, `"violence"`, `"nudity"`, `"false_information"`, `"intellectual_property"`, `"self_harm"`, `"other"` |
| `description` | string | No | Optional detailed description |

**Success Response (201):**

```json
{
  "status_code": 201,
  "success": true,
  "message": "Report submitted successfully",
  "data": {
    "report_id": "ObjectId"
  }
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | target_id, target_type, and reason are required / Invalid target_type |
| 409 | `ERR_DUPLICATE` | You have already reported this content |

---

## Settings

All settings endpoints are mounted at `/api/v1/users/me/settings` and require authentication (🔒).

---

### GET /users/me/settings

Get all settings for the authenticated user.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "User settings fetched",
  "data": {
    "privacy": {
      "private_account": false,
      "allow_messages_from": "everyone",
      "allow_comments_from": "everyone",
      "allow_mentions_from": "everyone",
      "show_activity_status": true,
      "blocked_users": []
    },
    "notifications": {
      "likes": true,
      "comments": true,
      "mentions": true,
      "follows": true,
      "messages": true
    },
    "appearance": {
      "theme": "system"
    },
    "feed": {
      "mode": "algorithmic",
      "show_sensitive_content": false
    },
    "security": {
      "login_alerts": true,
      "sessions": []
    }
  }
}
```

---

### PATCH /users/me/settings/privacy

Update **exactly one** privacy setting at a time.

**Request Body (one field per request):**

```json
{ "private_account": true }
```

```json
{ "allow_messages_from": "followers_only" }
```

```json
{ "allow_comments_from": "no_one" }
```

```json
{ "allow_mentions_from": "everyone" }
```

```json
{ "show_activity_status": false }
```

| Field | Type | Accepted Values |
|-------|------|-----------------|
| `private_account` | boolean | `true`, `false` |
| `allow_messages_from` | string | `"everyone"`, `"followers_only"`, `"no_one"` |
| `allow_comments_from` | string | `"everyone"`, `"followers_only"`, `"no_one"` |
| `allow_mentions_from` | string | `"everyone"`, `"followers_only"`, `"no_one"` |
| `show_activity_status` | boolean | `true`, `false` |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Privacy settings updated successfully",
  "data": null
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Please provide exactly one field to update / private_account must be a boolean |

---

### PATCH /users/me/settings/notifications

Update **exactly one** notification preference at a time.

**Request Body (one field per request):**

```json
{ "likes": false }
```

```json
{ "comments": true }
```

```json
{ "follows": true }
```

```json
{ "mentions": false }
```

```json
{ "messages": true }
```

| Field | Type | Description |
|-------|------|-------------|
| `likes` | boolean | Receive like notifications |
| `comments` | boolean | Receive comment notifications |
| `follows` | boolean | Receive follow notifications |
| `mentions` | boolean | Receive mention notifications |
| `messages` | boolean | Receive message notifications |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Notification setting updated successfully",
  "data": null
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Exactly one notification setting must be provided |

---

### PATCH /users/me/settings/appearance

Update appearance settings (theme).

**Request Body:**

```json
{
  "theme": "dark"
}
```

| Field | Type | Accepted Values |
|-------|------|-----------------|
| `theme` | string | `"light"`, `"dark"`, `"system"` |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Theme updated successfully",
  "data": null
}
```

---

### PATCH /users/me/settings/feed

Update **exactly one** feed setting at a time.

**Request Body (one field per request):**

```json
{ "mode": "chronological" }
```

```json
{ "show_sensitive_content": true }
```

| Field | Type | Accepted Values |
|-------|------|-----------------|
| `mode` | string | `"algorithmic"`, `"chronological"` |
| `show_sensitive_content` | boolean | `true`, `false` |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Feed settings updated successfully",
  "data": null
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Exactly one of 'mode' or 'show_sensitive_content' must be provided |

---

## Media (Content Upload)

All endpoints require authentication (🔒).

---

### POST /media/post

Create a new post with image uploads.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `images` | File[] | Yes | Image files (max 500MB total) |
| `caption` | string | No | Post caption |
| `visibility` | string | No | `"public"`, `"private"`, `"followers"` |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Post uploaded successfully",
  "data": {
    "_id": "ObjectId",
    "author": "ObjectId",
    "caption": "My new post!",
    "hashtags": ["newpost"],
    "media_keys": ["img_abc.jpg", "img_def.jpg"],
    "visibility": "public",
    "createdAt": "2026-03-06T12:00:00.000Z"
  }
}
```

---

### POST /media/reel

Create a new reel with video upload.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `video` | File | Yes | Video file (max 500MB) |
| `caption` | string | No | Reel caption |
| `visibility` | string | No | `"public"`, `"private"`, `"followers"` |

**Success Response (201):**

```json
{
  "status_code": 201,
  "success": true,
  "message": "Reel uploaded successfully",
  "data": {
    "_id": "ObjectId",
    "author": "ObjectId",
    "caption": "Watch this!",
    "hashtags": ["viral"],
    "media_key": "vid_xyz.mp4",
    "thumbnail_key": "thumb_xyz.jpg",
    "duration_seconds": 30,
    "visibility": "public",
    "createdAt": "2026-03-06T12:00:00.000Z"
  }
}
```

---

## Files (Static Asset Serving)

These endpoints are **publicly accessible** (no authentication required). The random file key acts as a capability token.

---

### GET /files/images/:imageKey

Serve a processed image file.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `imageKey` | string | Image file key |

**Response:** Binary image data with `Content-Type: image/jpeg` and `Cache-Control: private, max-age=3600`.

---

### GET /files/videos/:videoKey

Serve a video file.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `videoKey` | string | Video file key |

**Response:** Binary video data with `Content-Type: video/mp4` and `Cache-Control: private, max-age=3600`.

---

### GET /files/thumbnails/:thumbnailKey

Serve a video thumbnail image.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `thumbnailKey` | string | Thumbnail file key |

**Response:** Binary image data with `Content-Type: image/jpeg` and `Cache-Control: private, max-age=3600`.

---

## Moderators

All moderator endpoints require authentication (🔒) **and** moderator role (`moderator` or `system_admin`).

---

### GET /moderators/dashboard/stats

Get dashboard overview statistics.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Dashboard stats fetched",
  "data": {
    "total_users": 1500,
    "active_users": 1400,
    "disabled_users": 20,
    "moderator_count": 5,
    "total_posts": 5000,
    "removed_posts": 30,
    "total_reels": 2000,
    "removed_reels": 10,
    "total_comments": 15000,
    "pending_reports": 25,
    "total_reports": 200
  }
}
```

---

### GET /moderators/users

Get all users with search and filtering.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `search` | string | — | Search by username or name |
| `filter` | string | — | `"all"`, `"active"`, `"disabled"`, `"moderators"` |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Users fetched",
  "data": [
    {
      "_id": "ObjectId",
      "full_name": "John Doe",
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "is_disabled": false,
      "avatar_url": "http://...",
      "createdAt": "2026-01-15T08:30:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 1500, "totalPages": 75 }
}
```

---

### GET /moderators/users/:userId

Get detailed information about a specific user.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `userId` | string | User ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "User details fetched",
  "data": {
    "_id": "ObjectId",
    "full_name": "John Doe",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "is_disabled": false,
    "bio": "Hello world",
    "avatar_url": "http://...",
    "followers_count": 42,
    "following_count": 50,
    "createdAt": "2026-01-15T08:30:00.000Z"
  }
}
```

---

### PATCH /moderators/users/:userId/disable

Disable a user account. Creates an audit log entry and sends notification.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `userId` | string | User ID to disable |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "User has been disabled",
  "data": null
}
```

---

### PATCH /moderators/users/:userId/enable

Re-enable a disabled user account.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `userId` | string | User ID to enable |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "User has been enabled",
  "data": null
}
```

---

### POST /moderators/users/:userId/warn

Send a warning to a user. Creates a notification and an audit log entry.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `userId` | string | User ID to warn |

**Request Body:**

```json
{
  "message": "Your recent post violates our community guidelines."
}
```

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Warning sent to user",
  "data": null
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Warning message is required |
| 403 | `ERR_FORBIDDEN` | Cannot warn a moderator or admin |
| 404 | `ERR_NOT_FOUND` | User not found |

---

### GET /moderators/posts

Get all posts with filtering.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `filter` | string | — | `"all"`, `"active"`, `"removed"` |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Posts fetched",
  "data": [
    {
      "_id": "ObjectId",
      "author": { "_id": "...", "username": "...", "avatar_url": "..." },
      "caption": "...",
      "media_urls": [],
      "hashtags": [],
      "likes_count": 15,
      "comments_count": 3,
      "is_removed_by_moderator": false,
      "createdAt": "2026-03-05T10:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 5000, "totalPages": 250 }
}
```

---

### PATCH /moderators/posts/:postId/remove

Remove a post (set `is_removed_by_moderator` to `true`). Sends notification to author and logs the action.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Post has been removed",
  "data": null
}
```

---

### PATCH /moderators/posts/:postId/restore

Restore a previously removed post.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `postId` | string | Post ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Post has been restored",
  "data": null
}
```

---

### GET /moderators/reels

Get all reels with filtering.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `filter` | string | — | `"all"`, `"active"`, `"removed"` |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reels fetched",
  "data": [
    {
      "_id": "ObjectId",
      "author": { "_id": "...", "username": "..." },
      "caption": "...",
      "thumbnail_url": "...",
      "duration_seconds": 30,
      "likes_count": 50,
      "views_count": 200,
      "is_removed_by_moderator": false,
      "createdAt": "2026-03-04T09:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 2000, "totalPages": 100 }
}
```

---

### PATCH /moderators/reels/:reelId/remove

Remove a reel. Sends notification to author and logs the action.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `reelId` | string | Reel ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reel has been removed",
  "data": null
}
```

---

### PATCH /moderators/reels/:reelId/restore

Restore a previously removed reel.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `reelId` | string | Reel ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reel has been restored",
  "data": null
}
```

---

### DELETE /moderators/comments/:commentId

Remove a comment (moderator action). Logs the action.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `commentId` | string | Comment ID |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Comment has been removed",
  "data": null
}
```

---

### GET /moderators/reports

Get all reports with status and type filtering.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page |
| `status` | string | — | `"pending"`, `"reviewed"`, `"resolved"`, `"dismissed"` |
| `target_type` | string | — | `"post"`, `"reel"`, `"comment"`, `"user"` |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Reports fetched",
  "data": [
    {
      "_id": "ObjectId",
      "reporter": { "_id": "...", "username": "..." },
      "target_id": "ObjectId",
      "target_type": "post",
      "reason": "spam",
      "description": "This is spam",
      "status": "pending",
      "reviewed_by": null,
      "moderator_note": null,
      "createdAt": "2026-03-06T09:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 200, "totalPages": 10 }
}
```

---

### GET /moderators/reports/counts

Get counts of reports grouped by status.

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Report counts fetched",
  "data": {
    "pending": 25,
    "reviewed": 50,
    "resolved": 100,
    "dismissed": 25,
    "total": 200
  }
}
```

---

### PATCH /moderators/reports/:reportId/status

Update the status of a report.

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `reportId` | string | Report ID |

**Request Body:**

```json
{
  "status": "resolved",
  "moderator_note": "Content has been removed"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | Yes | `"pending"`, `"reviewed"`, `"resolved"`, `"dismissed"` |
| `moderator_note` | string | No | Optional note about the moderation decision |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Report status updated",
  "data": null
}
```

**Error Responses:**

| Status | Code | Message |
|--------|------|---------|
| 400 | `ERR_INVALID_INPUT` | Valid status is required (pending, reviewed, resolved, dismissed) |
| 404 | `ERR_NOT_FOUND` | Report not found |

---

### GET /moderators/audit-log

Get the audit log of all moderator actions.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 30 | Items per page |
| `action` | string | — | Filter by action type (see below) |
| `moderator_id` | string | — | Filter by moderator ID |

**Action Types:**

| Action | Description |
|--------|-------------|
| `user_disabled` | User account was disabled |
| `user_enabled` | User account was re-enabled |
| `user_warned` | Warning sent to user |
| `post_removed` | Post was removed |
| `post_restored` | Post was restored |
| `reel_removed` | Reel was removed |
| `reel_restored` | Reel was restored |
| `comment_removed` | Comment was removed |
| `report_reviewed` | Report was marked as reviewed |
| `report_resolved` | Report was resolved |
| `report_dismissed` | Report was dismissed |

**Success Response (200):**

```json
{
  "status_code": 200,
  "success": true,
  "message": "Audit log fetched",
  "data": [
    {
      "_id": "ObjectId",
      "moderator": { "_id": "...", "username": "...", "full_name": "..." },
      "action": "post_removed",
      "target_id": "ObjectId",
      "target_type": "post",
      "details": "Removed for violating community guidelines",
      "createdAt": "2026-03-06T08:00:00.000Z"
    }
  ],
  "pagination": { "page": 1, "limit": 30, "total": 150, "totalPages": 5 }
}
```

---

## Socket.IO Events

The Socket.IO server runs on the same port as the HTTP server (`8000`).

### Connection & Authentication

**Connection URL:** `http://localhost:8000`

**CORS:** Allows `http://localhost:3000` with credentials.

**Transports:** `websocket`, `polling`

**Authentication:** The Socket.IO server uses middleware to validate the session before allowing a connection.

The session ID is read from:
1. `socket.handshake.auth.sessionId` (preferred), or
2. The `session_id` cookie from `socket.handshake.headers.cookie`

```javascript
// Client connection example
const socket = io("http://localhost:8000", {
  auth: { sessionId: "your-session-id" },
  withCredentials: true
});
```

**On successful connection:**
- User is marked as `is_online: true` in the database
- `last_active_at` is updated
- User joins their personal room `user:{userId}`
- If user has `show_activity_status` enabled, `user:online` is broadcast to all connected clients

**On authentication failure:**

```javascript
socket.on("connect_error", (err) => {
  // err.message: "Authentication required" | "Invalid session" | "Session expired" | "Authentication failed"
});
```

---

### Client → Server Events

---

#### `conversation:join`

Join a conversation room to receive real-time messages.

**Payload:**

```javascript
socket.emit("conversation:join", conversationId);
```

| Field | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID to join |

**Server Actions:**
- Validates user is a participant of the conversation
- Joins the Socket.IO room `conversation:{conversationId}`
- Marks all messages in the conversation as read
- Emits `messages:read` to the conversation room
- Emits `unread:update` to the user's personal room

**On Error:**

```javascript
socket.on("error", (data) => {
  // data.message: "Cannot join conversation"
});
```

---

#### `conversation:leave`

Leave a conversation room.

**Payload:**

```javascript
socket.emit("conversation:leave", conversationId);
```

| Field | Type | Description |
|-------|------|-------------|
| `conversationId` | string | Conversation ID to leave |

---

#### `message:send`

Send a message in a conversation.

**Payload:**

```javascript
socket.emit("message:send", {
  conversationId: "ObjectId",
  content: "Hello!",
  messageType: "text",
  mediaKeys: [],
  sharedPostId: null,
  sharedReelId: null,
  replyTo: null,
  tempId: "temp-uuid"
});
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `conversationId` | string | Yes | Target conversation |
| `content` | string | No | Text content |
| `messageType` | string | No (default `"text"`) | `"text"`, `"image"`, `"video"`, `"mixed"`, `"shared_post"`, `"shared_reel"` |
| `mediaKeys` | string[] | No | Media file keys from upload endpoint |
| `sharedPostId` | string | No | Post ID when sharing a post |
| `sharedReelId` | string | No | Reel ID when sharing a reel |
| `replyTo` | string | No | Message ID being replied to |
| `tempId` | string | No | Client-side temp ID for optimistic UI matching |

**Server Emits:**

1. `message:new` → to `conversation:{conversationId}` room (see [message:new](#messagenew))
2. `conversation:updated` → to each other participant's personal room
3. `unread:update` → to each other participant's personal room

**On Error:**

```javascript
socket.on("error", (data) => {
  // data.message: "Failed to send message"
});
```

---

#### `typing:start`

Notify that the user has started typing.

**Payload:**

```javascript
socket.emit("typing:start", { conversationId: "ObjectId" });
```

**Server Emits:** `typing:start` → to other users in the conversation room (see [typing:start](#typingstart-1))

---

#### `typing:stop`

Notify that the user has stopped typing.

**Payload:**

```javascript
socket.emit("typing:stop", { conversationId: "ObjectId" });
```

**Server Emits:** `typing:stop` → to other users in the conversation room

---

#### `messages:read`

Mark all messages in a conversation as read.

**Payload:**

```javascript
socket.emit("messages:read", { conversationId: "ObjectId" });
```

**Server Actions:**
- Marks messages as read in the database
- Emits `messages:read` to the conversation room
- Emits `unread:update` to the reading user's personal room

---

#### `message:react`

Add an emoji reaction to a message.

**Payload:**

```javascript
socket.emit("message:react", {
  messageId: "ObjectId",
  conversationId: "ObjectId",
  emoji: "❤️"
});
```

| Field | Type | Description |
|-------|------|-------------|
| `messageId` | string | Message to react to |
| `conversationId` | string | Conversation the message belongs to |
| `emoji` | string | Emoji character |

**Server Emits:** `message:reacted` → to the conversation room (see [message:reacted](#messagereacted))

**On Error:**

```javascript
socket.on("error", (data) => {
  // data.message: "Failed to react"
});
```

---

#### `message:unreact`

Remove your emoji reaction from a message.

**Payload:**

```javascript
socket.emit("message:unreact", {
  messageId: "ObjectId",
  conversationId: "ObjectId"
});
```

**Server Emits:** `message:unreacted` → to the conversation room (see [message:unreacted](#messageunreacted))

**On Error:**

```javascript
socket.on("error", (data) => {
  // data.message: "Failed to remove reaction"
});
```

---

#### `message:delete`

Delete a message (soft delete).

**Payload:**

```javascript
socket.emit("message:delete", {
  messageId: "ObjectId",
  conversationId: "ObjectId"
});
```

**Server Emits:** `message:deleted` → to the conversation room (see [message:deleted](#messagedeleted))

**On Error:**

```javascript
socket.on("error", (data) => {
  // data.message: "Failed to delete message"
});
```

---

#### `user:check-online`

Check online status for a batch of users. Respects privacy settings.

**Payload:**

```javascript
socket.emit("user:check-online", {
  userIds: ["ObjectId1", "ObjectId2", "ObjectId3"]
});
```

**Server Emits:** `user:online-status` → directly to the requesting socket

```javascript
socket.on("user:online-status", (statuses) => {
  // statuses: { "ObjectId1": true, "ObjectId2": false, "ObjectId3": true }
});
```

> If the requesting user has `show_activity_status` disabled, all users will be returned as `false`.
> Users with `show_activity_status` disabled will always appear as offline.

---

### Server → Client Events

---

#### `message:new`

A new message was sent in a conversation you're in.

**Emitted to:** `conversation:{conversationId}` room

**Payload:**

```javascript
socket.on("message:new", (message) => {
  // message:
  {
    _id: "ObjectId",
    conversation_id: "ObjectId",
    sender: {
      _id: "ObjectId",
      username: "john_doe",
      full_name: "John Doe",
      avatar_url: "http://..."
    },
    content: "Hello!",
    message_type: "text",
    media_urls: [],
    reactions: [],
    read_by: [],
    reply_to: null,
    is_deleted: false,
    createdAt: "2026-03-06T11:00:00.000Z",
    tempId: "temp-uuid"  // Only if provided by sender
  }
});
```

---

#### `message:reacted`

A reaction was added to a message.

**Emitted to:** `conversation:{conversationId}` room

**Payload:**

```javascript
socket.on("message:reacted", (data) => {
  // data:
  {
    messageId: "ObjectId",
    conversationId: "ObjectId",
    userId: "ObjectId",
    emoji: "❤️"
  }
});
```

---

#### `message:unreacted`

A reaction was removed from a message.

**Emitted to:** `conversation:{conversationId}` room

**Payload:**

```javascript
socket.on("message:unreacted", (data) => {
  // data:
  {
    messageId: "ObjectId",
    conversationId: "ObjectId",
    userId: "ObjectId"
  }
});
```

---

#### `message:deleted`

A message was deleted in a conversation.

**Emitted to:** `conversation:{conversationId}` room

**Payload:**

```javascript
socket.on("message:deleted", (data) => {
  // data:
  {
    messageId: "ObjectId",
    conversationId: "ObjectId"
  }
});
```

---

#### `messages:read`

Messages in a conversation were marked as read by a user.

**Emitted to:** `conversation:{conversationId}` room

**Payload:**

```javascript
socket.on("messages:read", (data) => {
  // data:
  {
    conversationId: "ObjectId",
    userId: "ObjectId"  // The user who read the messages
  }
});
```

---

#### `typing:start`

A user has started typing in a conversation.

**Emitted to:** Other users in `conversation:{conversationId}` room

**Payload:**

```javascript
socket.on("typing:start", (data) => {
  // data:
  {
    conversationId: "ObjectId",
    userId: "ObjectId"
  }
});
```

---

#### `typing:stop`

A user has stopped typing in a conversation.

**Emitted to:** Other users in `conversation:{conversationId}` room

**Payload:**

```javascript
socket.on("typing:stop", (data) => {
  // data:
  {
    conversationId: "ObjectId",
    userId: "ObjectId"
  }
});
```

---

#### `user:online`

A user has come online. Only emitted if the user has `show_activity_status` enabled.

**Emitted to:** All connected clients (broadcast)

**Payload:**

```javascript
socket.on("user:online", (data) => {
  // data:
  {
    userId: "ObjectId"
  }
});
```

---

#### `user:offline`

A user has gone offline (all sockets disconnected). Only emitted if the user has `show_activity_status` enabled.

**Emitted to:** All connected clients (broadcast)

**Payload:**

```javascript
socket.on("user:offline", (data) => {
  // data:
  {
    userId: "ObjectId"
  }
});
```

---

#### `user:online-status`

Response to `user:check-online` with batch online status.

**Emitted to:** The requesting socket only

**Payload:**

```javascript
socket.on("user:online-status", (statuses) => {
  // statuses: Record<string, boolean>
  // e.g. { "userId1": true, "userId2": false }
});
```

---

#### `conversation:updated`

A conversation has been updated (new message, request accepted). Used to refresh the conversation list.

**Emitted to:** `user:{userId}` personal room

**Payload:**

```javascript
socket.on("conversation:updated", (data) => {
  // data:
  {
    conversationId: "ObjectId"
  }
});
```

---

#### `unread:update`

Total unread message count has changed.

**Emitted to:** `user:{userId}` personal room

**Payload:**

```javascript
socket.on("unread:update", (data) => {
  // data:
  {
    total: 7
  }
});
```

---

#### `notification:new`

A new notification has been created (emitted by the notification service).

**Emitted to:** `user:{recipientId}` personal room

**Payload:**

```javascript
socket.on("notification:new", (notification) => {
  // notification:
  {
    _id: "ObjectId",
    recipient: "ObjectId",
    sender: {
      _id: "ObjectId",
      username: "jane_doe",
      full_name: "Jane Doe",
      avatar_url: "http://..."
    },
    type: "like_post",
    target_id: "ObjectId",
    target_type: "post",
    content: "",
    is_read: false,
    createdAt: "2026-03-06T10:00:00.000Z"
  }
});
```

---

#### `notification:count`

Unread notification count has been updated.

**Emitted to:** `user:{userId}` personal room

**Payload:**

```javascript
socket.on("notification:count", (data) => {
  // data:
  {
    count: 12
  }
});
```

---

#### `message-request:new`

A new message request has been received (conversation from a non-follower).

**Emitted to:** `user:{recipientId}` personal room

**Payload:**

```javascript
socket.on("message-request:new", (data) => {
  // data:
  {
    conversationId: "ObjectId"
  }
});
```

---

#### `message-request:accepted`

A message request you sent has been accepted by the recipient.

**Emitted to:** `user:{senderId}` personal room

**Payload:**

```javascript
socket.on("message-request:accepted", (data) => {
  // data:
  {
    conversationId: "ObjectId"
  }
});
```

---

#### `error`

An error occurred while processing a socket event.

**Emitted to:** The requesting socket only

**Payload:**

```javascript
socket.on("error", (data) => {
  // data:
  {
    message: "Error description"
  }
});
```
