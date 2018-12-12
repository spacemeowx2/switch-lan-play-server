import { SLPUDPServer } from "./udpserver"
import { SLPHttpServer } from "./httpserver"

function main (argv: string[]) {
  let port = argv[0]
  if (port === undefined) {
    port = '11451'
  }
  const portNum = parseInt(port)
  let udp = new SLPUDPServer(portNum)
  let monitor = new SLPHttpServer(udp)
  monitor.start(portNum)
}
main(process.argv.slice(2))
