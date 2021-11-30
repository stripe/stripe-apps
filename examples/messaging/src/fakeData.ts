import { Message } from "./types";

export const fakeUserMessages: Message[] = [
  {
    id: '1',
    subject: 'Refund processing',
    from: 'sds@example.com',
    to: 'some.merchant@gmail.com',
    date: 1637088399000,
    snippet: 'Hi there, Has my refund processed yet? I don\'t see it in my bank account yet. I know these things...',
    body: 'Hi there,\n\nHas my refund processed yet? I don\'t see it in my bank account yet. I know these things take time to process, and I appreciate you looking into it.\n\nWarm regards,\nExample Customer',
  },
    {
    id: '2',
    subject: 'Your order #012345678',
    from: 'some.merchant@gmail.com',
    to: 'sds@example.com',
    date: 1636088399000,
    snippet: 'Dear Soumya, Get ready, because your order is on the way! Look out for a tracking number within...',
    body: 'Dear Soumya,\n\nGet ready, because your order is on the way! Look out for a tracking number within 1-3 business days. We\'re excited for you to try out your new widget.\n\nWarm regards,\nCool Merchant',
  },
];
