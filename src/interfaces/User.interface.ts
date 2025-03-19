import { Types } from "mongoose";

interface UserInterface {
  idPerson: string | Types.ObjectId;
  idStatusType: string | Types.ObjectId; // Allow both types
  idTeamwork: string | Types.ObjectId; // Allow both types
  idSubteamwork: string | Types.ObjectId; // Allow both types
  idArea: string | Types.ObjectId; // Allow both types
  username: string;
  password: string;
  role: string;
  dateCreate?: Date;
  dateExpired?: Date;
}

export default UserInterface;