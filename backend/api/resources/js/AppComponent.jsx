import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
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
import AdminLoginPage from "./components/auth/AdminLoginPage";
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
    <AuthProvider>
      <div className="font-sans flex flex-col min-h-screen">
        {!hideDefaultNavbar && <Navbar />}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/penyaluran" element={<PenyaluranPage />} />
            <Route path="/pengaduan" element={<PengaduanSection />} />
            <Route path="/login" element={<LoginSelection />} />
            <Route path="/login/admin" element={<AdminLoginPage />} />
            <Route path="/login/donatur" element={<DonorLoginPage />} />
            <Route path="/register/donatur" element={<DonorRegisterPage />} />
            <Route path="/login/penerima" element={<RecipientLoginPage />} />
            <Route path="/register/penerima" element={<RecipientRegisterPage />} />
            
            {/* Protected Donor Routes */}
            <Route path="/donor" element={<ProtectedRoute allowedTypes={['donor']}><DonorDashboard /></ProtectedRoute>} />
            <Route path="/donor/programku" element={<ProtectedRoute allowedTypes={['donor']}><DonorPrograms /></ProtectedRoute>} />
            <Route path="/donor/programku/:id" element={<ProtectedRoute allowedTypes={['donor']}><DonorProgramDetail /></ProtectedRoute>} />
            <Route path="/donor/donasi-baru" element={<ProtectedRoute allowedTypes={['donor']}><DonorNewDonation /></ProtectedRoute>} />
            <Route path="/donor/profil" element={<ProtectedRoute allowedTypes={['donor']}><DonorProfile /></ProtectedRoute>} />
            <Route path="/donor/profil/edit" element={<ProtectedRoute allowedTypes={['donor']}><DonorProfileEdit /></ProtectedRoute>} />
            
            {/* Protected Recipient Routes */}
            <Route path="/penerima" element={<ProtectedRoute allowedTypes={['recipient']}><RecipientDashboard /></ProtectedRoute>} />
            <Route path="/penerima/profil" element={<ProtectedRoute allowedTypes={['recipient']}><RecipientProfile /></ProtectedRoute>} />
            <Route path="/penerima/program" element={<ProtectedRoute allowedTypes={['recipient']}><RecipientPrograms /></ProtectedRoute>} />
            <Route path="/penerima/program/:id" element={<ProtectedRoute allowedTypes={['recipient']}><RecipientProgramDetail /></ProtectedRoute>} />
            <Route path="/penerima/pengajuan" element={<ProtectedRoute allowedTypes={['recipient']}><RecipientApplication /></ProtectedRoute>} />
            <Route path="/penerima/pengajuan/status/:status" element={<ProtectedRoute allowedTypes={['recipient']}><RecipientApplicationStatus /></ProtectedRoute>} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedTypes={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedTypes={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/program" element={<ProtectedRoute allowedTypes={['admin']}><AdminPrograms /></ProtectedRoute>} />
            <Route path="/admin/donasi" element={<ProtectedRoute allowedTypes={['admin']}><AdminDonations /></ProtectedRoute>} />
            <Route path="/admin/donasi/:id/jadwal" element={<ProtectedRoute allowedTypes={['admin']}><AdminDonationSchedule /></ProtectedRoute>} />
            <Route path="/admin/donasi/:id/edit" element={<ProtectedRoute allowedTypes={['admin']}><AdminDonationEdit /></ProtectedRoute>} />
            <Route path="/admin/penyaluran" element={<ProtectedRoute allowedTypes={['admin']}><AdminDistribution /></ProtectedRoute>} />
            <Route path="/admin/penyaluran/:id/verifikasi" element={<ProtectedRoute allowedTypes={['admin']}><AdminDistributionVerify /></ProtectedRoute>} />
            <Route path="/admin/verifikasi" element={<ProtectedRoute allowedTypes={['admin']}><AdminVerificationDashboard /></ProtectedRoute>} />
            <Route path="/admin/verifikasi/donatur/:id" element={<ProtectedRoute allowedTypes={['admin']}><AdminDonorDetail /></ProtectedRoute>} />
            <Route path="/admin/verifikasi/donatur/:id/edit" element={<ProtectedRoute allowedTypes={['admin']}><AdminDonorEdit /></ProtectedRoute>} />
            <Route path="/admin/verifikasi/penerima/:id" element={<ProtectedRoute allowedTypes={['admin']}><AdminRecipientDetail /></ProtectedRoute>} />
            <Route path="/admin/verifikasi/penerima/:id/edit" element={<ProtectedRoute allowedTypes={['admin']}><AdminRecipientEdit /></ProtectedRoute>} />
            <Route path="/admin/profil" element={<ProtectedRoute allowedTypes={['admin']}><AdminProfile /></ProtectedRoute>} />
            <Route path="/admin/profil/edit" element={<ProtectedRoute allowedTypes={['admin']}><AdminProfileEdit /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
