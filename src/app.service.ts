import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getSystemHealth(): string {
    console.debug("System Online!");

    	return "System Online!";
  }

  getVersion(): Record<string, unknown> {
    return {
      currentVersion: process.env.CURRENT_VERSION,
    };
  }
}
