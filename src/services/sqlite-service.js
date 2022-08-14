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

  getUnsentMessages() {
    const select = this.#db.prepare("SELECT * FROM messages WHERE sentAt IS NULL").all()
    return select
  }

  /**
   * Update sentAt
   * @param UnsentMessageId number
   * @returns BetterSqlite3.RunResult
   */
  updateMessageSentAtTime(unsentMessageId) {
    const update = this.#db.prepare(`UPDATE messages SET sentAt = ? WHERE id = ?`)
    return update.run(new Date().toISOString(), unsentMessageId)
  }
}

module.exports = SqliteService