// Store user socket connections
export const userSockets = new Map<string, string>(); // userId -> socketId

// Helper function to get user's socket ID
export const getUserSocketId = (userId: string): string | undefined => {
  return userSockets.get(userId);
};
