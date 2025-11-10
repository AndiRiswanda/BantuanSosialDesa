# Integrasi Backend Laravel dengan Frontend React

## Struktur Proyek
```
BantuanSosialDesa/
├── backend/
│   └── api/           # Laravel backend
├── src/               # React frontend
├── vite.config.js     # Vite config dengan proxy
└── .env               # Environment variables
```

## Setup Backend (Laravel)

### 1. Masuk ke direktori backend
```bash
cd backend/api
```

### 2. Install dependencies
```bash
composer install
```

### 3. Setup .env
```bash
copy .env.example .env
```

Edit `.env` dan sesuaikan konfigurasi database:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bantuan_sosial_desa
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Generate application key
```bash
php artisan key:generate
```

### 5. Run migrations
```bash
php artisan migrate
```

### 6. Install Laravel Sanctum (untuk authentication)
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 7. Jalankan Laravel server
```bash
php artisan serve
```

Laravel akan berjalan di `http://localhost:8000`

## Setup Frontend (React)

### 1. Kembali ke root directory
```bash
cd ../..
```

### 2. Install dependencies
```bash
npm install
```

### 3. Jalankan development server
```bash
npm run dev
```

React akan berjalan di `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/login` - Login donor/recipient
- `POST /api/register/donor` - Register donor
- `POST /api/register/recipient` - Register recipient
- `POST /api/admin/login` - Admin login
- `POST /api/logout` - Logout

### Donor (Protected)
- `GET /api/donor/dashboard` - Dashboard data
- `GET /api/donor/programs` - List programs
- `GET /api/donor/programs/{id}` - Program detail
- `POST /api/donor/donations` - Create donation
- `GET /api/donor/donations` - List donations
- `GET /api/donor/profile` - Get profile
- `PUT /api/donor/profile` - Update profile

### Recipient (Protected)
- `GET /api/recipient/dashboard` - Dashboard data
- `GET /api/recipient/programs` - List programs
- `GET /api/recipient/programs/{id}` - Program detail
- `POST /api/recipient/applications` - Create application
- `GET /api/recipient/applications` - List applications
- `GET /api/recipient/profile` - Get profile
- `PUT /api/recipient/profile` - Update profile

### Admin (Protected)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/programs` - Manage programs
- `GET /api/admin/donations` - Manage donations
- `GET /api/admin/distributions` - Manage distributions
- `GET /api/admin/verifications` - Verification dashboard
- `GET /api/admin/donors` - Manage donors
- `GET /api/admin/recipients` - Manage recipients

### Public
- `GET /api/programs` - List programs
- `GET /api/programs/{id}` - Program detail
- `POST /api/pengaduan` - Submit complaint

## Penggunaan API di Frontend

Import API utilities:
```javascript
import { authAPI, donorAPI, recipientAPI, adminAPI, publicAPI } from './utils/api';
```

### Contoh Login
```javascript
import { authAPI, setAuthToken, setUser } from './utils/api';

const handleLogin = async (email, password) => {
  try {
    const response = await authAPI.login({ email, password });
    setAuthToken(response.token);
    setUser(response.user);
    // Redirect based on user type
    if (response.type === 'donor') {
      navigate('/donor/dashboard');
    } else if (response.type === 'recipient') {
      navigate('/penerima/dashboard');
    }
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

### Contoh Get Data
```javascript
import { donorAPI } from './utils/api';

const fetchDashboard = async () => {
  try {
    const data = await donorAPI.getDashboard();
    console.log(data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

### Contoh Submit Data
```javascript
import { donorAPI } from './utils/api';

const handleDonation = async (donationData) => {
  try {
    const response = await donorAPI.createDonation(donationData);
    console.log('Donation created:', response);
  } catch (error) {
    console.error('Error:', error.message);
  }
};
```

## CORS Configuration

CORS sudah dikonfigurasi di Laravel (`backend/api/config/cors.php`) untuk menerima request dari:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (alternative port)

## Development Workflow

1. Jalankan Laravel backend:
   ```bash
   cd backend/api
   php artisan serve
   ```

2. Di terminal lain, jalankan React frontend:
   ```bash
   npm run dev
   ```

3. Akses aplikasi di browser: `http://localhost:5173`

4. API requests akan otomatis di-proxy ke Laravel backend di `http://localhost:8000`

## Troubleshooting

### CORS Error
Pastikan:
- Laravel Sanctum sudah terinstall
- CORS config di `backend/api/config/cors.php` sudah benar
- Frontend origin sudah ditambahkan di `allowed_origins`

### Authentication Error
Pastikan:
- Token disimpan di localStorage setelah login
- Token dikirim di header `Authorization: Bearer {token}`
- User sudah login sebelum mengakses protected routes

### 404 Not Found
Pastikan:
- Laravel server berjalan di `http://localhost:8000`
- API routes sudah didefinisikan di `backend/api/routes/api.php`
- Proxy di `vite.config.js` sudah benar

## Notes

- Semua endpoint API diawali dengan `/api`
- Protected routes memerlukan authentication token
- Token disimpan di localStorage dengan key `auth_token`
- User data disimpan di localStorage dengan key `user`
