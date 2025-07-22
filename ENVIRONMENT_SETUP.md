# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017
# For production: mongodb+srv://username:password@cluster.mongodb.net

# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Inngest Configuration (if using Inngest Cloud)
INNGEST_EVENT_KEY=your_inngest_event_key_here
INNGEST_SIGNING_KEY=your_inngest_signing_key_here

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000al: For production
NODE_ENV=development
```

## Setup Instructions

### 1Database Setup
```bash
# Install MongoDB locally or use MongoDB Atlas
# For local development:
mongod --dbpath /path/to/data/db

# Or use Docker:
docker run -d -p 27017:2717name mongodb mongo:latest
```

### 2oard Configuration
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)2 Navigate to **Webhooks**
3. Add a new webhook endpoint:
   - URL: `https://your-domain.com/api/webhooks/clerk`
   - For local testing: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
4. Select these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `user.logged_in`
5. Copy the webhook secret to your `.env.local`

### 3st Setup (Optional)1[Inngest Dashboard](https://cloud.inngest.com)
2. Create a new project3Copy the event key and signing key to your `.env.local`

### 4. Local Development with ngrok
```bash
# Install ngrok
npm install -g ngrok

# Start your Next.js app
npm run dev

# In another terminal, expose your local server
ngrok http 3000 Use the ngrok URL in your Clerk webhook configuration
```

## Testing Your Setup

### 1. Test Database Connection
```bash
npm run dev
# Check console for: "✅ MongoDB connected successfully
```

### 2. Test Webhook Endpoint
```bash
# Test with curl
curl -X POST http://localhost:300api/webhooks/clerk \
  -H "Content-Type: application/json undefined -H svix-id: test-id" \
  -H "svix-timestamp: $(date +%s)" \
  -H "svix-signature: test-signature\
  -d{"test": data"}
```

### 3. Test User Creation
1. Create a new user in Clerk Dashboard
2. Check Inngest dashboard for function execution
3. Verify user appears in MongoDB

## Troubleshooting

### Common Issues

#### Database Connection Failed
- Verify MongoDB is running
- Check `MONGODB_URI` format
- Ensure network connectivity

#### Webhook Not Receiving Events
- Verify webhook URL is accessible
- Check webhook secret is correct
- Ensure events are selected in Clerk dashboard

#### Inngest Functions Not Executing
- Check Inngest dashboard for errors
- Verify event names match function triggers
- Check function registration

### Debug Commands
```bash
# Check MongoDB connection
mongosh

# Check environment variables
node -e "console.log(process.env.MONGODB_URI)"

# Test webhook locally
curl -X POST http://localhost:300api/webhooks/clerk

# Monitor logs
tail -f .next/server.log
```

## Security Best Practices
1 **Never commit `.env.local`** - it's already in `.gitignore`
2Use different keys for development and production**
3. **Rotate secrets regularly**4TTPS in production**5**Validate all webhook signatures**

## Production Checklist

- ODE_ENV=production`
- production MongoDB cluster
- [ ] Configure production Clerk keys
- Set up proper webhook URLs
-  Configure Inngest for production
- [ ] Set up monitoring and logging
-est all user flows
- [ ] Verify data persistence 