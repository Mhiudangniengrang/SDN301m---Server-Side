import express from "express";
import homeControllersAdmin from "../controllers/homeControllersAdmin";
import authControllers from "../controllers/authControllers";
import { authenticateToken, checkAdmin } from "../middleware/jwtAction";

const router = express.Router();

const initWebAdminRoute = (app) => {
  // Admin signup route
  router.post("/signup_Admin", authControllers.signUpAdmin);

  // Watches routes
  router
    .route("/admin/watches")
    .get(authenticateToken, checkAdmin, homeControllersAdmin.homePageAdmin)
    .post(authenticateToken, checkAdmin, homeControllersAdmin.createWatch);
  router
    .route("/admin/watches/:id")
    .get(authenticateToken, checkAdmin, homeControllersAdmin.deleteWatch);

  // Brands routes
  router
    .route("/admin/brands")
    .get(authenticateToken, checkAdmin, homeControllersAdmin.brandPage)
    .post(authenticateToken, checkAdmin, homeControllersAdmin.addBrandPage);
  router
    .route("/admin/brands/:id")
    .get(authenticateToken, checkAdmin, homeControllersAdmin.deleteBrand);

  // Dashboard routes
  router.get(
    "/admin/dashboard",
    authenticateToken,
    checkAdmin,
    homeControllersAdmin.dashboard
  );
  router.get(
    "/admin/dashboard/watches",
    authenticateToken,
    checkAdmin,
    homeControllersAdmin.getWatches
  );
  router.get(
    "/admin/dashboard/brands",
    authenticateToken,
    checkAdmin,
    homeControllersAdmin.getBrands
  );
  router.get(
    "/admin/dashboard/members",
    authenticateToken,
    checkAdmin,
    homeControllersAdmin.getMembers
  );
  router.get(
    "/admin/dashboard/members/:id",
    authenticateToken,
    checkAdmin,
    homeControllersAdmin.deleteMember
  );
  // Update member
  router.post(
    "/admin/dashboard/members/:id",
    authenticateToken,
    checkAdmin,
    homeControllersAdmin.updateMember
  );

  // Update watch
  router.post(
    "/admin/watches/:id",
    authenticateToken,
    checkAdmin,
    homeControllersAdmin.updateWatch
  );

  // Update brand
  router.post(
    "/admin/brands/:id",
    authenticateToken,
    checkAdmin,
    homeControllersAdmin.updateBrand
  );

  // Edit member page
  router.get(
    "/admin/dashboard/members/edit/:id",
    authenticateToken,
    checkAdmin,
    homeControllersAdmin.editMemberPage
  );

  // Edit watch page
  router.get(
    "/admin/watches/edit/:id",
    authenticateToken,
    checkAdmin,
    homeControllersAdmin.editWatchPage
  );

  // Edit brand page
  router.get(
    "/admin/brands/edit/:id",
    authenticateToken,
    checkAdmin,
    homeControllersAdmin.editBrandPage
  );

  // Sử dụng router cho tất cả các routes
  return app.use("/", router);
};

export default initWebAdminRoute;