import prismaClient from "../../prisma";
import bcrypt from "bcrypt";

interface CreateUserProps {
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ email, password }: CreateUserProps) {
    if (!email || !password) {
      throw new Error("Preencha todos os campos");
    }

    email = email.toLowerCase();

    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new Error("E-mail ja cadastrado");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        email,
        password: hashedPassword,
        status: true,
      },
    });
    return user;
  }
}
export { CreateUserService };
