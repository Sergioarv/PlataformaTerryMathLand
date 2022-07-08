import { Respuesta } from "./respuesta";

export class Estudiante {
    idusuario = '';
    nombre = '';
    respuestas: Respuesta[] = [];
    roles: string[] = [];
    documento: string = '';
    contrasenia: string = '';
}