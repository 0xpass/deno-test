const accessToken = Deno.env.get("DEPLOY_ACCESS_TOKEN");
const API = "https://api.deno.com/v1";

const projectName = Deno.env.get("DEPLOY_PROJECT_NAME");
const projectId = Deno.env.get("DEPLOY_PROJECT_ID");

// Create a new deployment
const res = await fetch(`${API}/projects/${projectId}/deployments`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    entryPointUrl: "main.ts",
    assets: {
      "main.ts": {
        "kind": "file",
        "content": `export default {
  async fetch(req) {
    console.log('importing viem');
    try {
      const { verifyMessage } = await import('npm:viem');
      const signatures = [
        '0x43ea8e996ae22fb6f59fa7478b4f9ac934e882cb6bc6dac488124ef9f0ac78be78f39c633dfc1255e1a79e2a5b8beb5ee1fa259cfd54ea991c01c61b4aee52c41c',
        '0xd48d6e2e9942f8575ab54d461e7490e2ea8ae3babcc130f647c8ce9aaca11e5e5696e135611e6f2befef17a61982d5ddf514a9e270be1d898ecb4057b5fbf4931b'
      ];
      const message = 'hey';
      const addresses = [
        '0x58147FD6Fd6A32e59a7783AB9a0856D76Ea1d6E4',
        '0x58147FD6Fd6A32e59a7783AB9a0856D76Ea1d6E4'
      ];
      async function verifySignatures(signatures, message) {
        let validCount = 0;
        for (let i = 0; i < signatures.length; i++) {
          const signature = signatures[i];
          const address = addresses[i];
          try {
            const validMessage = await verifyMessage({
              message: message,
              address: address,
              signature: signature
            });
            if (validMessage) {
              validCount++;
              if (validCount >= 2) {
                return true;
              }
            }
          } catch (error) {
            console.error('Error verifying signature ' + (i + 1) + ':', error);
            return false;
          }
        }
        return false;
      }
      console.log('verifying signatures');
      try {
        const result = await verifySignatures(signatures, message);
        console.log('Verification result: ', result);
        return new Response(result ? 'true' : 'false');
      } catch (error) {
        console.error('Error during verification:', error);
        return new Response('false');
      }
    } catch (error) {
      console.error('Failed to import package:', error);
      return new Response('false');
    }
  }
}`,
        "encoding": "utf-8",
      },
    },
    envVars: {},
  }),
});

const deployment = await res.json();

console.log(res.status);
console.log(
  "Visit your site here:",
  `https://${projectName}-${deployment.id}.deno.dev`,
);
