import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MailService {
  constructor(private readonly httpService: HttpService) {}

  async sendMail(data: {operacion?: string, correo: string, header: string, content: string, footer?: string}): Promise<any> {
    data.operacion = 'enviarSMS';
    const response = await lastValueFrom(
      this.httpService.post('http://localhost:4444/correo.php', data, {
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
        },
      }).pipe(
        map((response) => {
          return response.data;
        }),
      ),
    );

    return response;
  }
}
