import { Container } from "inversify";
import { TYPES } from './types';
import { ChatRoomService, IChatRoomService } from './chat/room-routes/chat-room.service';

const container = new Container();
container.bind<IChatRoomService>(TYPES.ChatRoomService).to(ChatRoomService);

export default container;