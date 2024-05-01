import {
  CreateUserService,
  DeleteUserService,
  ListUserService,
  LoginUserService,
} from "../services/UserService";
import jwt, { Secret } from "jsonwebtoken";
import { Request, Response } from "express";

const SECRET_KEY: Secret = process.env.SECRET_KEY || "0";

async function authenticateToken(req: Request, res: Response, next: Function) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.status(401).send({ error: "Token invalido" });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token invalido" });
    next(user);
  });
}

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body.data as {
      email: string;
      password: string;
    };

    const userService = new CreateUserService();
    try {
      const user = await userService.execute({ email, password });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "Error creating user", user: req.body });
    }
  }
}

class DeleteUserController {
  async handle(req: Request, res: Response) {
    const { id } = req.query as { id: string };
    const deleteUserService = new DeleteUserService();

    try {
      const user = await deleteUserService.execute({ id });
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: "Error deleting user", user: id });
    }
  }
}

class ListUserController {
  async handle(req: Request, res: Response) {
    const listUserService = new ListUserService();

    try {
      const users = await listUserService.execute();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "Error listing users" });
    }
  }
}

class LoginUserController {
  async handle(req: Request, res: Response) {
    const loginUserService = new LoginUserService();
    const { email, password } = req.body.data as {
      email: string;
      password: string;
    };

    try {
      const login = await loginUserService.execute({ email, password });
      res.status(200).json(login);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}

class AuthUserController {
  async handle(req: Request, res: Response) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) {
      res.status(401).send({ error: "Token invalido" });
      throw new Error("Token invalido");
    }

    jwt.verify(token, SECRET_KEY, (err) => {
      if (err) {
        res.status(403).json({ error: "Token invalido" });
        throw new Error("Token invalido");
      }
      res.status(200).json({ message: "Token validado com sucesso!" });
    });
  }
}

export {
  CreateUserController,
  DeleteUserController,
  ListUserController,
  LoginUserController,
  AuthUserController,
};
