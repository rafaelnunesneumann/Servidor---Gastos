import prismaClient from "../prisma";

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

class GetSpentService {
  async execute(userId: string) {
    // Verifica se o usuário existe
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      include: { gastos: true },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return user.gastos;
  }

  async getTodaySpents(userId: string) {
    // Verifica se o usuário existe
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const gastos = await prismaClient.gasto.findMany({
      where: {
        userId: userId,
      },
    });

    const gastosDoDia = gastos.filter((gasto) => {
      if (gasto.created_at) {
        const gastoDate = new Date(gasto.created_at);
        return (
          gastoDate.getDate() === currentDay &&
          gastoDate.getMonth() + 1 === currentMonth &&
          gastoDate.getFullYear() === currentYear
        );
      }
      return false;
    });

    return gastosDoDia;
  }
}

export { CreateSpentService, GetSpentService };
