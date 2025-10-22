import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/icon.png";

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="bg-[#1976d26c] flex justify-between items-center px-6 py-3 shadow-sm">
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

      {/* navbar pu navigasi */}
      <ul className="flex space-x-8 text-[#0B2B5E] font-medium">
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
    </nav>
  );
}
