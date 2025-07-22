import { serve } from "inngest/next";
import { inngest } from "@/config/inngest";

// Define your functions here
const syncUserCreation = (event) => {
  // Implement your user creation logic
  console.log("Syncing user creation", event);
};

const syncUserUpdate = (event) => {
  // Implement your user update logic
  console.log("Syncing user update", event);
};

const syncUserDeletion = (event) => {
  // Implement your user deletion logic
  console.log("Syncing user deletion", event);
};

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion
  ],
});
