const { Client } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

class WhatsappService {
  constructor() {
    this.#client = new Client()
    this.#client.on('qr', qrCode => qrcode.generate(qrCode, {small: true}))
    this.#client.on('ready', () => console.log('Whatsapp Service is ready!'))
    this.#client.on('message', message => console.log(message))
    this.#client.on('disconnected', () => console.warn('Whatsapp Service disconnected!'))
    this.#client.initialize()
  }

  #client

  /**
   * Send a message to a number
   * @param chatId string
   * @param content string
   */
  async sendMessage(number, content) {
    return await this.#client.sendMessage(`55${number}@c.us`, content)
  }
}

module.exports = WhatsappService