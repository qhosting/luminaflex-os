
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Client } = pg;

/**
 * LUMINAFLEX OS | DATABASE SYNC ENGINE (CORE)
 * PROTOCOLO: 741 8 520 | AURUM_SHIELD_V2
 * DESPLIEGUE: Easypanel Industrial Node
 */

const syncDatabase = async () => {
  // Limpiamos la URL de posibles espacios o caracteres de escape
  const dbUrl = process.env.DATABASE_URL?.trim();

  console.log("\x1b[35m%s\x1b[0m", "======================================================");
  console.log("\x1b[35m%s\x1b[0m", "   LUMINAFLEX OS | MOTOR DE SINCRONIZACIÓN ÉLITE      ");
  console.log("\x1b[35m%s\x1b[0m", "======================================================");

  // --- FASE 1: VALIDACIÓN DE SEGURIDAD ---
  console.log("\x1b[36m[FASE 1]: Validando Integridad de Entorno...\x1b[0m");
  
  if (!dbUrl || dbUrl === "undefined") {
    console.error("\x1b[31m[ERROR CRÍTICO]: DATABASE_URL no detectada o vacía.\x1b[0m");
    console.error("\x1b[31m[ACCION]: Verifique las variables de entorno en Easypanel.\x1b[0m");
    process.exit(1);
  }
  
  if (!dbUrl.startsWith('postgres://') && !dbUrl.startsWith('postgresql://')) {
    console.error("\x1b[31m[ERROR CRÍTICO]: Formato de DATABASE_URL inválido.\x1b[0m");
    process.exit(1);
  }

  console.log("\x1b[32m[FASE 1]: Entorno validado. Nodo detectado correctamente.\x1b[0m");

  const client = new Client({
    connectionString: dbUrl,
    // Protocolo Aurum para conexiones en la nube
    ssl: dbUrl.includes('sslmode=disable') ? false : { rejectUnauthorized: false }
  });

  try {
    // --- FASE 2: HANDSHAKE ---
    console.log("\x1b[36m[FASE 2]: Iniciando Handshake con Tu Nodo Postgres...\x1b[0m");
    await client.connect();
    console.log("\x1b[32m[FASE 2]: Enlace establecido bajo Protocolo 741.\x1b[0m");

    // --- FASE 3: SINCRONIZACIÓN DE ESQUEMA ---
    console.log("\x1b[36m[FASE 3]: Aplicando Esquema Maestro...\x1b[0m");
    const schemaPath = path.resolve(process.cwd(), 'schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      throw new Error("No se encontró el archivo schema.sql en el directorio raíz.");
    }
    
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log("\x1b[32m[FASE 3]: Esquema sincronizado. Tu Legado está actualizado.\x1b[0m");

    // --- FASE 4: SEEDING CEO ---
    console.log("\x1b[36m[FASE 4]: Validando Acceso CEO Maestro...\x1b[0m");
    const seedCEO = `
      INSERT INTO users (email, password, role, status, bio) 
      VALUES ('ceo@luminaflex.mx', 'Aurum_741_Master', 'CEO', 'Online', 'Fundador de Tu Legado Visual.')
      ON CONFLICT (email) DO UPDATE SET 
        role = 'CEO',
        status = 'Online',
        updated_at = CURRENT_TIMESTAMP;
    `;
    await client.query(seedCEO);
    console.log("\x1b[32m[FASE 4]: Credenciales maestras sincronizadas.\x1b[0m");

    console.log("\x1b[35m%s\x1b[0m", "======================================================");
    console.log("\x1b[35m%s\x1b[0m", "   SINCRONIZACIÓN EXITOSA | TU NODO ESTÁ ONLINE       ");
    console.log("\x1b[35m%s\x1b[0m", "======================================================");

  } catch (err) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error("\x1b[31m[FALLO CRÍTICO]: Error en el Nodo de Sincronización:\x1b[0m");
    console.error(err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
};

syncDatabase();
