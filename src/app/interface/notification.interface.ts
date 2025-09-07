export interface NotificationData {
  type: 'topic_request' | 'topic_response' | 'message' | 'system';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  createdAt: Date;
}
// notificationData:>>>>> {
//   type: 'topic_request',
//   title: 'Project Discussion AI',
//   message: `You've been invited to participate in "Project Discussion AI"`,
//   data: {
//     topicRequestId: new ObjectId('68bd018b23947d7073dd6382'),
//     topic: 'Project Discussion AI',
//     creator: '68bc081408d290b2a37a093b'
//   },
//   createdAt: 2025-09-07T03:52:43.487Z
// }