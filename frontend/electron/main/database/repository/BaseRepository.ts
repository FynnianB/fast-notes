import { sqlite } from '../sqlite';
import Database from 'better-sqlite3';

type Entity = { uuid: string; } | { id: number };

export abstract class BaseRepository<T extends Entity> {
    protected db = sqlite.getConnection();

    abstract findById(uuid: string): T | null;
    abstract findAll(): T[];

    abstract insert(model: Omit<T, 'uuid'|'id'>): string; // Return the uuid of the inserted entity
    abstract update(model: T): void;
    abstract delete(uuid: string): void;

    protected transaction = (fn: (database: Database.Database) => void) => {
        return this.db.transaction(() => fn(this.db))();
    }
}
