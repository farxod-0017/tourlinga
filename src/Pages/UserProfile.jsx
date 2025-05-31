import '../Styles/userPrf.css'
import { useCallback, useEffect, useReducer, useState } from "react"

import { mURL } from "../mURL"
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';

import upload_icon from "../Images/upload-icon.svg"


export default function UserProfile() {
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
    const location = useLocation();
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

    // toast login message
    useEffect(() => {
        if (location.state?.toastMessage) {
            toast.success(location.state.toastMessage);

            // 🔄 toast ko‘rsatib bo‘lgach, state'ni tozalash
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate, location.pathname]);

    // END toast login message

    // get unv and faculty
    const [unvs, setUnvs] = useState([]);
    const getUnvs = async () => {
        try {
            let fetchData = await fetch(`${mURL}/universities/universities/`, {
                method: 'GET',
            });
            let data = await fetchData.json();
            setUnvs(data)
            console.log(data);
        } catch (error) {
            console.log(`get Directionsda xatolik:, error`);
        }
    };
    const [faculs, setFaculs] = useState([])
    const getFaculty = async () => {
        try {
            let fetchData = await fetch(`${mURL}/universities/faculties/`, {
                method: 'GET',
            });
            let data = await fetchData.json();
            setFaculs(data)
            console.log(data);
        } catch (error) {
            console.log(`get Directionsda xatolik:, error`);
        }
    };
    useEffect(() => {
        getUnvs()
        getFaculty();
    }, [])
    // END get unv and faculty

    const [direction_name, setDirectionName] = useState("");
    const [news_tavsif, setNews_tavsif] = useState("");
    const [email, setEmail] = useState("");
    const [unv, setUnv] = useState("");
    const [facul, setFacul] = useState("");
    const [kurs, setKurs] = useState("")

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
                    setFacul(data.fakultet);
                    setUnv(data.university);
                    setKurs(data.oquvyili);

                    console.log(data);
                } else if (fetchData.status === 401) {
                    toast.error('Token yaroqsiz, login sahifasiga yonaltirilmoqda');
                    setTimeout(() => {
                        sessionStorage.clear('userId')
                        Cookies.remove('role');
                        navigate('/login')
                    },1500);

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
        if (image) {
            readyD.append('image', image);
        }
        readyD.append('first_name', direction_name); // o'rniga input qiymatini qo'ying
        readyD.append("last_name", news_tavsif);
        readyD.append('email', email);
        readyD.append('fakultet', facul);
        readyD.append('university', unv);
        readyD.append('oquvyili', kurs);


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

                const result = await fetchData.json();
                if (fetchData.ok) {
                    fourceUpdate();
                    setImage(null);
                    toast.success("Ma'lumotlaringiz muvaffaqqiyatli yangilandi")
                } else if (fetchData.status === 401) {
                    toast.error('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                    setTimeout(() => {
                        sessionStorage.clear('userId')
                        Cookies.remove('role')
                        navigate('/login');
                    }, 1500)
                } else {
                    toast.error(`Xatolik: ${result?.error}`)
                }
            } catch (error) {
                toast.warn(`Serverga ulanishda xatolik: ${error.message}, yoki Internet aloqangizni tekshirib qayta urinib ko'ring `)
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
        <section className='user_prf'>
            <ToastContainer />
            <div className='adm_prf'>
                <div className="theme_head">
                    <ul>
                        <li>Bosh sahifa </li>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                            <path
                                d="M6.83 5.29001L2.59 1.05001C2.49704 0.956281 2.38644 0.881887 2.26458 0.831118C2.14272 0.780349 2.01202 0.754211 1.88 0.754211C1.74799 0.754211 1.61729 0.780349 1.49543 0.831118C1.37357 0.881887 1.26297 0.956281 1.17 1.05001C0.983753 1.23737 0.879211 1.49082 0.879211 1.75501C0.879211 2.0192 0.983753 2.27265 1.17 2.46001L4.71 6.00001L1.17 9.54001C0.983753 9.72737 0.879211 9.98082 0.879211 10.245C0.879211 10.5092 0.983753 10.7626 1.17 10.95C1.26344 11.0427 1.37426 11.116 1.4961 11.1658C1.61793 11.2155 1.7484 11.2408 1.88 11.24C2.01161 11.2408 2.14207 11.2155 2.26391 11.1658C2.38575 11.116 2.49656 11.0427 2.59 10.95L6.83 6.71001C6.92373 6.61705 6.99813 6.50645 7.04889 6.38459C7.09966 6.26273 7.1258 6.13202 7.1258 6.00001C7.1258 5.868 7.09966 5.73729 7.04889 5.61543C6.99813 5.49357 6.92373 5.38297 6.83 5.29001Z"
                                fill="#717680"
                            />
                        </svg>
                        <li>Profile</li>
                    </ul>
                </div>
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
                        {
                            direcs?.image ?
                                <img src={direcs?.image} alt="profile image" /> :
                                <p>rasm yuklanmagan</p>

                        }
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
                <div className="prf_selecs_wrap">
                    <div>
                        <h4>Universitet nomi</h4>
                        <select value={unv} onChange={(e) => setUnv(e.target.value)}>
                            {unvs?.map((item) => {
                                return (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div>
                        <h4>O‘quv kursi</h4>
                        <select value={kurs} onChange={(e) => setKurs(e.target.value)}>
                            <option value="1">1-kurs</option>
                            <option value="2">2-kurs</option>
                            <option value="3">3-kurs</option>
                            <option value="4">4-kurs</option>
                        </select>
                    </div>
                    <div>
                        <h4>Fakultet</h4>
                        <select value={facul} onChange={(e) => setFacul(e.target.value)}>
                            {faculs?.map((item) => {
                                return (
                                    <option value={item.id} key={item.id}>{item.name}</option>
                                )
                            })}
                        </select>
                    </div>
                </div>
                <hr />
                <div className="prf_upd_can_wrap">
                    <button type="button" className='btn_outline'>Bekor qilish</button>
                    {
                        isLoading ?
                            <button type="button" className='btn_primary loadingB'>Yuklanmoqda ...</button> :
                            <button onClick={(e) => updateDirec(e)} type="button" className='btn_primary'>Saqlash</button>
                    }
                </div>
            </div>
        </section>

    )
}