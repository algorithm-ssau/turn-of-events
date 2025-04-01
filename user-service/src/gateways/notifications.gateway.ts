import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Logger, UnauthorizedException } from '@nestjs/common';
  import { Socket, Server } from 'socket.io';
  import { JwtService } from '@nestjs/jwt';
  
  @WebSocketGateway({
    cors: {
      origin: '*', // Разрешить запросы со всех доменов
    },
  })
  export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    private logger: Logger = new Logger('NotificationsGateway');
  
    // userId -> список socketId (если пользователь подключается с нескольких вкладок)
    private activeUsers: Record<number, string[]> = {};
  
    constructor(private readonly jwtService: JwtService) {}
  
    /**
     * Срабатывает при подключении нового клиента
     */
    handleConnection(client: Socket) {
      try {
        // Обычно токен передают в заголовке Authorization: Bearer <token>
        const authHeader = client.handshake.headers.authorization;
        if (!authHeader) {
          this.logger.warn('Нет заголовка Authorization');
          client.disconnect();
          return;
        }
  
        const token = authHeader.split(' ')[1]; // Берём всё, что после 'Bearer '
        const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
        const userId = payload.sub;
  
        // Сохраняем сокет в списке активных
        if (!this.activeUsers[userId]) {
          this.activeUsers[userId] = [];
        }
        this.activeUsers[userId].push(client.id);
  
        // Запоминаем userId внутри объекта сокета
        client.data.userId = userId;
  
        this.logger.log(`Клиент ${client.id} подключился (userId = ${userId})`);
      } catch (err) {
        this.logger.error(`Ошибка авторизации сокета: ${err.message}`);
        client.disconnect();
      }
    }
  
    /**
     * Срабатывает при отключении клиента
     */
    handleDisconnect(client: Socket) {
      const userId = client.data.userId;
      if (userId && this.activeUsers[userId]) {
        // Удаляем socketId из массива
        this.activeUsers[userId] = this.activeUsers[userId].filter((id) => id !== client.id);
        // Если сокетов не осталось — удаляем userId
        if (this.activeUsers[userId].length === 0) {
          delete this.activeUsers[userId];
        }
      }
      this.logger.log(`Клиент ${client.id} отключился (userId = ${userId || 'неизвестен'})`);
    }
  
    /**
     * Метод для отправки события "создание транзакции"
     */
    notifyTransactionCreated(transaction: any, userId: number) {
      if (!this.activeUsers[userId]) return;
      this.activeUsers[userId].forEach((socketId) => {
        this.server.to(socketId).emit('transactionCreated', transaction);
      });
    }
  
    /**
     * Метод для отправки события "обновление транзакции"
     */
    notifyTransactionUpdated(transaction: any, userId: number) {
      if (!this.activeUsers[userId]) return;
      this.activeUsers[userId].forEach((socketId) => {
        this.server.to(socketId).emit('transactionUpdated', transaction);
      });
    }
  
    /**
     * Метод для отправки события "удаление транзакции"
     */
    notifyTransactionDeleted(transactionId: number, userId: number) {
      if (!this.activeUsers[userId]) return;
      this.activeUsers[userId].forEach((socketId) => {
        this.server.to(socketId).emit('transactionDeleted', { id: transactionId });
      });
    }
  
    /**
     * Пример ручного события через @SubscribeMessage (необязательно)
     */
    @SubscribeMessage('subscribeTransactions')
    handleSubscribe(client: Socket) {
      // Можно обрабатывать кастомные события от клиента,
      // например, когда клиент явно подписывается на что-то
      client.emit('subscribed', 'Подписка на транзакции оформлена!');
    }
  }
  