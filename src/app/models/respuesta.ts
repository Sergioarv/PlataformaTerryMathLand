import { Solucion } from "./solucion";

export class Respuesta {
    idrespuesta: string = '';
    soluciones: Solucion[] = [];
    acertadas: string = '';
    nota: string = '';
    fecha: Date = new Date();
}