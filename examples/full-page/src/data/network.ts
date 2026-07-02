export const MOCK_NETWORK_DELAY_MS = 400;

export const simulateNetworkDelay = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, MOCK_NETWORK_DELAY_MS);
  });

export async function withNetworkDelay<T>(data: T): Promise<T> {
  await simulateNetworkDelay();
  return Promise.resolve(data);
}
