import prismaClient from "../prisma"

class GetLast3MessagesService {
    async execute() { // Devolve as últimas 3 mensagens do usuário
        const messages = await prismaClient.message.findMany({
            take: 3, //pega 3 mmensages
            orderBy: { //ordena por
                created_at: "desc" // ordem decrescente
            },
            include: {
                user: true //pega as informações do usuário
            }
        });
        //Funciona assim: Select * from messages limit 3 order by created_at desc
        return messages;
    };
};

export {GetLast3MessagesService};