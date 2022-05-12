import { Injectable } from '@nestjs/common';
import { RunnerService } from './runner.service';

// // init docker
const Docker = require('dockerode');
const streams = require('memory-streams');

const docker = new Docker();

@Injectable()
export class PythonRunnerService extends RunnerService {
  async run(code: string) {
    // init stdout and stderr to catch result
    const stdout = new streams.WritableStream();
    const stderr = new streams.WritableStream();

    let result = { stdout: '', stderr: '' };

    result = await docker
      .run(
        'python',
        ['sh', '-c', `echo "${code.replaceAll('\"', '\\"')}" > index.py; python index.py`],
        [stdout, stderr],
        { Tty: false },
      )
      .then(([res, container]) => {
        container.remove({ force: true });
        return { stdout: stdout.toString(), stderr: stderr.toString() };
      })
      .catch((error) => console.log(error));

    return result;
  }
}
