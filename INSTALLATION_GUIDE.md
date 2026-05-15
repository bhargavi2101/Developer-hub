# 🚀 Quick Start: Security Fixes Installation

## Prerequisites
- Node.js installed
- MongoDB account
- Basic terminal knowledge

## Installation Steps

### 1. Install Security Dependencies
```bash
cd backend
npm install helmet xss
```

### 2. Update Environment Variables

Generate secure secrets:
```bash
# Generate JWT secrets
JWT_SECRET=$(openssl rand -base64 64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64)
SESSION_SECRET=$(openssl rand -base64 64)

echo "Copy these secrets to your .env file:"
echo "JWT_SECRET=$JWT_SECRET"
echo "JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET"
echo "SESSION_SECRET=$SESSION_SECRET"
```

Update `backend/.env`:
```env
# MongoDB - REPLACE WITH YOUR CREDENTIALS
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER/devhub

# JWT - USE THE GENERATED SECRETS ABOVE
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here

# CORS - ADD YOUR FRONTEND DOMAINS
ALLOWED_ORIGINS=http://localhost:4200,https://your-frontend-domain.com

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Security
NODE_ENV=production
SESSION_SECRET=your_session_secret_here
```

### 3. Start the Backend Server
```bash
cd backend
npm start
```

You should see:
```
✅ DB connected
🚀 Server running on port 3000
🔒 Security headers enabled
📊 Rate limiting active
```

### 4. Verify Security Headers

Test your API with curl:
```bash
curl -I http://localhost:3000/
```

Expected headers:
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 5. Test Rate Limiting

```bash
# Should work first time
curl http://localhost:3000/api/protected

# Should fail after 100 requests
for i in {1..110}; do curl http://localhost:3000/api/protected; done
```

## What's Been Fixed?

### ✅ Backend Security
- CORS properly configured
- Rate limiting enabled
- Security headers active
- Input validation implemented
- XSS protection added
- File upload security enhanced
- Admin routes protected
- Password requirements strengthened
- JWT secrets secured

### ⚠️ Frontend Security (Still Needed)
See `FRONTEND_SECURITY_GUIDE.md` for implementation steps

## Testing Your Security

### 1. Test XSS Protection
```bash
curl -X POST http://localhost:3000/api/social/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"content":"<script>alert(\"XSS\")</script>"}'
```

Expected: Content should be sanitized (script tags removed)

### 2. Test Rate Limiting
```bash
# Login rate limit (5 attempts per 15 minutes)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

Expected: 5th attempt should succeed, 6th should fail with rate limit error

### 3. Test Admin Protection
```bash
# Try to access admin without admin role
curl http://localhost:3000/api/admin/dashboard/stats \
  -H "Authorization: Bearer NON_ADMIN_TOKEN"
```

Expected: 403 Forbidden

## Troubleshooting

### MongoDB Connection Error
```bash
# Check your MONGO_URI format
# Should be: mongodb+srv://username:password@cluster.mongodb.net/database
```

### JWT Secret Error
```bash
# Generate new secrets
JWT_SECRET=$(openssl rand -base64 64)
# Update .env file
```

### Rate Limiting Too Strict
```bash
# Adjust in server.js
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Increase this number
});
```

## Production Deployment

### 1. Update Environment
```env
NODE_ENV=production
ALLOWED_ORIGINS=https://your-production-domain.com
```

### 2. Enable HTTPS
```bash
# Use reverse proxy (nginx/Apache)
# Or use cloud provider (AWS, Heroku, Vercel)
```

### 3. Set Up Monitoring
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Security monitoring (Cloudflare)

## Security Checklist

Before going to production:

- [ ] Update all secrets in .env
- [ ] Enable HTTPS
- [ ] Configure CORS for production domains
- [ ] Set up database backups
- [ ] Enable security monitoring
- [ ] Implement frontend security (see guide)
- [ ] Test all security fixes
- [ ] Review logs for suspicious activity
- [ ] Set up alerts for security events

## Support

If you encounter issues:

1. Check `SECURITY_FIXES.md` for detailed explanations
2. Review error logs in console
3. Verify environment variables are set correctly
4. Ensure all dependencies are installed

## Next Steps

1. ✅ Backend security fixes - DONE
2. ⏳ Frontend security implementation - SEE GUIDE
3. ⏳ Security testing - RECOMMENDED
4. ⏳ Production deployment - PLANNING

---

**Estimated Time**: 15-30 minutes
**Difficulty**: Easy
**Security Impact**: Critical fixes applied

**Documentation**: See SECURITY_FIXES.md for complete details