export type DeviceSessionActivity = "User Logged in" | "User Logged out";

export type DeviceSessionChannel = "Mobile" | "Web";

export type DeviceSessionRecord = {
  id: string;
  sessionId: string;
  deviceName: string;
  channel: DeviceSessionChannel;
  ipAddress: string;
  userLocation: string;
  activity: DeviceSessionActivity;
  sessionDateLabel: string;
  timestampLabel: string;
  dateLabel: string;
};
