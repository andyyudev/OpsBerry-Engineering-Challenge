# OpsBerry Engineering Challenge

## Description

This repository contains a Node.js application designed to interact with Google Cloud services using the Google Cloud APIs. The application demonstrates retrieving IAM policies, roles, service accounts, and groups by leveraging the Google Cloud Identity and Access Management (IAM) API and Cloud Identity API.

**Note:** This is a demo account, so I have synced the `.env` file to GitHub. **This is NOT a recommended practice** for production environments. After the demo, I will make the repository private.


## Getting Started

### Clone project

```bash
$ git clone git@github.com:andyyudev/OpsBerry-Engineering-Challenge.git
```

### Project setup

```bash
$ npm install
```

### Run the project

```bash
# Start the application in production mode
$ npm run start

# Start the application in development mode (watch mode)
$ npm run dev
```

### Update .env file with your own google credentials

```bash
GOOGLE_API_CREDENTIALS=/secrets/YOUR_GOOGLE_SERVICE_ACCOUNT_CREDENTIAL_JSON
GOOGLE_CUSTOMER_ID=YOUR_GOOGLE_CUSTOMER_ID
GOOGLE_PROJECT_ID=YOUR_GOOGLE_PROJECT_ID
```

** Add the credential json file in "/secrets/" directory.

## How to get your api credential?

1. Go to the Google Cloud Console.
2. Navigate to IAM & Admin > Service Accounts.
3. Click on the service account you want to use or create a new one if necessary.
4. To create a new service account, click Create Service Account, provide a name, description, and click Create.
5. Click on Keys and then select Add Key > Create New Key.
6. Choose the JSON key type and click Create. This will download your credentials file in JSON format.
7. Save this file in "/secrets/" and set the GOOGLE_API_CREDENTIALS variable in your .env file to the path of this file.

## How to find your customer id

1. Go to the Google Admin Console.
2. Click on Account > Account Settings > Profile.
3. Your Customer ID is listed in the Customer Info section.
4. Alternatively, you can use the Directory API to programmatically fetch the customer ID by making a request as an administrator of your domain.

## How to find your project id

1. Go to the Google Cloud Console.
2. Select IAM & Admin > Settings.
3. The Project ID will be displayed at the top of the Settings page.
4. You can also find the Project ID in the Dashboard or by navigating to any resource in the project.
5. If you have multiple projects, you can use the project selector dropdown at the top of the page to select and view the Project ID of your desired project.

## API Endpoints

- Get Identities
  - Endpoint: GET /identities
  - URL: http://localhost:3000/api/identities
  - SOURCE: Uses the Google IAM API to retrieve a list of service accounts associated with a specified Google Cloud project.

- Get Roles
  - Endpoint: GET /roles
  - URL: http://localhost:3000/api/roles
  - SOURCE: Uses the Google IAM API to retrieve all predefined roles offered by Google Cloud and any custom roles defined within a specified Google Cloud project.

- Get Groups
  - Endpoint: GET /groups
  - URL: http://localhost:3000/api/groups
  - SOURCE: Uses the Google Cloud Identity API to retrieve groups associated with a specified Google Workspace or Cloud Identity customer.

- Get Policies
  - Endpoint: GET /policies
  - URL: http://localhost:3000/api/policies
  - SOURCE: Retrieves allow policies using the Google Cloud Resource Manager API and deny policies using the Google IAM API v2 for a specified Google Cloud project.

## Queues Endpoint (Bonus)

This is a simple example demonstrating the use of message queues between requests and services. A Redis server is required for this functionality to work; you can either run it locally or use a remote Redis server. Update the configuration in the .env file accordingly.

After making a request in the browser, you will see a status 202 response indicating that the job is currently queued for processing. The results will appear in the server’s console because I have not implemented a front-end UI to update the screen when the job is completed.

- Get Identities
  - Endpoint: GET /identities
  - URL: http://localhost:3000/queues/identities

- Get Roles
  - Endpoint: GET /roles
  - URL: http://localhost:3000/queues/roles

- Get Groups
  - Endpoint: GET /groups
  - URL: http://localhost:3000/queues/groups

- Get Policies
  - Endpoint: GET /policies
  - URL: http://localhost:3000/queues/policies

## Missing Features & Future Improvements

Since this is a simple demo, several key features were not implemented:

1. An API gateway for enhanced security measures, such as rate limiting, throttling, authentication, authorization, and handling CORS.
2. Persistent data storage, which typically involves using a database, was not included.
3. Mechanisms for API retries and handling failures have not been considered.
4. Google API request pagination was not implemented; in a real-world application, each page token would be sent to message queues for further processing.
5. Observability tools, such as Sentry, Winston, or other logging and monitoring solutions, were not included.
6. And more...
