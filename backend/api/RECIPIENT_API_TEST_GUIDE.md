# Quick API Test Guide - Recipient Endpoints

## Prerequisites
1. Database sudah di-seed dengan data dummy
2. Laravel server running (`php artisan serve`)
3. Tool testing: Postman, Insomnia, atau curl

## Step 1: Login
```bash
POST http://localhost:8000/api/login/recipient
Content-Type: application/json

{
  "no_kk": "3601012501250001",
  "password": "penerima123"
}
```

**Expected Response:**
```json
{
  "token": "1|xxxxxxxxxxxxxxxxxxxxx",
  "user": {
    "id": 1,
    "no_kk": "3601012501250001",
    "nama_kepala": "Ahmad Dahlan"
  },
  "role": "penerima"
}
```

**Action:** Copy token untuk digunakan di request berikutnya

---

## Step 2: Test Dashboard
```bash
GET http://localhost:8000/api/recipient/dashboard
Authorization: Bearer {your_token}
```

**Expected:** 
- ✅ User info
- ✅ Stats (total_programs, approved_programs, dll)
- ✅ Recent programs (array dengan max 5 items)

---

## Step 3: Test Programs List
```bash
# All programs
GET http://localhost:8000/api/recipient/programs
Authorization: Bearer {your_token}

# With filters
GET http://localhost:8000/api/recipient/programs?jenis=barang&per_page=15
Authorization: Bearer {your_token}

# With search
GET http://localhost:8000/api/recipient/programs?search=sembako
Authorization: Bearer {your_token}
```

**Expected:**
- ✅ Array of programs
- ✅ Pagination metadata
- ✅ Field 'received' true/false

---

## Step 4: Test Program Detail
```bash
GET http://localhost:8000/api/recipient/programs/1
Authorization: Bearer {your_token}
```

**Expected:**
- ✅ Complete program info
- ✅ Donor details
- ✅ Category details
- ✅ my_application (if user applied)
- ✅ schedule array
- ✅ can_apply flag

---

## Step 5: Test Applications
```bash
# All applications
GET http://localhost:8000/api/recipient/applications
Authorization: Bearer {your_token}

# Filter by status
GET http://localhost:8000/api/recipient/applications?status=disetujui
Authorization: Bearer {your_token}
```

**Expected:**
- ✅ Array of user's applications
- ✅ Latest transaction info
- ✅ Progress calculation
- ✅ Pagination

---

## Step 6: Test Profile
```bash
GET http://localhost:8000/api/recipient/profile
Authorization: Bearer {your_token}
```

**Expected:**
- ✅ Complete profile info
- ✅ program_stats object
- ✅ programs array
- ✅ documents array with URLs

---

## Step 7: Test Schedules (All)
```bash
GET http://localhost:8000/api/recipient/schedules
Authorization: Bearer {your_token}
```

**Expected:**
- ✅ Array of all schedules
- ✅ Program info for each schedule
- ✅ Formatted dates and amounts
- ✅ Pagination

---

## Step 8: Test Program Schedules
```bash
# Replace {id} with actual program ID that user is recipient of
GET http://localhost:8000/api/recipient/programs/1/schedules
Authorization: Bearer {your_token}
```

**Expected:**
- ✅ Array of schedules for specific program
- ✅ Detailed transaction info
- ✅ No pagination (returns all)

---

## Step 9: Test Apply Program
```bash
# Try to apply to a new program (program ID 3 or higher if not yet applied)
POST http://localhost:8000/api/recipient/programs/3/apply
Authorization: Bearer {your_token}
Content-Type: application/json

{}
```

**Expected Success:**
```json
{
  "success": true,
  "message": "Pengajuan berhasil dikirim. Mohon tunggu verifikasi admin.",
  "data": {
    "id": 124,
    "status_penerimaan": "menunggu"
  }
}
```

**Expected Error (if already applied):**
```json
{
  "success": false,
  "message": "Anda sudah mendaftar program ini"
}
```

---

## Step 10: Test Update Profile
```bash
PUT http://localhost:8000/api/recipient/profile
Authorization: Bearer {your_token}
Content-Type: application/json

{
  "nama_kepala": "Ahmad Dahlan Updated",
  "nomor_telepon": "081234567890",
  "jumlah_tanggungan": 4
}
```

**Expected:**
- ✅ Updated profile data
- ✅ All fields preserved

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```
**Fix:** Check token in Authorization header

### 403 Forbidden
```json
{
  "success": false,
  "message": "Anda harus diverifikasi terlebih dahulu..."
}
```
**Fix:** User must be verified (status_verifikasi = 'disetujui')

### 404 Not Found
```json
{
  "message": "No query results for model..."
}
```
**Fix:** Check if ID exists in database

---

## Checklist Testing

- [ ] Login berhasil dan dapat token
- [ ] Dashboard menampilkan data real
- [ ] Programs list dengan pagination
- [ ] Programs filter by jenis works
- [ ] Programs search works
- [ ] Program detail lengkap
- [ ] Applications list dengan status
- [ ] Profile dengan documents
- [ ] Schedules (all) dengan pagination
- [ ] Program schedules
- [ ] Apply program berhasil
- [ ] Apply program validate duplicate
- [ ] Update profile berhasil

---

## Test Users Available

| No. KK | Nama | Password | Status |
|--------|------|----------|--------|
| 3601012501250001 | Ahmad Dahlan | penerima123 | disetujui |
| 3601012501250002 | Siti Aminah | penerima123 | disetujui |
| 3601012501250003 | Budi Santoso | penerima123 | disetujui |
| 3601012501250009 | Rina Susanti | penerima123 | pending |

**Note:** User dengan status 'pending' tidak bisa apply program

---

## Postman Collection

Jika menggunakan Postman, buat collection dengan struktur:
```
Recipient API
├── Auth
│   └── Login Recipient
├── Dashboard
│   └── Get Dashboard
├── Programs
│   ├── Get All Programs
│   ├── Get Programs (Filtered)
│   ├── Get Program Detail
│   └── Apply Program
├── Applications
│   └── Get Applications
├── Profile
│   ├── Get Profile
│   └── Update Profile
└── Schedules
    ├── Get All Schedules
    └── Get Program Schedules
```

Gunakan environment variable:
- `base_url`: http://localhost:8000
- `token`: (set setelah login)

---

## Troubleshooting

### Error: "SQLSTATE[HY000] [1045] Access denied"
- Check database config di `.env`
- Pastikan MySQL running

### Error: "Route [login] not defined"
- Middleware redirect ke login
- Pastikan token valid dan tidak expired

### Empty data returned
- Pastikan database sudah di-seed
- Check dengan: `SELECT * FROM penerima;` di MySQL

### Token expired
- Login ulang untuk mendapatkan token baru
- Token Sanctum default tidak expired, tapi bisa di-set di config

---

## Success Criteria

✅ Semua endpoint return status 200 (OK) atau 201 (Created)
✅ Data sesuai dengan yang ada di database dummy
✅ Pagination berfungsi dengan benar
✅ Filter dan search memberikan hasil yang benar
✅ Validation error memberikan pesan yang jelas
✅ Response format konsisten
