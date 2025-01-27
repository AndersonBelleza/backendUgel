import { ObjectId } from "mongoose";

interface ConexionUsuario{
  conectado: Boolean;
  ultimaConexion: Date;
}

export default ConexionUsuario;