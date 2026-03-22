export type SupportTicketChannel = "Mobile" | "Web";

export type SupportTicketStatus = "resolved" | "pending";

export type SupportTicketRecord = {
  id: string;
  ticketId: string;
  customerEmailAddress: string;
  customerPhoneNumber: string;
  channel: SupportTicketChannel;
  requestDateLabel: string;
  dateLabel: string;
  timestampLabel: string;
  issueCategory: string;
  issueDescription: string;
  status: SupportTicketStatus;
};
