// src/app/client.ts
import { createThirdwebClient } from "thirdweb";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID!;

if (!clientId) {
  throw new Error("NEXT_PUBLIC_CLIENT_ID environment variable is required");
}

export const client = createThirdwebClient({ clientId });