import '../AdminCSS/admHome.css'
import { useCallback, useEffect, useReducer, useState } from "react"

import { mURL } from "../mURL"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

import arrow_up from '../Images/arrow-up.svg'
import arrow_down from "../Images/arrow-down.svg"


export default function AdminHome() {
    // universal blocks
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const secret_key = import.meta.env.VITE_SECRET_KEY;
    const takeOriginalValue = useCallback((shifr_key) => {
        const encryptedValue = Cookies.get(shifr_key);
        if (encryptedValue) {
            const bytes = CryptoJS.AES.decrypt(encryptedValue, secret_key);
            const origin_value = bytes.toString(CryptoJS.enc.Utf8);
            return origin_value
        }

    }, [secret_key]);
    const saveEncryptedCookie = useCallback((key, value) => {
        let encrypted_value = CryptoJS.AES.encrypt(value, secret_key).toString();
        Cookies.set(key, encrypted_value);
    }, [secret_key]);
    // const [ignore, fourceUpdate] = useReducer(x => x + 1, 0);

    // END universal blocks

    // get Themes
    // Fake NEWS Array
    const [direcs, setDirecs] = useState({});
    const getDirecs = useCallback(async () => {
        const current_time = new Date();
        const stored_time = takeOriginalValue('stored_time');
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (timeDiff < 900) {
            try {
                let fetchData = await fetch(`${mURL}/main/admin/statistics/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    }
                });
                if (fetchData.ok) {
                    let data = await fetchData.json();
                    setDirecs(data);
                    console.log(data);
                } else if (fetchData.status === 401) {
                    console.log('Token tekshirilmoqda...');
                    Cookies.remove('role');
                    navigate('/')
                } else {
                    console.log('Xatolik:', fetchData.statusText);
                }
            } catch (error) {
                console.log(`get Directionsda xatolik:, ${error}`);
            }
        } else {
            // Token muddati tugagan, refresh orqali yangi token olish
            let readyPost = {
                userId: takeOriginalValue('user_id'),
                refreshToken: takeOriginalValue('refresh_token')
            }
            try {
                let refreshResponse = await fetch(`${mURL}/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': "application/json",
                    },
                    body: JSON.stringify(readyPost)
                });
                if (refreshResponse.ok) {
                    let data = await refreshResponse.json();
                    saveEncryptedCookie('refresh_token', data.refresh_token);
                    saveEncryptedCookie('access_token', data.access_token);
                    let current_time = new Date().toISOString();
                    saveEncryptedCookie('stored_time', current_time);
                    // Yangi token bilan so'rovni qayta amalga oshirish
                    getDirecs();
                } else {
                    console.log('Refresh token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                    Cookies.remove('role')
                    navigate('/')
                }
            } catch (error) {
                console.error('Serverga ulanishda xatolik (refresh):', error.message);
            }
        }

    }, [navigate, saveEncryptedCookie, takeOriginalValue]);

    useEffect(() => {
        getDirecs();
    }, [getDirecs]);

    // END get news

    return (
        <div className="adm_home">
            <h1>Dashboard</h1>
            <h3>Barcha ma’lumotlar bitta sahifada.</h3>
            <div className="stat_grid">
                {Object.entries(direcs).map(([key, value]) => (
                    <div key={key} className='stat_box'>
                        <h4>{key === "mavzu" ? "Mavzular soni" : key === "savol" ? "Savollar soni" : key === "termin" ? "Terminlar soni" : key === "talabalar" ? "Talabalar soni" : key==="universitetlar" ? "Universitetlar soni": key === "talabalar_ball" ? "To‘plangan ballar" : "Ko'rsatkich"}</h4>
                        <h2>{value.current}</h2>
                        <div>
                            <img src={arrow_up} alt="" />
                            <h5>
                                <span>{value.percent_change}%</span>
                                vs last month
                            </h5>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}