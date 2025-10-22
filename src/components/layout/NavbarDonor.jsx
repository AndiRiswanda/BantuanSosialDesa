import React from "react";
import { Link, useLocation } from "react-router-dom";
import { UserCircle2 } from "lucide-react";
import logo from "../../assets/Icon.png";

export default function NavbarDonor() {
  const { pathname } = useLocation();
  const items = [
    { to: "/donor", label: "Beranda" },
    { to: "/donor/programku", label: "Programku" },
    { to: "/donor/donasi-baru", label: "Donasi Baru" },
  ];

  return (
    <nav className="bg-[#1976d26c] flex justify-between items-center px-6 py-3 shadow-sm">
      {/* Brand */}
      <div className="flex items-center space-x-2">
        <Link to="/donor">
          <img src={logo} alt="Logo" className="w-11 h-11" />
        </Link>
        <div>
          <h1 className="text-[#0B2B5E] font-semibold leading-tight">Transparansi</h1>
          <p className="text-xs text-[#0B2B5E] -mt-1">Bantuan Sosial Desa</p>
        </div>
      </div>

      {/* Nav */}
      <ul className="flex space-x-8 text-[#0B2B5E] font-medium">
        {items.map((item) => (
          <li
            key={item.to}
            className={`${pathname === item.to ? "border-b-4 border-[#43A047]" : "hover:text-green-600"} pb-1`}
          >
            <Link to={item.to}>{item.label}</Link>
          </li>
        ))}
      </ul>

      {/* Right profile icon */}
      <button className="text-[#0B2B5E] hover:text-green-700">
        <UserCircle2 className="w-8 h-8" />
      </button>
    </nav>
  );
}
