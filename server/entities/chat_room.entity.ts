import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  roomkey: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @OneToMany(() => Message, (message) => message.chatRoom)
  messages: Message[];
}
