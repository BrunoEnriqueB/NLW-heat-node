import prismaClient from "../prisma"
import {io} from "../app";


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

        const infoWS = { // fazendo a mensagem q vai ser emitida
            text: message.text,
            user_id: message.user_id,
            created_at: message.created_at,
            user: {
                name: message.user.name,
                avatar_url: message.user.avatar_url
            }
        }

        io.emit("new_message", infoWS) //emite uma mensagem

        return message; //devolve a mensagem
    };
};

export {CreateMessageService};