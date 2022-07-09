import { environment } from "src/environments/environment";

export class GlobalConstant {

    //Globales
    //public static URL_ENDPOINT = 'http://localhost:8080';
    //public static URL_ENDPOINT = 'https://bk-terrymathland.herokuapp.com';
    public static URL_ENDPOINT = environment.baseUrl;

    //Pregunta
    public static URL_PREGUNTA = '/pregunta';
    public static URL_PREGUNTA_FILTRO = '/pregunta/filtrar';
    public static URL_PREGUNTA_EDITAR = '/pregunta/editarPregunta';

    //Respuesta
    public static URL_RESPUESTA = '/respuesta';
    public static URL_RESPUESTA_FILTRO = '/respuesta/filtrar';
    public static URL_RESPUESTA_FILTRO_GRAFICO = '/respuesta/graficarRespuestas';

    //Estudiante
    public static URL_ESTUDIANTE = '/estudiante';
    public static URL_ESTUDIANTE_AGREGAR = '/agregarEstudiante';
    public static URL_ESTUDIANTE_EDITAR = '/editarEstudiante';
    public static URL_ESTUDIANTE_FILTRO = '/estudiante/filtrar';
    public static URL_ESTUDIANTE_LISTAR = '/estudiante/listarEstudiantes';

    //Cartilla
    public static URL_CARTILLA = '/cartilla';
    public static URL_CARTILLA_FILTRO = '/cartilla/filtrarPreguntas';

    //Auth
    public static URL_AUTH = '/auth';
    public static URL_AUTH_LOGIN = '/auth/login';
    public static URL_AUTH_REFRESH = '/auth/refresh';

    //Docente
    public static URL_DOCENTE = '/docente';
    public static URL_DOCENTE_AGREGAR = '/agregarDocente';
    public static URL_DOCENTE_EDITAR = '/editarDocente';
    public static URL_DOCENTE_FILTRO = '/docente/filtrar';
}
