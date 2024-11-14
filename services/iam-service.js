// Load node modules
// =============================================================
const { google } = require("googleapis");

// Create service
// =============================================================
class IAMService {
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_API_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
    this.projectId = process.env.GOOGLE_PROJECT_ID;
  }

  async getAuthClient() {
    try {
      return await this.auth.getClient();
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: "Failed to authenticate client",
        error: error.message,
      };
    }
  }

  async listIdentities() {
    try {
      const iam = google.iam({
        version: "v1",
        auth: await this.getAuthClient(),
      });

      const response = await iam.projects.serviceAccounts.list({
        name: `projects/${this.projectId}`,
      });

      return {
        success: true,
        statusCode: 200,
        message: "Identities fetched successfully",
        data: response.data.accounts || [],
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: "Failed to fetch identities",
        error: error.message,
      };
    }
  }

  async listRoles() {
    try {
      const iam = google.iam({
        version: "v1",
        auth: await this.getAuthClient(),
      });

      const predefinedRolesResponse = await iam.roles.list();
      const predefinedRoles = predefinedRolesResponse.data.roles || [];

      const customRolesResponse = await iam.projects.roles.list({
        parent: `projects/${this.projectId}`,
      });
      const customRoles = customRolesResponse.data.roles || [];

      return {
        success: true,
        statusCode: 200,
        message: "Roles fetched successfully",
        data: { predefinedRoles, customRoles },
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: "Failed to fetch roles",
        error: error.message,
      };
    }
  }

  async listGroups() {
    try {
      const cloudIdentity = google.cloudidentity({
        version: "v1",
        auth: await this.getAuthClient(),
      });

      const response = await cloudIdentity.groups.list({
        parent: `customers/${process.env.GOOGLE_CUSTOMER_ID}`,
      });

      return {
        success: true,
        statusCode: 200,
        message: "Groups fetched successfully",
        data: response.data.groups || [],
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: "Failed to fetch groups",
        error: error.message,
      };
    }
  }

  async listPolicies() {
    try {
      // Fetch allow policies using IAM v1 API
      const cloudResourceManager = google.cloudresourcemanager({
        version: "v1",
        auth: await this.getAuthClient(),
      });
      const allowPolicyResponse = await cloudResourceManager.projects.getIamPolicy({
        resource: this.projectId,
      });
      const allowPolicies = allowPolicyResponse.data;

      // Fetch deny policies using IAM v2 API
      const iam = google.iam({
        version: "v2",
        auth: await this.getAuthClient(),
      });
      const parent = `policies/cloudresourcemanager.googleapis.com%2Fprojects%2F${this.projectId}/denypolicies`;
      const denyPolicyResponse = await iam.policies.listPolicies({
        parent: parent,
      });
      const denyPolicies = denyPolicyResponse.data.policies || [];

      return {
        success: true,
        statusCode: 200,
        message: "Policies fetched successfully",
        data: { allowPolicies, denyPolicies },
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: "Failed to fetch policies",
        error: error.message,
      };
    }
  }
}

module.exports = new IAMService();
