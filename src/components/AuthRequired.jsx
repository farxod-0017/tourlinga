import { useNavigate } from "react-router-dom";
import "../Styles/authRequired.css";

const AuthRequired = ({pageName}) => {
  const navigate = useNavigate();

  return (
    <main className="auth-required-container">
      <div className="auth-box">
        <h2 className="auth-message">
          Iltimos, {pageName} sahifasini kuzatish uchun tizimdan ro'yhatdan o'ting
        </h2>

        <div className="auth-buttons">
          <button className="auth-btn login_nav" onClick={() => navigate("/login")}>
            Tizimga kirish
          </button>
          <button className="auth-btn register" onClick={() => navigate("/sign-up")}>
            Ro‘yxatdan o‘tish
          </button>
        </div>
      </div>
    </main>
  );
};

export default AuthRequired;
