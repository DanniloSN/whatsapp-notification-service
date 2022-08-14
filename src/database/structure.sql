CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  createdAt TEXT NOT NULL,
  sentAt TEXT,
  number TEXT NOT NULL,
  message TEXT NOT NULL,
  attachment BLOB
);