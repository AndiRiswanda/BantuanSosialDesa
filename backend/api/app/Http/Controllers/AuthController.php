<?php

namespace App\Http\Controllers;

use App\Models\Donatur;
use App\Models\Penerima;
use App\Models\UserAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function loginDonor(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Password harus diisi.',
        ]);

        $donatur = Donatur::where('email', $request->email)->first();

        if (!$donatur) {
            throw ValidationException::withMessages([
                'email' => ['Email tidak terdaftar.'],
            ]);
        }

        if (!Hash::check($request->password, $donatur->password)) {
            throw ValidationException::withMessages([
                'password' => ['Email/Password yang Anda masukkan salah.'],
            ]);
        }

        $token = $donatur->createToken('donor-token')->plainTextToken;

        return response()->json([
            'user' => $donatur,
            'token' => $token,
            'type' => 'donor',
        ]);
    }

    public function loginRecipient(Request $request)
    {
        $request->validate([
            'no_kk' => 'required|string|digits:16',
            'password' => 'required',
        ], [
            'no_kk.required' => 'Nomor KK harus diisi.',
            'no_kk.digits' => 'Nomor KK harus 16 digit.',
            'password.required' => 'Password harus diisi.',
        ]);

        $penerima = Penerima::where('no_kk', $request->no_kk)->first();

        if (!$penerima) {
            throw ValidationException::withMessages([
                'no_kk' => ['Nomor KK tidak terdaftar.'],
            ]);
        }

        if (!Hash::check($request->password, $penerima->password)) {
            throw ValidationException::withMessages([
                'password' => ['Nomor KK/Password yang Anda masukkan salah.'],
            ]);
        }

        $token = $penerima->createToken('recipient-token')->plainTextToken;

        return response()->json([
            'user' => $penerima,
            'token' => $token,
            'type' => 'recipient',
        ]);
    }

    public function registerDonor(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:donatur',
            'password' => 'required|string|min:8|confirmed',
            'nama_organisasi' => 'nullable|string|max:100',
            'nama_lengkap' => 'nullable|string|max:100',
            'nomor_telepon' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
        ], [
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar.',
            'password.required' => 'Password harus diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $donatur = Donatur::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'nama_organisasi' => $request->nama_organisasi,
            'nama_lengkap' => $request->nama_lengkap,
            'nomor_telepon' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'status_verifikasi' => 'pending',
        ]);

        $token = $donatur->createToken('donor-token')->plainTextToken;

        return response()->json([
            'user' => $donatur,
            'token' => $token,
            'type' => 'donor',
        ], 201);
    }

    public function registerRecipient(Request $request)
    {
        $request->validate([
            'no_kk' => 'required|string|digits:16|unique:penerima',
            'password' => 'required|string|min:8|confirmed',
            'nama_kepala' => 'required|string|max:100',
            'nomor_telepon' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
            'pekerjaan' => 'nullable|string|max:100',
            'pekerjaan_istri' => 'nullable|string|max:100',
            'status_anak' => 'nullable|string|max:100',
            'jumlah_tanggungan' => 'required|integer|min:0',
            'penghasilan' => 'nullable|string|max:100',
        ], [
            'no_kk.required' => 'Nomor KK harus diisi.',
            'no_kk.digits' => 'Nomor KK harus 16 digit.',
            'no_kk.unique' => 'Nomor KK sudah terdaftar. Silakan hubungi admin jika ada masalah.',
            'password.required' => 'Password harus diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'nama_kepala.required' => 'Nama kepala keluarga harus diisi.',
            'nama_kepala.max' => 'Nama kepala keluarga maksimal 100 karakter.',
            'nomor_telepon.max' => 'Nomor telepon maksimal 15 karakter.',
            'pekerjaan.max' => 'Pekerjaan maksimal 100 karakter.',
            'jumlah_tanggungan.required' => 'Jumlah tanggungan harus diisi.',
            'jumlah_tanggungan.integer' => 'Jumlah tanggungan harus berupa angka.',
            'jumlah_tanggungan.min' => 'Jumlah tanggungan minimal 0.',
        ]);

        $penerima = Penerima::create([
            'no_kk' => $request->no_kk,
            'password' => Hash::make($request->password),
            'nama_kepala' => $request->nama_kepala,
            'nomor_telepon' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'pekerjaan' => $request->pekerjaan,
            'pekerjaan_istri' => $request->pekerjaan_istri,
            'status_anak' => $request->status_anak,
            'jumlah_tanggungan' => $request->jumlah_tanggungan,
            'penghasilan' => $request->penghasilan,
            'status_verifikasi' => 'belum_mengajukan', // User baru belum mengajukan bantuan
        ]);

        $token = $penerima->createToken('recipient-token')->plainTextToken;

        return response()->json([
            'user' => $penerima,
            'token' => $token,
            'type' => 'recipient',
        ], 201);
    }

    public function adminLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ], [
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'password.required' => 'Password harus diisi.',
        ]);

        $admin = UserAdmin::where('email', $request->email)->first();

        if (!$admin) {
            throw ValidationException::withMessages([
                'email' => ['Email tidak terdaftar sebagai admin.'],
            ]);
        }

        if (!Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'password' => ['Email/Password yang Anda masukkan salah.'],
            ]);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'user' => $admin,
            'token' => $token,
            'type' => 'admin',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out',
        ]);
    }
}
