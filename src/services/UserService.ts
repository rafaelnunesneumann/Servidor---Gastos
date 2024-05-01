import prismaClient from "../prisma";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

const SECRET_KEY: Secret = process.env.SECRET_KEY || "0";

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

interface DeleteCustomerProps {
  id: string;
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class DeleteUserService {
  async execute({ id }: DeleteCustomerProps) {
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

class ListUserService {
  async execute() {
    const users = await prismaClient.user.findMany();

    return users;
  }
}

class LoginUserService {
  async execute({ email, password }: CreateUserProps) {
    if (!email || !password) {
      throw new Error("Preencha todos os campos");
    }

    email = email.toLowerCase();
    const user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });
    const hashedPassword = user?.password || "";

    if (await bcrypt.compare(password, hashedPassword)) {
      const token = jwt.sign({ email }, SECRET_KEY);
      return { token: token };
    }
    return false;
  }
}

export {
  CreateUserService,
  DeleteUserService,
  ListUserService,
  LoginUserService,
};
