import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
import logo from "../../assets/Icon.png";

export default function NavbarAdmin() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = [
    { to: "/admin", label: "Beranda" },
    { to: "/admin/program", label: "Program" },
    { to: "/admin/donasi", label: "Donasi" },
    { to: "/admin/penyaluran", label: "Penyaluran" },
    { to: "/admin/verifikasi", label: "Verifikasi" },
  ];

  return (
    <nav className="bg-[#1976d26c] relative flex justify-between items-center px-6 py-3 shadow-sm">
      {/* Brand */}
      <div className="flex items-center space-x-2">
        <Link to="/admin">
          <img src={logo} alt="Logo" className="w-11 h-11" />
        </Link>
        <div>
          <h1 className="text-[#0B2B5E] font-semibold leading-tight">Transparansi</h1>
          <p className="text-xs text-[#0B2B5E] -mt-1">Bantuan Sosial Desa</p>
        </div>
      </div>

      {/* Desktop nav */}
      <ul className="hidden md:flex space-x-8 text-[#0B2B5E] font-medium">
        {items.map((item) => {
          const active = item.to === "/admin" ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <li key={item.to} className={`${active ? "border-b-4 border-[#43A047]" : "hover:text-green-600"} pb-1`}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          );
        })}
      </ul>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("/admin/profil")} className="text-[#0B2B5E] hover:text-green-700">
          <UserCircle2 className="w-8 h-8" />
        </button>
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-slate-200 bg-white/90 shadow hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-slate-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-slate-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div role="menu" className="absolute top-full left-0 right-0 z-20 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur shadow">
          <ul className="flex flex-col py-2 text-[#0B2B5E] font-medium">
            {items.map((item) => {
              const active = item.to === "/admin" ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link to={item.to} onClick={() => setOpen(false)} className={`block px-6 py-3 ${active ? "text-green-700 bg-green-50" : "hover:text-green-700"}`}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
