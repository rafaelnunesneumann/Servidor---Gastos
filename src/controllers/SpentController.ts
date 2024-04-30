import { FastifyRequest, FastifyReply } from "fastify";
import { CreateSpentService, GetSpentService } from "../services/SpentService";

class CreateSpentController {

    async handle(req : FastifyRequest, res: FastifyReply) {

        const {userId, value} = req.body as {userId: string, value: number}

        const spentService = new CreateSpentService()
        const spent = await spentService.execute({userId, value})
        res.send(spent)
    }
}


class GetSpentController {

    async handle(req : FastifyRequest, res: FastifyReply) {

        const { userId } = req.query as {userId : string}

        const spentService = new GetSpentService()
        const spent = await spentService.execute(userId)
        res.send(spent)
    }
}


export {CreateSpentController, GetSpentController}