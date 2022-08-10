const { Client } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

class WhatsappService {
  constructor() {
    this.#client = new Client()
    this.#client.on('qr', qrCode => this.#generateQrCode(qrCode))
    this.#client.on('ready', () => console.log('Whatsapp Service is ready!'))
    this.#client.on('message', message => console.log(message))
    this.#client.on('disconnected', () => console.warn('Whatsapp Service disconnected!'))
    this.#client.initialize()
  }

  #client

  #generateQrCode(qrCode) {
    qrcode.generate(qrCode, {small: true})
  }

  /**
   * Send a message to a number
   * @param chatId string
   * @param content string
   */
  sendMessage(chatId, content) {
    this.#client.sendMessage(chatId, content)
  }
}

module.exports = WhatsappService