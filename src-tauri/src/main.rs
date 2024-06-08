// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Migration, MigrationKind};
use tauri_plugin_shell::init as shell_init;

const MIGRATION_CUSTOMER_TABLE: Migration = Migration {
    version: 1,
    description: "create_customers_table",
    sql: "CREATE TABLE IF NOT EXISTS Customer (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
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

const MIGRATION_VEHICLE_TABLE: Migration = Migration {
  version: 2,
  description: "create_vehicles_table",
  sql: "CREATE TABLE IF NOT EXISTS Vehicle (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    registeredAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    make TEXT,
    model TEXT,
    vin TEXT UNIQUE,
    year INTEGER,
    plateNumber TEXT UNIQUE,
    color TEXT,
    description TEXT,
    mileage INTEGER,
    isDeleted INTEGER DEFAULT 0,
    FOREIGN KEY (customer_id) REFERENCES Customer(id)
  )",
  kind: MigrationKind::Up,
};

const MIGRATION_SERVICE_TABLE: Migration = Migration {
    version: 3,
    description: "create_services_table",
    sql: "CREATE TABLE IF NOT EXISTS Service (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle_id INTEGER,
      technician_id INTEGER,
      total_cost REAL,
      note TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      createdBy TEXT,
      completedAt TEXT,
      isDeleted INTEGER DEFAULT 0,
      FOREIGN KEY (vehicle_id) REFERENCES Vehicle(id),
      FOREIGN KEY (technician_id) REFERENCES Technician(id)
    )",
    kind: MigrationKind::Up,
};



const MIGRATION_TECHNICIAN_TABLE: Migration = Migration {
  version: 4,
  description: "create_technicians_table",
  sql: "CREATE TABLE IF NOT EXISTS Technician (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    specialty TEXT,
    registeredAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isDeleted INTEGER DEFAULT 0
  )", 
  kind: MigrationKind::Up,
};

const MIGRATION_SERVICE_TYPE_TABLE: Migration = Migration {
  version: 5,
  description: "create_service_types_table",
  sql: "CREATE TABLE IF NOT EXISTS ServiceType (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    createdBy TEXT,
    isDeleted INTEGER DEFAULT 0
  )",
  kind: MigrationKind::Up,
};

const MIGRATION_SERVICE_OPERATION_TABLE: Migration = Migration {
  version: 6,
  description: "create_service_operations_table",
  sql: "CREATE TABLE IF NOT EXISTS ServiceOperation (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    service_id INTEGER,
    service_type_id INTEGER,
    quantity INTEGER DEFAULT 1,
    note TEXT,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    isDeleted INTEGER DEFAULT 0,
    FOREIGN KEY (service_id) REFERENCES Service(id),
    FOREIGN KEY (service_type_id) REFERENCES ServiceType(id)
  )",
  kind: MigrationKind::Up,
};

const MIGRATION_AUTH_USER_TABLE: Migration = Migration {
     version: 7,
     description: "create_auth_user_table",
     sql: "CREATE TABLE IF NOT EXISTS AuthUser (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      password TEXT
     )",
     kind: MigrationKind::Up,
    };
     
const MIGRATION_INSERT_DEFAULT_USERS: Migration = Migration {
  version: 8,
  description: "insert_default_users",
  sql: "INSERT INTO AuthUser (username, password) VALUES ('admin', 'admin'), ('test', 'test')",
  kind: MigrationKind::Up,
};



fn main() {
  let migrations: Vec<Migration> = vec![
        // Define your migrations here
        MIGRATION_CUSTOMER_TABLE,
        MIGRATION_SERVICE_TABLE,
        MIGRATION_VEHICLE_TABLE,
        MIGRATION_TECHNICIAN_TABLE,
        MIGRATION_SERVICE_TYPE_TABLE,
        MIGRATION_SERVICE_OPERATION_TABLE,
        MIGRATION_AUTH_USER_TABLE,
        MIGRATION_INSERT_DEFAULT_USERS
    ];
  tauri::Builder::default()
    .plugin(tauri_plugin_sql::Builder::default()
    .add_migrations("sqlite:auto-repair-shop.db", migrations)
    .build())
    .plugin(shell_init())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
