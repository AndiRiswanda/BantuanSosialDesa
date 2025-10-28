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
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import AdminPrograms from "./components/pages/admin/AdminPrograms";
import AdminDonations from "./components/pages/admin/AdminDonations";
import AdminDonationSchedule from "./components/pages/admin/AdminDonationSchedule";
import AdminDonationEdit from "./components/pages/admin/AdminDonationEdit";
import AdminDistribution from "./components/pages/admin/AdminDistribution";
import AdminDistributionVerify from "./components/pages/admin/AdminDistributionVerify";
import AdminVerificationDashboard from "./components/pages/admin/AdminVerificationDashboard";
import AdminDonorDetail from "./components/pages/admin/AdminDonorDetail";
import AdminDonorEdit from "./components/pages/admin/AdminDonorEdit";
import AdminRecipientDetail from "./components/pages/admin/AdminRecipientDetail";
import AdminRecipientEdit from "./components/pages/admin/AdminRecipientEdit";
import AdminProfile from "./components/pages/admin/AdminProfile";
import AdminProfileEdit from "./components/pages/admin/AdminProfileEdit";

// HomePage component for the home route
const HomePage = () => (
  <>
    <HeroSection />
    <FeaturesSection />
  </>
);

function App() {
  const { pathname } = useLocation();
  const hideDefaultNavbar = pathname.startsWith("/donor") || pathname.startsWith("/penerima") || pathname.startsWith("/admin");
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
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/program" element={<AdminPrograms />} />
          <Route path="/admin/donasi" element={<AdminDonations />} />
          <Route path="/admin/donasi/:id/jadwal" element={<AdminDonationSchedule />} />
          <Route path="/admin/donasi/:id/edit" element={<AdminDonationEdit />} />
          <Route path="/admin/penyaluran" element={<AdminDistribution />} />
          <Route path="/admin/penyaluran/:id/verifikasi" element={<AdminDistributionVerify />} />
          <Route path="/admin/verifikasi" element={<AdminVerificationDashboard />} />
          <Route path="/admin/verifikasi/donatur/:id" element={<AdminDonorDetail />} />
          <Route path="/admin/verifikasi/donatur/:id/edit" element={<AdminDonorEdit />} />
          <Route path="/admin/verifikasi/penerima/:id" element={<AdminRecipientDetail />} />
          <Route path="/admin/verifikasi/penerima/:id/edit" element={<AdminRecipientEdit />} />
          <Route path="/admin/profil" element={<AdminProfile />} />
          <Route path="/admin/profil/edit" element={<AdminProfileEdit />} />
          {/* Add more routes here as needed */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
