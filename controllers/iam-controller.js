// Load node modules
// =============================================================

// Load services
// =============================================================
const queueService = require("../services/queue-service");
const iamService = require("../services/iam-service");

// Create controller
// =============================================================
class IAMController {
  async getIdentities(req, res) {
    try {
      const identities = await iamService.listIdentities();
      res.status(200).json(identities);
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to fetch identities",
        error: error.message,
      });
    }
  }

  async fetchIdentities(req, res) {
    try {
      await queueService.addJobToQueue("queue", "fetchIdentities", {});
      res.status(202).json({
        success: true,
        statusCode: 202,
        message: "Request to fetch identities has been queued",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to queue request to fetch identities",
        error: error.message,
      });
    }
  }

  async getRoles(req, res) {
    try {
      const roles = await iamService.listRoles();
      res.status(200).json(roles);
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to fetch roles",
        error: error.message,
      });
    }
  }

  async fetchRoles(req, res) {
    try {
      await queueService.addJobToQueue("queue", "fetchRoles", {});
      res.status(202).json({
        success: true,
        statusCode: 202,
        message: "Request to fetch roles has been queued",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to queue request to fetch roles",
        error: error.message,
      });
    }
  }

  async getGroups(req, res) {
    try {
      const groups = await iamService.listGroups();
      res.status(200).json(groups);
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to fetch groups",
        error: error.message,
      });
    }
  }

  async fetchGroups(req, res) {
    try {
      await queueService.addJobToQueue("queue", "fetchGroups", {});
      res.status(202).json({
        success: true,
        statusCode: 202,
        message: "Request to fetch groups has been queued",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to queue request to fetch groups",
        error: error.message,
      });
    }
  }

  async getPolicies(req, res) {
    try {
      const policies = await iamService.listPolicies();
      res.status(200).json(policies);
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to fetch policies",
        error: error.message,
      });
    }
  }

  async fetchPolicies(req, res) {
    try {
      await queueService.addJobToQueue("queue", "fetchPolicies", {});
      res.status(202).json({
        success: true,
        statusCode: 202,
        message: "Request to fetch policies has been queued",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Failed to queue request to fetch policies",
        error: error.message,
      });
    }
  }
}

module.exports = new IAMController();
