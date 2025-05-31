// components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom'
import Cookies from 'js-cookie'
import CryptoJS from 'crypto-js';


const ProtectedRoute = () => {
    const secret_key = import.meta.env.VITE_SECRET_KEY;
    const takeOriginalValue = (shifr_key) => {
        const encryptedValue = Cookies.get(shifr_key);
        if (encryptedValue) {
            const bytes = CryptoJS.AES.decrypt(encryptedValue, secret_key);
            const origin_value = bytes.toString(CryptoJS.enc.Utf8);
            return origin_value
        }

    }
    const isAdmin = takeOriginalValue("user_role") === "Admin"

    // Agar cookie yo'q bo'lsa, login sahifasiga yo'naltir
    return isAdmin ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
