import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
import logo from "../../assets/Icon.png";

export default function NavbarDonatur() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = [
    { to: "/donatur/dashboard", label: "Beranda" },
    { to: "/donatur/programku", label: "Programku" },
    { to: "/donatur/donasi-baru", label: "Donasi Baru" },
  ];

  return (
    <nav className="bg-[#1976d26c] relative flex justify-between items-center px-6 py-3 shadow-sm">
      {/* Brand */}
      <div className="flex items-center space-x-2">
        <Link to="/donatur/dashboard">
          <img src={logo} alt="Logo" className="w-11 h-11" />
        </Link>
        <div>
          <h1 className="text-[#0B2B5E] font-semibold leading-tight">Transparansi</h1>
          <p className="text-xs text-[#0B2B5E] -mt-1">Bantuan Sosial Desa</p>
        </div>
      </div>

      {/* Nav desktop */}
      <ul className="hidden md:flex space-x-8 text-[#0B2B5E] font-medium">
        {items.map((item) => (
          <li
            key={item.to}
            className={`${(item.to === "/donatur/dashboard" ? pathname === item.to : pathname.startsWith(item.to)) ? "border-b-4 border-[#43A047]" : "hover:text-green-600"} pb-1`}
          >
            <Link to={item.to}>{item.label}</Link>
          </li>
        ))}
      </ul>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("/donatur/profil")} className="text-[#0B2B5E] hover:text-green-700">
          <UserCircle2 className="w-8 h-8" />
        </button>
        {/* Mobile menu button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-slate-200 bg-white/90 shadow hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          {open ? (
            // X icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-slate-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Menu icon
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-slate-700">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 right-0 z-20 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur shadow"
        >
          <ul className="flex flex-col py-2 text-[#0B2B5E] font-medium">
            {items.map((item) => {
              const active = item.to === "/donatur/dashboard" ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`block px-6 py-3 ${active ? "text-green-700 bg-green-50" : "hover:text-green-700"}`}
                  >
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
