import prismaClient from "../prisma"

class ProfileUserService {
    async execute(user_id: string) { // Devolve as últimas 3 mensagens do usuário
        const user = await prismaClient.user.findFirst({ //acha o usuário de acordo com seu id
            where: {
                id: user_id
            }
        });

        return user; //devolve o usuário
    };
};

export { ProfileUserService };