import '../AdminCSS/admProfile.css'

import { useCallback, useEffect, useReducer, useState } from "react"

import { useRef } from "react";
import { mURL } from "../mURL"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';

import upload_icon from "../Images/upload-icon.svg"


export default function AdminProfile() {
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        validateAndSet(file);
    };

    const handleChange = (e) => {
        const file = e.target.files[0];
        validateAndSet(file);
    };

    const validateAndSet = (file) => {
        if (!file) return;
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'];
        const img = new Image();
        const objectURL = URL.createObjectURL(file);
        img.src = objectURL;

        img.onload = () => {
            if (
                allowedTypes.includes(file.type) &&
                img.width <= 8000 &&
                img.height <= 4000
            ) {
                setImage(file); // faqat file saqlanadi
                setError('');
            } else {
                setError('Faqat 800x400px dan kichik SVG, PNG, JPG, JPEG yoki GIF fayllar qabul qilinadi.');
                setImage(null);
            }
        };
    };

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

    const [direction_name, setDirectionName] = useState("");
    const [news_tavsif, setNews_tavsif] = useState("");
    const [email, setEmail] = useState("");

    // get news
    const [direcs, setDirecs] = useState([]);
    const getDirecs = useCallback(async () => {
        const current_time = new Date();
        const stored_time = takeOriginalValue('stored_time');
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (timeDiff < 900) {
            try {
                let fetchData = await fetch(`${mURL}/users/profile/${sessionStorage.getItem('userId')}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    }
                });
                if (fetchData.ok) {
                    let data = await fetchData.json();
                    setDirecs(data);
                    setDirectionName(data.first_name);
                    setNews_tavsif(data.last_name);
                    setEmail(data.email);

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
    }, [ignore, getDirecs])
    // END get news


    // update news

    async function updateDirec(e) {
        e.preventDefault();
        const stored_time = takeOriginalValue('stored_time');
        const currentTime = new Date();
        const timeDiff = (currentTime - new Date(stored_time)) / 60000;
        // let readyD = {
        //     title: direction_name,
        //     content: news_tavsif,
        //     image: image
        // };
        const readyD = new FormData();
        readyD.append('first_name', direction_name); // o'rniga input qiymatini qo'ying
        readyD.append("last_name", news_tavsif);
        if(image) {
            readyD.append('image', image);
        }
        readyD.append('email', email);


        if (timeDiff < 900) {
            try {
                setIsLoading(true);
                let fetchData = await fetch(`${mURL}/users/profile/${sessionStorage.getItem('userId')}/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    },
                    body: readyD
                });
                if (fetchData.ok) {
                    const result = await fetchData.json();
                    fourceUpdate();
                    console.log('direction created sccff:', result);
                } else if (fetchData.status === 401) {
                    console.error('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                    Cookies.remove('role')
                    navigate('/');
                } else {
                    console.log('xatolik yuz berdi:', `${fetchData.statusText} errors, or direction name may be valid.`);
                }
            } catch (error) {
                console.log('Serverga ulanishda xatolik:', error.message);
            } finally {
                setIsLoading(false);
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
                    createDirection();
                } else {
                    console.log('Refresh token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                    Cookies.remove('role');
                    navigate('/')
                }
            } catch (error) {
                console.error('Serverga ulanishda xatolik (refresh):', error.message);
            } finally {
                setIsLoading(false)
            }
        }
    }
    // END update news

    return (
        <div className='adm_prf'>
            <h1>Profil</h1>
            <h6>Rasm va shaxsiy ma'lumotlarni yangilang.</h6>
            <h3>Shaxsiy ma'lumotlar</h3>
            <h5>Shaxsiy maʼlumotlaringizni shu yerda yangilang.</h5>
            <hr />
            <div className="prf_fio">
                <h4>F.I.O</h4>
                <span>
                    <input value={direction_name} onChange={(e) => setDirectionName(e.target.value)} type="text" placeholder='Ismingizni kiriting' />
                    <input value={news_tavsif} onChange={(e) => setNews_tavsif(e.target.value)} type="text" placeholder='Familiyangizni kiriting' />
                </span>
            </div>
            <div className="prf_email">
                <h4>Elektron pochta manzili</h4>
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='Emailingizni kiriting' />
            </div>
            <hr />
            <div className="prf_img">
                <span>
                    <h4>Sizning suratingiz</h4>
                    <p>Bu sizning profilingizda ko'rsatiladi.</p>
                </span>
                <div className='prf_file_img'>
                    <img src={direcs?.image} alt="profile image" />
                    <div
                        className="news-upload-box"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <label htmlFor="fileInput" className="news-upload-label">
                            <div className="news-upload-content">
                                <img src={upload_icon} alt="upload" className="news-upload-icon" />
                                <p>Yuklash uchun bosing <span>yoki sudrab olib tashlang</span></p>
                                <h6>SVG, PNG, JPG yoki GIF (maks. 800x400px)</h6>
                            </div>
                            <input
                                id="fileInput"
                                type="file"
                                accept=".png,.jpg,.jpeg,.gif,.svg"
                                onChange={handleChange}
                                hidden
                            />
                        </label>
                        {error && <p className="news-error-text">{error}</p>}
                        {image && <img src={URL.createObjectURL(image)} alt="Yuklangan rasm" className="news-preview-img" />}
                    </div>
                </div>
            </div>
            <hr />
            <div className="prf_upd_can_wrap">
                <button type="button" className='btn_outline'>Bekor qilish</button>
                <button onClick={(e)=>updateDirec(e)} type="button" className='btn_primary'>Saqlash</button>
            </div>
        </div>
    )
}