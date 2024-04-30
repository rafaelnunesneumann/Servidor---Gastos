import prismaClient from "../prisma";



interface CreateSpentProps {
    userId: string;
    value: number;
}

class CreateSpentService {
    
    async execute({ userId, value }: CreateSpentProps) {
        if (!userId || !value) {
            throw new Error("Preencha todos os campos");
        }

        const user = await prismaClient.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        const gasto = await prismaClient.gasto.create({
            data: {
                value,
                user: {
                    connect: { id: userId }
                }
            }
        });

        return gasto;
    }
}

class GetSpentService {
    async execute(userId: string) {
        // Verifica se o usuário existe
        const user = await prismaClient.user.findUnique({
            where: { id: userId },
            include: { gastos: true }
        });

        if (!user) {
            throw new Error("Usuário não encontrado");
        }

        return user.gastos;
    }
}

export {CreateSpentService, GetSpentService}
