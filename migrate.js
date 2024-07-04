import db from "./database/config/Database.js";
//import LogMigration from "./database/migrations/LogMigration.js";


async function runMigrations() {
    try {
        // Ejecuta las migraciones
        //await LogMigration.up(db.getQueryInterface(), Sequelize);
        console.log("Migraciones completadas exitosamente.");
    } catch (error) {
        console.error("Ocurrió un error durante las migraciones:", error);
    } finally {
        // Cierra la conexión con la base de datos
        await db.close();
    }
}

runMigrations();
