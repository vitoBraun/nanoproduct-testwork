import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import * as cookieParser from 'cookie-parser';
import * as passportSocketIo from 'passport.socketio';

import { sessionStore } from 'src/auth/session.middleware';
import passport from 'passport';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const eventNames = {
  updateTask: 'updateTask',
  addNewTask: 'addNewTask',
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  credentials: true,
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  constructor(private readonly configService: ConfigService) {}

  afterInit(server: Server) {
    server.use(
      passportSocketIo.authorize({
        store: sessionStore,
        key: 'express.sid',
        passport: passport,
        cookieParser: cookieParser,
        secret: this.configService.get('SESSION_SECRET'),
      }),
    );
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  emitToClient(eventName: string, data?: any) {
    this.server.emit(eventName, data);
  }
}
