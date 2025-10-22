import { useNavigate } from "react-router-dom";
import "./LoginSelection.css";

export default function LoginSelection() {
  const navigate = useNavigate();
  return (
    <section className="ls-root">
      <div className="ls-container">
        <header className="ls-header">
          <h1 className="ls-title">Pilih Akun untuk Masuk</h1>
          <p className="ls-sub">Masuk sebagai Donatur, Penerima Bantuan, atau Admin untuk melanjutkan.</p>
        </header>

        <div className="ls-grid">
          {/* Donatur */}
          <article className="ls-card" aria-labelledby="donor-title">
            <div className="ls-card-top">
              <div className="ls-icon donor" aria-hidden="true">💚</div>
              <h2 id="donor-title" className="ls-card-title">Donatur</h2>
            </div>

            <p className="ls-card-desc">
              Masuk untuk melanjutkan kontribusi Anda dan melihat riwayat donasi.
            </p>

            <div className="ls-actions">
              <button 
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95" 
                type="button"
                onClick={() => navigate('/login/donatur')}
              >
                Masuk sebagai Donatur
              </button>
              <a 
                className="ls-link" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register/donatur');
                }}
              >
                Daftar
              </a>
            </div>
          </article>

          {/* Center/ Admin */}
          <div className="ls-center">
            <div className="ls-divider" aria-hidden="true"></div>
            <span className="ls-badge">Admin</span>
          </div>

          {/* Penerima Bantuan */}
          <article className="ls-card" aria-labelledby="recipient-title">
            <div className="ls-card-top">
              <div className="ls-icon recipient" aria-hidden="true">🧑‍🌾</div>
              <h2 id="recipient-title" className="ls-card-title">Penerima Bantuan</h2>
            </div>

            <p className="ls-card-desc">
              Masuk untuk memeriksa status bantuan dan melihat informasi program.
            </p>

            <div className="ls-actions">
              <button 
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95" 
                type="button"
                onClick={() => navigate('/login/penerima')}
              >
                Masuk sebagai Penerima
              </button>
              <a 
                className="ls-link" 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/register/penerima');
                }}
              >
                Daftar
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
