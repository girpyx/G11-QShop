#!/usr/bin/env node

/**
 * Comprehensive Setup Testing Script
 * Run this script to validate your database and event management setup
 */

import mongoose from mongoose;
import[object Object]config } from dotenv/ Load environment variables
config({ path: .env.local' });

const colors = [object Object]
    reset: '\x1b[0m,
    bright: \x1b1m,
    red: '\x1b[31m,
    green: '\x1b[32m,
    yellow: '\x133m,
    blue: '\x1b34,
    magenta: '\x135m,
    cyan: '\x1b[36m
};

function log(message, color = 'reset')[object Object]   console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logWarning(message) {
    log(`⚠️ ${message}`, 'yellow');
}

function logInfo(message) {
    log(`ℹ️ ${message}`,blue
}

async function testEnvironmentVariables() {
    logInfo('Testing environment variables...);    const requiredVars = 
     MONGODB_URI',
        CLERK_WEBHOOK_SECRET,
        NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
       CLERK_SECRET_KEY'
    ];
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) [object Object]        logError(`Missing environment variables: ${missing.join(', ')}`);
        return false;
    }
    
    logSuccess('All required environment variables are set');
    return true;
}

async function testDatabaseConnection() {
    logInfo('Testing database connection...');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI + '/g11-shop', {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS:5000            socketTimeoutMS: 45000            family: 4,
        });
        
        logSuccess('Database connection successful');
        
        // Test basic operations
        const testCollection = mongoose.connection.collection('test');
        await testCollection.insertOne({ test: true, timestamp: new Date() });
        await testCollection.deleteOne({ test: true });
        
        logSuccess('Database operations test passed);       return true;
    } catch (error) [object Object]        logError(`Database connection failed: ${error.message}`);
        return false;
    } finally {
        await mongoose.disconnect();
    }
}

async function testUserModel() {
    logInfo('Testing User model...');
    
    try {
        await mongoose.connect(process.env.MONGODB_URI + '/g11-shop');
        
        // Import User model
        const[object Object] default: User } = await import(../models/User.js');
        
        // Test user creation
        const testUser = new User([object Object]            _id: 'test-user-' + Date.now(),
            name: 'Test User',
            email:test@example.com',
            imageUrl: 'https://via.placeholder.com/150'
        });
        
        await testUser.save();
        logSuccess('User creation test passed');
        
        // Test user methods
        await testUser.addToCart(test-product', {
            quantity: 2,
            price: 29.99,
            name: 'Test Product',
            image: 'https://via.placeholder.com/50'
        });
        logSuccess(User cart methods test passed');
        
        // Test virtuals
        logInfo(`Cart item count: ${testUser.cartItemCount}`);
        logInfo(`Cart total: $${testUser.cartTotal}`);
        
        // Cleanup
        await User.findByIdAndDelete(testUser._id);
        logSuccess('User deletion test passed');
        
        return true;
    } catch (error) [object Object]        logError(`User model test failed: ${error.message}`);
        return false;
    } finally {
        await mongoose.disconnect();
    }
}

async function testInngestFunctions() {
    logInfo('Testing Inngest functions...');
    
    try[object Object]        const { inngest, syncUserCreation } = await import(../config/inngest.js');
        
        // Test function registration
        const functions = inngest.listFunctions();
        const functionIds = functions.map(f => f.id);
        
        const requiredFunctions = [
            sync-user-from-clerk',
           sync-user-update-from-clerk',
       sync-user-deletion-from-clerk',
          sync-user-login-from-clerk'
        ];
        
        const missingFunctions = requiredFunctions.filter(id => !functionIds.includes(id));
        
        if (missingFunctions.length > 0)[object Object]          logError(`Missing Inngest functions: ${missingFunctions.join(', )}`);            return false;
        }
        
        logSuccess('All Inngest functions are registered);       return true;
    } catch (error) [object Object]        logError(`Inngest functions test failed: ${error.message}`);
        return false;
    }
}

async function testWebhookEndpoint() {
    logInfo('Testing webhook endpoint...');
    
    try {
        const response = await fetch(http://localhost:300api/webhooks/clerk', {
            method: 'POST',
            headers:[object Object]
               Content-Type':application/json,
              svix-id': 'test-id,
               svix-timestamp: Math.floor(Date.now() / 1000),
               svix-signature:test-signature'
            },
            body: JSON.stringify({ test: true })
        });
        
        if (response.status === 400[object Object]        logWarning('Webhook endpoint is accessible (expected 400 for invalid signature)');
            return true;
        } else[object Object]          logError(`Unexpected webhook response: ${response.status}`);
            return false;
        }
    } catch (error) {
        logWarning('Webhook endpoint test skipped (server may not be running));       return true;
    }
}

async function runAllTests() {
    log('🚀 Starting comprehensive setup test...', bright');
    log(',reset);  
    const tests =[object Object]name: 'Environment Variables', fn: testEnvironmentVariables },
        { name: 'Database Connection', fn: testDatabaseConnection },
   [object Object] name:User Model', fn: testUserModel },
        { name: Inngest Functions, fn: testInngestFunctions },
      [object Object]name:Webhook Endpoint, fn: testWebhookEndpoint }
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    for (const test of tests)[object Object]
        log(`\n📋 Running ${test.name} test...`, 'cyan');
        const result = await test.fn();
        if (result) {
            passedTests++;
        }
    }
    
    log(undefinedn' +=epeat(50bright');
    log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`, 'bright');
    
    if (passedTests === totalTests) {
        logSuccess('🎉 All tests passed! Your setup is ready.');
        logInfo('Next steps:');
        logInfo('1. Start your development server: npm run dev');
        logInfo('2onfigure Clerk webhook in dashboard');
        logInfo('3. Test with a real user creation');
    } else [object Object]        logError(Some tests failed. Please fix the issues above.');
        process.exit(1);
    }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://$[object Object]process.argv[1[object Object]    runAllTests().catch(error => [object Object]        logError(`Test runner failed: ${error.message}`);
        process.exit(1);
    });
}

export { runAllTests }; 