import express from "express";
import apiControllers from "../controllers/apiControllers";
const router = express.Router();

const initAPIRoute = (app) => {
  //C-R-U-D
  router.get("/users/info", apiControllers.getAllUsers);
  router.post("/user/login", apiControllers.login);
  router.post("/user/register", apiControllers.signup); 
  router.get("/watches", apiControllers.getAllWatches); 
  router.get("/watches/brand/:brandId", apiControllers.getWatchesByBrand); 
  router.get("/watches/:id", apiControllers.getWatchById); 
  router.get("/watches/search/:name", apiControllers.searchWatchesByName); 
  return app.use("/api/v1", router);
};

module.exports = initAPIRoute;
