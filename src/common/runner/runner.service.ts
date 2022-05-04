import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class RunnerService {
  abstract run(code: string): Promise<any>;
}
