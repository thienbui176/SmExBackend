import { Controller, Get, Inject } from '@nestjs/common';
import RoomService from './RoomService';
import { AppLogger } from 'src/Core/Logger/AppLogger';
import BaseController from 'src/Core/Base/BaseController';

@Controller('/rooms')
export default class RoomController extends BaseController {
  private roomService: RoomService;
  constructor(roomService: RoomService) {
    super();
    this.roomService = roomService;
  }

  @Get()
  createRoom() {
    this.logger.log('START CREATE ROOM');
    const result = this.roomService.createRoom();
    this.logger.log('END CREATE ROOM');
    return result;
  }
}
