import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';
import * as migrationRunner from './migration_runner';

class SQLite {
    private readonly db: Database.Database;

    constructor() {
        const dbPath = process.env.NODE_ENV === 'development'
            ? './fast-notes.db'
            : path.join(app.getPath('userData'), 'fast-notes.db');
        this.db = new Database(dbPath);
        this.db.pragma('journal_mode = WAL');

        migrationRunner.executeMigrations(this.db).then(_ => {});
    }

    public run = (query: string, params: any[] = []) => {
        return this.db.prepare(query).run(params);
    }

    public get = (query: string, params: any[] = []) => {
        return this.db.prepare(query).expand().get(params);
    }

    public all = (query: string, params: any[] = []) => {
        return this.db.prepare(query).expand().all(params);
    }

    public transaction = (fn: (sqlite: SQLite) => void) => {
        return this.db.transaction(() => fn(this))();
    }
}

export const sqlite = new SQLite();