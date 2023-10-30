import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any) {
    console.log(payload);
    payload = JSON.parse(payload);
    this.server.emit(payload.receiver, payload.message); // Broadcast the message to all connected clients
  }

  handleConnection(client: Socket, ...args: any[]) {
    // Trate a conexão do cliente aqui
    console.log(`Cliente ${client.id} conectado`);
  }

  handleDisconnect(client: any) {
    // Trate a desconexão do cliente aqui
  }
}
