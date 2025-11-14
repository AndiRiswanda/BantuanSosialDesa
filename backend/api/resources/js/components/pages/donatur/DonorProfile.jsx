import React, { useState, useEffect } from "react";
import NavbarDonatur from "../../layout/NavbarDonatur";
import { ArrowLeft, Building2, ShieldCheck, LogOut, User, Mail, Phone, MapPin, Layers, Pencil } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../services/api";

function StatBox({ label, value }) {
	return (
		<div className="flex-1 rounded-xl bg-white border border-slate-200 shadow-sm p-4 text-center">
			<div className="text-[#0B2B5E] font-semibold text-sm">{label}</div>
			<div className="mt-1 text-xl font-extrabold text-slate-800">{value}</div>
		</div>
	);
}

function LogoutConfirmModal({ onClose, onConfirm }) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />
			<div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-[#E8F1FF] p-5 shadow-xl">
				<div className="text-sm font-semibold text-[#0B2B5E]">Konfirmasi Keluar Akun</div>
				<p className="mt-2 text-sm text-slate-700">
					Apakah Anda yakin ingin keluar dari akun ini? Semua sesi aktif akan ditutup dan Anda harus login kembali untuk mengakses sistem.
				</p>
				<div className="mt-4 flex justify-end gap-2">
					<button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Batal</button>
					<button onClick={onConfirm} className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white">Keluar</button>
				</div>
			</div>
		</div>
	);
}

export default function DonorProfile() {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const { logout } = useAuth();
	const [showLogout, setShowLogout] = useState(false);
	const [profileData, setProfileData] = useState(null);
	const [dashboardStats, setDashboardStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				console.log('=== Fetching Profile Data ===');
				console.log('Token:', localStorage.getItem('token'));
				console.log('User from localStorage:', localStorage.getItem('user'));
				
				// Fetch profile data
				const profileResponse = await api.get('/api/donatur/profile');
				console.log('Profile Response:', profileResponse);
				console.log('Profile Data:', profileResponse.data);
				setProfileData(profileResponse.data);
				console.log('Profile Data SET!');
				
				// Fetch dashboard stats
				const dashboardResponse = await api.get('/api/donatur/dashboard');
				console.log('Dashboard Response:', dashboardResponse);
				console.log('Dashboard Data:', dashboardResponse.data);
				console.log('Stats:', dashboardResponse.data.stats);
				// Dashboard response has stats nested in .stats
				const stats = dashboardResponse.data.stats || dashboardResponse.data;
				console.log('=== STATS DETAIL ===');
				console.log('total_bantuan_uang:', stats.total_bantuan_uang);
				console.log('total_bantuan_barang:', stats.total_bantuan_barang);
				console.log('total_programs:', stats.total_programs);
				console.log('total_penerima:', stats.total_penerima);
				setDashboardStats(stats);
				console.log('Dashboard Stats SET:', stats);
			} catch (err) {
				console.error('=== Error fetching profile ===');
				console.error('Error object:', err);
				console.error('Error response:', err.response);
				console.error('Error message:', err.message);
				setError(err.message || 'Gagal memuat data');
			} finally {
				setLoading(false);
			}
		};
		
		fetchData();
	}, []);

	const handleLogout = async () => {
		await logout();
		navigate('/login/donatur');
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-white">
				<NavbarDonatur />
				<div className="flex items-center justify-center min-h-[60vh]">
					<div className="text-center">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
						<p className="mt-4 text-slate-600">Memuat data profil...</p>
					</div>
				</div>
			</div>
		);
	}

	console.log('=== RENDERING PROFILE ===');
	console.log('profileData:', profileData);
	console.log('dashboardStats:', dashboardStats);
	console.log('nama_organisasi:', profileData?.nama_organisasi);
	console.log('email:', profileData?.email);

	return (
		<div className="min-h-screen bg-white">
			<NavbarDonatur />

			{/* Back breadcrumb */}
			<div className="bg-[#1976d26c]/30">
				<div className="max-w-6xl mx-auto px-3 py-2 text-sm text-[#0B2B5E] flex items-center gap-2">
					<button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 hover:text-green-700">
						<ArrowLeft className="w-4 h-4" />
						<span>Profil</span>
					</button>
				</div>
			</div>

			<div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[240px,1fr] gap-4">
				{/* Left actions card */}
						<div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-2 h-fit">
							<Link
								to="/donatur/profil"
								aria-current={pathname === "/donatur/profil" ? "page" : undefined}
								className={`w-full inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
									pathname === "/donatur/profil"
										? "bg-green-600 text-white border-green-600 shadow"
										: "bg-white text-[#0B2B5E] border-green-600 hover:bg-green-50"
								}`}
							>
						<User className="w-4 h-4"/> Data Profil
					</Link>
							<Link
								to="/donatur/profil/edit"
								aria-current={pathname === "/donatur/profil/edit" ? "page" : undefined}
								className={`w-full inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
									pathname === "/donatur/profil/edit"
										? "bg-green-600 text-white border-green-600 shadow"
										: "bg-white text-[#0B2B5E] border-green-600 hover:bg-green-50"
								}`}
							>
						<Pencil className="w-4 h-4"/> Edit Data Profil
					</Link>
					<button
						onClick={() => setShowLogout(true)}
						className="w-full inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
					>
						<LogOut className="w-4 h-4"/> Keluar
					</button>
				</div>

				{/* Main */}
				<div className="space-y-4">
					{/* Header card */}
					<div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-4 text-white shadow">
						<div className="flex items-center gap-4">
							<div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-lg font-extrabold">
								{profileData?.nama_organisasi?.substring(0, 3).toUpperCase() || 'DO'}
							</div>
							<div className="flex-1">
								<div className="text-lg md:text-xl font-extrabold">{profileData?.nama_organisasi || 'Nama Organisasi'}</div>
								<div className="mt-1 flex flex-wrap items-center gap-2 text-xs md:text-sm">
									<span className="inline-flex items-center gap-1 rounded bg-white/20 px-2 py-0.5">
										<ShieldCheck className="w-3.5 h-3.5"/> 
										{profileData?.jenis_instansi ? 
											profileData.jenis_instansi.charAt(0).toUpperCase() + profileData.jenis_instansi.slice(1) 
											: 'N/A'}
									</span>
									<span>{profileData?.alamat || 'Alamat tidak tersedia'}</span>
									<span>{profileData?.nomor_telepon || '-'}</span>
								</div>
							</div>
						</div>
						<div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
							<StatBox 
								label="Program Bantuan" 
								value={dashboardStats?.total_programs || 0} 
							/>
							<div className="flex-1 rounded-xl bg-white border border-slate-200 shadow-sm p-4 text-center">
								<div className="text-[#0B2B5E] font-semibold text-sm">Total Donasi</div>
								<div className="mt-1">
									<div className="text-xl font-extrabold text-slate-800">
										{dashboardStats?.total_bantuan_uang ? 
											`Rp ${parseInt(dashboardStats.total_bantuan_uang).toLocaleString('id-ID')}` 
											: 'Rp 0'}
									</div>
									{dashboardStats?.total_bantuan_barang > 0 && (
										<div className="text-sm font-semibold text-green-700 mt-0.5">
											+ {parseInt(dashboardStats.total_bantuan_barang).toLocaleString('id-ID')} unit
										</div>
									)}
								</div>
							</div>
							<StatBox 
								label="Penerima Terbantu" 
								value={dashboardStats?.total_penerima || 0} 
							/>
						</div>
					</div>

					{/* Data Donatur */}
					<div className="rounded-2xl border border-green-200 shadow-sm">
						<div className="px-4 py-2 border-b border-green-200 font-semibold text-[#0B2B5E]">Data Donatur</div>
						<div className="p-4 grid gap-3">
							{[{
								label: "Nama Instansi", 
								value: profileData?.nama_organisasi || '-', 
								icon: Building2
							},{
								label: "Email Instansi", 
								value: profileData?.email || '-', 
								icon: Mail
							},{
								label: "Alamat Instansi", 
								value: profileData?.alamat || '-', 
								icon: MapPin
							},{
								label: "No. Telepon/WhatsApp", 
								value: profileData?.nomor_telepon || '-', 
								icon: Phone
							},{
								label: "Jenis Donatur", 
								value: profileData?.jenis_instansi ? 
									profileData.jenis_instansi.charAt(0).toUpperCase() + profileData.jenis_instansi.slice(1) 
									: '-', 
								icon: Layers
							}].map(({label, value, icon: Icon}) => (
								<div key={label} className="grid md:grid-cols-[220px,1fr] items-start gap-3">
									<div className="text-sm text-slate-600 flex items-center gap-2"><Icon className="w-4 h-4"/> {label}</div>
									<div className="rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-sm text-slate-700">{value}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{showLogout && (
				<LogoutConfirmModal onClose={() => setShowLogout(false)} onConfirm={handleLogout} />
			)}
		</div>
	);
}
