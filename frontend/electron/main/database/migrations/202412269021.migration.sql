DROP TABLE IF EXISTS note;

-- Table for shared properties of all canvas objects
CREATE TABLE IF NOT EXISTS canvas_object (
    uuid VARCHAR(64) PRIMARY KEY,                     -- Unique ID for the object
    type VARCHAR(32) NOT NULL,                        -- Type of the object (e.g., 'note', 'heading')
    last_modified DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp for last update
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,    -- Timestamp for creation
    category_id VARCHAR(64) DEFAULT NULL,             -- Unique ID of the category
    sync_status VARCHAR(32) DEFAULT 'PENDING',        -- Sync status of the object ('PENDING','SYNCED','FAILED')
    is_deleted BOOLEAN DEFAULT 0,                     -- Flag to indicate if the object is deleted (soft delete)
    x INTEGER DEFAULT NULL,                           -- X-coordinate of the object
    y INTEGER DEFAULT NULL,                           -- Y-coordinate of the object
    FOREIGN KEY (category_id) REFERENCES category (uuid)
);

-- Table for note-specific properties
CREATE TABLE note (
    uuid VARCHAR(64) PRIMARY KEY,         -- Uuid of canvas_object
    content TEXT NOT NULL,                -- Content/body of the note
    FOREIGN KEY (uuid) REFERENCES canvas_object (uuid) ON DELETE CASCADE
);

-- Table for heading-specific properties
CREATE TABLE heading (
    uuid VARCHAR(64) PRIMARY KEY,         -- Uuid of canvas_object
    text TEXT NOT NULL,                   -- Text of the heading
    font_size INTEGER NOT NULL,           -- Font size of the heading
    color TEXT NOT NULL,                  -- Color of the text
    FOREIGN KEY (uuid) REFERENCES canvas_object (uuid) ON DELETE CASCADE
);

CREATE INDEX idx_canvas_object_type ON canvas_object (type);
