import prismaClient from "../prisma";

interface CreateUserProps {
    username: string,
    password: string
}

class CreateUserService {
    
    async execute({username, password} : CreateUserProps) {
        if (!username || !password) {
            throw new Error("Preencha todos os campos")
        }

        username = username.toLowerCase()

        const user = await prismaClient.user.create({
            data: {
                username,
                password,
                status: true
            }
        })
        return user
    }
}

interface DeleteCustomerProps {
    id: string
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class DeleteUserService {
    async execute({ id }: DeleteCustomerProps) {
        if (!id) {
            throw new Error("Solicitação inválida");
        }

        const findUser = await prisma.user.findUnique({
            where: { id: id },
            include: { gastos: true }
        });

        if (!findUser) {
            throw new Error("Usuário inexistente");
        }

        await prisma.gasto.deleteMany({
            where: { userId: id }
        });

        await prisma.user.delete({
            where: { id: id }
        });

        return { message: "Deletado com sucesso" };
    }
}


class ListUserService {
    async execute() {
        const users = await prismaClient.user.findMany()

        return users
    }
}

export {CreateUserService, DeleteUserService, ListUserService}