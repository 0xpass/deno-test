


1. Begin by creating an account on Deno.com. Proceed to create an organization and generate an access token. Once done, populate the environment variables accordingly.

2. Execute the command `deno run -A --env create_project.ts` to initiate the project creation process.

3. Upon successful execution, you will receive the project ID and name. Take note of these details for the next step.

4. Update the `.env` file with the project ID and name you received in the previous step.

5. Finally, run `deno run -A --env create_deployment.ts` to create the deployment.