import fs from 'fs';
import path from 'path';
import type { ResolvedConfig } from 'vite';

const InlineMigrationsVitePlugin = () => {
    let outputFile = '';

    return {
        name: 'inline-migrations',
        configResolved(config: ResolvedConfig) {
            const migrationsDir = path.resolve(__dirname, './main/database/migrations');
            const migrations: Record<string, string> = {};

            // Read all .sql files from the migrations directory
            fs.readdirSync(migrationsDir).forEach((file) => {
                const fullPath = path.join(migrationsDir, file);
                if (path.extname(file) === '.sql') {
                    migrations[file] = fs.readFileSync(fullPath, 'utf-8');
                }
            });

            // Ensure the output directory exists
            const outputDir = config.build.outDir;
            fs.mkdirSync(outputDir, { recursive: true });

            // Write migrations into js file inside output directory
            outputFile = path.resolve(config.build.outDir, 'migrations.inline.mjs');
            fs.writeFileSync(outputFile, `export default ${JSON.stringify(migrations, null, 2)};`);
        },
    }
};

export default InlineMigrationsVitePlugin;