import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/icon.png";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#1976d26c] relative flex justify-between items-center px-6 py-3 shadow-sm">
        {/* Logo disini */}
      <div className="flex items-center space-x-2">
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="w-11 h-11"
          />
        </Link>
        <div>
          <h1 className="text-[#0B2B5E] font-semibold leading-tight">
            Transparansi
          </h1>
          <p className="text-xs text-[#0B2B5E] -mt-1">
            Bantuan Sosial Desa
          </p>
        </div>
      </div>

      {/* Desktop nav */}
      <ul className="hidden md:flex space-x-8 text-[#0B2B5E] font-medium">
        <li className={`${path === "/" ? "border-b-4 border-[#43A047]" : "hover:text-green-600"} pb-1 cursor-pointer`}>
          <Link to="/">Beranda</Link>
        </li>
        <li className={`${path === "/penyaluran" ? "border-b-4 border-[#43A047]" : "hover:text-green-600"} pb-1 cursor-pointer`}>
          <Link to="/penyaluran">Penyaluran</Link>
        </li>
        <li className={`${path === "/pengaduan" ? "border-b-4 border-[#43A047]" : "hover:text-green-600"} pb-1 cursor-pointer`}>
          <Link to="/pengaduan">Pengaduan</Link>
        </li>
        <li className={`${path === "/login" ? "border-b-4 border-[#43A047]" : "hover:text-green-600"} pb-1 cursor-pointer`}>
          <Link to="/login">Masuk</Link>
        </li>
      </ul>

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

      {/* Mobile dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 right-0 z-20 md:hidden border-t border-slate-200 bg-white/95 backdrop-blur shadow"
        >
          <ul className="flex flex-col py-2 text-[#0B2B5E] font-medium">
            <li>
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className={`block px-6 py-3 ${path === "/" ? "text-green-700 bg-green-50" : "hover:text-green-700"}`}
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link
                to="/penyaluran"
                onClick={() => setOpen(false)}
                className={`block px-6 py-3 ${path === "/penyaluran" ? "text-green-700 bg-green-50" : "hover:text-green-700"}`}
              >
                Penyaluran
              </Link>
            </li>
            <li>
              <Link
                to="/pengaduan"
                onClick={() => setOpen(false)}
                className={`block px-6 py-3 ${path === "/pengaduan" ? "text-green-700 bg-green-50" : "hover:text-green-700"}`}
              >
                Pengaduan
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className={`block px-6 py-3 ${path === "/login" ? "text-green-700 bg-green-50" : "hover:text-green-700"}`}
              >
                Masuk
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
