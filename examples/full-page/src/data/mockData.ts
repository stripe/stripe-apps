export type PaymentStatus = "succeeded" | "pending" | "failed" | "refunded";

export interface Payment {
  id: string;
  customer: string;
  email: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  date: string;
  description: string;
}

export const payments: Payment[] = [
  { id: "pi_1ABC001", customer: "Acme Corp", email: "billing@acme.com", amount: 24999, currency: "usd", status: "succeeded", date: "2024-03-15", description: "Enterprise plan - March" },
  { id: "pi_1ABC002", customer: "TechStart Inc", email: "pay@techstart.io", amount: 4999, currency: "usd", status: "succeeded", date: "2024-03-15", description: "Pro plan - March" },
  { id: "pi_1ABC003", customer: "Global Retail", email: "accounts@globalretail.com", amount: 99900, currency: "usd", status: "succeeded", date: "2024-03-14", description: "Custom plan - Q1" },
  { id: "pi_1ABC004", customer: "CloudNine SaaS", email: "finance@cloudnine.dev", amount: 14999, currency: "usd", status: "pending", date: "2024-03-14", description: "Business plan - March" },
  { id: "pi_1ABC005", customer: "DataFlow Labs", email: "billing@dataflow.ai", amount: 7999, currency: "usd", status: "succeeded", date: "2024-03-13", description: "Pro plan - March" },
  { id: "pi_1ABC006", customer: "Summit Design", email: "hello@summitdesign.co", amount: 2499, currency: "usd", status: "failed", date: "2024-03-13", description: "Starter plan - March" },
  { id: "pi_1ABC007", customer: "Velocity Motors", email: "ap@velocitymotors.com", amount: 49999, currency: "usd", status: "succeeded", date: "2024-03-12", description: "Enterprise plan - March" },
  { id: "pi_1ABC008", customer: "NeonWave Media", email: "pay@neonwave.tv", amount: 9999, currency: "usd", status: "refunded", date: "2024-03-12", description: "Business plan - March" },
  { id: "pi_1ABC009", customer: "Apex Logistics", email: "billing@apexlog.com", amount: 34999, currency: "usd", status: "succeeded", date: "2024-03-11", description: "Enterprise plan - March" },
  { id: "pi_1ABC010", customer: "Pixel Perfect", email: "team@pixelperfect.io", amount: 4999, currency: "usd", status: "succeeded", date: "2024-03-11", description: "Pro plan - March" },
  { id: "pi_1ABC011", customer: "FreshBrew Co", email: "orders@freshbrew.co", amount: 1999, currency: "usd", status: "pending", date: "2024-03-10", description: "Starter plan - March" },
  { id: "pi_1ABC012", customer: "Acme Corp", email: "billing@acme.com", amount: 5000, currency: "usd", status: "succeeded", date: "2024-03-10", description: "Add-on: Extra seats" },
  { id: "pi_1ABC013", customer: "Orbit Health", email: "finance@orbithealth.com", amount: 19999, currency: "usd", status: "succeeded", date: "2024-03-09", description: "Business plan - March" },
  { id: "pi_1ABC014", customer: "TechStart Inc", email: "pay@techstart.io", amount: 4999, currency: "usd", status: "failed", date: "2024-03-09", description: "Pro plan - retry" },
  { id: "pi_1ABC015", customer: "Lunar Dynamics", email: "billing@lunardyn.space", amount: 74999, currency: "usd", status: "succeeded", date: "2024-03-08", description: "Custom plan - March" },
  { id: "pi_1ABC016", customer: "GreenLeaf Foods", email: "ap@greenleaf.org", amount: 2499, currency: "usd", status: "succeeded", date: "2024-03-08", description: "Starter plan - March" },
  { id: "pi_1ABC017", customer: "CloudNine SaaS", email: "finance@cloudnine.dev", amount: 14999, currency: "usd", status: "succeeded", date: "2024-03-07", description: "Business plan - Feb" },
  { id: "pi_1ABC018", customer: "Bolt Security", email: "invoices@boltsec.io", amount: 39999, currency: "usd", status: "succeeded", date: "2024-03-07", description: "Enterprise plan - March" },
  { id: "pi_1ABC019", customer: "Acme Corp", email: "billing@acme.com", amount: 24999, currency: "usd", status: "succeeded", date: "2024-03-06", description: "Enterprise plan - Feb" },
  { id: "pi_1ABC020", customer: "DataFlow Labs", email: "billing@dataflow.ai", amount: 7999, currency: "usd", status: "refunded", date: "2024-03-06", description: "Pro plan - Feb refund" },
];

export const revenueByDay = [
  { date: "Mar 6", amount: 32998 },
  { date: "Mar 7", amount: 54998 },
  { date: "Mar 8", amount: 77498 },
  { date: "Mar 9", amount: 24998 },
  { date: "Mar 10", amount: 6999 },
  { date: "Mar 11", amount: 39998 },
  { date: "Mar 12", amount: 59998 },
  { date: "Mar 13", amount: 10498 },
  { date: "Mar 14", amount: 114899 },
  { date: "Mar 15", amount: 29998 },
];

export const revenueByStatus = [
  { status: "Succeeded", amount: 489383 },
  { status: "Pending", amount: 16998 },
  { status: "Failed", amount: 7498 },
  { status: "Refunded", amount: 17998 },
];

export const customers = [
  { id: "cus_01", value: "Acme Corp" },
  { id: "cus_02", value: "TechStart Inc" },
  { id: "cus_03", value: "Global Retail" },
  { id: "cus_04", value: "CloudNine SaaS" },
  { id: "cus_05", value: "DataFlow Labs" },
  { id: "cus_06", value: "Summit Design" },
  { id: "cus_07", value: "Velocity Motors" },
  { id: "cus_08", value: "NeonWave Media" },
  { id: "cus_09", value: "Apex Logistics" },
  { id: "cus_10", value: "Pixel Perfect" },
  { id: "cus_11", value: "FreshBrew Co" },
  { id: "cus_12", value: "Orbit Health" },
  { id: "cus_13", value: "Lunar Dynamics" },
  { id: "cus_14", value: "GreenLeaf Foods" },
  { id: "cus_15", value: "Bolt Security" },
];
