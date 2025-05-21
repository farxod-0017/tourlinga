import '../Styles/termData.css'


import { useRef } from "react"

import { useCallback, useEffect, useReducer, useState } from "react"

import { mURL } from "../mURL"
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { useDirecs } from '../context/DirecsContext';

export default function TermData() {

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
    const [ignore, fourceUpdate] = useReducer(x => x + 1, 0);

    // END universal blocks

    // get Themes
    const [selectedTmId, setSelectedTmId] = useState(0);

    const [direcs, setDirecs] = useState([]);
    const getDirecs = useCallback(async () => {
        const current_time = new Date();
        const stored_time = takeOriginalValue('stored_time');
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (timeDiff < 900) {
            try {
                let fetchData = await fetch(`${mURL}/main/mavzular/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    }
                });
                if (fetchData.ok) {
                    let data = await fetchData.json();
                    setDirecs(data);
                    let first_id = data[0]?.id
                    setSelectedTmId(first_id)
                    console.log(data);
                } else if (fetchData.status === 401) {
                    console.log('Token tekshirilmoqda...');
                    Cookies.remove('role');
                    navigate('/')
                } else {
                    console.log('Xatolik:', fetchData.statusText);
                }
            } catch (error) {
                console.log(`get Directionsda xatolik:, error`);
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
                    navigate('/login')
                }
            } catch (error) {
                console.error('Serverga ulanishda xatolik (refresh):', error.message);
            }
        }

    }, [navigate, saveEncryptedCookie, takeOriginalValue]);

    useEffect(() => {
        getDirecs();
    }, [ignore, getDirecs]);

    // END get news

    // get terms
    const [terms, setTerms] = useState([]);
    const getTerms = useCallback(async () => {
        const current_time = new Date();
        const stored_time = takeOriginalValue('stored_time');
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (selectedTmId) {
            if (timeDiff < 900) {
                try {
                    let fetchData = await fetch(`${mURL}/main/termin-by-mavzu/${selectedTmId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                        }
                    });
                    if (fetchData.ok) {
                        let data = await fetchData.json();
                        setTerms(data)
                        console.log(data);
                    } else if (fetchData.status === 401) {
                        console.log('Token tekshirilmoqda...');
                        Cookies.remove('role');
                        navigate('/')
                    } else {
                        console.log('Xatolik:', fetchData.statusText);
                    }
                } catch (error) {
                    console.log(`get Directionsda xatolik:, error`);
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
                        getTerms();
                    } else {
                        console.log('Refresh token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                        Cookies.remove('role')
                        navigate('/')
                    }
                } catch (error) {
                    console.error('Serverga ulanishda xatolik (refresh):', error.message);
                }
            }
        }

    }, [navigate, selectedTmId, saveEncryptedCookie, takeOriginalValue]);

    useEffect(() => {
        getTerms();
    }, [ignore, getTerms]);

    // END get terms

    // global state
    const info = useDirecs()
    // global state END

    return (
        <section className='terms'>
            <div className="theme_bar">
                <div className="theme_head">
                    <ul>
                        <li>Bosh sahifa </li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                            <path
                                d="M6.83 5.29001L2.59 1.05001C2.49704 0.956281 2.38644 0.881887 2.26458 0.831118C2.14272 0.780349 2.01202 0.754211 1.88 0.754211C1.74799 0.754211 1.61729 0.780349 1.49543 0.831118C1.37357 0.881887 1.26297 0.956281 1.17 1.05001C0.983753 1.23737 0.879211 1.49082 0.879211 1.75501C0.879211 2.0192 0.983753 2.27265 1.17 2.46001L4.71 6.00001L1.17 9.54001C0.983753 9.72737 0.879211 9.98082 0.879211 10.245C0.879211 10.5092 0.983753 10.7626 1.17 10.95C1.26344 11.0427 1.37426 11.116 1.4961 11.1658C1.61793 11.2155 1.7484 11.2408 1.88 11.24C2.01161 11.2408 2.14207 11.2155 2.26391 11.1658C2.38575 11.116 2.49656 11.0427 2.59 10.95L6.83 6.71001C6.92373 6.61705 6.99813 6.50645 7.04889 6.38459C7.09966 6.26273 7.1258 6.13202 7.1258 6.00001C7.1258 5.868 7.09966 5.73729 7.04889 5.61543C6.99813 5.49357 6.92373 5.38297 6.83 5.29001Z"
                                fill="#717680"
                            />
                        </svg>
                        <li>Terminlar</li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                            <path
                                d="M6.83 5.29001L2.59 1.05001C2.49704 0.956281 2.38644 0.881887 2.26458 0.831118C2.14272 0.780349 2.01202 0.754211 1.88 0.754211C1.74799 0.754211 1.61729 0.780349 1.49543 0.831118C1.37357 0.881887 1.26297 0.956281 1.17 1.05001C0.983753 1.23737 0.879211 1.49082 0.879211 1.75501C0.879211 2.0192 0.983753 2.27265 1.17 2.46001L4.71 6.00001L1.17 9.54001C0.983753 9.72737 0.879211 9.98082 0.879211 10.245C0.879211 10.5092 0.983753 10.7626 1.17 10.95C1.26344 11.0427 1.37426 11.116 1.4961 11.1658C1.61793 11.2155 1.7484 11.2408 1.88 11.24C2.01161 11.2408 2.14207 11.2155 2.26391 11.1658C2.38575 11.116 2.49656 11.0427 2.59 10.95L6.83 6.71001C6.92373 6.61705 6.99813 6.50645 7.04889 6.38459C7.09966 6.26273 7.1258 6.13202 7.1258 6.00001C7.1258 5.868 7.09966 5.73729 7.04889 5.61543C6.99813 5.49357 6.92373 5.38297 6.83 5.29001Z"
                                fill="#717680"
                            />
                        </svg>
                        <li>{selectedTmId ? direcs?.find((item) => item.id === selectedTmId).name : "Barchasi"}</li>
                    </ul>
                    <h1>Terminlar</h1>
                </div>
                <div className="theme_body">
                    <input type="text" placeholder='Qidirish' />
                    <ul>
                        {direcs?.map((item) => {
                            return (
                                <li className={item.id === selectedTmId ? "selectedTheme" : ""} onClick={(e) => setSelectedTmId(item.id)} key={item.id}>{item.name}</li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <div className="terms_body">
                <h2>{selectedTmId ? direcs?.find((item) => item.id === selectedTmId).name : "Barchasi"}</h2>
                <div className="terms_body_head">
                    <nav>
                        <NavLink to={"/terms"}>Terminlar</NavLink>
                        <NavLink to={"/questions"}>Savol-Javob</NavLink>
                    </nav>
                    <h4>To‘plangan ballar: <span>{info?.ball ? info?.ball : "0"}</span></h4>
                </div>
                <div className="terms_grid">
                    {terms?.length === 0 ?
                        <h6>Bu mavzu uchun Terminlar yuklanmagan</h6> :
                        <noscript></noscript>
                    }
                    {terms?.map((item) => {
                        return (
                            <div key={item.id} className="terms_wrap">
                                <div className="terms_box">
                                    <h5>Ingliz</h5>
                                    <h3>{item.engw}</h3>
                                    <p>{item.engwt}</p>
                                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                                        {item.link}
                                    </a>
                                    <img src={item.image} alt="image of word" />
                                </div>
                                <div className="terms_box">
                                    <h5>O‘zbek</h5>
                                    <h3>{item.uzbw}</h3>
                                    <p>{item.uzbwt}</p>
                                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                                        {item.link}
                                    </a>
                                    <img src={item.image} alt="image of word" />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}