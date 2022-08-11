CREATE TABLE messages (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  createdAt TEXT NOT NULL,
  sendedAt TEXT,
  number TEXT NOT NULL,
  message TEXT NOT NULL,
  attachment BLOB
);