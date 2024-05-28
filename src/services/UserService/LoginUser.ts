import prismaClient from "../../prisma";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

const SECRET_KEY: Secret = process.env.SECRET_KEY || "0";

interface LoginUserProps {
  email: string;
  password: string;
}

class LoginUserService {
  async execute({ email, password }: LoginUserProps) {
    if (!email || !password) {
      throw new Error("Preencha todos os campos");
    }

    email = email.toLowerCase();
    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new Error("Usuario nao cadastrado!");
    }
    const hashedPassword = user?.password || "";

    if (await bcrypt.compare(password, hashedPassword)) {
      const token = jwt.sign({ email }, SECRET_KEY);
      return { token: token, id: user.id };
    } else {
      throw new Error("Senha invalida");
    }
  }
}

export { LoginUserService };
