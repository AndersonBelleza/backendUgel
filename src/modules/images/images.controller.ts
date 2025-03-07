import { Controller, Get, Param, Res, Render, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import puppeteer from 'puppeteer'

@Controller('images')
export class ImagesController {

  @Get(':archivo/:imageName')
  getImage(@Param('archivo') archivo: string, @Param('imageName') imageName: string, @Res() res: Response) {
    try {
      const imagePath = join(__dirname, '..', '..', '..', 'src', 'assets', 'files', archivo , imageName);
      return res.sendFile(imagePath);
    } catch (error) {
      return res.status(401).json({message: 'Archivo no encontrado', error: error});
    }
  }
}

@Controller('files')
export class FileController {
  @Get(':archivo/:archivoName')
  getArchive(@Param('archivoName') archiveName: string, @Param('archivo') archive: string, @Res() res: Response){
    try {
      const imagePath = join(__dirname, '..', '..', '..', 'src', 'assets', 'files', archive, archiveName);
      return res.sendFile(imagePath);
    } catch (error) {
      return res.status(401).json({message: 'Archivo no encontrado', error: error});
    }
  }
  @Get(':archivo/:subarchivo/:archivoName')
  getArchive2(@Param('archivoName') archiveName: string, @Param('archivo') archive: string,  @Param('subarchivo') subarchive: string, @Res() res: Response){
    try {
      const imagePath = join(__dirname, '..', '..', '..', 'src', 'assets', 'files', archive, subarchive, archiveName);
      return res.sendFile(imagePath);
    } catch (error) {
      return res.status(401).json({message: 'Archivo no encontrado', error: error});
    }
  }
  @Get(':archivo/:subarchivo/:sub/:archivoName')
  getArchive3(@Param('archivoName') archiveName: string, @Param('archivo') archive: string,  @Param('subarchivo') subarchive: string ,  @Param('sub') sub: string, @Res() res: Response){
    try {
      const imagePath = join(__dirname, '..', '..', '..', 'src', 'assets', 'files', archive, subarchive, sub, archiveName);
      return res.sendFile(imagePath);
    } catch (error) {
      return res.status(401).json({message: 'Archivo no encontrado', error: error});
    }
  }
}

@Controller('security')
export class FilesController {
  @Get(':archivoName')
  getArchive(@Param('archivoName') archiveName: string, @Res() res: Response){
    try {
      const imagePath = join(__dirname, '..', '..', '..', 'src', 'assets', 'files', 'tmpFiles', archiveName);
      res.setHeader('Content-Disposition', `attachment; filename=${archiveName}`);
      res.setHeader('Content-Type', 'application/x-pkcs12');
      return res.sendFile(imagePath);
    } catch (error) {
      return res.status(401).json({message: 'Archivo no encontrado', error: error});
    }
  }
}

@Controller('builderImage')
export class MakeImagesController{
  @Get('buildImages')
  async webScrapping(@Res() res: Response){
    const pageURL = "https://docs.nestjs.com/techniques/mvc";
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(pageURL);
    const screenshotBuffer = await page.screenshot();
    await browser.close();
    res.setHeader('Content-Disposition', 'inline; filename="prueba.png"');
    res.setHeader('Content-Type', 'image/png');
    res.send(screenshotBuffer);
  }

  @Get('sDocumentv1/:type/:document')
  async searchDocument(@Param('type') type: 'DNI' | 'RUC', @Param('document') doc: string, @Res() res: Response){
    const pageURLRUC = "https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias";
    const pageURLDNI = "https://eldni.com/pe/buscar-datos-por-dni"
    const browser = await puppeteer.launch({ headless: 'new', timeout: 5000, args: ['--no-sandbox'] });
    try {
      const page = await browser.newPage();
      await page.goto(type == 'RUC' ? pageURLRUC : pageURLDNI);
      if(type == "RUC"){
        await page.locator('input#txtRuc').fill(doc)
        await page.click("#btnAceptar")
        await page.waitForSelector('div.list-group')
        const result = await page.evaluate(() => {
          const data = document.querySelectorAll('div.list-group-item')
          const results = [...data].flatMap((list:any) => {
            const cv1 = list.querySelector('div.col-sm-5>h4.list-group-item-heading')?.innerText;
            const vv1 = list.querySelector('div.col-sm-7>h4.list-group-item-heading')?.innerText;
            const vv2 = list.querySelector('div.col-sm-7>p.list-group-item-text')?.innerText;
            
            const cv2 = list.querySelectorAll('div.col-sm-3')
            if([...cv2].length > 3){
              const divsCols = [...cv2].map((sub) => {
                const subcv = sub.querySelector('h4.list-group-item-heading')?.innerText;
                const subvv = sub.querySelector('p.list-group-item-text')?.innerText;
                return { Clave : subcv, Valor : subvv }
              })
              const combinedDivsCols = [];
              for (let i = 0; i < divsCols.length; i += 2) {
                  const clave = divsCols[i]?.Clave || "-";
                  const valor = divsCols[i + 1]?.Valor || "-";
                  combinedDivsCols.push({ Clave: clave, Valor: valor });
              }
              return combinedDivsCols;
            }else{
              const tablevv3 = list.querySelectorAll('div.col-sm-7>table.table>tbody>tr');
              const vv3 = tablevv3 && tablevv3.length > 0 ? [...tablevv3].map((v3) => { return v3.innerText }) : undefined;
              return { Clave : cv1 || "-", Valor : vv1 || vv2 || vv3 || "-"}
            }
            
          })
          return results
        })
        await browser.close();
        const objResult = result.reduce((acc, curr) => {
          if (curr.Clave && curr.Valor) {
            acc[curr.Clave] = curr.Valor;
          }
          return acc;
        }, {});

        const response = {
          codResultado: "0000",
          razonSocial: objResult["Número de RUC:"] ? (objResult["Número de RUC:"]).split("-")[1].trim() : "-",
          direccion: objResult["Domicilio Fiscal:"] || "-",
          nombreComercial: objResult["Nombre Comercial:"] || "-",
          tipoContribuyente: objResult["Tipo Contribuyente:"] || "-",
          fechaInscripcion: objResult["Fecha de Inscripción:"] || "-",
          fechaInicioActividades: objResult["Fecha de Inicio de Actividades:"] || "-", 
          estado: objResult["Estado del Contribuyente:"] || "-",
          condicion: objResult["Condición del Contribuyente:"] || "-",
          sistemaEmision: objResult["Sistema Emisión de Comprobante:"] || "-",
          actividadComercio: objResult["Actividad Comercio Exterior:"] || "-",
          sistemaContabilidad: objResult["Sistema Contabilidad:"] || "-",
          actividades: objResult["Actividad(es) Económica(s):"] || "-",
          comprobantesPago: objResult["Comprobantes de Pago c/aut. de impresión (F. 806 u 816):"] || "-",
          sistemaElectronico: objResult["Sistema de Emisión Electrónica:"] || "-",
          inicioEmisionElectronico: objResult["Emisor electrónico desde:"] || "-",
          comprobantes: objResult["Comprobantes Electrónicos:"] ?  (objResult["Comprobantes Electrónicos:"]).split(",") : "-"
          // Falta asingar mas -
        }
        //res.status(200).json(objResult); 
        res.status(200).json(response); 
      }else{
        await page.locator('input#dni').fill(doc)
        await page.click("#btn-buscar-datos-por-dni")
        await page.waitForSelector("div#div-copy")
        const result = await page.evaluate(() => {
          const data = document.querySelectorAll('div.form-group')
          const results = [...data].map((inpt:any) => {
            const c1 = inpt.querySelector("input")?.id
            const v1 = inpt.querySelector("input")?.value
            return (c1 && v1) ? { clave: c1, valor: v1} : { clave: "-", valor: "-"}
          })
          return results;
        })
        await browser.close()
        const objResult = result.reduce((acc, curr) => {
          if (curr.clave && curr.valor) {
            acc[curr.clave] = curr.valor;
          }
          return acc;
        }, {});
        return res.status(400).send(objResult)
      }
    } catch (error) {
      await browser.close();
      res.status(500).json(error);
    }
  }

  @Post('conversionMoneda')
  async obtenerCambio(@Body() body:any, @Res() res: Response){
    const { entrada = "PEN", salida = "USD", valor = "1" } = body;
    //const pageURL = `https://wise.com/es/currency-converter/${entrada.toLowerCase()}-to-${salida.toLowerCase()}-rate?amount=${valor}`;
    const pageURL = `https://www.google.com/finance/quote/${entrada}-${salida}?hl=es`
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    try {
      const page = await browser.newPage();
      await page.goto(pageURL);
      //await page.waitForSelector('h3.cc__source-to-target');
      await page.waitForSelector('div.VfPpkd-WsjYwc')
      //const result = await page.$eval('h3.cc__source-to-target>span.d-inline-block>span.text-success', element => element.innerText);
      const result = await page.$eval('div.VfPpkd-WsjYwc>c-wiz>div>div>div', element => element.getAttribute("data-last-price"));
      const detail = {
        entrada: {
          moneda: entrada,
          monto: parseFloat(valor)
        },
        salida: {
          moneda: salida,
          monto: parseFloat(result ? result.replace(',', '.') : "1")
        }
      }
      await browser.close();
      res.send(detail);
    }catch(error){
      await browser.close();
      console.error('Error:', error);
      res.status(500).json(error);
    }
  }


}