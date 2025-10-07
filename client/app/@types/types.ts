export type Role = "user" | "assistant";

export interface MessagePayloadText {
  type: "text";
  text: string;
}

export interface MessagePayloadTable {
  type: "table";
  text?: string;
  columns: string[];
  rows: unknown[][];
}

export type MessagePayload = string | MessagePayloadText | MessagePayloadTable;

export interface Message {
  role: Role;
  payload: MessagePayload;
  conversationId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
