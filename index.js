const express = require('express')

const app = express()
app.use(express.json())

const WhatsappService = require('./src/services/whatsapp-service')
const whatsappService = new WhatsappService()

const SqliteService = require('./src/services/sqlite-service')
const sqliteService = new SqliteService()

const ApiResponse = require('./src/models/api-response')
const Tools = require('./src/utils/tools')
const { randomIntNumber } = require('./src/utils/tools')

app.post('/send_message', (req, res) => {
  try {
    const { message, number } = req.body
    if (!message) throw new Error('No message found!')
    if (!number.replace(/[^0-9]/, '').match(/^[0-9]{10,11}$/g))
      throw new Error('Invalid number format!')
    console.log(`Request received (${number}): ${message}`)
    sqliteService.saveMessage(number, message)
  } catch (error) {
    ApiResponse.message = error.message || 'Could not send message'
    ApiResponse.status = false
  } finally {
    res.json(ApiResponse)
  }
})

app.listen(3000)

async function unsendedMessagesHandler() {
  const messages = sqliteService.getUnsentMessages()
  console.log(`${new Date().toISOString()}: ${messages?.length || 0} unsent message(s)`)
  if (messages?.length) {
    console.log(`Sending them...`)
    let success = 0
    let fails = 0
    messages?.forEach(async message => {
      try {
        await whatsappService.sendMessage(message.number, message.message)
        sqliteService.updateMessageSentAtTime(message.id)
        console.log(`Message sent successfully: (${message.number}) ${message.message}`)
        success += 1
        await Tools.sleep(3, 7)
      } catch (error) {
        console.error(`Fail to send message: (${message.number}) ${message.message}: ${error.message || 'unknown'}`)
        fails += 1
      }
    })
    console.log(`Success: ${success}, Fails: ${fails}`)
  }
  return setTimeout(unsendedMessagesHandler, 2000)
}

unsendedMessagesHandler()
