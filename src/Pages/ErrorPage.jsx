import "../Styles/errorPage.css";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="error-container">
      <div className="error-box">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Sahifa topilmadi</h2>
        <p className="error-message">
          Kechirasiz, siz izlagan sahifa mavjud emas yoki ko'chirilgan bo'lishi mumkin.
        </p>
        <button className="error-button" onClick={() => navigate("/")}>
          Bosh sahifaga qaytish
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
