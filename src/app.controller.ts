import { Controller, Get } from "@nestjs/common";
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiForbiddenResponse,
} from "@nestjs/swagger";

import { AppService } from "./app.service";

@ApiTags("system")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: "Check if app is healthy" })
  @ApiResponse({ status: 200, description: "System is online and healthy" })
  @ApiForbiddenResponse({ description: "Forbidden" })
  @Get()
  getSystemHealth(): string {
    return this.appService.getSystemHealth();
  }

  @ApiOperation({ summary: "Current version of app" })
  @ApiResponse({ status: 200, description: "Success" })
  @ApiForbiddenResponse({ description: "Forbidden" })
  @Get("version")
  getVersion(): Record<string, unknown> {
    return this.appService.getVersion();
  }
}
