    tauri::Builder::default()
        // .menu(menu)
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(
                    "sqlite:inventory_system.db",
                    vec![
                        Migration {
                            version: 1,
                            description: "create users",
                            sql: include_str!("../migrations/1.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 2,
                            description: "create inventory & inventory history ",
                            sql: include_str!("../migrations/2.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 3,
                            description: "create transactions & transaction details",
                            sql: include_str!("../migrations/3.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 4,
                            description: "added VAT on transaction columns",
                            sql: include_str!("../migrations/4.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 5,
                            description: "added location on inventory table",
                            sql: include_str!("../migrations/5.sql"),
                            kind: MigrationKind::Up,
                        },
                        Migration {
                            version: 6,
                            description: "added location on inventory login table",
                            sql: include_str!("../migrations/6.sql"),
                            kind: MigrationKind::Up,
                        },
                    ],
                )
                .build(),
        )
        .invoke_handler(tauri::generate_handler![export_xls])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");