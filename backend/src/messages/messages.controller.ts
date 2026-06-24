import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Messages')
@ApiBearerAuth()
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get conversation list' })
  async getConversationList(@CurrentUser('id') userId: string) {
    return this.messagesService.getConversationList(userId);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get conversation with a user' })
  async getConversation(
    @CurrentUser('id') currentUserId: string,
    @Param('userId') otherUserId: string,
  ) {
    return this.messagesService.getConversation(currentUserId, otherUserId);
  }

  @Patch(':senderId/read')
  @ApiOperation({ summary: 'Mark messages as read' })
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Param('senderId') senderId: string,
  ) {
    return this.messagesService.markAsRead(userId, senderId);
  }
}
