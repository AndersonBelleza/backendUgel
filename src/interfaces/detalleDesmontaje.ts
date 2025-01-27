import { ObjectId } from "mongoose";

interface detalleDesmontaje {
  cod?: String;
  idProducto?: ObjectId;
  item: String;
  nombre: String;
  stock: number;
  cantidad: number;
  serializados: number;
  noSerializados: number;
  series: []
  simbolo: ObjectId;
  isNew: any;
  idEmpresa: ObjectId;
  idSede: ObjectId;
  idCategoria: ObjectId;
  idSubCategoria: ObjectId;
  idMarca: ObjectId;
  codigo: String;
  
}

export default detalleDesmontaje;