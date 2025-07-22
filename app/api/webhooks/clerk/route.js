import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { inngest } from '@/config/inngest';

// Validate required environment variables
function validateEnvironment() {
    const requiredVars = ['CLERK_WEBHOOK_SECRET'];
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}

export async function POST(req) {
    try {
        // Validate environment variables
        validateEnvironment();
        
        const headerPayload = headers();
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");
        
        // Validate required headers
        if (!svix_id || !svix_timestamp || !svix_signature) {
            console.error('❌ Missing required Svix headers');
            return new Response('Missing required headers', {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Get and validate request body
        let payload;
        try {
            payload = await req.json();
        } catch (error) {
            console.error('❌ Invalid JSON payload:', error);
            return new Response('Invalid JSON payload', {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const body = JSON.stringify(payload);

        // Create webhook instance with proper error handling
        let wh;
        try {
            wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        } catch (error) {
            console.error('❌ Invalid webhook secret:', error);
            return new Response('Invalid webhook configuration', {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        let evt;
        // Verify the payload with the headers
        try {
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            });
        } catch (err) {
            console.error('❌ Webhook verification failed:', err);
            return new Response('Webhook verification failed', {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Extract event data
        const { id } = evt.data;
        const eventType = evt.type;

        console.log(`✅ Webhook received! ${eventType} for user: ${id}`);

        // Validate event type
        const allowedEvents = ['user.created', 'user.updated', 'user.deleted', 'user.logged_in'];
        if (!allowedEvents.includes(eventType)) {
            console.log(`⚠️ Ignoring unsupported event type: ${eventType}`);
            return new Response('Event type not supported', {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        // Forward the event to Inngest with retry logic
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
            try {
                await inngest.send({
                    name: `clerk/${eventType}`,
                    data: evt.data,
                });
                console.log(`✅ Event forwarded to Inngest: clerk/${eventType}`);
                break;
            } catch (error) {
                retryCount++;
                console.error(`❌ Error forwarding event to Inngest (attempt ${retryCount}/${maxRetries}):`, error);
                
                if (retryCount >= maxRetries) {
                    return new Response('Failed to process event', { 
                        status: 500,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                }
                
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 10));
            }
        }

        return new Response('Success', { 
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        return new Response('Internal server error', {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}

// Handle OPTIONS request for CORS
export async function OPTIONS(req) {
    return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, svix-id, svix-timestamp, svix-signature',
        },
    });
} 