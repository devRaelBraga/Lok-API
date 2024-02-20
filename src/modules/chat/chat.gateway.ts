import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from '../message/message.service';

type Payload = {
  message: string,
  receiverEmail: string,
  senderEmail: string
}

@WebSocketGateway({cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly messageService:MessageService){}

  

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: any) {
    console.log(payload);
    payload = JSON.parse(payload);
    payload.message = {
      message: payload.message,
      receiverEmail: payload.receiverEmail,
      senderEmail: payload.senderEmail,
      group: payload.group
    }
    if(payload.senderEmail.length > 6 && payload.senderEmail.slice(0,6) == 'group '){
      let groupId = payload.senderEmail.split(' ')[1]
      let members = await this.messageService.getGroupMembersById({groupId})
      // payload.gr

      members.map((member) =>{
        // console.lo
        console.log(member.email)
        payload.message.receiverEmail = member.email
        if(payload.message.receiverEmail != payload.senderEmail.split(' ')[2]) {
          this.server.emit(String(member.email), JSON.stringify(payload.message))
        }
      })
    }
    else {
      // this.server.
      this.server.emit(payload.receiverEmail, JSON.stringify(payload.message)); // Broadcast the message to all connected clients
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    // Trate a conexão do cliente aqui
    console.log(`Cliente ${client.id} conectado`);
  }

  handleDisconnect(client: any) {
    // Trate a desconexão do cliente aqui
  }
}
