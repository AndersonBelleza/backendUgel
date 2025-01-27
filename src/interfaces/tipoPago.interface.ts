import { ObjectId } from "mongoose";

interface tipoPago{
  idTipoPago: ObjectId;
  numCuenta: String;
  comentario: String;
}

export default tipoPago;