import { Pregunta } from "./pregunta";

export class Cartilla {
    idcartilla: string;
    nombre: string;
    preguntas: Pregunta[];

    constructor(){
        this.idcartilla = "";
        this.nombre = "";
        this.preguntas = [];
    }
}