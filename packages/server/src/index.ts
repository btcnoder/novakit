import path from 'node:path'
import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import Koa from 'koa'
import serve from 'koa-static'
import chalk from 'chalk'
import { execSync } from 'child_process'

const cwdPath = process.cwd()
const libPath = __dirname
const certPath = path.resolve(libPath, './localhost.pem')
const keyPath = path.resolve(libPath, './localhost-key.pem')

export interface optionsProps {
  port: string
  ssl?: boolean
}

export function httpServer(options: optionsProps) {
  const app = new Koa()
  app.use(serve(cwdPath))

  if (options.ssl) {
    try {
      execSync('mkcert --help', { stdio: 'pipe' })
    } catch (error) {
      console.error(`error: ${error.stderr.toString()}`)
      console.error(
        'please install "mkcert" first and execute "mkcert -install" '
      )
      process.exit(1)
    }

    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      try {
        execSync(`cd ${libPath} && mkcert localhost`, { stdio: 'pipe' })
        console.log('generate localhost.pem and localhost-key.pem')
      } catch (error) {
        console.error(`error: can't generate "localhost.pem"`)
        process.exit(1)
      }
    }

    const params = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    }
    const httpsAddr = chalk.blueBright(`https://localhost:${options.port}`)
    https
      .createServer(params, app.callback() as any)
      .listen(parseInt(options.port), () =>
        console.log(`Server is running on:  ${httpsAddr}`)
      )
  } else {
    const httpAddr = chalk.blueBright(`http://localhost:${options.port}`)
    http
      .createServer(app.callback() as any)
      .listen(parseInt(options.port), () => {
        console.log(`Server is running on:  ${httpAddr}`)
      })
  }
}
