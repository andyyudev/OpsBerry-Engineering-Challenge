// Load node modules
// =============================================================
const router = require("express").Router();

// Load controllers
// =============================================================
const iamController = require("../controllers/iam-controller");

// Utility function to handle method not allowed responses
const methodNotAllowed = (req, res) => {
  res.status(405).send({ message: "Method Not Allowed" });
};

// Define routes
// =============================================================
// Default route
router
  .route("/")
  .get((req, res) => {
    res.send("Hello Opsberry");
  })
  .all(methodNotAllowed);

// IAM identities
router.route("/identities").get(iamController.getIdentities.bind(iamController)).all(methodNotAllowed);

// IAM roles route
router.route("/roles").get(iamController.getRoles.bind(iamController)).all(methodNotAllowed);

// IAM groups route
router.route("/groups").get(iamController.getGroups.bind(iamController)).all(methodNotAllowed);

// IAM policies route
router.route("/policies").get(iamController.getPolicies.bind(iamController)).all(methodNotAllowed);

// Export the router
// =============================================================
module.exports = () => {
  return router;
};
