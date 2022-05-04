import { Module } from '@nestjs/common';
import { NodeRunnerService } from './node-runner.service';
import { PythonRunnerService } from './python-runner.service';
import { RustRunnerService } from './rust-runner.service';
import { JavaRunnerService } from './java-runner.service';

@Module({
  providers: [
    NodeRunnerService,
    PythonRunnerService,
    RustRunnerService,
    JavaRunnerService,
  ],
  exports: [
    NodeRunnerService,
    PythonRunnerService,
    RustRunnerService,
    JavaRunnerService,
  ],
})
export class RunnerModule {}
