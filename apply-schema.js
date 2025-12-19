
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

const applySchema = async () => {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error("\x1b[31m[AURUM_SYNC_ERROR]: DATABASE_URL no detectada en el entorno.\x1b[0m");
    process.exit(1);
  }

  console.log("\x1b[36m[AURUM_SYNC]: Iniciando handshake con el nodo qhosting_luminaflex-db...\x1b[0m");

  const client = new Client({
    connectionString: dbUrl,
    ssl: dbUrl.includes('sslmode=disable') ? false : { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("\x1b[32m[AURUM_SYNC]: Conexión establecida. Aplicando esquema industrial...\x1b[0m");

    const schemaPath = path.resolve(process.cwd(), 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    // Ejecutamos el schema completo
    await client.query(sql);

    console.log("\x1b[32m[AURUM_SYNC]: Ecosistema de tablas sincronizado exitosamente.\x1b[0m");
    console.log("\x1b[33m[AURUM_SYNC]: Protocolo 741 8 520 finalizado.\x1b[0m");
  } catch (err) {
    console.error("\x1b[31m[AURUM_SYNC_FAULT]: Error crítico durante la sincronización:\x1b[0m");
    console.error(err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
};

applySchema();
