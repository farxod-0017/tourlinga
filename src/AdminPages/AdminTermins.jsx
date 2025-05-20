import { useCallback, useEffect, useReducer, useState } from "react"
import "../AdminCSS/adminNews.css"
import "../AdminCSS/admTermin.css"

import upload_icon from "../Images/upload-icon.svg"
import close_icon from "../Images/close_icon.svg"
import undov from "../Images/undov.svg"
import edit from "../Images/edit.svg"
import del from "../Images/del.svg"

import { useRef } from "react";
import { mURL } from "../mURL"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';

export default function AdminTermins() {
    const [modalMood, setModalMood] = useState(true);

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


    let adm_news_modal = useRef("")
    function opentModal() {
        adm_news_modal.current.classList.add("open_news_modal");
    };
    function closeModal() {
        adm_news_modal.current.classList.remove("open_news_modal");
        setDirectionName("");
        setNews_tavsif("");
        setDirectionNameEng("");
        setNews_tavsif_eng("")
        setImage("")
        setTermin_havola("")
        setTermTheme("")
    }

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

    const formatDate = (isoString) => {
        const date = new Date(isoString);

        // Mahalliy vaqt zonasi bo'yicha o'qiladi
        return date.toLocaleString("uz-UZ", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // END universal blocks

    const [termTheme, setTermTheme] = useState("")

    // get Themes
    const [org_unvs, setOrg_unvs] = useState([])
    const getThemes = useCallback(async () => {
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
                    setOrg_unvs(data);
                    let first_id = data[0]?.id
                    setTermTheme(first_id);
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
                    navigate('/')
                }
            } catch (error) {
                console.error('Serverga ulanishda xatolik (refresh):', error.message);
            }
        }

    }, [navigate, saveEncryptedCookie, takeOriginalValue]);

    useEffect(() => {
        getThemes();
    }, [ignore, getThemes]);
    // END get themes

    // create news
    const [direction_name, setDirectionName] = useState("");
    const [news_tavsif, setNews_tavsif] = useState("");
    const [direction_name_eng, setDirectionNameEng] = useState("");
    const [news_tavsif_eng, setNews_tavsif_eng] = useState("");
    const [termin_havola, setTermin_havola] = useState("");
    function openCreateModal() {
        opentModal();
        setModalMood(true);
        setDirectionName("");
        setNews_tavsif("");
        setDirectionNameEng("");
        setNews_tavsif_eng("")
        setImage("")
        setTermin_havola("")
        // setTermTheme("")
    }
    async function createDirection(e) {
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
        readyD.append('uzbw', direction_name); // o'rniga input qiymatini qo'ying
        readyD.append("engw", direction_name_eng)
        readyD.append('image', image);
        readyD.append('mavzu_id', termTheme);
        readyD.append('link', termin_havola);
        readyD.append('uzbwt', news_tavsif);
        readyD.append('engwt', news_tavsif_eng)

        if (timeDiff < 900) {
            try {
                setIsLoading(true);
                let fetchData = await fetch(`${mURL}/main/terminlar/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    },
                    body: readyD
                });
                if (fetchData.ok) {
                    const result = await fetchData.json();
                    fourceUpdate();
                    closeModal()
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
    // create news END

    // get news
    const [direcs, setDirecs] = useState([]);
    const getDirecs = useCallback(async () => {
        const current_time = new Date();
        const stored_time = takeOriginalValue('stored_time');
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (timeDiff < 900) {
            try {
                let fetchData = await fetch(`${mURL}/main/terminlar`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    }
                });
                if (fetchData.ok) {
                    let data = await fetchData.json();
                    setDirecs(data)
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
    const [updingId, setUpdingId] = useState(null);
    function openUpdateModal(e, data) {
        opentModal();
        setDirectionName(data.uzbw);
        setNews_tavsif(data.uzbwt);
        setDirectionNameEng(data.engw);
        setNews_tavsif_eng(data.engwt);
        setTermTheme(data.mavzu_id);
        setTermin_havola(data.link)

        setUpdingId(data.id);
        setModalMood(false);
        setImage("")
        // setImage(data.image);
    };

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
        readyD.append('uzbw', direction_name); // o'rniga input qiymatini qo'ying
        readyD.append("uzbwt", news_tavsif)
        readyD.append('image', image);
        readyD.append('engwt', news_tavsif_eng)
        readyD.append('engw', direction_name_eng)
        readyD.append('link', termin_havola)
        readyD.append('mavzu_id', termTheme);

        if (timeDiff < 900) {
            try {
                setIsLoading(true);
                let fetchData = await fetch(`${mURL}/main/terminlar/${updingId}/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    },
                    body: readyD
                });
                if (fetchData.ok) {
                    const result = await fetchData.json();
                    fourceUpdate();
                    closeModal()
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

    // delete news
    let del_modal = useRef("");
    const [deltingId, setDeltingID] = useState(null);
    const [delTitle, setDelTitle] = useState("")
    function openDeleteModal(e, id, title) {
        setDeltingID(id);
        setDelTitle(title);
        del_modal.current.classList.add("open_news_modal");
    };
    function closeDeleteModal() {
        del_modal.current.classList.remove("open_news_modal");
    };
    async function deleteDirecOk(e) {
        e.preventDefault();
        const stored_time = takeOriginalValue('stored_time');
        const currentTime = new Date();
        const timeDiff = (currentTime - new Date(stored_time)) / 60000;
        if (timeDiff < 900) {
            try {
                setIsLoading(true);
                let fetchData = await fetch(`${mURL}/main/terminlar/${deltingId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    },
                });
                const result = await fetchData.json();
                console.log(result);
                fourceUpdate();

                //   if (fetchData.ok) {
                //     fourceUpdate();
                //     closeDeleteModal()
                //     console.log('direc DELETED sccff:', result);
                //   } else if (fetchData.status === 401) {
                //     console.error('Token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                //     Cookies.remove('role')
                //     navigate('/');
                //     window.location.reload()
                //   } else {
                //     console.log('xatolik yuz berdi:', `${fetchData.statusText} errors, or phone number may be valid.`);
                //   }
            } catch (error) {
                console.log('Serverga ulanishda xatolik:', error.message);
            } finally {
                setIsLoading(false);
                closeDeleteModal()
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
                    deleteDirecOk(e);
                } else {
                    console.log('Refresh token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
                    Cookies.remove('role');
                    navigate('/');
                    window.location.reload()
                }
            } catch (error) {
                console.error('Serverga ulanishda xatolik (refresh):', error.message);
            } finally {
                setIsLoading(false)
            }
        }
    }
    // END delete news

    return (
        <section className="adm_news">
            {/* Modal Delete */}
            <div ref={del_modal} className="adm_news_modal adm_del_modal">
                <div className="adm_del_modal_window">
                    <img src={undov} alt="" />
                    <h4>Terminni o'chirish</h4>
                    <p>Haqiqatan ham bu Terminni({delTitle}) oʻchirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo‘lmaydi.</p>
                    <div className="del_btn_wrap">
                        <button onClick={closeDeleteModal} type="button">Bekor qilish</button>
                        <button onClick={deleteDirecOk} type="button">O‘chirish</button>
                    </div>
                </div>
            </div>

            {/* Modal Post and PUT News */}
            <div ref={adm_news_modal} className="adm_news_modal adm_termin_modal">
                <div className="adm_modal_window">
                    <div className="adm_modal_head">
                        <h2>Termin yaratish</h2>
                        <img onClick={closeModal} src={close_icon} alt="" />
                    </div>
                    <h1>Terminlar nomi</h1>
                    <div className="termin_name_wrap">
                        <div>
                            <h4>O‘zbek tilida</h4>
                            <textarea value={direction_name} onChange={(e) => setDirectionName(e.target.value)} placeholder="Termin kiriting..."></textarea>
                        </div>
                        <div>
                            <h4>Ingliz tilida</h4>
                            <textarea value={direction_name_eng} onChange={(e) => setDirectionNameEng(e.target.value)} placeholder="Termin kiriting..."></textarea>
                        </div>
                    </div>
                    <h1>Terminlar tavsifi</h1>
                    <div className="termin_tavsif_wrap">
                        <div>
                            <h4>O‘zbek tilida</h4>
                            <textarea value={news_tavsif} onChange={(e) => setNews_tavsif(e.target.value)} className="tavsif_text" placeholder="Tavsif kiriting..."></textarea>
                        </div>
                        <div>
                            <h4>Ingliz tilida</h4>
                            <textarea value={news_tavsif_eng} onChange={(e) => setNews_tavsif_eng(e.target.value)} className="tavsif_text" placeholder="Tavsif kiriting..."></textarea>
                        </div>
                    </div>
                    <div className="termin_url_mavzu">
                        <span>
                            <b>Havola kiriting</b>
                            <input value={termin_havola} onChange={(e) => setTermin_havola(e.target.value)} placeholder="Havola kiriting" type="url" />
                        </span>
                        <span>
                            <b>Mavzu tanlang</b>
                            <select value={termTheme} onChange={(e) => setTermTheme(e.target.value)}>
                                {org_unvs?.map((item) => {
                                    return (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })}

                            </select>
                        </span>

                    </div>
                    <div>
                        <h4>Rasm yuklang</h4>
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

                    <div className="adm_submit_wrap">
                        {modalMood ? (
                            <span>
                                <button onClick={closeModal} type="button" className="btn_outline">Bekor qilish</button>
                                <button onClick={(e) => createDirection(e)} type="button" className="btn_primary">Saqlash</button>
                            </span>
                        ) :
                            (
                                <span>
                                    <button onClick={closeModal} className="btn_outline">Bekor qilish</button>
                                    <button onClick={(e) => updateDirec(e)} className="btn_primary">Saqlash (Upd)</button>
                                </span>
                            )}
                    </div>
                </div>
            </div>

            <div className="adm_news_head">
                <span>
                    <h2>Terminlar</h2>
                    <h6>Terminlar ro'yhati.</h6>
                </span>
                <button onClick={(e) => openCreateModal(e)} className="btn_primary" type="button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M14.06 4.94l3.75 3.75"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <path
                            d="M19 21v-4M17 19h4"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    Termin qo‘shish
                </button>
            </div>
            {/* Modal Body Table */}
            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>T/R</th>
                            <th>Termin nomi</th>
                            <th>Tavsif</th>
                            <th>Rasmi</th>
                            <th>Mavzusi</th>
                            <th>Sozlamalar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* direcs?.slice()?.reverse()?.map */}
                        {direcs?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>{item.uzbw}/{item.engw}</td>
                                <td className="admin-td-description">{item.uzbwt} <br /> {item.engwt}</td>
                                <td>
                                    <img src={item.image} alt="rasm" className="row-image" />
                                </td>
                                <td>{org_unvs?.find((t) => t.id === +item.mavzu_id)?.name}</td>
                                <td>
                                    <div className="action-buttons">
                                        {/* <button className="btn view-btn">👁️</button> */}
                                        <button onClick={(e) => openUpdateModal(e, { id: item.id, uzbw: item.uzbw, uzbwt: item.uzbwt, engw: item.engw, engwt: item.engwt, mavzu_id: item.mavzu_id, link: item.link })} className="btn edit-btn"><img src={edit} alt="" /></button>
                                        <button onClick={(e) => openDeleteModal(e, item.id, item.uzbw)} className="btn delete-btn"><img src={del} alt="" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}