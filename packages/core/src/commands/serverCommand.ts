import BaseCommand from './baseCommand.js'
import { httpServer } from '@nova-kit/server'

class ServerCommand extends BaseCommand {
  constructor(program) {
    super(program)
  }
  get command() {
    return 'server'
  }

  get description() {
    return 'start server'
  }

  get options() {
    return [
      ['-p, --port <port>', 'listen port', '8090'],
      ['-s,--ssl', 'enable https']
    ]
  }

  async action([options, command]) {
    httpServer(options)
  }
}

export default function (instance) {
  return new ServerCommand(instance)
}
