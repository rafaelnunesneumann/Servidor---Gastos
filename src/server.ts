import express from "express";
import routesController from "./routes";

const app = express();
routesController(app);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
