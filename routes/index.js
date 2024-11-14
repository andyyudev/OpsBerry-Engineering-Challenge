// Load node modules
// =============================================================
const router = require("express").Router();

// Load controllers
// =============================================================
const iamController = require("../controllers/IAMController");

// Define routes
// =============================================================
// Default route
router
  .route("/")
  .get((req, res) => {
    res.send("Hello Opsberry");
  })
  .all((req, res) => {
    res.status(405).send("Method Not Allowed");
  });

// IAM identities
router
  .route("/identities")
  .get(iamController.getIdentities.bind(iamController))
  .all((req, res) => {
    res.status(405).send("Method Not Allowed");
  });

// IAM roles route
router
  .route("/roles")
  .get(iamController.getRoles.bind(iamController))
  .all((req, res) => {
    res.status(405).send("Method Not Allowed");
  });

// IAM groups route
router
  .route("/groups")
  .get(iamController.getGroups.bind(iamController))
  .all((req, res) => {
    res.status(405).send("Method Not Allowed");
  });

// IAM policies route
router
  .route("/policies")
  .get(iamController.getPolicies.bind(iamController))
  .all((req, res) => {
    res.status(405).send("Method Not Allowed");
  });

// Export the router
// =============================================================
module.exports = () => {
  return router;
};
