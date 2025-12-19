
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

/**
 * LUMINAFLEX OS | DATABASE SYNC ENGINE
 * PROTOCOLO: 741 8 520 | AURUM_SHIELD_V2
 * FASES: 1.Detección -> 2.Sincronización -> 3.Seed -> 4.Salud
 */

const syncDatabase = async () => {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error("\x1b[31m[FASE 1: ERROR]: DATABASE_URL no detectada en Tu Entorno Easypanel.\x1b[0m");
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: dbUrl.includes('sslmode=disable') ? false : { rejectUnauthorized: false }
  });

  try {
    // --- FASE 1: HANDSHAKE ---
    console.log("\x1b[36m[FASE 1]: Iniciando Handshake con Tu Nodo Postgres...\x1b[0m");
    await client.connect();
    console.log("\x1b[32m[FASE 1]: Conexión exitosa. Nodo qhosting_luminaflex-db detectado.\x1b[0m");

    // --- FASE 2: SINCRONIZACIÓN DE ESQUEMA ---
    console.log("\x1b[36m[FASE 2]: Sincronizando Esquema Maestro de Tu Marca...\x1b[0m");
    const schemaPath = path.resolve(process.cwd(), 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error("El archivo schema.sql no existe en la raíz de Tu Proyecto.");
    }
    
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    // Ejecutamos en una transacción para proteger Tu Integridad de Datos
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log("\x1b[32m[FASE 2]: Esquema sincronizado. Tus tablas están listas para operar.\x1b[0m");

    // --- FASE 3: INYECCIÓN DE DATOS MAESTROS (SEED) ---
    console.log("\x1b[36m[FASE 3]: Verificando Credenciales Maestras de Tu Legado...\x1b[0m");
    const seedQuery = `
      INSERT INTO users (email, password, role, status, bio) 
      VALUES ('ceo@luminaflex.mx', 'Aurum_741_Master', 'CEO', 'Online', 'Fundador de Tu Legado Visual.')
      ON CONFLICT (email) DO UPDATE SET 
        status = 'Online',
        last_login = CURRENT_TIMESTAMP;
    `;
    await client.query(seedQuery);
    console.log("\x1b[32m[FASE 3]: Usuario CEO Maestro sincronizado correctamente.\x1b[0m");

    // --- FASE 4: VERIFICACIÓN DE SALUD ---
    console.log("\x1b[36m[FASE 4]: Validando Salud del Nodo...\x1b[0m");
    const healthCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log(`\x1b[32m[FASE 4]: Sincronía Exitosa. ${healthCheck.rowCount} tablas detectadas en Tu Ecosistema.\x1b[0m`);
    console.log("\x1b[35m[AURUM_SYNC_COMPLETE]: Protocolo 741 finalizado. Tu Sistema está Operativo.\x1b[0m");

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("\x1b[31m[CRITICAL_FAULT]: Error durante la sincronización de Tu Base de Datos:\x1b[0m");
    console.error(err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
};

syncDatabase();
