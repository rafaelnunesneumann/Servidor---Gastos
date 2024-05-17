import { CreateSpentService, GetSpentService } from "../services/SpentService";
import { Request, Response } from "express";
import { AuthUserController } from "./UserController";

class CreateSpentController {
  async handle(req: Request, res: Response) {
    const { userId, value, type, icon } = req.body as {
      userId: string;
      value: number;
      type: string;
      icon: string;
    };

    const spentService = new CreateSpentService();
    try {
      const spent = await spentService.execute({ userId, value, type, icon });
      res.status(200).json(spent);
    } catch (err) {
      res.status(500).json({ message: "Error on creating spent" });
    }
  }
}

class GetSpentController {
  async handle(req: Request, res: Response) {
    const auth = await new AuthUserController().isAuthorized(req, res);
    if (auth) {
      const { userId } = req.query as { userId: string };

      const spentService = new GetSpentService();
      try {
        const spent = await spentService.execute(userId);
        res.status(200).json(spent);
      } catch (err) {
        res.status(500).json({ message: "Error on getting spents" });
      }
    } else {
      res.status(500).json({ message: "Error on authentication" });
    }
  }
}

export { CreateSpentController, GetSpentController };
