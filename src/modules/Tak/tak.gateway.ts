import { Injectable, OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { createServer } from 'http';

@Injectable()
export class WebSocketGateway implements OnModuleInit {
  private io: Server;

  onModuleInit() {
    const httpServer = createServer(); // Crear un servidor HTTP básico
    this.io = new Server(httpServer, {
      cors: {
        origin: '*', // Permitir todas las fuentes (ajustar según tu necesidad)
      },
    });

    // Iniciar el servidor en un puerto específico
    httpServer.listen(3001, () => {
      console.log('WebSocket Server is running on http://172.16.14.107:3001');
    });

    this.handleSocketConnections();
  }

  private handleSocketConnections() {
    this.io.on('connection', (socket) => {

      // Escuchar eventos personalizados si es necesario
      socket.on('disconnect', () => {
      });
    });
  }

  // Método para emitir eventos a los clientes
  emitEvent(event: string, data: any) {
    this.io.emit(event, data);
  }
}