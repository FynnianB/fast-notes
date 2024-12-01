CREATE TABLE IF NOT EXISTS notes (
    uuid VARCHAR(64) PRIMARY KEY,
    content TEXT NOT NULL,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
    category_id VARCHAR(64) DEFAULT NULL,
    sync_status VARCHAR(32) NOT NULL,
    is_deleted BOOLEAN DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories (uuid)
);

CREATE TABLE IF NOT EXISTS categories (
    uuid VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sync_status (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sync_queue_id INTEGER NOT NULL,
    type VARCHAR(32) NOT NULL,
    executed_at DATETIME NOT NULL,
    affected_rows INTEGER DEFAULT 0,
    failed_rows INTEGER DEFAULT 0,
    FOREIGN KEY (sync_queue_id) REFERENCES sync_queue (id)
);

CREATE TABLE IF NOT EXISTS sync_queue (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    table_name VARCHAR(64) NOT NULL,
    row_id VARCHAR(64) NOT NULL,
    action VARCHAR(64) NOT NULL,
    data TEXT NOT NULL,
    last_modified DATETIME NOT NULL
);