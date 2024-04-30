import { FastifyRequest, FastifyReply } from "fastify";
import { CreateUserService, DeleteUserService, ListUserService } from "../services/UserService";

class CreateUserController {

    async handle(req : FastifyRequest, res: FastifyReply) {

        const {username, password} = req.body as {username: string, password: string}

        const userService = new CreateUserService()
        const user = await userService.execute({username, password})
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

export {CreateUserController, DeleteUserController, ListUserController}