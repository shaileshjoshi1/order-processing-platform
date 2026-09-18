import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || "ap-south-1",
});

export async function getSecrets() {
  const command = new GetSecretValueCommand({
    SecretId: "MONGOURI",
  });

  const response = await client.send(command);

  if (!response.SecretString) {
    throw new Error("SecretString not found");
  }

  return JSON.parse(response.SecretString);
}