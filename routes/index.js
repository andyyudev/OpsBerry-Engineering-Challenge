// Load node modules
// =============================================================
const router = require("express").Router();

// Load controllers
// =============================================================
const iamController = require("../controllers/iam-controller");

// Handle method not allowed responses
const methodNotAllowed = (req, res) => {
  res.status(405).send({ message: "Method Not Allowed" });
};

// Define routes
// =============================================================
// Default route
router
  .route("/")
  .get((req, res) => {
    res.send("Hello OpsBerry");
  })
  .all(methodNotAllowed);

// API routes
// IAM identities
router.route("/api/identities").get(iamController.getIdentities.bind(iamController)).all(methodNotAllowed);
// IAM roles
router.route("/api/roles").get(iamController.getRoles.bind(iamController)).all(methodNotAllowed);
// IAM groups
router.route("/api/groups").get(iamController.getGroups.bind(iamController)).all(methodNotAllowed);
// IAM policies
router.route("/api/policies").get(iamController.getPolicies.bind(iamController)).all(methodNotAllowed);

// Queues routes
// IAM identities
router.route("/queues/identities").get(iamController.fetchIdentities.bind(iamController)).all(methodNotAllowed);
// IAM roles
router.route("/queues/roles").get(iamController.fetchRoles.bind(iamController)).all(methodNotAllowed);
// IAM groups
router.route("/queues/groups").get(iamController.fetchGroups.bind(iamController)).all(methodNotAllowed);
// IAM policies
router.route("/queues/policies").get(iamController.fetchPolicies.bind(iamController)).all(methodNotAllowed);

// Catch-all route for unmatched paths
router.all("*", (req, res) => {
  res.status(404).send({
    success: false,
    statusCode: 404,
    message: "Route Not Found",
  });
});

// Export the router
// =============================================================
module.exports = () => {
  return router;
};
