// Store user socket connections
export const userSockets = new Map<string, string>(); // userId -> socketId

// Store online users
export const onlineUsers = new Set<string>(); // Set of online userIds

// Helper function to get user's socket ID
export const getUserSocketId = (userId: string): string | undefined => {
  return userSockets.get(userId);
};

// Helper function to check if user is online
export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};

// Helper function to get all online users
export const getOnlineUsers = (): string[] => {
  return Array.from(onlineUsers);
};
