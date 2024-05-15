// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Migration, MigrationKind};

const MIGRATION_CUSTOMERS_TABLE: Migration = Migration {
    version: 1,
    description: "create_customers_table",
    sql: "CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      registeredAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      companyName TEXT,
      email TEXT,
      phone TEXT,
      address TEXT,
      description TEXT,
      isDeleted INTEGER DEFAULT 0
    )",
    kind: MigrationKind::Up,
};

const MIGRATION_SERVICES_TABLE: Migration = Migration {
    version: 2,
    description: "create_services_table",
    sql: "CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerId INTEGER,
      technicianIds INTEGER,
      vehicleIds INTEGER,
      serviceOperationIds TEXT,
      totalCost REAL,
      note TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      createdBy TEXT,
      isDeleted INTEGER DEFAULT 0
    )",
    kind: MigrationKind::Up,
};

const MIGRATION_VEHICLES_TABLE: Migration = Migration {
  version: 3,
  description: "create_vehicles_table",
  sql: "CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    registeredAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    make TEXT,
    model TEXT,
    plateNumber TEXT,
    year INTEGER,
    color TEXT,
    description TEXT,
    mileage INTEGER,
    isDeleted INTEGER DEFAULT 0
  )",
  kind: MigrationKind::Up,
};

const MIGRATION_TECHNICIANS_TABLE: Migration = Migration {
  version: 4,
  description: "create_technicians_table",
  sql: "CREATE TABLE IF NOT EXISTS technicians (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isDeleted INTEGER DEFAULT 0
  )", 
  kind: MigrationKind::Up,
};

const MIGRATION_SERVICE_TYPES_TABLE: Migration = Migration {
  version: 5,
  description: "create_service_types_table",
  sql: "CREATE TABLE IF NOT EXISTS service_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdBy TEXT,
    isDeleted INTEGER DEFAULT 0
  )",
  kind: MigrationKind::Up,
};

// const MIGRATION_SERVICE_OPERATIONS_TABLE: Migration = Migration {
//   version: 6,
//   description: "create_service_operations_table",
//   sql: "CREATE TABLE IF NOT EXISTS service_operations (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     serviceTypeId INTEGER NOT NULL,
//     name TEXT NOT NULL,
//     createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     createdBy TEXT,
//     isDeleted INTEGER DEFAULT 0
//   )",
//   kind: MigrationKind::Up,
// };

const MIGRATION_SERVICE_LOGIN_TABLE: Migration = Migration {
     version: 6,
     description: "create_service_operations_table",
     sql: "CREATE TABLE IF NOT EXISTS userlogin(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT
     )",
     kind: MigrationKind::Up,
    };
     



fn main() {
  let migrations: Vec<Migration> = vec![
        // Define your migrations here
        MIGRATION_CUSTOMERS_TABLE,
        MIGRATION_SERVICES_TABLE,
        MIGRATION_VEHICLES_TABLE,
        MIGRATION_TECHNICIANS_TABLE,
        MIGRATION_SERVICE_TYPES_TABLE,
        MIGRATION_SERVICE_LOGIN_TABLE
        //MIGRATION_SERVICE_OPERATIONS_TABLE,
    ];
  tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::default()
    .add_migrations("sqlite:auto-repair-shop.db", migrations)
    .build())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
