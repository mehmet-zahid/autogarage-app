# add this to tauri.conf.json for macos build
`
"macOS": {
        "category": "public.app-category.developer-tools",
        "entitlements": "entitlements.mac.inherit.plist",
        "entitlementsInherit": "entitlements.mac.inherit.plist",
        "exceptionDomain": "",
        "hardenedRuntime": true,
        "provisioningProfile": "",
        "signingIdentity": "Developer ID Application: Your Name (TeamID)"
      }
`
# TO DO (* -> not immidate, ** -> immidiate, *** -> very immidate)

## Reporting (Pdf, Excel) 
**printpdf = "0.7.0" at cargo side (rust crate)
  [x] Pdf Report Generation (*)
  [x] Excel Report Generation (*)
  [x] Report Filters (*)
  [x] Report Export (*)

## User Management (The only user is the admin, the admin can add new users, and the new users can only view the reports and not add new users.)
  [x] Adding New Users (***)
  [x] Removing Users (***)
  [x] User Roles (*)

## Audit Log Collection
  [x] User Login Logs (*)
  [x] User Logout Logs (*)
  [x] User Action Logs(*)

## License Management Improvement
  [x] License Expiry Notification (*)
  [x] License Renewal (*)
  [x] License Deactivation (*)

## Dashboard
  [x] Dashboard (*)
    - Which data to show on the dashboard
  [x] Dashboard Filters (*)
  [x] Dashboard Graphs (*)