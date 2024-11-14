// Load env file
require("dotenv").config();

// Load node modules
// =============================================================
const { google } = require("googleapis");

// Load services
// =============================================================
const iamService = require("../services/iam-service");

// Create controller
// =============================================================
class IAMController {
  async getIdentities(req, res) {
    try {
      const identities = await iamService.listIdentities();
      res.status(200).json(identities);
    } catch (error) {
      console.error("Error fetching identities:", error);
      res.status(500).json({ message: "Failed to fetch identities", error: error.message });
    }
  }

  async getRoles(req, res) {
    try {
      const roles = await iamService.listRoles();
      res.status(200).json(roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      res.status(500).json({ message: "Failed to fetch roles", error: error.message });
    }
  }

  async getGroups(req, res) {
    try {
      const groups = await iamService.listGroups();
      res.status(200).json(groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
      res.status(500).json({ message: "Failed to fetch groups", error: error.message });
    }
  }

  async getPolicies(req, res) {
    try {
      const policies = await iamService.listPolicies();
      res.status(200).json(policies);
    } catch (error) {
      console.error("Error fetching policies:", error);
      res.status(500).json({ message: "Failed to fetch policies", error: error.message });
    }
  }
}

module.exports = new IAMController();
