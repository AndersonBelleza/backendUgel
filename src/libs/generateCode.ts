import { randomUUID } from "crypto";

function generarLetraAlAzar(): string{
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const i = Math.floor(Math.random() * letras.length);
    return letras.charAt(i);
}

function quitarGuiones( uuidConGuiones:string ){
    return uuidConGuiones.replace(/-/g, '').toUpperCase();
}

function generarNumeroAlAzar(min: number, max: number): number{
    return Math.floor(Math.random() * (max - min + 1 )) + min;
}

export function generarCodigo(longitud: number): string{
    let codigo = '';
    for(let i  = 0; i < longitud; i++){
        const esLetra = Math.random() < 0.5;
        if(esLetra){
            codigo += generarLetraAlAzar();
        }else{
            codigo += generarNumeroAlAzar(0, 9).toString();
        }
    }
    return codigo;
}

export function convertirFecha(fechaString:any) {
    var partesFecha = fechaString.split('-');
    var fecha = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
    
    return fecha;
}

export function convertirFecha2(fechaString:any) {
    var partesFecha = fechaString.split('-');
    var fecha = new Date(partesFecha[0], partesFecha[1] - 1, partesFecha[2]);
    
    return fecha;
}

export function stripTime(date:any) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

export function generarID(){
    let codigo:string = randomUUID();
    return quitarGuiones(codigo);
}

export function decimalToDMS(deg, isLat) {
    const absDeg = Math.abs(deg);
    const degrees = Math.floor(absDeg) || 0;
    const minutes = Math.floor((absDeg - degrees) * 60) || 0;
    const seconds = ((absDeg - degrees) * 60 - minutes) * 60  || 0;

    let direction = "";
    if (isLat) {
        direction = deg < 0 ? 'S' : 'N'; // Sur o Norte para latitud
    } else {
        direction = deg < 0 ? 'W' : 'E'; // Oeste o Este para longitud
    }

    return `${degrees}° ${minutes}' ${seconds.toFixed(2)}" ${direction} `;
}