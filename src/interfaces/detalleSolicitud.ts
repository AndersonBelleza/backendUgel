import { ObjectId } from "mongoose";

interface detalleSolicitud {
  item: String;
  nombre: String;
  stock: number;
  cantidad: number;
  serializados: number;
  noSerializados: number;
  series: [];
  especificaciones: [];
  evidencias: {};
  simbolo: ObjectId;
  isNew: any;
  idEmpresa: ObjectId;
  idSede: ObjectId;
  codigo: String;
  cod?: String;
  idProducto?: ObjectId;
}

export default detalleSolicitud;