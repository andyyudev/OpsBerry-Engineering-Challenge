// Load node modules
// =============================================================
const { google } = require("googleapis");

// Create service
// =============================================================
class IAMService {
  constructor() {
    // Set auth
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_API_CREDENTIALS,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    // Set customer id
    this.customerId = process.env.GOOGLE_CUSTOMER_ID;

    // Set project id
    this.projectId = process.env.GOOGLE_PROJECT_ID;

    // Bind methods
    this.getAuthClient = this.getAuthClient.bind(this);
    this.listIdentities = this.listIdentities.bind(this);
    this.listRoles = this.listRoles.bind(this);
    this.listGroups = this.listGroups.bind(this);
    this.listPolicies = this.listPolicies.bind(this);
  }

  // Get auth client
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

  // List identities
  async listIdentities() {
    try {
      const iam = google.iam({
        version: "v1",
        auth: await this.getAuthClient(),
      });

      const response = await iam.projects.serviceAccounts.list({
        name: `projects/${this.projectId}`,
      });

      // Parse data
      const parsedIdentities = (response.data.accounts || []).map((identity) => ({
        resourceType: "Service Account",
        resourceName: identity.displayName || identity.name,
        resourceId: identity.uniqueId || identity.email,
        creationDate: null,
      }));

      return {
        success: true,
        statusCode: 200,
        message: "Identities fetched and parsed successfully",
        data: parsedIdentities,
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

  // List roles
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

      // Combine data
      const allRoles = [...predefinedRoles, ...customRoles];

      // Parse data
      const parsedRoles = allRoles.map((role) => ({
        resourceType: "Role",
        resourceName: role.title || null,
        resourceId: role.name || null,
        creationDate: null,
      }));

      return {
        success: true,
        statusCode: 200,
        message: "Roles fetched and parsed successfully",
        data: parsedRoles,
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

  // List groups
  async listGroups() {
    try {
      const cloudIdentity = google.cloudidentity({
        version: "v1",
        auth: await this.getAuthClient(),
      });

      const response = await cloudIdentity.groups.list({
        parent: `customers/${this.customerId}`,
      });

      // Parse data
      const parsedGroups = (response.data.groups || []).map((group) => ({
        resourceType: "Group",
        resourceName: group.displayName || null,
        resourceId: group.groupKey?.id || null,
        creationDate: null,
      }));

      return {
        success: true,
        statusCode: 200,
        message: "Groups fetched successfully",
        data: parsedGroups,
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

  // List policies
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
      const allowPolicies = allowPolicyResponse.data.bindings || [];

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

      // Parse data
      const parsedAllowPolicies = allowPolicies.map((binding) => ({
        resourceType: "Allow Policy",
        resourceName: binding.role || null,
        resourceId: binding.members.join(", ") || null,
        creationDate: null,
      }));

      const parsedDenyPolicies = denyPolicies.map((policy) => ({
        resourceType: "Deny Policy",
        resourceName: policy.name || null,
        resourceId: policy.name || null,
        creationDate: policy.createTime || null,
      }));

      // Combine data
      const combinedPolicies = [...parsedAllowPolicies, ...parsedDenyPolicies];

      return {
        success: true,
        statusCode: 200,
        message: "Policies fetched successfully",
        data: combinedPolicies,
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
