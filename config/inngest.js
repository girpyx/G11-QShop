import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/User";
console.log("Received event from Clerk:", JSON.stringify(event, null, 2));

export const inngest = new Inngest({ id : "g11-shop" });

// Inngest function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {
        id : "sync-user-from-clerk",
    },
    { event : "clerk/user.created" },
    async ({event, step}) => {
        try {
            const { id, first_name, last_name, email_addresses, image_url } = event.data.object;
            
            if (!id || !email_addresses || email_addresses.length === 0) {
                throw new Error("Invalid user data received from Clerk");
            }
            
            const userData = {
                _id : id,
                name : `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown User',
                email : email_addresses[0].email_address,
                imageUrl : image_url || '',
            }
            
            await step.run("connect-database", async () => {
                await connectDB();
            });
            
            await step.run("create-user", async () => {
                await User.create(userData);
            });
        } catch (error) {
            console.error("Error in syncUserCreation:", error);
            throw error;
        }
    }
)

export const syncUserUpdate = inngest.createFunction(
    {
        id : "sync-user-update-from-clerk",
    },
    { event : "clerk/user.updated" },
    async ({event, step}) => {
        try {
            const { id, first_name, last_name, email_addresses, image_url } = event.data.object;
            
            if (!id || !email_addresses || email_addresses.length === 0) {
                throw new Error("Invalid user data received from Clerk");
            }
            
            const userData = {
                name : `${first_name || ''} ${last_name || ''}`.trim() || 'Unknown User',
                email : email_addresses[0].email_address,
                imageUrl : image_url || '',
            }
            
            await step.run("connect-database", async () => {
                await connectDB();
            });
            
            await step.run("update-user", async () => {
                await User.findByIdAndUpdate(id, userData);
            });
        } catch (error) {
            console.error("Error in syncUserUpdate:", error);
            throw error;
        }
    }
)

// Inngest function to delete user from database
export const syncUserDeletion = inngest.createFunction(
    {
        id : "sync-user-deletion-from-clerk",
    },
    { event : "clerk/user.deleted" },
    async ({event, step}) => {
        try {
            const { id } = event.data.object;
            
            if (!id) {
                throw new Error("Invalid user ID received from Clerk");
            }
            
            await step.run("connect-database", async () => {
                await connectDB();
            });
            
            await step.run("delete-user", async () => {
                await User.findByIdAndDelete(id);
            });
        } catch (error) {
            console.error("Error in syncUserDeletion:", error);
            throw error;
        }
    }
)

