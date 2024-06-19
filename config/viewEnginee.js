import express from "express";

const configViewEngine = (app) => {
  app.use(express.static("uploads"));
  app.set("view engine", "ejs");
  app.set("views", ["views", "views/auth", "views/admin"]); 
};

export default configViewEngine;
