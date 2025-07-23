import { Inngest } from "inngest";
import connectDB from "./db";
import { User } from "lucide-react"; // Make sure this is your actual Mongoose model

// Initialize Inngest client
export const inngest = new Inngest({ id: "quickcart-next" });

/**
 * Sync user creation from Clerk to MongoDB
 */
export const syncUserCreation = inngest.createFunction(
  { id: "quickcart-sync-user-creation-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;
    
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageurl: image_url,
    };

    await connectDB();
    await User.create(userData);
  }
);

/**
 * Sync user update from Clerk to MongoDB
 */
export const syncUserUpdate = inngest.createFunction(
  { id: "quickcart-sync-user-update-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } = event.data;

    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: `${first_name} ${last_name}`,
      imageurl: image_url,
    };

    await connectDB();
    await User.findByIdAndUpdate(id, userData);
  }
);

/**
 * Sync user deletion from Clerk to MongoDB
 */
export const syncUserDeletion = inngest.createFunction(
  { id: "g11-shop-sync-user-deletion-from-clerk" }, // MUST match Inngest log error
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);
