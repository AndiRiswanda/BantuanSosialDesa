# Laravel backend stubs (migrations + models)

This folder contains Laravel-ready migrations and Eloquent models for the Bantuan Sosial Desa backend. Drop these into a fresh Laravel project to get a working schema with ORM relationships.

## How to use

1) Create a Laravel app (if you don't have one yet)
```powershell
# Requires PHP + Composer installed
composer create-project laravel/laravel backend
```

2) Configure database
- In `backend/.env`, set your MySQL connection:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bantuan_sosial_desa
DB_USERNAME=your_user
DB_PASSWORD=your_password
```

3) Copy files
- Copy all files from `backend/laravel-stubs/database/migrations` -> `backend/database/migrations/`
- Copy all files from `backend/laravel-stubs/app/Models` -> `backend/app/Models/`

4) Run migrations
```powershell
cd backend
php artisan migrate
```

5) (Optional) Seeders/factories
- You can add seeders later based on your needs. The schema includes timestamps and constraints ready for production use.

## Entities covered
- Admin (`user_admin`) – backoffice admin users.
- Donor (`donatur`) – organizations/individuals donating.
- Recipient (`penerima`) – beneficiary households + uploaded verification documents.
- Category (`kategori_bantuan`) – aid categories.
- Program (`program_bantuan`) – programs created by donors under a category.
- Criteria (`kriteria_penerima`) – eligibility thresholds per program.
- RecipientProgram (`penerima_program`) – assignments of recipients to programs (with `created_by` admin).
- Schedule (`jadwal_penyaluran`) – distribution schedules per program.
- Distribution (`transaksi_penyaluran`) – actual disbursement per recipient-program (with verification by admin).
- Donation (`donasi`) – donor donations per program (with verification by admin).
- TransparencyReport (`laporan_transparansi`) – program transparency posts (by admin).
- Complaint (`pengaduan`) – complaints from recipients or donors.

## Notes
- Models set explicit `$table` and `$primaryKey` to match the snake_case tables.
- All tables use `created_at`/`updated_at` timestamps compatible with Eloquent.
- Enums are implemented using MySQL enum types; adjust to string+check if you prefer.
- Foreign keys mirror the domain: deletes are mostly RESTRICT (except where nullable makes sense).
