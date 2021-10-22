import prismaClient from "../prisma"



class CreateMessageService {
    async execute(text : string, user_id: string) { //recebe a mensagem e o usuário como parâmetros
        const message = await prismaClient.message.create({  //cria uma mensagem no nosso servidor
            data: { //atribui os dados da mensagem
                text,
                user_id
            },
            include: {
                user: true //inclui as informações do usuário
            }
        });
        return message; //devolve a mensagem
    };
};

export {CreateMessageService};