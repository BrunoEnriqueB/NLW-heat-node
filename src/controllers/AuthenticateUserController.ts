import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUSerService";



class AuthenticateUserController {
    async handle(request: Request, response: Response) {
        const { code } = request.body;

        const service = new AuthenticateUserService;
        try {
            const result = await service.execute(code); //se a chamada der certo, traz meus dados
            return response.json(result);
        } catch (err) {
            return response.json({ error: err.message }); //se nao der certo, mostra o tipo de erro q deu
        }

    };
};

export { AuthenticateUserController };