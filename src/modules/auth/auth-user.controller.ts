import { Body, Controller, Get, Res, Post, Req } from '@nestjs/common';
import { Response } from 'express';
import { ValidadorSchemaPipe } from 'src/middlewares/validador.middleware'
import { decryptKey } from 'src/libs';

// Seguridad
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { TOKEN_SECRET } from 'src/config';
import Request from 'src/interfaces/requestUser'
import { Auth } from 'src/middlewares/decorators/auth.decorator';
import { Role } from 'src/middlewares/role.enum';
import { AllRoll, PublicAccess, StopBody } from 'src/middlewares/decorators/public.decorator';
import { LoginUserInterface } from 'src/interfaces/loginUser.interface';
import { UserService } from '../User/user.service';
import { StatusTypeService } from '../statusType/statusType.service';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private statusTypeService: StatusTypeService,
    private jwtService: JwtService,
  ){}

  @PublicAccess()
  @Post('loginUser')
  async loginUser(@Body( new ValidadorSchemaPipe()) body: LoginUserInterface, @Res() res: Response, @Req() req: any){
    const userFound:any = await this.userService.findOne({ username : body.username.toString() });
    
    if(!userFound) return res.status(400).json({ message: "Usuario no encontrado."});

    const validation = await bcrypt.compare(body.password, userFound.password);
    if(!validation) return res.status(400).json({ message: "Contraseña incorrecta." });

    const token = await this.jwtService.signAsync({ id: userFound._id, role: userFound?.role });
    const statusType = await this.statusTypeService.findOne({ name: 'Activo', type: 'User' });

    if( userFound?.idStatusType?.toString() !== statusType._id.toString() ) return res.status(400).json({ message: 'Usuario inactivo.' });
    
    res.json({
      token: token,
      id: userFound._id,
      username: userFound.username,
      role: userFound?.role,
      idPerson: userFound?.idPerson
    });
  }

  @Post('logoutUser')
  async logoutUser(@Body() body: any, @Res() res: Response, @Req() req: any) {

    if(body.token){
      const { id } = await decryptKey(body.token);
      body.idUser = id;
    }

    const userFound:any = await this.userService.searchIdUser(body.idUser);
    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    res.json({
      session: false  
    })

  }

  // @PublicAccess()
  // @Post('loginUsuarioAdmin')
  // async loginAdmin(@Body() body: LoginUserInterface, @Res() res: Response, @Req() req: any){
  //   const userFound:any = await this.userService.buscarUsuario({
  //     nombreUsuario : body.nombreUsuario.toString()}
  //   );
    
  //   if(!userFound) return res.status(400).json({message: "Usuario no encontrado "});

  //   const validation = await bcrypt.compare(body.password, userFound.password);
  //   if(!validation) return res.status(400).json({message: "password incorrecta"});

  //   if(userFound?.idTipoUsuario?.nombre == "Default"){
  //     return res.status(400).json({message: "Acceso no autorizado"});
  //   }

  //   const token = await this.jwtService.signAsync({id: userFound._id, rol: userFound?.idTipoUsuario?.nombre ? userFound?.idTipoUsuario?.nombre : ""});

  //   const statusType = await this.statusTypeService.statusTypeNombre('Activo');

  //   if(userFound?.statusType !== statusType._id.toString()){
  //     return res.status(400).json({message: "Usuario inactivo"});
  //   }

  //   if(userFound?.bool !== "0"){
  //     return res.status(400).json({ message: `Sesión activa en otro dispositivo, por favor cierre antes para proceder desde este dispositivo. <<${userFound?._id}>>`})
  //   }

  //   await this.userService.actualizarOptionalField(userFound?._id, { bool: "1"});

  //   const infoIP = IPAdreessUtil.getInfoIP(req)
  //   const dataActividad: any = {
  //     actividad: 'login',
  //     schema: 'Usuario',
  //     idUser: userFound._id.toString(),
  //     statusType: statusType._id.toString(),
  //     data: userFound,
  //     conexionUsuario: {
  //       conectado: true,
  //       ultimaConexion: new Date()
  //     },
  //     ip: infoIP.IP,
  //     dispositivo: infoIP.dispositivo,
  //     userAgent: infoIP.userAgent
  //   }

  //   const resLocation = await this.locacionIpService.getLocation(infoIP.IP);
  //   if(resLocation.status == 200){
  //     dataActividad.locacion = resLocation.data;
  //   }

  //   const actividad = await this.actividadService.registrar(dataActividad);

  //   res.json({
  //     token: token,
  //     id: userFound?.idEmpresa?._id,
  //     idUser:  userFound._id,
  //     usuario: userFound.nombreUsuario,
  //     email: userFound.correo, 
  //     sedesVisualizadas: userFound.sedesVisualizadas || [], 
  //     facturacion: userFound?.idEmpresa?.facturacionElectronica,
  //     rol: userFound?.idTipoUsuario?.nombre ? userFound?.idTipoUsuario?.nombre : "",
  //     logo: userFound?.fotoPerfil[0] ? userFound?.fotoPerfil[0] : {},
  //     idS: userFound?.idSede,
  //     statusOnline: userFound?.bool,
  //     roles: userFound?.roles ? userFound?.roles : []
  //   })
  // }



  // @PublicAccess()
  // @Post('registrarUsuario')
  // @Auth()
  // async registrarUsuario(@Body() body: registrarUserDto, @Res() res: Response, @Req() req: any){
  //   try{
  //     const passwordncriptada = await bcrypt.hash(body.password.toString(), 10);
  //     const statusType = await this.statusTypeService.statusTypeNombre('Activo');
  //     const tipoUsuario = await this.tipouserService.buscarTipoUsuarioNombre('Default');
  //     const sede:any = await this.sedeService.obtenerSede(body.idSede.toString());
  //     console.log(sede.idEmpresa._id);
      
  //     const Sendbody:any = {
  //       ...body, 
  //       password: passwordncriptada, 
  //       idEmpresa: sede.idEmpresa._id, 
  //       statusType: statusType.id.toString(), 
  //       idTipoUsuario: tipoUsuario.id.toString(),
  //       accesos: tipoUsuario.accesos
  //     }
      
  //     const usuarioU = await this.userService.crear(Sendbody);
  //     const token = await this.jwtService.signAsync({id: usuarioU._id, rol: "Default"});

  //     // ACTIVIDAD
  //     const infoIP = IPAdreessUtil.getInfoIP(req)
  //     const dataActividad: any = {
  //       actividad: 'registri',
  //       schema: 'Usuario',
  //       idUser: usuarioU._id.toString(),
  //       statusType: statusType._id.toString(),
  //       data: usuarioU,
  //       conexionUsuario: {
  //         conectado: true,
  //         ultimaConexion: new Date()
  //       },
  //       ip: infoIP.IP,
  //       dispositivo: infoIP.dispositivo,
  //       userAgent: infoIP.userAgent
  //     }

  //     const resLocation = await this.locacionIpService.getLocation(infoIP.IP);
  //     if(resLocation.status == 200){
  //       dataActividad.locacion = resLocation.data;
  //     }
      
  //     const actividad = await this.actividadService.registrar(dataActividad);

  //     res.json({
  //       tokenUser: token,
  //       id: usuarioU._id,
  //       usuario: usuarioU.nombreUsuario,
  //       rol: "Default",
  //       statusOnline: usuarioU?.bool,
  //     })

  //   }catch(error){
  //     res.status(500).json({message: error.message});
  //   }
  // }

  // @Post('verificar')
  // async verificarToken( @Req() req: Request, @Res() res: Response) {
  //   const {token, idSede} = req.body;
  //   if (!token) return res.status(401).json({ message: 'Token inexistente, acceso denegado' });
  //   if(!idSede) return res.status(401).json({message: 'Tienda no encontrada, acceso denegado'});
  //   const usuario = this.jwtService.verify(token, { secret: TOKEN_SECRET });
  //   if (!usuario) return res.status(401).json({ message: `Verificación fallida, token inválido, acceso denegado` })
  //   const usuarioU:any  = await this.userService.buscarUsuario({_id: usuario.id, idSede: idSede});
  //   if (!usuarioU) return res.status(401).json({ message: `Usuario no encontrado, acceso denegado` })
  //   return res.json({
  //     id: usuarioU._id,
  //     usuario: usuarioU.nombreUsuario,
  //     rol: usuarioU.idTipoUsuario?.nombre ? usuarioU.idTipoUsuario?.nombre  + "U" : ""
  //   })
  // }

  // @Post('verificarUser')
  // async verificarTokenUser( @Req() req: Request, @Res() res: Response) {
  //   const {token} = req.body;
  //   if (!token) return res.status(401).json({ message: 'Token inexistente, acceso denegado' });
  //   const usuario = this.jwtService.verify(token, { secret: TOKEN_SECRET });
  //   if (!usuario) return res.status(401).json({ message: `Verificación fallida, token inválido, acceso denegado` })
  //   const usuarioU:any  = await this.userService.buscarUsuario({ _id: usuario.id });
  //   if (!usuarioU) return res.status(401).json({ message: `Usuario no encontrado, acceso denegado` })
  //   return res.json({
  //     token: token,
  //     id: usuarioU?.idEmpresa?._id,
  //     idUser:  usuarioU._id,
  //     usuario: usuarioU.nombreUsuario,
  //     email: usuarioU.correo, 
  //     sedesVisualizadas: usuarioU.sedesVisualizadas || [], 
  //     facturacion: usuarioU?.idEmpresa?.facturacionElectronica,
  //     rol: usuarioU?.idTipoUsuario?.nombre ? usuarioU?.idTipoUsuario?.nombre : "",
  //     logo: usuarioU?.fotoPerfil[0] ? usuarioU?.fotoPerfil[0] : {},
  //     idS: usuarioU?.idSede,
  //     statusOnline: usuarioU?.bool,
  //     roles: usuarioU?.roles ? usuarioU?.roles : []
  //   })
  // }


}
