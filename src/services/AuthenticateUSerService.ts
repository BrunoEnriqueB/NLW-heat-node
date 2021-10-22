import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";

/**
 * Receber code(string)
 * Recuperar o acces_token no github
 * Recuperar infos do usuário no github
 * Verificar se o usuário existe no DB
 * Se ele existir, a gente gera um token pra ele
 * Se não existir, a gente cria ele no DB e gera um token pra ele
 * No fim, a gente retorna o token com as infos do usuário logado 
 */

interface IAccessTokenResponse { //vai fazer o axios devolver só o access token 
    access_token: string
};

interface IUserResponse { //Vai pegar só esses dados desejados do nosso access_token
    avatar_url: string,
    login: string,
    id: number,
    name: string
};

class AuthenticateUserService {
    async execute(code: string) {
        const url = "https://github.com/login/oauth/access_token"; //url pra acessar nosso access_token

        const { data: AccessTokenResponse } = await axios.post<IAccessTokenResponse>(url, null, { //Acessa os dados retornados pelo login do github e os imprime em json
            params: {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            headers: {
                "Accept": "application/json"
            }
        });
        //pega todas as informações do usuário que está logado na aplicação
        // por isso o segundo parâmetro tem que ter o tipo do token (bearer) e o access_token
        const response = await axios.get<IUserResponse>("https://api.github.com/user", {
            headers: {
                authorization: `Bearer ${AccessTokenResponse.access_token}` //Tipo do token e token
            }
        });
        //guarda todos os dados do usuário
        const { login, id, avatar_url, name } = response.data;
        // recebe o model que criamos para os dados do usuário lá no nosso schema.prisma
        let user = await prismaClient.user.findFirst({ //procura no nosso banco de dados se já existe o usuário
            where: {
                github_id: id
            }
        });
        // se o usuário não existir
        if (!user) {
            user = await prismaClient.user.create({
                data: { //parâmetro que traz todas as informações do nosso model e salvamos de acordo com os dados do usuário
                    github_id: id,
                    login,
                    avatar_url,
                    name
                }
            })
        };

        const token = sign( //Cria nosso token e adiciona todas as infomações necessárias para login do usuário
            {
                user: {
                    name: user.name,
                    avatar_url: user.avatar_url,
                    id: user.id
                }
            },
            process.env.JWT_SECRET,
            {
                subject: user.id, // id do usuário
                expiresIn: "1d"  // quando o token expira
            }
        );

        return { token, user };
    }
}

export { AuthenticateUserService }