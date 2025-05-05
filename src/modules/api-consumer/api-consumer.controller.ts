import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiConsumerService } from './api-consumer.service';
import { CreateApiConsumerDto } from './dto/create-api-consumer.dto';
import { UpdateApiConsumerDto } from './dto/update-api-consumer.dto';
import { catchError, lastValueFrom, map, throwError, tap } from 'rxjs'
import { HttpService } from '@nestjs/axios'

@Controller('apiConsumer')
export class ApiConsumerController {
  constructor(
    private  apiConsumerService: ApiConsumerService,
    private httpService: HttpService,
  ) {}


  @Post()
  create(@Body() createApiConsumerDto: CreateApiConsumerDto) {
    return this.apiConsumerService.create(createApiConsumerDto);
  }

  @Get()
  findAll() {
    return this.apiConsumerService.findAll();
  }

  // BUSCAR DATOS DNI
  @Get('searchDni/:dni')
  async searchDni(@Param('dni') dni: string, @Param('token') token: string,) {
    const responseData = await lastValueFrom(this.httpService.get('https://app.minam.gob.pe/TransparenciaWSREST/tramites/transparencia/persona?dni=' + dni,
      {
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      }).pipe(
        map((response) => {
          console.log(response)
          return response.data
        }),
        catchError((error) => {
          return `Error al procesar la respuesta: ${error.message}`;
        })
      )
    );
    console.log(responseData)

    return responseData;
  }

  // BUSCAR DATOS DNI BLOC NOTAS
  @Get('searchDniV2/:dni')
  async searchDniV2(@Param('dni') dni: string,@Param('token') token: string,) {
    let tokenB = "eyJraWQiOiJhcGkuc3VuYXQuZ29iLnBlLmtpZDAwMSIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyMDYwOTg3ODMxMyIsImF1ZCI6Ilt7XCJhcGlcIjpcImh0dHBzOlwvXC9hcGktY3BlLnN1bmF0LmdvYi5wZVwiLFwicmVjdXJzb1wiOlt7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvZ3JlXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn0se1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL3BhcmFtZXRyb3NcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifSx7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvY29udHJpYnV5ZW50ZXNcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifV19LHtcImFwaVwiOlwiaHR0cHM6XC9cL2FwaS5zdW5hdC5nb2IucGVcIixcInJlY3Vyc29cIjpbe1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL2NvbnRyaWJ1eWVudGVzXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn1dfV0iLCJ1c2VyZGF0YSI6eyJudW1SVUMiOiIyMDYwOTg3ODMxMyIsInRpY2tldCI6IjEyOTExMDUxMzQxMDQiLCJucm9SZWdpc3RybyI6IiIsImFwZU1hdGVybm8iOiIiLCJsb2dpbiI6IjIwNjA5ODc4MzEzU0VFUEVESUMiLCJub21icmVDb21wbGV0byI6IlZBTUFTIFMuQS5DLiIsIm5vbWJyZXMiOiJWQU1BUyBTLkEuQy4iLCJjb2REZXBlbmQiOiIwMTAzIiwiY29kVE9wZUNvbWVyIjoiIiwiY29kQ2F0ZSI6IiIsIm5pdmVsVU8iOjAsImNvZFVPIjoiIiwiY29ycmVvIjoiIiwidXN1YXJpb1NPTCI6IlNFRVBFRElDIiwiaWQiOiIiLCJkZXNVTyI6IiIsImRlc0NhdGUiOiIiLCJhcGVQYXRlcm5vIjoiIiwiaWRDZWx1bGFyIjpudWxsLCJtYXAiOnsiaXNDbG9uIjpmYWxzZSwiZGRwRGF0YSI6eyJkZHBfbnVtcnVjIjoiMjA2MDk4NzgzMTMiLCJkZHBfbnVtcmVnIjoiMDEwMyIsImRkcF9lc3RhZG8iOiIwMCIsImRkcF9mbGFnMjIiOiIwMCIsImRkcF91YmlnZW8iOiIxMTAyMDciLCJkZHBfdGFtYW5vIjoiMDMiLCJkZHBfdHBvZW1wIjoiMzkiLCJkZHBfY2lpdSI6IjUyMzkxIn0sImlkTWVudSI6IjEyOTExMDUxMzQxMDQiLCJqbmRpUG9vbCI6InAwMTAzIiwidGlwVXN1YXJpbyI6IjAiLCJ0aXBPcmlnZW4iOiJJVCIsInByaW1lckFjY2VzbyI6dHJ1ZX19LCJuYmYiOjE3MjkxODAzMDcsImNsaWVudElkIjoiZjEyMzAxNDAtYTY1ZC00YjI3LThkNzgtYmQzYTExOTRlOWUzIiwiaXNzIjoiaHR0cHM6XC9cL2FwaS1zZWd1cmlkYWQuc3VuYXQuZ29iLnBlXC92MVwvY2xpZW50ZXNzb2xcL2YxMjMwMTQwLWE2NWQtNGIyNy04ZDc4LWJkM2ExMTk0ZTllM1wvb2F1dGgyXC90b2tlblwvIiwiZXhwIjoxNzI5MTgzOTA3LCJncmFudFR5cGUiOiJhdXRob3JpemF0aW9uX3Rva2VuIiwiaWF0IjoxNzI5MTgwMzA3fQ.Vo7JSdt6GkjigLKCVvoH0zedEfvlSzE8w_NIsUrlH1FlOzld9-cSLuoJavWy75u0yVAlH7ZF8Ke84YlG_mJAI3m2Id8Zeez3Pkwuq8pqD28yUNKy0jkgAdCrf6IfBJ8MzEVWv0aaq3vjit_qM2Ivd65MAiW9cwGSjxzJj8v3NZR6CNKLZawj7fVFse7w62jYL4DhtWEMBzC5H4a9-_ihjX_2vGOAyuRqUrw8F8IPof8a-530brul1xNheeuoWNPuIEVFhFh1cPMml7Ps89zE5jivObDwCkgOK2Pe7w5FYiLm-GOG8H8M0lkyrwDt7Wa8vYVKlbOY3YZxQcunNDgcDw";
    const responseData = await lastValueFrom(this.httpService.get('https://api-cpe.sunat.gob.pe/v1/contribuyente/parametros/personas/' + dni,
      {
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${tokenB}`
        }
      }).pipe(
        map((response) => {
          return response.data
          console.log(response)

        }),
        catchError((error) => {
          return `Error al procesar la respuesta: ${error.message}`;
        })
      )
    );
    console.log(responseData)

    return responseData;
  }

  // BUSCAR DATOS RUC EMPRESA
  @Get('searchRuc/:ruc')
  async searchRuc(@Param('ruc') ruc: string,@Param('token') token: string,) {
    const responseData = await lastValueFrom(this.httpService.get('https://app.minam.gob.pe/TransparenciaWSREST/tramites/transparencia/sunatDetalle?ruc=' + ruc,
      {
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      }).pipe(
        map((response) => {
          return response.data
        }),
        catchError((error) => {
          return `Error al procesar la respuesta: ${error.message}`;
        })
      )
    );

    return responseData;
  }
  // BUSCAR DATOS RUC EMPRESA BLOC NOTAS
  @Get('searchRucV2/:ruc')
  async searchRucV2(@Param('ruc') ruc:any) {
    let tokenB = "eyJraWQiOiJhcGkuc3VuYXQuZ29iLnBlLmtpZDAwMSIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyMDYwOTg3ODMxMyIsImF1ZCI6Ilt7XCJhcGlcIjpcImh0dHBzOlwvXC9hcGktY3BlLnN1bmF0LmdvYi5wZVwiLFwicmVjdXJzb1wiOlt7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvZ3JlXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn0se1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL3BhcmFtZXRyb3NcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifSx7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvY29udHJpYnV5ZW50ZXNcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifV19LHtcImFwaVwiOlwiaHR0cHM6XC9cL2FwaS5zdW5hdC5nb2IucGVcIixcInJlY3Vyc29cIjpbe1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL2NvbnRyaWJ1eWVudGVzXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn1dfV0iLCJ1c2VyZGF0YSI6eyJudW1SVUMiOiIyMDYwOTg3ODMxMyIsInRpY2tldCI6IjEyOTExMDUxMzQxMDQiLCJucm9SZWdpc3RybyI6IiIsImFwZU1hdGVybm8iOiIiLCJsb2dpbiI6IjIwNjA5ODc4MzEzU0VFUEVESUMiLCJub21icmVDb21wbGV0byI6IlZBTUFTIFMuQS5DLiIsIm5vbWJyZXMiOiJWQU1BUyBTLkEuQy4iLCJjb2REZXBlbmQiOiIwMTAzIiwiY29kVE9wZUNvbWVyIjoiIiwiY29kQ2F0ZSI6IiIsIm5pdmVsVU8iOjAsImNvZFVPIjoiIiwiY29ycmVvIjoiIiwidXN1YXJpb1NPTCI6IlNFRVBFRElDIiwiaWQiOiIiLCJkZXNVTyI6IiIsImRlc0NhdGUiOiIiLCJhcGVQYXRlcm5vIjoiIiwiaWRDZWx1bGFyIjpudWxsLCJtYXAiOnsiaXNDbG9uIjpmYWxzZSwiZGRwRGF0YSI6eyJkZHBfbnVtcnVjIjoiMjA2MDk4NzgzMTMiLCJkZHBfbnVtcmVnIjoiMDEwMyIsImRkcF9lc3RhZG8iOiIwMCIsImRkcF9mbGFnMjIiOiIwMCIsImRkcF91YmlnZW8iOiIxMTAyMDciLCJkZHBfdGFtYW5vIjoiMDMiLCJkZHBfdHBvZW1wIjoiMzkiLCJkZHBfY2lpdSI6IjUyMzkxIn0sImlkTWVudSI6IjEyOTExMDUxMzQxMDQiLCJqbmRpUG9vbCI6InAwMTAzIiwidGlwVXN1YXJpbyI6IjAiLCJ0aXBPcmlnZW4iOiJJVCIsInByaW1lckFjY2VzbyI6dHJ1ZX19LCJuYmYiOjE3MjkxODAzMDcsImNsaWVudElkIjoiZjEyMzAxNDAtYTY1ZC00YjI3LThkNzgtYmQzYTExOTRlOWUzIiwiaXNzIjoiaHR0cHM6XC9cL2FwaS1zZWd1cmlkYWQuc3VuYXQuZ29iLnBlXC92MVwvY2xpZW50ZXNzb2xcL2YxMjMwMTQwLWE2NWQtNGIyNy04ZDc4LWJkM2ExMTk0ZTllM1wvb2F1dGgyXC90b2tlblwvIiwiZXhwIjoxNzI5MTgzOTA3LCJncmFudFR5cGUiOiJhdXRob3JpemF0aW9uX3Rva2VuIiwiaWF0IjoxNzI5MTgwMzA3fQ.Vo7JSdt6GkjigLKCVvoH0zedEfvlSzE8w_NIsUrlH1FlOzld9-cSLuoJavWy75u0yVAlH7ZF8Ke84YlG_mJAI3m2Id8Zeez3Pkwuq8pqD28yUNKy0jkgAdCrf6IfBJ8MzEVWv0aaq3vjit_qM2Ivd65MAiW9cwGSjxzJj8v3NZR6CNKLZawj7fVFse7w62jYL4DhtWEMBzC5H4a9-_ihjX_2vGOAyuRqUrw8F8IPof8a-530brul1xNheeuoWNPuIEVFhFh1cPMml7Ps89zE5jivObDwCkgOK2Pe7w5FYiLm-GOG8H8M0lkyrwDt7Wa8vYVKlbOY3YZxQcunNDgcDw";
    const responseData = await lastValueFrom(this.httpService.get('https://api-cpe.sunat.gob.pe/v1/contribuyente/parametros/contribuyentes/' + ruc,
      {
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${tokenB}`
        }
      }).pipe(
        map((response) => {
          return response.data
        }),
        catchError((error) => {
          return `Error al procesar la respuesta: ${error.message}`;
        })
      )
    );

    return responseData;
  }

  // BUSCAR DATOS RUC EMPRESA BLOC NOTAS DOMICILIO FISCAL
  @Get('searchRucInfo/:ruc')
  async searchRucInfo(@Param('ruc') ruc: string,@Param('token') token: string,) {
    let tokenB = "eyJraWQiOiJhcGkuc3VuYXQuZ29iLnBlLmtpZDAwMSIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyMDYwOTg3ODMxMyIsImF1ZCI6Ilt7XCJhcGlcIjpcImh0dHBzOlwvXC9hcGktY3BlLnN1bmF0LmdvYi5wZVwiLFwicmVjdXJzb1wiOlt7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvZ3JlXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn0se1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL3BhcmFtZXRyb3NcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifSx7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvY29udHJpYnV5ZW50ZXNcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifV19LHtcImFwaVwiOlwiaHR0cHM6XC9cL2FwaS5zdW5hdC5nb2IucGVcIixcInJlY3Vyc29cIjpbe1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL2NvbnRyaWJ1eWVudGVzXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn1dfV0iLCJ1c2VyZGF0YSI6eyJudW1SVUMiOiIyMDYwOTg3ODMxMyIsInRpY2tldCI6IjEyOTExMDUxMzQxMDQiLCJucm9SZWdpc3RybyI6IiIsImFwZU1hdGVybm8iOiIiLCJsb2dpbiI6IjIwNjA5ODc4MzEzU0VFUEVESUMiLCJub21icmVDb21wbGV0byI6IlZBTUFTIFMuQS5DLiIsIm5vbWJyZXMiOiJWQU1BUyBTLkEuQy4iLCJjb2REZXBlbmQiOiIwMTAzIiwiY29kVE9wZUNvbWVyIjoiIiwiY29kQ2F0ZSI6IiIsIm5pdmVsVU8iOjAsImNvZFVPIjoiIiwiY29ycmVvIjoiIiwidXN1YXJpb1NPTCI6IlNFRVBFRElDIiwiaWQiOiIiLCJkZXNVTyI6IiIsImRlc0NhdGUiOiIiLCJhcGVQYXRlcm5vIjoiIiwiaWRDZWx1bGFyIjpudWxsLCJtYXAiOnsiaXNDbG9uIjpmYWxzZSwiZGRwRGF0YSI6eyJkZHBfbnVtcnVjIjoiMjA2MDk4NzgzMTMiLCJkZHBfbnVtcmVnIjoiMDEwMyIsImRkcF9lc3RhZG8iOiIwMCIsImRkcF9mbGFnMjIiOiIwMCIsImRkcF91YmlnZW8iOiIxMTAyMDciLCJkZHBfdGFtYW5vIjoiMDMiLCJkZHBfdHBvZW1wIjoiMzkiLCJkZHBfY2lpdSI6IjUyMzkxIn0sImlkTWVudSI6IjEyOTExMDUxMzQxMDQiLCJqbmRpUG9vbCI6InAwMTAzIiwidGlwVXN1YXJpbyI6IjAiLCJ0aXBPcmlnZW4iOiJJVCIsInByaW1lckFjY2VzbyI6dHJ1ZX19LCJuYmYiOjE3MjkxODAzMDcsImNsaWVudElkIjoiZjEyMzAxNDAtYTY1ZC00YjI3LThkNzgtYmQzYTExOTRlOWUzIiwiaXNzIjoiaHR0cHM6XC9cL2FwaS1zZWd1cmlkYWQuc3VuYXQuZ29iLnBlXC92MVwvY2xpZW50ZXNzb2xcL2YxMjMwMTQwLWE2NWQtNGIyNy04ZDc4LWJkM2ExMTk0ZTllM1wvb2F1dGgyXC90b2tlblwvIiwiZXhwIjoxNzI5MTgzOTA3LCJncmFudFR5cGUiOiJhdXRob3JpemF0aW9uX3Rva2VuIiwiaWF0IjoxNzI5MTgwMzA3fQ.Vo7JSdt6GkjigLKCVvoH0zedEfvlSzE8w_NIsUrlH1FlOzld9-cSLuoJavWy75u0yVAlH7ZF8Ke84YlG_mJAI3m2Id8Zeez3Pkwuq8pqD28yUNKy0jkgAdCrf6IfBJ8MzEVWv0aaq3vjit_qM2Ivd65MAiW9cwGSjxzJj8v3NZR6CNKLZawj7fVFse7w62jYL4DhtWEMBzC5H4a9-_ihjX_2vGOAyuRqUrw8F8IPof8a-530brul1xNheeuoWNPuIEVFhFh1cPMml7Ps89zE5jivObDwCkgOK2Pe7w5FYiLm-GOG8H8M0lkyrwDt7Wa8vYVKlbOY3YZxQcunNDgcDw";
    const responseData = await lastValueFrom(this.httpService.get(`https://api-cpe.sunat.gob.pe/v1/contribuyente/gre/contribuyentes/${ruc}/domiciliofiscal`,
      {
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${tokenB}`
        }
      }).pipe(
        map((response) => {
          return response.data
        }),
        catchError((error) => {
          return `Error al procesar la respuesta: ${error.message}`;
        })
      )
    );

    return responseData;
  }

  //CONSULTAR FACTURA
  @Get('searchFactura/:factura')
  async searchFactura(@Param('factura') factura: string) {
    let tokenB = "eyJraWQiOiJhcGkuc3VuYXQuZ29iLnBlLmtpZDAwMSIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyMDYwOTg3ODMxMyIsImF1ZCI6Ilt7XCJhcGlcIjpcImh0dHBzOlwvXC9hcGktY3BlLnN1bmF0LmdvYi5wZVwiLFwicmVjdXJzb1wiOlt7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvZ3JlXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn0se1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL3BhcmFtZXRyb3NcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifSx7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvY29udHJpYnV5ZW50ZXNcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifV19LHtcImFwaVwiOlwiaHR0cHM6XC9cL2FwaS5zdW5hdC5nb2IucGVcIixcInJlY3Vyc29cIjpbe1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL2NvbnRyaWJ1eWVudGVzXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn1dfV0iLCJ1c2VyZGF0YSI6eyJudW1SVUMiOiIyMDYwOTg3ODMxMyIsInRpY2tldCI6IjEyOTExMDUxMzQxMDQiLCJucm9SZWdpc3RybyI6IiIsImFwZU1hdGVybm8iOiIiLCJsb2dpbiI6IjIwNjA5ODc4MzEzU0VFUEVESUMiLCJub21icmVDb21wbGV0byI6IlZBTUFTIFMuQS5DLiIsIm5vbWJyZXMiOiJWQU1BUyBTLkEuQy4iLCJjb2REZXBlbmQiOiIwMTAzIiwiY29kVE9wZUNvbWVyIjoiIiwiY29kQ2F0ZSI6IiIsIm5pdmVsVU8iOjAsImNvZFVPIjoiIiwiY29ycmVvIjoiIiwidXN1YXJpb1NPTCI6IlNFRVBFRElDIiwiaWQiOiIiLCJkZXNVTyI6IiIsImRlc0NhdGUiOiIiLCJhcGVQYXRlcm5vIjoiIiwiaWRDZWx1bGFyIjpudWxsLCJtYXAiOnsiaXNDbG9uIjpmYWxzZSwiZGRwRGF0YSI6eyJkZHBfbnVtcnVjIjoiMjA2MDk4NzgzMTMiLCJkZHBfbnVtcmVnIjoiMDEwMyIsImRkcF9lc3RhZG8iOiIwMCIsImRkcF9mbGFnMjIiOiIwMCIsImRkcF91YmlnZW8iOiIxMTAyMDciLCJkZHBfdGFtYW5vIjoiMDMiLCJkZHBfdHBvZW1wIjoiMzkiLCJkZHBfY2lpdSI6IjUyMzkxIn0sImlkTWVudSI6IjEyOTExMDUxMzQxMDQiLCJqbmRpUG9vbCI6InAwMTAzIiwidGlwVXN1YXJpbyI6IjAiLCJ0aXBPcmlnZW4iOiJJVCIsInByaW1lckFjY2VzbyI6dHJ1ZX19LCJuYmYiOjE3MjkxODAzMDcsImNsaWVudElkIjoiZjEyMzAxNDAtYTY1ZC00YjI3LThkNzgtYmQzYTExOTRlOWUzIiwiaXNzIjoiaHR0cHM6XC9cL2FwaS1zZWd1cmlkYWQuc3VuYXQuZ29iLnBlXC92MVwvY2xpZW50ZXNzb2xcL2YxMjMwMTQwLWE2NWQtNGIyNy04ZDc4LWJkM2ExMTk0ZTllM1wvb2F1dGgyXC90b2tlblwvIiwiZXhwIjoxNzI5MTgzOTA3LCJncmFudFR5cGUiOiJhdXRob3JpemF0aW9uX3Rva2VuIiwiaWF0IjoxNzI5MTgwMzA3fQ.Vo7JSdt6GkjigLKCVvoH0zedEfvlSzE8w_NIsUrlH1FlOzld9-cSLuoJavWy75u0yVAlH7ZF8Ke84YlG_mJAI3m2Id8Zeez3Pkwuq8pqD28yUNKy0jkgAdCrf6IfBJ8MzEVWv0aaq3vjit_qM2Ivd65MAiW9cwGSjxzJj8v3NZR6CNKLZawj7fVFse7w62jYL4DhtWEMBzC5H4a9-_ihjX_2vGOAyuRqUrw8F8IPof8a-530brul1xNheeuoWNPuIEVFhFh1cPMml7Ps89zE5jivObDwCkgOK2Pe7w5FYiLm-GOG8H8M0lkyrwDt7Wa8vYVKlbOY3YZxQcunNDgcDw";
    const responseData = await lastValueFrom(this.httpService.get(`https://api-cpe.sunat.gob.pe/v1/contribuyente/gre/cpegem/factura/${factura}`,
      {
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${tokenB}`
        }
      }).pipe(
        map((response) => {
          return response.data
        }),
        catchError((error) => {
          return `Error al procesar la respuesta: ${error.message}`;
        })
      )
    );

    return responseData;
  }
  
  //CONSULTAr BOLETA
  @Get('searchBoleta/:boleta')
  async searchBoleta(@Param('factura') boleta: string) {
    let tokenB = "eyJraWQiOiJhcGkuc3VuYXQuZ29iLnBlLmtpZDAwMSIsInR5cCI6IkpXVCIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIyMDYwOTg3ODMxMyIsImF1ZCI6Ilt7XCJhcGlcIjpcImh0dHBzOlwvXC9hcGktY3BlLnN1bmF0LmdvYi5wZVwiLFwicmVjdXJzb1wiOlt7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvZ3JlXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn0se1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL3BhcmFtZXRyb3NcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifSx7XCJpZFwiOlwiXC92MVwvY29udHJpYnV5ZW50ZVwvY29udHJpYnV5ZW50ZXNcIixcImluZGljYWRvclwiOlwiMVwiLFwiZ3RcIjpcIjEwMDEwMFwifV19LHtcImFwaVwiOlwiaHR0cHM6XC9cL2FwaS5zdW5hdC5nb2IucGVcIixcInJlY3Vyc29cIjpbe1wiaWRcIjpcIlwvdjFcL2NvbnRyaWJ1eWVudGVcL2NvbnRyaWJ1eWVudGVzXCIsXCJpbmRpY2Fkb3JcIjpcIjFcIixcImd0XCI6XCIxMDAxMDBcIn1dfV0iLCJ1c2VyZGF0YSI6eyJudW1SVUMiOiIyMDYwOTg3ODMxMyIsInRpY2tldCI6IjEyOTExMDUxMzQxMDQiLCJucm9SZWdpc3RybyI6IiIsImFwZU1hdGVybm8iOiIiLCJsb2dpbiI6IjIwNjA5ODc4MzEzU0VFUEVESUMiLCJub21icmVDb21wbGV0byI6IlZBTUFTIFMuQS5DLiIsIm5vbWJyZXMiOiJWQU1BUyBTLkEuQy4iLCJjb2REZXBlbmQiOiIwMTAzIiwiY29kVE9wZUNvbWVyIjoiIiwiY29kQ2F0ZSI6IiIsIm5pdmVsVU8iOjAsImNvZFVPIjoiIiwiY29ycmVvIjoiIiwidXN1YXJpb1NPTCI6IlNFRVBFRElDIiwiaWQiOiIiLCJkZXNVTyI6IiIsImRlc0NhdGUiOiIiLCJhcGVQYXRlcm5vIjoiIiwiaWRDZWx1bGFyIjpudWxsLCJtYXAiOnsiaXNDbG9uIjpmYWxzZSwiZGRwRGF0YSI6eyJkZHBfbnVtcnVjIjoiMjA2MDk4NzgzMTMiLCJkZHBfbnVtcmVnIjoiMDEwMyIsImRkcF9lc3RhZG8iOiIwMCIsImRkcF9mbGFnMjIiOiIwMCIsImRkcF91YmlnZW8iOiIxMTAyMDciLCJkZHBfdGFtYW5vIjoiMDMiLCJkZHBfdHBvZW1wIjoiMzkiLCJkZHBfY2lpdSI6IjUyMzkxIn0sImlkTWVudSI6IjEyOTExMDUxMzQxMDQiLCJqbmRpUG9vbCI6InAwMTAzIiwidGlwVXN1YXJpbyI6IjAiLCJ0aXBPcmlnZW4iOiJJVCIsInByaW1lckFjY2VzbyI6dHJ1ZX19LCJuYmYiOjE3MjkxODAzMDcsImNsaWVudElkIjoiZjEyMzAxNDAtYTY1ZC00YjI3LThkNzgtYmQzYTExOTRlOWUzIiwiaXNzIjoiaHR0cHM6XC9cL2FwaS1zZWd1cmlkYWQuc3VuYXQuZ29iLnBlXC92MVwvY2xpZW50ZXNzb2xcL2YxMjMwMTQwLWE2NWQtNGIyNy04ZDc4LWJkM2ExMTk0ZTllM1wvb2F1dGgyXC90b2tlblwvIiwiZXhwIjoxNzI5MTgzOTA3LCJncmFudFR5cGUiOiJhdXRob3JpemF0aW9uX3Rva2VuIiwiaWF0IjoxNzI5MTgwMzA3fQ.Vo7JSdt6GkjigLKCVvoH0zedEfvlSzE8w_NIsUrlH1FlOzld9-cSLuoJavWy75u0yVAlH7ZF8Ke84YlG_mJAI3m2Id8Zeez3Pkwuq8pqD28yUNKy0jkgAdCrf6IfBJ8MzEVWv0aaq3vjit_qM2Ivd65MAiW9cwGSjxzJj8v3NZR6CNKLZawj7fVFse7w62jYL4DhtWEMBzC5H4a9-_ihjX_2vGOAyuRqUrw8F8IPof8a-530brul1xNheeuoWNPuIEVFhFh1cPMml7Ps89zE5jivObDwCkgOK2Pe7w5FYiLm-GOG8H8M0lkyrwDt7Wa8vYVKlbOY3YZxQcunNDgcDw";
    const responseData = await lastValueFrom(this.httpService.get(`https://api-cpe.sunat.gob.pe/v1/contribuyente/gre/cpegem/boleta/${boleta}`,
      {
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
          Authorization : `Bearer ${tokenB}`
        }
      }).pipe(
        map((response) => {
          return response.data
        }),
        catchError((error) => {
          return `Error al procesar la respuesta: ${error.message}`;
        })
      )
    );

    return responseData;
  }

  @Get('getTokenSunat')
  async getTokenSunat() {

    let token = await this.apiConsumerService.createCacheTokenSunatGRE();

    return token;
  }


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiConsumerDto: UpdateApiConsumerDto) {
    return this.apiConsumerService.update(+id, updateApiConsumerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiConsumerService.remove(+id);
  }
}
