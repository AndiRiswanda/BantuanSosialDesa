import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import HeroSection from "./components/layout/HeroSection";
import FeaturesSection from "./components/layout/FeaturesSection";
import PenyaluranPage from "./components/pages/PenyaluranPage";
import LoginSelection from "./components/auth/LoginSelection";
import PengaduanSection from "./components/pages/PengaduanSection";
import DonorLoginPage from "./components/auth/donor/DonorLoginPage";
import DonorRegisterPage from "./components/auth/donor/DonorRegisterPage";
import RecipientLoginPage from "./components/auth/recipient/RecipientLoginPage";
import RecipientRegisterPage from "./components/auth/recipient/RecipientRegisterPage";
import DonorDashboard from "./components/pages/donor/DonorDashboard";
import DonorPrograms from "./components/pages/donor/DonorPrograms";
import DonorNewDonation from "./components/pages/donor/DonorNewDonation";
import DonorProgramDetail from "./components/pages/donor/DonorProgramDetail";
import DonorProfile from "./components/pages/donor/DonorProfile";
import DonorProfileEdit from "./components/pages/donor/DonorProfileEdit";
import RecipientDashboard from "./components/pages/recipient/RecipientDashboard";
import RecipientPrograms from "./components/pages/recipient/RecipientPrograms";
import RecipientApplication from "./components/pages/recipient/RecipientApplication";
import RecipientApplicationStatus from "./components/pages/recipient/RecipientApplicationStatus";
import RecipientProgramDetail from "./components/pages/recipient/RecipientProgramDetail";
import RecipientProfile from "./components/pages/recipient/RecipientProfile";

// HomePage component for the home route
const HomePage = () => (
  <>
    <HeroSection />
    <FeaturesSection />
  </>
);

function App() {
  const { pathname } = useLocation();
  const hideDefaultNavbar = pathname.startsWith("/donor") || pathname.startsWith("/penerima");
  return (
    <div className="font-sans flex flex-col min-h-screen">
      {!hideDefaultNavbar && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/penyaluran" element={<PenyaluranPage />} />
          <Route path="/pengaduan" element={<PengaduanSection />} />
          <Route path="/login" element={<LoginSelection />} />
          <Route path="/login/donatur" element={<DonorLoginPage />} />
          <Route path="/register/donatur" element={<DonorRegisterPage />} />
          <Route path="/login/penerima" element={<RecipientLoginPage />} />
          <Route path="/register/penerima" element={<RecipientRegisterPage />} />
          <Route path="/donor" element={<DonorDashboard />} />
          <Route path="/donor/programku" element={<DonorPrograms />} />
          <Route path="/donor/programku/:id" element={<DonorProgramDetail />} />
          <Route path="/donor/donasi-baru" element={<DonorNewDonation />} />
          <Route path="/donor/profil" element={<DonorProfile />} />
          <Route path="/donor/profil/edit" element={<DonorProfileEdit />} />
          <Route path="/penerima" element={<RecipientDashboard />} />
          <Route path="/penerima/profil" element={<RecipientProfile />} />
          <Route path="/penerima/program" element={<RecipientPrograms />} />
          <Route path="/penerima/program/:id" element={<RecipientProgramDetail />} />
          <Route path="/penerima/pengajuan" element={<RecipientApplication />} />
          <Route path="/penerima/pengajuan/status/:status" element={<RecipientApplicationStatus />} />
          {/* Add more routes here as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
