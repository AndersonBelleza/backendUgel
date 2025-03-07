import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import * as requestIp from 'request-ip';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ 
    allowedHeaders: ["*"], 
    // origin: ["https://semi.nom.pe", /^http?:\/\/172.16.14.107:\d+$/, "https://www.semi.nom.pe"],
    origin: [/^http?:\/\/172.16.14.107:\d+$/],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  });
  app.setGlobalPrefix('ugelchincha');
  app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.use(requestIp.mw());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  const environment = process.env.NODE_ENV || 'development';
  const config = require('../nest.config.js')[environment]
  const port = config.port;
  await app.listen(port || 5000);
}
bootstrap();