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
import { Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { GetUserService } from "./services/UserService/GetUser";
const SECRET_KEY: Secret = process.env.SECRET_KEY || "0";

const validationBase = (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers["authorization"];
  const { userId } = req.query as { userId: string };
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return;
  }
  jwt.verify(token, SECRET_KEY, async (err, user) => {
    if (!err) {
      try {
        if (typeof user !== "string" && user && "email" in user) {
          const getUser = await new GetUserService().execute(userId);
          if (getUser && getUser.email === user.email) {
            next();
          } else {
            res.status(401).send({ message: "Autenticação falhou!" });
          }
        } else {
          res.status(401).send({ message: "Token inválido!" });
        }
      } catch (error) {
        res.status(500).send({ message: "Erro ao buscar usuário!" });
      }
    } else {
      res.status(500).send({ message: "Erro na autenticação!" });
    }
  });
};

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
routes.post("/spent", validationBase, (req, res) => {
  return new CreateSpentController().handle(req, res);
});
routes.get("/spent", validationBase, (req, res) => {
  return new GetSpentController().handle(req, res);
});
routes.get("/todayspents", validationBase, (req, res) => {
  return new GetSpentController().getTodaySpents(req, res);
});
routes.post("/login", (req, res) => {
  return new LoginUserController().handle(req, res);
});
routes.get("/auth", validationBase, (_, res) =>
  res.status(200).send({ message: "Autenticado!" })
);

const routesController = (app: Express) => {
  app.route("/").get((_, res) => {
    res.status(200).send("Rota funcionando!");
  });
  app.use(express.json(), routes);
};

export default routesController;
