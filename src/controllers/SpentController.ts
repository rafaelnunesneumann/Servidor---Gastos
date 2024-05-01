import { CreateSpentService, GetSpentService } from "../services/SpentService";
import { Request, Response } from "express";

class CreateSpentController {
  async handle(req: Request, res: Response) {
    const { userId, value } = req.body as { userId: string; value: number };

    const spentService = new CreateSpentService();
    try {
      const spent = await spentService.execute({ userId, value });
      res.status(200).json(spent);
    } catch (err) {
      res.status(500).json({ message: "Error on creating spent" });
    }
  }
}

class GetSpentController {
  async handle(req: Request, res: Response) {
    const { userId } = req.query as { userId: string };

    const spentService = new GetSpentService();
    try {
      const spent = await spentService.execute(userId);
      res.status(200).json(spent);
    } catch (err) {
      res.status(500).json({ message: "Error on getting spents" });
    }
  }
}

export { CreateSpentController, GetSpentController };
