export type ProgramConfig = {
  name: string;
  pointsPerDollar: number;
  currency: "usd" | "eur" | "gbp";
  tierThresholds: {
    beanCounter: { min: number; max: number };
    barista: { min: number; max: number };
    roastmaster: { min: number; max: number };
  };
  engagementWindows: {
    active: number;
    atRisk: number;
    dormant: number;
  };
};

export const initialProgramConfig: ProgramConfig = {
  name: "Coffee Lovers Rewards",
  pointsPerDollar: 100,
  currency: "usd",
  tierThresholds: {
    beanCounter: { min: 0, max: 499 },
    barista: { min: 500, max: 1999 },
    roastmaster: { min: 2000, max: Infinity },
  },
  engagementWindows: {
    active: 30,
    atRisk: 60,
    dormant: 90,
  },
};
