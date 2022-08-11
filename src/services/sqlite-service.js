const db = require('better-sqlite3')

class SqliteService {
  constructor() {
    this.#db = db('./src/database/db.db', {})
  }

  #db

  /**
   * Save a message in database
   * @param receiverNumber string
   * @param messageContent string
   * @returns BetterSqlite3.RunResult
   */
  saveMessage(receiverNumber, messageContent) {
    const insert = this.#db.prepare("INSERT INTO messages (createdAt, number, message) VALUES (?, ?, ?)")
    return insert.run(new Date().toISOString(), receiverNumber, messageContent)
  }

  getUnsendedMessages() {
    const select = this.#db.prepare("SELECT * FROM messages WHERE sendedAt IS NULL").all()
    return select
  }

  /**
   * Update sendedAt
   * @param sendedMessagesIds array
   * @returns BetterSqlite3.RunResult
   */
  updateMessagesSendAtTime(sendedMessagesIds) {
    const update = this.#db.prepare(`UPDATE messages SET sendedAt = ? WHERE id IN(${sendedMessagesIds.join(',')})`)
    return update.run(new Date().toISOString())
  }
}

module.exports = SqliteService