import { serve } from "inngest/next";
import { inngest } from "@/config/inngest";

// Define real Inngest functions
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-creation" },
  { event: "user/created" },
  async ({ event, step }) => {
    console.log("Syncing user creation", event.data);
    // Your logic here
  }
);

const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update" },
  { event: "user/updated" },
  async ({ event, step }) => {
    console.log("Syncing user update", event.data);
    // Your logic here
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "sync-user-deletion" },
  { event: "user/deleted" },
  async ({ event, step }) => {
    console.log("Syncing user deletion", event.data);
    // Your logic here
  }
);

// Serve them via API
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
  ],
});
