import { Injectable, NestMiddleware } from '@nestjs/common';
import * as bodyParser from 'body-parser';

@Injectable()
export class FormDataParserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    bodyParser.urlencoded({ extended: true })(req, res, next);
  }
}
