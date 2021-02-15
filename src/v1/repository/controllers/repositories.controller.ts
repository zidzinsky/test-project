import { Controller, Get, Headers, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { RepositoriesService } from '../services/repositories.service';
import { RepoDto } from '../dto/repos.dto';
import { acceptHeaderValidation } from '../../../common/helpers';

@Controller('v1/repositories')
export class RepositoriesController {
  constructor(private readonly repositoriesService: RepositoriesService) {}

  @Get('/:username')
  @ApiResponse({
    status: 200,
    description: 'OK',
    type: RepoDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Validation failed for the request.',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Consumer is not found',
  })
  @ApiResponse({
    status: 406,
    description: 'Not Acceptable',
  })
  async getRepositories(@Param('username') username: string, @Headers() headers?: string): Promise<RepoDto[]> {
    acceptHeaderValidation(headers);

    return this.repositoriesService.getRepositories(username);
  }
}
