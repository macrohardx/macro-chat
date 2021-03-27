import "reflect-metadata";
import { describe, it } from 'mocha'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { ChatRoomController } from '../../src/controllers/chat-room.controller';
import { RoomManagerService } from '../../src/domain/services/room-manager.service';
import { IMessageRepository, Query } from '../../src/domain/interfaces/repository';
import { Message, Room } from '../../src/domain/model/models';
import { StubRepository } from './stub.repository';
import * as roomMocks from './mocks/rooms.mock.json'

class StubMessageRepository extends StubRepository<Message> implements IMessageRepository { }


describe('ChatRoomController', () => {

  const service = new RoomManagerService();
  const stubRepo = new StubMessageRepository();
  const chatRoomController = new ChatRoomController(service, stubRepo)

  it('Should return list of rooms and HTTP status 200', async () => {
    const getAllRoomStub = sinon.stub(service, 'getAllRooms');
    getAllRoomStub.resolves(roomMocks as unknown as Room[]);
    const response = await chatRoomController.getAllRooms();
    expect(response.statusCode).to.equal(200);
    expect(response).to.not.have.nested.property('json.error');
    expect(response).to.have.nested.property('json.data');
    expect(response.json.data).to.be.an('array').and.not.be.empty;
  })
})