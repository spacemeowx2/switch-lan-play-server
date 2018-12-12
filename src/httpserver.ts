import Koa from 'koa'
import cors from 'koa2-cors'
import Router, { IRouterContext } from 'koa-router'
import { SLPUDPServer } from './udpserver'
import { join } from 'path'
const pkg = require(join(__dirname, '..', 'package.json'))

export class SLPHttpServer {
  private router = new Router()
  private app = new Koa()

  constructor(private server: SLPUDPServer) {
    this.router.all('*', async (ctx, next) => {
      try {
        await next()
      } catch (err) {
        console.error(err)

        ctx.status = err.statusCode || err.status || 500
        ctx.body = {
          error: 'server exceptions'
        }
      }
    })
    this.router.get('/info', async ctx => this.handleGetInfo(ctx))
  }

  public start(port: number) {
    this.app.use(cors())
    this.app.use(this.router.routes())
    this.app.listen(port)
    console.log(`\nHttp service started on port ${port}/tcp`)
    console.log(`***************************************`)
  }

  private async handleGetInfo(ctx: IRouterContext) {
    const size = this.server.getClients().size

    ctx.type = 'application/json'
    ctx.body = {
      online: size,
      version: pkg.version
    }
  }
}
