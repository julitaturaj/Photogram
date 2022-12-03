import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WallService } from './wall.service';

@Controller('wall')
@ApiTags('wall')
export class WallController {
  constructor(private readonly wallService: WallService) {}
}
