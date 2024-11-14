// Load env file
require("dotenv").config();

// Load node modules
// =============================================================
const { google } = require("googleapis");

// Create controller
class IAMController {
  constructor() {
    // Set up google authentication
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_API_CREDENTIALS, // Path to the service account key file
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    // Set project id
    this.projectId = process.env.GOOGLE_PROJECT_ID;
  }

  // Fetch identities
  async getIdentities(req, res) {
    try {
      const iam = google.iam({
        version: "v1",
        auth: await this.auth.getClient(),
      });

      // List service accounts for the project
      const response = await iam.projects.serviceAccounts.list({
        name: `projects/${this.projectId}`,
      });

      const identities = response.data.accounts || [];
      res.status(200).json(identities);
    } catch (error) {
      console.error("Error fetching identities:", error);
      res.status(500).json({ message: "Failed to fetch identities", error: error.message });
    }
  }

  // Fetch roles
  async getRoles(req, res) {
    try {
      const iam = google.iam({
        version: "v1",
        auth: await this.auth.getClient(),
      });

      // Fetch all roles
      const response = await iam.roles.list();
      const roles = response.data.roles || [];

      // Fetch project roles
      const projectResponse = await iam.projects.roles.list({
        parent: `projects/${this.projectId}`,
      });
      const projectRoles = projectResponse.data.roles || [];

      res.status(200).json({ roles, projectRoles });
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Failed to fetch roles", error: error.message });
    }
  }

  // Fetch groups (using Cloud Identity API)
  async getGroups(req, res) {
    try {
      const cloudIdentity = google.cloudidentity({
        version: "v1",
        auth: await this.auth.getClient(),
      });

      // Fetch groups
      const response = await cloudIdentity.groups.list({
        parent: `customers/${process.env.GOOGLE_CUSTOMER_ID}`,
      });
      const groups = response.data.groups || [];

      res.status(200).json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups", error: error.message });
    }
  }

  // Fetch policies
  async getPolicies(req, res) {
    try {
      // Fetch allow policies using IAM v1 API
      const cloudResourceManager = google.cloudresourcemanager({
        version: "v1",
        auth: await this.auth.getClient(),
      });
      const allowPolicyResponse = await cloudResourceManager.projects.getIamPolicy({
        resource: this.projectId,
      });
      const allowPolicies = allowPolicyResponse.data;

      // Fetch deny policies using IAM v2 API
      const iam = google.iam({
        version: "v2",
        auth: await this.auth.getClient(),
      });
      const parent = `policies/cloudresourcemanager.googleapis.com%2Fprojects%2F${this.projectId}/denypolicies`;
      const denyPolicyResponse = await iam.policies.listPolicies({
        parent: parent,
      });
      const denyPolicies = denyPolicyResponse.data.policies || [];

      // Combine the responses
      res.status(200).json({
        allowPolicies,
        denyPolicies,
      });
    } catch (error) {
      console.error("Error fetching policies:", error);
      res.status(500).json({ message: "Failed to fetch policies", error: error.message });
    }
  }
}

module.exports = new IAMController();
