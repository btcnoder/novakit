import path from 'node:path'
import fse from 'fs-extra'
import { program } from 'commander'
import figlet from 'figlet'
import chalk from 'chalk'
import createCommand from './commands/createCommand'
import serverCommand from './commands/serverCommand'

function init() {
  console.log(chalk.green(figlet.textSync('NOVA KIT')))
  const pkgPath = path.resolve(__dirname, '../package.json')
  const pkg = fse.readJsonSync(pkgPath)
  program
    .name('nova')
    .usage('<Command>')
    .version(pkg.version, '-v, --version', 'output current version')
    .option('-d, --debug', 'enable debug mode')

  program.on('option:debug', function () {
    if (program.opts().debug) {
      console.log('debug', 'launch debug mode')
    }
  })

  program.on('command:*', function (obj) {
    console.log('unknow command' + obj[0])
  })

  return program
}

export default function () {
  const programer = init()
  createCommand(programer)
  serverCommand(programer)
  programer.parse(process.argv)
}
