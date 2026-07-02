export type TierName = "Bean Counter" | "Barista" | "Roastmaster";

export interface Member {
  id: string;
  name: string;
  email: string;
  points: number;
  tier: TierName;
  lifetimeSpend: number;
  lastOrder: string;
  joinedDate: string;
}

export interface Reward {
  id: string;
  name: string;
  pointsCost: number;
  description: string;
  category: "coffee" | "merchandise";
  available: boolean;
  redemptionCount: number;
}

export interface Transaction {
  id: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  type: "earned" | "redeemed";
  points: number;
  description: string;
  timestamp: string;
  orderId?: string;
}

export type TrendPoint = {
  week: string;
  value: number;
};
