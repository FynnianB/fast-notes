import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import * as migrationRunner from './migration_runner';
import logger from '../services/logger.service';

class SQLite {
    private static instance: SQLite;
    private readonly db: Database.Database;

    constructor() {
        const dbPath = process.env.NODE_ENV === 'development'
            ? './fast-notes.db'
            : path.join(app.getPath('userData'), 'fast-notes.db');
        this.db = new Database(dbPath, { verbose: logger.debug });
        this.db.pragma('journal_mode = WAL');
        this.db.pragma('foreign_keys = ON');
        this.db.pragma('synchronous = NORMAL');

        migrationRunner.executeMigrations(this.db).then(_ => {});
    }

    public static getInstance(): SQLite {
        if (!SQLite.instance) {
            SQLite.instance = new SQLite();
        }
        return SQLite.instance;
    }

    public getConnection(): Database.Database {
        return this.db;
    }

    public closeConnection(): void {
        this.db.close();
    }
}

export const sqlite = SQLite.getInstance();
