import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class DeleteUserService {
  async execute(id: string) {
    if (!id) {
      throw new Error("Solicitação inválida");
    }

    const findUser = await prisma.user.findUnique({
      where: { id: id },
      include: { gastos: true },
    });

    if (!findUser) {
      throw new Error("Usuário inexistente");
    }

    await prisma.gasto.deleteMany({
      where: { userId: id },
    });

    await prisma.user.delete({
      where: { id: id },
    });

    return { message: "Deletado com sucesso" };
  }
}

export { DeleteUserService };
