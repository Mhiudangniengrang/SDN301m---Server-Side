import express from "express";
import apiControllers from "../controllers/apiControllers";
const router = express.Router();

const initAPIRoute = (app) => {
  //C-R-U-D
  router.get("/watches", apiControllers.getAllWatches); //method GET => READ data

  return app.use("/api/v1", router);
};

module.exports = initAPIRoute;
