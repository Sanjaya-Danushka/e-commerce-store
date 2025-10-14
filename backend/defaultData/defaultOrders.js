export const defaultOrders = [
  {
    id: "27cba69d-4c3d-4098-b42d-ac7fa62b7664",
    userId: "229f2ad0-255b-47c9-ab42-3e954e8a0299", // Default user ID from auth system
    orderTimeMs: 1723456800000,
    totalCostCents: 3506,
    status: "delivered",
    products: [
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 1,
        estimatedDeliveryTimeMs: 1723716000000
      },
      {
        productId: "83d4ca15-0f35-48f5-b7a3-1ea210004f2e",
        quantity: 2,
        estimatedDeliveryTimeMs: 1723456800000
      }
    ]
  },
  {
    id: "b6b6c212-d30e-4d4a-805d-90b52ce6b37d",
    userId: "229f2ad0-255b-47c9-ab42-3e954e8a0299", // Default user ID from auth system
    orderTimeMs: 1718013600000,
    totalCostCents: 4190,
    status: "delivered",
    products: [
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 2,
        estimatedDeliveryTimeMs: 1718618400000
      }
    ]
  }
];
