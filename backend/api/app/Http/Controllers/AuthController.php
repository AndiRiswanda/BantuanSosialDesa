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
        ]);

        $donatur = Donatur::where('email', $request->email)->first();

        if (!$donatur || !Hash::check($request->password, $donatur->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
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
        ]);

        $penerima = Penerima::where('no_kk', $request->no_kk)->first();

        if (!$penerima || !Hash::check($request->password, $penerima->password)) {
            throw ValidationException::withMessages([
                'no_kk' => ['The provided credentials are incorrect.'],
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
        ]);

        $admin = UserAdmin::where('email', $request->email)->first();

        if (!$admin || !Hash::check($request->password, $admin->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
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
