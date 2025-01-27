import {  Controller, Get, Param, Req} from "@nestjs/common";
import { ConfigService } from "./config.service";
import { Auth } from "src/middlewares/decorators/auth.decorator";
import { Role } from "src/middlewares/role.enum";
import Request from 'src/interfaces/requestUser'

// @Auth(Role.ADMIN, Role.OWNER)
@Controller('config')
export class ConfigController{
  constructor( private configService: ConfigService){}

  @Get('all')
  allListener(@Req() req: Request){
    return this.configService.TemporalData();
  }

  @Get('removeOne/:configName')
  removeOneList(@Param('configName') collectionName: string, @Req() req: Request){
    return this.configService.resetOne(collectionName);
  }

  @Get('delete/:configName')
  deleteOneList(@Param('configName') collectionName: string, @Req() req: Request){
    return this.configService.deleteOne(collectionName);
  }
}