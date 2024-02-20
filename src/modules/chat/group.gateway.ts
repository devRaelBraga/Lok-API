import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({cors: true })
export class GroupGateway {
  @WebSocketServer()
  server: Server;
  

  @SubscribeMessage('addUserToGroup')
  handleMessage(client: any, payload: any) {
    // { receiver: bob@bob.com, key: sakdhsad0812b13-3b1293h219-3h1, sender: alice@alice.com }
    //
    console.log(payload);
    payload = JSON.parse(payload);

    
    this.server.emit('group-' + payload.receiver, JSON.stringify(payload)); // Broadcast the message to all connected clients
  }

  handleConnection(client: Socket, ...args: any[]) {
    // Trate a conexão do cliente aqui
    console.log(`Cliente ${client.id} conectado`);
  }

  handleDisconnect(client: any) {
    // Trate a desconexão do cliente aqui
  }
}
