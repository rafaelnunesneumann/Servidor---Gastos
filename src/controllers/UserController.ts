import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserService, DeleteUserService, ListUserService, LoginUserService } from "../services/UserService";
import jwt, { Secret } from "jsonwebtoken";

const SECRET_KEY : Secret = process.env.SECRET_KEY || "0";


async function authenticateToken(req: FastifyRequest, res: FastifyReply, next: Function) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).send({error: "Token invalido"});

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).send({error: "Token invalido"});
      next(user);
    });
  }

class CreateUserController {

    async handle(req : FastifyRequest, res: FastifyReply) {

        const {email, password} = req.body as {email: string, password: string}

        const userService = new CreateUserService()
        const user = await userService.execute({email, password})
        res.send(user)
    }
}

class DeleteUserController {
    async handle(req: FastifyRequest, res: FastifyReply) {
        const { id } = req.query as {id : string}
        const deleteUserService = new DeleteUserService()

        const user = await deleteUserService.execute({ id })
        res.send(user)
    }
}

class ListUserController {
    async handle(req: FastifyRequest, res: FastifyReply) {
        const listUserService = new ListUserService()

        const users = await listUserService.execute()
        res.send(users)
    }
}

class LoginUserController {
    async handle(req: FastifyRequest, res: FastifyReply) {
        const loginUserService = new LoginUserService()
        const {email, password} = req.body as {email: string, password: string}

        const login = await loginUserService.execute({email, password})
        res.send(login)
    }
}

export {CreateUserController, DeleteUserController, ListUserController, LoginUserController}