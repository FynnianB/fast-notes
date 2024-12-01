import Database from 'better-sqlite3';
import { Migration } from './entity/migration.entity';
import path from 'path';
import { pathToFileURL } from 'url';

export async function executeMigrations(db: Database.Database) {
    const appliedMigrations: string[] = getAppliedMigrations(db);

    let appliedCount = 0;
    const migrations = Object.entries(await getMigrations()).sort((a,b) => a[0].localeCompare(b[0]));
    for (const [filename,sql] of migrations) {
        if (appliedMigrations.includes(filename)) continue;

        appliedCount++;
        console.log(`Applying migration: ${filename}`);
        console.log(sql);
        db.exec(sql);
        db.prepare(`INSERT INTO migrations (filename, applied_at) VALUES (?, datetime('now'))`).run(filename);
    }
    if (appliedCount === 0) {
        console.log('No new migrations found.');
    } else {
        console.log(`${appliedCount} migrations successfully applied.`);
    }
}

async function getMigrations(): Promise<Record<string, string>> {
    const migrationsModulePath = pathToFileURL(path.resolve(__dirname, './migrations.inline.mjs')).href;
    const inlinedMigrations = await import(migrationsModulePath);
    return inlinedMigrations.default || inlinedMigrations;
}

function getAppliedMigrations(db: Database.Database): string[] {
    // Ensure the migrations table exists
    db.exec(`
        CREATE TABLE IF NOT EXISTS migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          filename TEXT NOT NULL UNIQUE,
          applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

    const rows = db.prepare('SELECT * FROM migrations').all() as Migration[];
    return rows.map(row => row.filename);
}