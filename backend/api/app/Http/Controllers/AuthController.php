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
                'email' => ['Email tidak terdaftar sebagai donatur.'],
            ]);
        }

        if (!Hash::check($request->password, $donatur->password)) {
            throw ValidationException::withMessages([
                'password' => ['Username/Password yang Anda masukkan salah.'],
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
            'no_kk' => 'required',
            'password' => 'required',
        ], [
            'no_kk.required' => 'Nomor KK harus diisi.',
            'password.required' => 'Password harus diisi.',
        ]);

        $penerima = Penerima::where('no_kk', $request->no_kk)->first();

        if (!$penerima) {
            throw ValidationException::withMessages([
                'no_kk' => ['Nomor KK tidak terdaftar sebagai penerima bantuan.'],
            ]);
        }

        if (!Hash::check($request->password, $penerima->password)) {
            throw ValidationException::withMessages([
                'password' => ['Username/Password yang Anda masukkan salah.'],
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
            'nama_organisasi' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:donatur',
            'password' => 'required|string|min:8|confirmed',
            'nomor_telepon' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
            'jenis_instansi' => 'required|in:perusahaan,yayasan,perorangan',
        ], [
            'nama_organisasi.required' => 'Nama organisasi harus diisi.',
            'nama_organisasi.max' => 'Nama organisasi maksimal 100 karakter.',
            'email.required' => 'Email harus diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.unique' => 'Email sudah terdaftar. Silakan gunakan email lain.',
            'password.required' => 'Password harus diisi.',
            'password.min' => 'Password minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'nomor_telepon.max' => 'Nomor telepon maksimal 15 karakter.',
            'jenis_instansi.required' => 'Jenis instansi harus dipilih.',
            'jenis_instansi.in' => 'Jenis instansi harus salah satu dari: perusahaan, yayasan, perorangan.',
        ]);

        $donatur = Donatur::create([
            'nama_organisasi' => $request->nama_organisasi,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'nomor_telepon' => $request->nomor_telepon,
            'alamat' => $request->alamat,
            'jenis_instansi' => $request->jenis_instansi,
            'status' => 'aktif',
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
            'no_kk' => 'required|string|max:20|unique:penerima',
            'password' => 'required|string|min:8|confirmed',
            'nama_kepala' => 'required|string|max:100',
            'nomor_telepon' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
            'pekerjaan' => 'nullable|string|max:100',
            'pekerjaan_istri' => 'nullable|in:ibu rumah tangga,bekerja & berpenghasilan,belum menikah,kepala keluarga',
            'status_anak' => 'nullable|in:belum punya,bayi,sekolah,bekerja,tidak bekerja',
            'jumlah_tanggungan' => 'required|integer|min:0',
            'penghasilan' => 'nullable|in:< 500.000,500.000 - 1.000.000,1.000.001 - 2.000.000,2.000.001 - 3.000.000,> 3.000.000',
        ], [
            'no_kk.required' => 'Nomor KK harus diisi.',
            'no_kk.unique' => 'Nomor KK sudah terdaftar. Silakan hubungi admin jika ada masalah.',
            'no_kk.max' => 'Nomor KK maksimal 20 karakter.',
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
            'status_verifikasi' => 'pending',
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
                'password' => ['Username/Password yang Anda masukkan salah.'],
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
            'message' => 'Logged out successfully',
        ]);
    }
}
