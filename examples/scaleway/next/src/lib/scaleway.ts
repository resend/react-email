import { loadProfileFromEnvironmentValues } from "@scaleway/configuration-loader";
import { createClient, TransactionalEmail } from "@scaleway/sdk";

// Requires the following environment variables:
// - SCALEWAY_ACCESS_KEY
// - SCALEWAY_SECRET_KEY
// - SCALEWAY_DEFAULT_PROJECT_ID
// - SCALEWAY_DEFAULT_REGION
const profile = loadProfileFromEnvironmentValues();
const client = createClient(profile);

export const scalewayTEM = new TransactionalEmail.v1alpha1.API(client);
