import { Inngest } from "inngest";
import connectDB from "./db";

export const inngest = new Inngest({ id : "g11-shop" });

// Inngest funstion to save user data to a database
export const syncUserCreation = new inngest.createFunction(
    {
        id : "sync-user-from-clerk",
    },
    { event : "clerk/user.created" },
    async ({events}) => {
        const { id, first_name, last_name, email_addresses, image_url } = events[0].data.object;
        const userData = {
            _id : id,
            name : `${first_name} ${last_name}`,
            email : email_addresses[0].email_address,
            imageUrl : image_url,
        }
        await connectDB()
        await User.create(userData);
    }
)

export const syncUserUpdate = new inngest.createFunction(
    {
        id : "sync-user-update-from-clerk",
    },
    { event : "clerk/user.updated" },
    async ({events}) => {
        const { id, first_name, last_name, email_addresses, image_url } = events[0].data.object;
        const userData = {
            name : `${first_name} ${last_name}`,
            email : email_addresses[0].email_address,
            imageUrl : image_url,
        }
        await connectDB()
        await User.findByIdAndUpdate(id, userData);
    }
)


//inngest function to delete user from database
export const syncUserDeletion = new inngest.createFunction(
    {
        id : "sync-user-deletion-from-clerk",
    },
    { event : "clerk/user.deleted" },
    async ({events}) => {
        const { id } = events[0].data.object;
        await connectDB()
        await User.findByIdAndDelete(id);
    }
)

