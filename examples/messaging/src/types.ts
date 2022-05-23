export interface Message {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: number; // epoch milliseconds
  snippet: string;
  body: string;
};
