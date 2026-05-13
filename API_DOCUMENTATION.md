# Developer Hub API Documentation

## Overview

The Developer Hub API provides comprehensive endpoints for user management, learning progress, social features, and administrative functions. All endpoints require authentication unless specified otherwise.

**Base URL:** `http://localhost:3000/api`

**Authentication:** Bearer Token (JWT)

---

## Authentication

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:** `201 Created`
```json
{
  "msg": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "msg": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

---

## User Management

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "username": "johndoe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "/uploads/avatars/johndoe.jpg",
  "location": "San Francisco, CA",
  "website": "https://johndoe.dev",
  "github": "johndoe",
  "linkedin": "johndoe",
  "skills": ["JavaScript", "React", "Node.js"],
  "interests": ["Web Development", "AI"],
  "learningGoals": ["Become full-stack developer"],
  "totalPoints": 1500,
  "learningStreak": 7
}
```

### Update User Profile
```http
PUT /api/users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "location": "San Francisco, CA",
  "website": "https://johndoe.dev",
  "github": "johndoe",
  "linkedin": "johndoe",
  "skills": ["JavaScript", "React", "Node.js"],
  "interests": ["Web Development", "AI"],
  "learningGoals": ["Become full-stack developer"]
}
```

### Upload Avatar
```http
POST /api/upload/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

avatar: [file]
```

**Response:** `200 OK`
```json
{
  "msg": "Avatar uploaded successfully",
  "avatarUrl": "/uploads/avatars/johndoe-1234567890.jpg"
}
```

---

## Learning Progress

### Get User Roadmaps
```http
GET /api/user-roadmaps
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "roadmaps": [
    {
      "id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "technologyId": "frontend",
      "technology": {
        "name": "Frontend Development",
        "category": "Web"
      },
      "status": "in_progress",
      "progress": [
        {
          "subTechnologyId": "html-css",
          "status": "completed",
          "completedAt": "2026-01-15T10:30:00Z"
        }
      ],
      "totalTimeSpent": 1200,
      "lastAccessed": "2026-01-20T15:45:00Z"
    }
  ]
}
```

### Enroll in Roadmap
```http
POST /api/user-roadmaps
Authorization: Bearer {token}
Content-Type: application/json

{
  "technologyId": "frontend"
}
```

### Update Lesson Progress
```http
PUT /api/user-roadmaps/:roadmapId/progress
Authorization: Bearer {token}
Content-Type: application/json

{
  "subTechnologyId": "html-css",
  "status": "completed",
  "timeSpent": 45
}
```

### Get Learning Statistics
```http
GET /api/user-roadmaps/statistics
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "totalRoadmaps": 3,
  "completedRoadmaps": 1,
  "totalLessons": 24,
  "completedLessons": 8,
  "totalTimeSpent": 3600,
  "averageSessionTime": 45,
  "learningStreak": 7
}
```

---

## Notes System

### Create Note
```http
POST /api/notes
Authorization: Bearer {token}
Content-Type: application/json

{
  "roadmapId": "frontend",
  "subTechnologyId": "html-css",
  "title": "CSS Grid Layout",
  "content": "CSS Grid is a powerful layout system...",
  "tags": ["CSS", "Grid", "Layout"],
  "isPrivate": true
}
```

### Get User Notes
```http
GET /api/notes?roadmapId=frontend
Authorization: Bearer {token}
```

### Update Note
```http
PUT /api/notes/:noteId
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated CSS Grid Layout",
  "content": "Updated content...",
  "tags": ["CSS", "Grid", "Layout", "Updated"]
}
```

### Delete Note
```http
DELETE /api/notes/:noteId
Authorization: Bearer {token}
```

### Search Notes
```http
GET /api/notes/search?q=CSS Grid
Authorization: Bearer {token}
```

---

## Quiz System

### Get Quiz
```http
GET /api/quizzes/:subTechnologyId
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "quiz": {
    "id": "507f1f77bcf86cd799439013",
    "subTechnologyId": "html-css",
    "title": "HTML & CSS Fundamentals",
    "description": "Test your knowledge of HTML and CSS basics",
    "questions": [
      {
        "question": "What does HTML stand for?",
        "type": "multiple-choice",
        "options": [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlinks and Text Markup Language"
        ],
        "correctAnswer": 0,
        "explanation": "HTML stands for Hyper Text Markup Language",
        "points": 10
      }
    ],
    "timeLimit": 15,
    "maxAttempts": 3,
    "passingScore": 70
  },
  "userProgress": {
    "attempts": 1,
    "bestScore": 80,
    "passed": true
  }
}
```

### Submit Quiz
```http
POST /api/quizzes/:quizId/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": [0, 1, 2, 1, 0],
  "timeSpent": 720
}
```

**Response:** `200 OK`
```json
{
  "score": 80,
  "maxScore": 100,
  "percentage": 80,
  "passed": true,
  "answers": [
    {
      "questionIndex": 0,
      "userAnswer": 0,
      "correctAnswer": 0,
      "isCorrect": true,
      "points": 10
    }
  ],
  "attempt": 1
}
```

### Get Quiz Results
```http
GET /api/quizzes?subTechnologyId=html-css
Authorization: Bearer {token}
```

---

## Social Features

### Create Post
```http
POST /api/social/posts
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Just completed the HTML & CSS module! 🎉",
  "type": "text",
  "visibility": "public",
  "tags": ["learning", "milestone"]
}
```

### Get Social Feed
```http
GET /api/social/feed?limit=20
Authorization: Bearer {token}
```

### Like Post
```http
POST /api/social/posts/:postId/like
Authorization: Bearer {token}
```

### Add Comment
```http
POST /api/social/posts/:postId/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Congratulations! Great achievement!",
  "parentCommentId": null
}
```

### Follow User
```http
POST /api/social/follow/:targetUserId
Authorization: Bearer {token}
```

### Get User Connections
```http
GET /api/social/connections
Authorization: Bearer {token}
```

### Search Users
```http
GET /api/social/search?q=john
Authorization: Bearer {token}
```

---

## Forum System

### Create Forum Topic
```http
POST /api/forums
Authorization: Bearer {token}
Content-Type: application/json

{
  "technologyId": "frontend",
  "subTechnologyId": "html-css",
  "title": "Best practices for CSS Grid?",
  "description": "I'm learning CSS Grid and want to know the best practices...",
  "category": "question",
  "tags": ["CSS", "Grid", "best-practices"]
}
```

### Get Technology Forums
```http
GET /api/forums/technology/:technologyId
Authorization: Bearer {token}
```

### Get Forum with Replies
```http
GET /api/forums/:forumId
Authorization: Bearer {token}
```

### Add Reply
```http
POST /api/forums/:forumId/replies
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Here are some best practices for CSS Grid...",
  "parentReplyId": null
}
```

### Like Reply
```http
POST /api/forums/replies/:replyId/like
Authorization: Bearer {token}
```

---

## Analytics

### Get Learning Patterns
```http
GET /api/analytics/learning-patterns?period=30d
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "period": "30d",
  "summary": {
    "totalDuration": 720,
    "totalSessions": 15,
    "completedLessons": 8,
    "averageSessionDuration": 48,
    "activeDays": 12
  },
  "learningByDay": [
    {
      "date": "2026-01-01",
      "duration": 60,
      "sessions": 2
    }
  ],
  "learningByTechnology": [
    {
      "technology": {
        "name": "Frontend Development",
        "category": "Web"
      },
      "duration": 480,
      "sessions": 10
    }
  ],
  "learningByHour": [0, 0, 0, 0, 0, 0, 0, 30, 60, 120, 90, 60, 45, 30, 60, 45, 30, 60, 90, 60, 30, 15, 0, 0]
}
```

### Get Progress Timeline
```http
GET /api/analytics/progress-timeline
Authorization: Bearer {token}
```

### Get Detailed Statistics
```http
GET /api/analytics/detailed-statistics
Authorization: Bearer {token}
```

### Get Leaderboard
```http
GET /api/analytics/leaderboard?type=points&limit=50
Authorization: Bearer {token}
```

---

## Admin Features

### Get Dashboard Statistics
```http
GET /api/admin/dashboard/stats
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "users": {
    "total": 1250,
    "active": 890,
    "newToday": 12,
    "newThisWeek": 85,
    "newThisMonth": 320
  },
  "roadmaps": {
    "total": 3750,
    "completed": 1250,
    "completionRate": "33.3"
  },
  "lessons": {
    "total": 45000,
    "completed": 18000,
    "completionRate": "40.0"
  },
  "community": {
    "totalPosts": 5200,
    "totalForums": 890,
    "totalReplies": 3400
  }
}
```

### Get All Users
```http
GET /api/admin/users?page=1&limit=20&search=john&role=user
Authorization: Bearer {token}
```

### Update User Role
```http
PATCH /api/admin/users/:userId/role
Authorization: Bearer {token}
Content-Type: application/json

{
  "isAdmin": true
}
```

### Ban/Unban User
```http
POST /api/admin/users/:userId/ban
Authorization: Bearer {token}
Content-Type: application/json

{
  "action": "ban",
  "reason": "Violation of community guidelines"
}
```

### Moderate Content
```http
POST /api/admin/moderate
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "post",
  "id": "507f1f77bcf86cd799439014",
  "reason": "Inappropriate content"
}
```

### Get Admin Logs
```http
GET /api/admin/logs?page=1&limit=20&action=BAN_USER
Authorization: Bearer {token}
```

---

## Time Tracking

### Start Learning Session
```http
POST /api/time-tracking/session/start
Authorization: Bearer {token}
Content-Type: application/json

{
  "technologyId": "frontend",
  "subTechnologyId": "html-css"
}
```

### End Learning Session
```http
POST /api/time-tracking/session/end
Authorization: Bearer {token}
Content-Type: application/json

{
  "sessionId": "507f1f77bcf86cd799439015",
  "endTime": "2026-01-20T16:30:00Z",
  "completionStatus": "completed"
}
```

### Get Time Analytics
```http
GET /api/time-tracking/analytics?period=30d
Authorization: Bearer {token}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "error": {
    "type": "ValidationError",
    "message": "Validation failed",
    "details": {
      "errors": [
        {
          "field": "email",
          "message": "Invalid email format",
          "value": "invalid-email"
        }
      ]
    }
  }
}
```

### Common Error Types

- `ValidationError` (400) - Invalid request data
- `AuthenticationError` (401) - Invalid or missing authentication
- `AuthorizationError` (403) - Insufficient permissions
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Duplicate resource
- `RateLimitError` (429) - Too many requests
- `ServerError` (500) - Internal server error

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints:** 5 requests per minute
- **Data modification endpoints:** 20 requests per minute
- **Data retrieval endpoints:** 60 requests per minute

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1642771200
```

---

## Pagination

List endpoints support pagination using query parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

Response includes pagination metadata:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Versioning

The API is versioned using URL paths. Current version: `v1`

Example: `http://localhost:3000/api/v1/users/profile`

---

## Support

For API support and questions, please contact:
- Email: support@developerhub.com
- Documentation: https://docs.developerhub.com
- GitHub Issues: https://github.com/developerhub/api/issues
