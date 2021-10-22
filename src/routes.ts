import { Router } from "express";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { CreateMessageController } from "./controllers/CreateMessageController";
import { ensureAuthenticated } from "./middleware/ensureAuthenticated";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserController } from "./controllers/ProfileUSerController";

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle); //válida o usuário

router.post("/messages", ensureAuthenticated, new CreateMessageController().handle); //envia mensagem

router.get("/messages/last3", new GetLast3MessagesController().handle); //pega as ultimas 3 mensagens

router.get("/profile", ensureAuthenticated, new ProfileUserController().handle); //devolve as informações do usuário

export { router };