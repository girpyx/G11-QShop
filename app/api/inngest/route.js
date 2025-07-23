// app/api/inngest/route.js

import { serve } from "inngest/next";
import { inngest } from "@/config/inngest";
import connectDB from "@/config/db";
import { User } from "lucide-react"; // Replace with your actual model import

// Sync user creation from Clerk
const syncUserCreation = inngest.createFunction(
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

// Sync user update from Clerk
const syncUserUpdate = inngest.createFunction(
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

// Sync user deletion from Clerk
const syncUserDeletion = inngest.createFunction(
  { id: "g11-shop-sync-user-deletion-from-clerk" }, // MATCHING the Inngest log error
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await connectDB();
    await User.findByIdAndDelete(id);
  }
);

// Expose to Inngest via API route
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
  ],
});
