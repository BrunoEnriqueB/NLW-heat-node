// Esse código vai verificar se o id do nosso usuário está válido na aplicação
// Se o token do usuário for inválido, a aplicação deverá retornar um erro, mas se ele estiver autenticado, passe pra frente (next function)
import{Request, Response, NextFunction} from "express";
import {verify} from "jsonwebtoken";

interface IPayLoad {
    sub: string //transforma o sub em string
}

export function ensureAuthenticated(request: Request, response: Response, next:NextFunction) {
    const authToken = request.headers.authorization; //pega o token

    if(!authToken) { //verifica se tem algum dado preenchido no token
        return response.status(401).json({ //se não tiver, devolve um erro 401 e fala pro usuário que o token é inválido
            errorCode: "token.invalid",
        });
    };
    // se o token for válido, ele chegara dessa forma:
    // Bearer 120938219038112093821
    // Por isso vamos desestruturar pra ignorar o Bearer
    const [,token ] = authToken.split(" ");

    try {
        const {sub} = verify(token, process.env.JWT_SECRET) as IPayLoad//verifica se o token é válido e devolve o id do usuário se ele for válido
        request.user_id = sub 

        return next(); //repassa o middleware pra frente
    } catch (err) {
        return response.status(401).json({errorCode: "token.expired"}) //Se não for válido, devolve erro de token expirado
    }

}