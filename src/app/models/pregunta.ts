import { Opcion } from "./opcion";

export class Pregunta {
    idpregunta = '';
    enunciado = '';
    urlImg = '';
    opciones: Opcion[] = [];
}