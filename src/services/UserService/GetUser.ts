import prismaClient from "../../prisma";

class GetUserService {
  async execute(id: string) {
    if (!id) {
      throw new Error("Preencha todos os campos");
    }
    const getUser = await prismaClient.user.findUnique({
      where: { id },
    });
    return getUser;
  }
}

export { GetUserService };
