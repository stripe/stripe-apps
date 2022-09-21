export interface Note {
  id: number;
  agentId: string;
  customerId: string;
  message: string;
  createdAt: Date;
}

export interface APIResponse {
  data: any;
  error: boolean;
}