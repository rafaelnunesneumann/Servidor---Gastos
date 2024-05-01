import express, { Express } from "express";
import {
  CreateUserController,
  ListUserController,
  DeleteUserController,
  LoginUserController,
} from "./controllers/UserController";
import {
  CreateSpentController,
  GetSpentController,
} from "./controllers/SpentController";

const routes = express.Router();
routes.post("/register", (req, res) => {
  return new CreateUserController().handle(req, res);
});
routes.get("/users", (req, res) => {
  return new ListUserController().handle(req, res);
});
routes.delete("/user", (req, res) => {
  return new DeleteUserController().handle(req, res);
});
routes.post("/spent", (req, res) => {
  return new CreateSpentController().handle(req, res);
});
routes.get("/spent", (req, res) => {
  return new GetSpentController().handle(req, res);
});
routes.post("/login", (req, res) => {
  return new LoginUserController().handle(req, res);
});

const routesController = (app: Express) => {
  app.route("/").get((_, res) => {
    res.status(200).send("Rota funcionando!");
  });
  app.use(express.json(), routes);
};

export default routesController;
