import express from "express";
import homeControllers from "../controllers/homeControllers";
import authControllers from "../controllers/authControllers";
import { authenticateToken } from "../middleware/jwtAction";
import { ensureAuthenticated } from "../middleware/jwtAction";
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
  router.get(
    "/watches",
    ensureAuthenticated,
    authenticateToken,
    homeControllers.getWatchesPage
  );

  // Detail watches
  router.get("/watches/:id", authenticateToken, homeControllers.detailWatches);
  router.post(
    "/watches/:id/comments",
    authenticateToken,
    homeControllers.addComment
  );

  // Member profile
  router.get(
    "/member",
    ensureAuthenticated,
    authenticateToken,
    homeControllers.memberProfile
  );

  // Routes for editing profile and changing password
  router
    .route("/editProfile")
    .get(
      ensureAuthenticated,
      authenticateToken,
      homeControllers.editProfilePage
    )
    .post(
      ensureAuthenticated,
      authenticateToken,
      homeControllers.updateProfile
    );
  router
    .route("/editProfile")
    .get(
      ensureAuthenticated,
      authenticateToken,
      homeControllers.editProfilePage
    )
    .post(
      ensureAuthenticated,
      authenticateToken,
      homeControllers.updateProfile
    );

  router.post(
    "/changePassword",
    ensureAuthenticated,
    authenticateToken,
    homeControllers.changePassword
  );
  return app.use("/", router);
};

export default initWebRoute;
