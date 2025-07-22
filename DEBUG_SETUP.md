# MongoDB Event Debugging Guide

## Issues Found and Fixed

### 1. Database Connection Issue ✅ FIXED
- **Problem**: Syntax error in `config/db.js` - incorrect template literal syntax
- **Fix**: Changed `'${process.env.MONGODB_URI}/g11-shop'.opts` to `\`${process.env.MONGODB_URI}/g11shop\`, opts`

### 2. Missing Clerk Webhook Handler ✅ CREATED
- **Problem**: No webhook endpoint to receive Clerk events
- **Fix**: Created `app/api/webhooks/clerk/route.js` to handle Clerk webhooks and forward to Inngest

### 3. Missing Dependencies ✅ INSTALLED
- **Problem**: Missing `svix` package for webhook verification
- **Fix**: Installed `npm install svix`

## Setup Checklist

### Environment Variables Required
Create a `.env.local` file with:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017

# Clerk Configuration
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret_here

# Inngest Configuration (if using Inngest Cloud)
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here
```

### Clerk Dashboard Setup
1. Go to your Clerk Dashboard
2vigate to Webhooks
3. Add a new webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
4. Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
5. Copy the webhook secret to your `.env.local` file

### Testing Steps

1atabase Connection**:
   ```bash
   npm run dev
   # Check console for database connection errors
   ```
2**Test Webhook Endpoint**:
   ```bash
   # Your webhook URL should be accessible at:
   # https://your-domain.com/api/webhooks/clerk
   ```
3 Inngest Functions**:
   - Go to Inngest Dashboard
   - Check if functions are registered
   - Look for any execution errors
4. **Monitor Logs**:
   - Check browser console for errors
   - Check server logs for webhook processing
   - Check Inngest dashboard for function executions

## Common Issues and Solutions

### Issue: Webhook not receiving events
**Solutions**:
- Verify webhook URL is correct in Clerk dashboard
- Check if webhook secret is properly set
- Ensure your domain is accessible from the internet (use ngrok for local testing)

### Issue: Database connection failing
**Solutions**:
- Verify `MONGODB_URI` is correct
- Ensure MongoDB is running
- Check if database exists

### Issue: Inngest functions not executing
**Solutions**:
- Verify Inngest client is properly configured
- Check if events are being sent to Inngest
- Look for function registration errors

## Debugging Commands

```bash
# Check if MongoDB is running
mongosh

# Check environment variables
echo $MONGODB_URI

# Test webhook locally with ngrok
ngrok http 3000 Inngest dashboard
# Go to https://cloud.inngest.com
```

## File Structure
```
app/
├── api/
│   ├── inngest/
│   │   └── route.js          # Inngest API endpoint
│   └── webhooks/
│       └── clerk/
│           └── route.js      # Clerk webhook handler
config/
├── db.js                     # Database connection
└── inngest.js               # Inngest functions
models/
└── User.js                  # User model
```

## Next Steps
1. Set up your environment variables
2onfigure Clerk webhook in dashboard
3st with a new user creation
4. Monitor logs and Inngest dashboard
5. Verify data appears in MongoDB 