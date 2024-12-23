import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RmqService {
  constructor(private readonly configService: ConfigService) {}

  getOptions(queue: string, noAck: boolean = false): RmqOptions {
    const rmqUri = `amqp://${this.configService.get<string>('RMQ_USER')}:${this.configService.get<string>('RMQ_PASSWORD')}@${this.configService.get<string>('RMQ_HOST')}:${this.configService.get<string>('RMQ_PORT')}`;
    const rmqUiUrl = `http://${this.configService.get<string>('RMQ_HOST')}:${this.configService.get<string>('RMQ_UI_PORT')}`;
    const rmqQueue = this.configService.get<string>(`RMQ_${queue.toUpperCase()}_QUEUE`);

    console.log("RMQ Uri:", rmqUri);
    console.log("RMQ Ui Url:", rmqUiUrl);
    console.log("RMQ Queue:", rmqQueue);
    return {
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://${this.configService.get<string>('RMQ_USER')}:${this.configService.get<string>('RMQ_PASSWORD')}@${this.configService.get<string>('RMQ_HOST')}:${this.configService.get<string>('RMQ_PORT')}`],
          queue: this.configService.get<string>(`RMQ_${queue.toUpperCase()}_QUEUE`),
          noAck,
          persistent: true,
          queueOptions: {
            durable: false
          },
        },
    };
  }



}

