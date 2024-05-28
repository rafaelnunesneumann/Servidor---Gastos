import prismaClient from "../../prisma";

interface CreateSpentProps {
  userId: string;
  value: number;
  type: string;
  icon: string;
}

class CreateSpentService {
  async execute({ userId, value, type, icon }: CreateSpentProps) {
    if (!userId || !value || !type || !icon) {
      throw new Error("Preencha todos os campos");
    }

    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const gasto = await prismaClient.gasto.create({
      data: {
        value,
        type,
        icon,
        user: {
          connect: { id: userId },
        },
      },
    });

    return gasto;
  }
}

export { CreateSpentService };
