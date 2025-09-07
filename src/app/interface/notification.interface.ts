export interface NotificationData {
  type: 'topic_request' | 'topic_response' | 'message' | 'system';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  createdAt: Date;
}
