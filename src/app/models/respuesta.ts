import { Solucion } from "./solucion";

export class Respuesta {
    idrespuesta: string = '';
    soluciones: Solucion[] = [];
    acertadas: string = '';
    intentos: string = '';
    cantidadPreguntas: string = '';
    nota: number = 0.0;
    fecha: Date = new Date();
}