import express from "express";
import homeControllers from "../controllers/homeControllers";
import authControllers from "../controllers/authControllers";
import { authenticateToken } from "../middleware/jwtAction";
const router = express.Router();

const initWebRoute = (app) => {
  // Render sign-in pages
  router
    .route("/")
    .get(authControllers.signin)
    .post(authControllers.signinSuccess);

  // Render sign-up pages
  router
    .route("/signup")
    .get(authControllers.signup)
    .post(authControllers.signUpSuccess);

  // Logout
  router.get("/logout", authControllers.logout);

  // Define routes for watches
  router.get("/watches", authenticateToken, homeControllers.getWatchesPage);

  // Detail watches
  router.get("/watches/:id", authenticateToken, homeControllers.detailWatches);
  router.post(
    "/watches/:id/comments",
    authenticateToken,
    homeControllers.addComment
  );

  // Member profile
  router.get("/member", authenticateToken, homeControllers.memberProfile);

  // Routes for editing profile and changing password
  router
    .route("/editProfile")
    .get(authenticateToken, homeControllers.editProfilePage)
    .post(authenticateToken, homeControllers.updateProfile);
  router
    .route("/editProfile")
    .get(authenticateToken, homeControllers.editProfilePage)
    .post(authenticateToken, homeControllers.updateProfile);

  router.post(
    "/changePassword",
    authenticateToken,
    homeControllers.changePassword
  );
  return app.use("/", router);
};

export default initWebRoute;
