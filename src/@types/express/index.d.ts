declare namespace Express { //sobreescreve a biblioteca namespace do express
    export interface Request { // botamos em qual interface queremos adicionar essa informação
        user_id: string;
    }
}