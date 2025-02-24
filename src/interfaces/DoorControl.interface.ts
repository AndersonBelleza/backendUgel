import { IsNotEmpty, IsString } from "class-validator";

export class DoorControlInterface{

    @IsString()
    @IsNotEmpty({message: 'El nombre de usuario es requerido!'})
    username: string;

    @IsString()
    @IsNotEmpty({message: 'La clave es requerida!'})
    password: string;

}