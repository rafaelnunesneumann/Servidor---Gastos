import { FastifyInstance, FastifyPluginOptions, FastifyRequest, FastifyReply } from "fastify";
import { CreateUserController, DeleteUserController, ListUserController } from "./controllers/UserController";
import { CreateSpentController, GetSpentController } from "./controllers/SpentController";

export async function routes(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.get("/", async (req: FastifyRequest, res: FastifyReply) => {
        return {ok: true}
    })
    fastify.post("/user", async (req: FastifyRequest, res: FastifyReply) => {
        return new CreateUserController().handle(req, res)
    })
    fastify.get("/users", async (req: FastifyRequest, res: FastifyReply) => {
        return new ListUserController().handle(req, res)
    })
    fastify.delete("/user", async (req: FastifyRequest, res: FastifyReply) => {
        return new DeleteUserController().handle(req, res)
    }) 
    
    fastify.post("/spent", async (req: FastifyRequest, res: FastifyReply) => {
        return new CreateSpentController().handle(req, res)
    })
    fastify.get("/spent", async (req: FastifyRequest, res: FastifyReply) => {
        return new GetSpentController().handle(req, res)
    })
}