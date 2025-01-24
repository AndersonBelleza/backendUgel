import { Injectable } from '@nestjs/common';
import { CreateApiConsumerDto } from './dto/create-api-consumer.dto';
import { UpdateApiConsumerDto } from './dto/update-api-consumer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ApiConsumer } from './api-consumer.schema';
import { Model } from 'mongoose';
import puppeteer from 'puppeteer';

@Injectable()
export class ApiConsumerService {
  constructor(@InjectModel(ApiConsumer.name) private apiConsumerModel : Model<ApiConsumer>){}
  
  create(createApiConsumerDto: any) {
    let newData = new this.apiConsumerModel(createApiConsumerDto)
    newData.save();
  }

  async findAll(body:any = {}) {
    return await this.apiConsumerModel.find(body);
  }

  async findOne(id: number) {
    return await this.apiConsumerModel.findById(id);
  }

  async update(id: number, updateApiConsumerDto: any) {
    return await this.apiConsumerModel.findByIdAndUpdate(id,updateApiConsumerDto);
  }

  async remove(id: number) {
    return await this.apiConsumerModel.findByIdAndDelete(id);
  }

  async createCacheTokenSunatGRE(){
    const pageURL = "https://api-seguridad.sunat.gob.pe/v1/clientessol/4f3b88b3-d9d6-402a-b85d-6a0bc857746a/oauth2/loginMenuSol?originalUrl=https://e-menu.sunat.gob.pe/cl-ti-itmenu/AutenticaMenuInternet.htm&state=rO0ABXNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAx3CAAAABAAAAADdAAEZXhlY3B0AAZwYXJhbXN0AEsqJiomL2NsLXRpLWl0bWVudS9NZW51SW50ZXJuZXQuaHRtJmI2NGQyNmE4YjVhZjA5MTkyM2IyM2I2NDA3YTFjMWRiNDFlNzMzYTZ0AANleGVweA==";
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox']});

    function delay(time: number) {
      return new Promise(resolve => setTimeout(resolve, time));
    }

    try {
      const page = await browser.newPage();
      await page.goto(pageURL, { waitUntil: 'networkidle2'});
      await delay(1000)
      await page.locator('input#txtRuc').fill("20609878313")
      await delay(1000)
      await page.locator('input#txtUsuario').fill("SEEPEDIC")
      await delay(1000)
      await page.locator('input#txtContrasena').fill("teereente")
      const resp = page.waitForNavigation();
      await page.click("#btnAceptar"); // Logeandose...
      await delay(2000)
      await resp;
      await page.waitForSelector('div#divOpcionServicio2')
      await page.click("div#divOpcionServicio2"); // Le dió click en EMPRESAS
      await delay(1500)
      await page.waitForSelector("li#nivel1_62");
      await page.locator("li#nivel1_62").click(); // Le dió click en Guía Remision Electronica
      await delay(1500)
      await page.waitForSelector("li#nivel2_62_1");
      await page.locator("li#nivel2_62_1").click(); // Le dió click en Guia Remision Electronica  - SUB
      await delay(1500)
      await page.waitForSelector("li#nivel3_62_1_1");
      await page.locator("li#nivel3_62_1_1").click(); // Le dió click en Emisión de GRE
      await delay(1500)
      await page.waitForSelector("li#nivel4_62_1_1_1_1");
      await page.locator("li#nivel4_62_1_1_1_1").click();  // Le dió click en EMISION GRE - SEGUNDO ENLACE
      await delay(10000)
      const iframeElement = await page.waitForSelector("iframe#iframeApplication"); // Esperar carga de iframe
      const iframe = await iframeElement.contentFrame();
      await delay(2500)
      const token = await iframe.evaluate(() => { return sessionStorage.getItem("SUNAT.token")} ) // Retorno de token
      await browser.close();
      // await this.cacheManager.set("tokenGRE", token);
      return token;
    } catch (error) {
      console.log("Error", error);
      await browser.close()
      return undefined;
    }
}
}
