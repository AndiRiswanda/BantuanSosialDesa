import React, { useState, useEffect } from "react";
import NavbarDonor from "../../layout/NavbarDonor";
import { ArrowLeft, Building2, ShieldCheck, LogOut, User, Mail, Phone, MapPin, Layers, Pencil } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../../utils/api";

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
	const [showLogout, setShowLogout] = useState(false);
	const [profile, setProfile] = useState(null);
	const [stats, setStats] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				console.log("=== FETCHING PROFILE DATA ===");
				console.log("🔑 Auth Token:", localStorage.getItem('auth_token') ? 'EXISTS' : 'MISSING');
				
				// Fetch profile - api.get returns data directly
				console.log("⏳ Fetching profile...");
				const profileData = await api.get("/api/donatur/profile");
				console.log("✅ Profile Response:", profileData);
				setProfile(profileData);
				
				// Fetch dashboard stats - api.get returns data directly  
				console.log("⏳ Fetching dashboard...");
				const dashboardData = await api.get("/api/donatur/dashboard");
				console.log("✅ Dashboard Response received!");
				console.log("Type:", typeof dashboardData);
				console.log("Is null?", dashboardData === null);
				console.log("Is undefined?", dashboardData === undefined);
				console.log("Dashboard Data:", dashboardData);
				
				if (!dashboardData) {
					console.error("❌ Dashboard data is null/undefined!");
					setStats({
						total_bantuan_uang: 0,
						total_bantuan_barang: 0,
						total_penerima: 0,
						active_programs: 0,
					});
					return;
				}
				
				console.log("📊 Has stats property?", !!dashboardData.stats);
				console.log("📊 Stats Object:", dashboardData.stats || dashboardData);
				
				// Extract stats - handle both nested and flat response
				const statsData = dashboardData.stats || dashboardData;
				
				// Safely extract values with logging
				console.log("🔍 Extracting values:");
				console.log("💰 total_bantuan_uang:", statsData.total_bantuan_uang, typeof statsData.total_bantuan_uang);
				console.log("📦 total_bantuan_barang:", statsData.total_bantuan_barang, typeof statsData.total_bantuan_barang);
				console.log("👥 total_penerima:", statsData.total_penerima, typeof statsData.total_penerima);
				console.log("📋 active_programs:", statsData.active_programs, typeof statsData.active_programs);
				
				// Convert to numbers safely
				const processedStats = {
					total_bantuan_uang: Number(statsData.total_bantuan_uang) || 0,
					total_bantuan_barang: Number(statsData.total_bantuan_barang) || 0,
					total_penerima: Number(statsData.total_penerima) || 0,
					active_programs: Number(statsData.active_programs) || 0,
				};
				
				console.log("✨ Processed stats (after Number conversion):");
				console.log("💰 total_bantuan_uang (number):", processedStats.total_bantuan_uang, typeof processedStats.total_bantuan_uang);
				console.log("📦 total_bantuan_barang (number):", processedStats.total_bantuan_barang, typeof processedStats.total_bantuan_barang);
				console.log("👥 total_penerima (number):", processedStats.total_penerima, typeof processedStats.total_penerima);
				console.log("📋 active_programs (number):", processedStats.active_programs, typeof processedStats.active_programs);
				
				// Log formatted values
				console.log("💵 Formatted Uang:", formatCurrency(processedStats.total_bantuan_uang));
				console.log("📦 Formatted Barang:", processedStats.total_bantuan_barang.toLocaleString('id-ID') + " Unit");
				
				setStats(processedStats);
				console.log("✅ Stats SET to state!");
				console.log("Final stats in state:", processedStats);
			} catch (error) {
				console.log("=".repeat(50));
				console.error("❌❌❌ PROFILE FETCH ERROR!");
				console.log("=".repeat(50));
				console.error("Error:", error);
				console.error("Error message:", error.message);
				console.error("Error stack:", error.stack);
				if (error.response) {
					console.error("Response status:", error.response.status);
					console.error("Response data:", error.response.data);
				}
				console.log("=".repeat(50));
				
				// Set empty stats on error
				setStats({
					total_bantuan_uang: 0,
					total_bantuan_barang: 0,
					total_penerima: 0,
					active_programs: 0,
				});
			} finally {
				setLoading(false);
			}
		};
		
		fetchData();
	}, []);

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-white">
				<NavbarDonor />
				<div className="flex items-center justify-center min-h-[60vh]">
					<div className="text-center">
						<div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
						<p className="mt-4 text-slate-600">Memuat data...</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-white">
			<NavbarDonor />

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
								to="/donor/profil"
								aria-current={pathname === "/donor/profil" ? "page" : undefined}
								className={`w-full inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
									pathname === "/donor/profil"
										? "bg-green-600 text-white border-green-600 shadow"
										: "bg-white text-[#0B2B5E] border-green-600 hover:bg-green-50"
								}`}
							>
						<User className="w-4 h-4"/> Data Profil
					</Link>
							<Link
								to="/donor/profil/edit"
								aria-current={pathname === "/donor/profil/edit" ? "page" : undefined}
								className={`w-full inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
									pathname === "/donor/profil/edit"
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
								{profile?.nama_organisasi ? profile.nama_organisasi.substring(0, 3).toUpperCase() : 'DO'}
							</div>
							<div className="flex-1">
								<div className="text-lg md:text-xl font-extrabold">{profile?.nama_organisasi || 'Loading...'}</div>
								<div className="mt-1 flex flex-wrap items-center gap-2 text-xs md:text-sm">
									<span className="inline-flex items-center gap-1 rounded bg-white/20 px-2 py-0.5">
										<ShieldCheck className="w-3.5 h-3.5"/> {profile?.jenis_instansi || 'Organisasi'}
									</span>
									<span>{profile?.alamat || 'Alamat tidak tersedia'}</span>
									<span>{profile?.nomor_telepon || '-'}</span>
								</div>
							</div>
						</div>
						
						{/* Debug Info */}
						{import.meta.env.DEV && stats && (
							<div className="mt-3 p-2 bg-white/20 rounded text-xs space-y-1">
								<div>🐛 Debug:</div>
								<div>Uang (raw): {stats.total_bantuan_uang} ({typeof stats.total_bantuan_uang})</div>
								<div>Barang (raw): {stats.total_bantuan_barang} ({typeof stats.total_bantuan_barang})</div>
								<div>Formatted Uang: {formatCurrency(stats.total_bantuan_uang)}</div>
							</div>
						)}
						
						{/* Statistics Section with Total Donasi Split */}
						<div className="mt-5 space-y-3">
							{/* Total Donasi Header */}
							<div className="text-center">
								<h3 className="text-lg font-bold text-white/90">Total Donasi</h3>
								<p className="text-xs text-white/70">Donasi dalam bentuk uang dan barang</p>
							</div>
							
							{/* Total Donasi - Uang dan Barang Side by Side */}
							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-xl bg-white/90 backdrop-blur-sm border border-white/30 shadow-sm p-3 text-center">
									<div className="text-green-700 font-semibold text-xs mb-1">💰 Donasi Uang</div>
									<div className="text-xl font-extrabold text-green-800 break-words">
										{formatCurrency(stats?.total_bantuan_uang ?? 0)}
									</div>
									<div className="text-[10px] text-slate-600 mt-1">Total uang disalurkan</div>
								</div>
								<div className="rounded-xl bg-white/90 backdrop-blur-sm border border-white/30 shadow-sm p-3 text-center">
									<div className="text-blue-700 font-semibold text-xs mb-1">📦 Donasi Barang</div>
									<div className="text-xl font-extrabold text-blue-800">
										{(stats?.total_bantuan_barang ?? 0).toLocaleString('id-ID')}
									</div>
									<div className="text-sm font-semibold text-blue-600">Unit</div>
									<div className="text-[10px] text-slate-600 mt-1">Total barang disalurkan</div>
								</div>
							</div>
							
							{/* Other Stats */}
							<div className="grid grid-cols-2 gap-3">
								<StatBox 
									label="Program Bantuan" 
									value={(stats?.active_programs ?? 0).toString()} 
								/>
								<StatBox 
									label="Penerima Terbantu" 
									value={(stats?.total_penerima ?? 0).toString()} 
								/>
							</div>
						</div>
					</div>

					{/* Data Donatur */}
					<div className="rounded-2xl border border-green-200 shadow-sm">
						<div className="px-4 py-2 border-b border-green-200 font-semibold text-[#0B2B5E]">Data Donatur</div>
						<div className="p-4 grid gap-3">
							{[{
								label: "Nama Instansi", value: profile?.nama_organisasi || '-', icon: Building2
							},{
								label: "Email Instansi", value: profile?.email || '-', icon: Mail
							},{
								label: "Alamat Instansi", value: profile?.alamat || '-', icon: MapPin
							},{
								label: "No. Telepon/WhatsApp", value: profile?.nomor_telepon || '-', icon: Phone
							},{
								label: "Jenis Donatur", value: profile?.jenis_instansi || '-', icon: Layers
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
				<LogoutConfirmModal onClose={() => setShowLogout(false)} onConfirm={() => navigate("/login/donatur")} />
			)}
		</div>
	);
}
