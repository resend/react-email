import { createClient, TransactionalEmail } from "@scaleway/sdk";

const client = createClient({
  accessKey: process.env.ACCESS_KEY,
  secretKey: process.env.SECRET_KEY,
  defaultProjectId: process.env.PROJECT_ID,
  defaultRegion: "fr-par",
  defaultZone: "fr-par-1",
});

export const scalewayTEM = new TransactionalEmail.v1alpha1.API(client);
