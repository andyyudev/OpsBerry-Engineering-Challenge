# OpsBerry Engineering Challenge

## Description

This repository contains a Node.js application designed to interact with Google Cloud services using the Google Cloud APIs. The application demonstrates retrieving IAM policies, roles, service accounts, and groups by leveraging the Google Cloud Identity and Access Management (IAM) API and Cloud Identity API.

**Note:** This is a demo account, so I have synced the `.env` file and the service account credentials file to GitHub. **This is NOT a recommended practice** for production environments. After the demo, I will make the repository private.


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
GOOGLE_API_CREDENTIALS=PATH_TO_YOUR_GOOGLE_SERVICE_ACCOUNT_CREDENTIAL_JSON
GOOGLE_CUSTOMER_ID=YOUR_GOOGLE_CUSTOMER_ID
GOOGLE_PROJECT_ID=YOUR_GOOGLE_PROJECT_ID
```

### How to get your api credential?

### How to find your customer id

### How to find your project id

## API Endpoints

- Get Identities
  - Endpoint: GET /identities
  - URL: http://localhost:3000/identities
  - SOURCE: Uses the Google IAM API to retrieve a list of service accounts associated with a specified Google Cloud project.

- Get Roles
  - Endpoint: GET /roles
  - URL: http://localhost:3000/roles
  - SOURCE: Uses the Google IAM API to retrieve all predefined roles offered by Google Cloud and any custom roles defined within a specified Google Cloud project.

- Get Groups
  - Endpoint: GET /groups
  - URL: http://localhost:3000/groups
  - SOURCE: Uses the Google Cloud Identity API to retrieve groups associated with a specified Google Workspace or Cloud Identity customer.

- Get Policies
  - Endpoint: GET /policies
  - URL: http://localhost:3000/policies
  - SOURCE: Retrieves allow policies using the Google Cloud Resource Manager API and deny policies using the Google IAM API v2 for a specified Google Cloud project.
