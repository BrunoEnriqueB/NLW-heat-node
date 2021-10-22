import "dotenv/config";
import express from "express";
import {router} from "./routes"

const app = express();

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

app.listen(4000, () => console.log(`Server is running ON PORT 4000`));

