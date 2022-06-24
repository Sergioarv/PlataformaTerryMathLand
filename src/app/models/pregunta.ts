import { Opcion } from "./opcion";

export class Pregunta {
    idpregunta = '';
    enunciado = '';
    urlImg = '';
    idImg = "";
    nombreImg = "";
    opciones: Opcion[] = [];
}