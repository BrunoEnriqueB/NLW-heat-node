import "dotenv/config";
import express from "express";
import {router} from "./routes";
import {Server} from "socket.io";
import http from "http";
import cors from "cors"; //serve pra permitir ou barrar as requisições dentro da nossa aplicação

const app = express();

app.use(cors()); //habilita o cors pro nosso app

const serverHttp = http.createServer(app); //sobe o servidor pelo http pra podermos usar o websocket
const io = new Server(serverHttp, {
    cors: {
        origin: "*"
    }
});

io.on("connection", socket => { //fica mandando mensagem de que usuário se conhectou
    console.log(`Usuário conectado no socket: ${socket.id}`);
}) 

app.use(express.json()); //permite que o express leia arquivos json para requisições
app.use(router); //cria a rota de autorização com o code que o github nos retorna

app.get("/github", (request, response) => {
    response.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`); //quando acessar o localhost/github, vai devolver a url 
                                                                                                            //para login e depois devolve o callback
})

app.get("/signin/callback", (request, response) => {
    const {code} = request.query; //recebe o código da url como string

    return response.json(code) //devolve uma página com o código da url em json
})

export {serverHttp, io};