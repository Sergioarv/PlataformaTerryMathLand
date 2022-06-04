import { Solucion } from "./solucion";

export class Respuesta {
    idrespuesta = '';
    soluciones: Solucion[] = [];
    acertadas = '';
    nota = '';
    fecha : Date = new Date();
}