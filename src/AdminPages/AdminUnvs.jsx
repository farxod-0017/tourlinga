import { useRef } from "react"
import "../AdminCSS/admUnvs.css"

import { useCallback, useEffect, useReducer, useState } from "react"

import undov from "../Images/undov.svg"
import { mURL } from "../mURL"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';

import plus from "../Images/plus.svg"
import pdots from "../Images/pdots.svg"
import users from "../Images/users.svg"
import edit from "../Images/edit.svg"
import del from "../Images/del.svg"

export default function AdminUnvs() {

    let pp_modal = useRef("");
    const [modalMood, setModalMood] = useState(true);
    function opentModal() {
        pp_modal.current.classList.add("open_news_modal");
    };
    function closeModal() {
        pp_modal.current.classList.remove("open_news_modal");
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

    // create news
    const [direction_name, setDirectionName] = useState("");
    function openCreateModal() {
        opentModal();
        setModalMood(true);
        setDirectionName("");
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
        readyD.append('name', direction_name); // o'rniga input qiymatini qo'ying

        if (timeDiff < 900) {
            try {
                setIsLoading(true);
                let fetchData = await fetch(`${mURL}/universities/universities/`, {
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

    // get Unvs
    const [org_unvs, setOrg_unvs] = useState([])
    const [direcs, setDirecs] = useState([]);
    const getDirecs = useCallback(async () => {
        const current_time = new Date();
        const stored_time = takeOriginalValue('stored_time');
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (timeDiff < 900) {
            try {
                let fetchData = await fetch(`${mURL}/universities/universities/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    }
                });
                if (fetchData.ok) {
                    let data = await fetchData.json();
                    let data_visible = data?.map((item) => ({ ...item, visible: false }))
                    setDirecs(data_visible);
                    setOrg_unvs(data_visible);
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
    }, [ignore, getDirecs]);
    // END get Unvs

    function showPpModal(e, id) {
        let new_state = org_unvs?.map((item) => item.id === id
            ? { ...item, visible: true }
            : { ...item, visible: false }
        );
        setDirecs(new_state)
    }
    // END get news

    // update news
    const [updingId, setUpdingId] = useState(null);
    function openUpdateModal(e, data) {
        opentModal();
        setModalMood(false);
        setDirectionName(data.title);
        setUpdingId(data.id);
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
        readyD.append('name', direction_name); // o'rniga input qiymatini qo'ying

        if (timeDiff < 900) {
            try {
                setIsLoading(true);
                let fetchData = await fetch(`${mURL}/universities/universities/${updingId}/`, {
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
                let fetchData = await fetch(`${mURL}/universities/universities/${deltingId}/`, {
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
        <section className="adm_unv">
            {/* Modal Delete */}
            <div ref={del_modal} className="adm_news_modal">
                <div className="adm_del_modal_window">
                    <img src={undov} alt="" />
                    <h4>Universitetni o'chirish</h4>
                    <p>Haqiqattan ham bu universitetni({delTitle}) oʻchirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo‘lmaydi.</p>
                    <div className="del_btn_wrap">
                        <button onClick={closeDeleteModal} type="button">Bekor qilish</button>
                        <button onClick={deleteDirecOk} type="button">O‘chirish</button>
                    </div>
                </div>
            </div>
            {/* Modal Post and PUT News */}
            <div ref={pp_modal} className="adm_news_modal">
                <div className="adm_del_modal_window adm_pp_modal_window">
                    <h4>Universitet {modalMood ? "qo‘shish" : "yangilash"} </h4>
                    <p>Universitet nomi</p>
                    <input value={direction_name} onChange={(e) => setDirectionName(e.target.value)} placeholder="Universitet nomini kiriting" type="text" />
                    <div className="del_btn_wrap">
                        {modalMood ? (
                            <span>
                                <button onClick={closeModal} type="button" className="btn_outline">Bekor qilish</button>
                                <button onClick={(e) => createDirection(e)} type="button" className="btn_primary">Tasdiqlash</button>
                            </span>
                        ) :
                            (
                                <span>
                                    <button onClick={closeModal} className="btn_outline">Bekor qilish</button>
                                    <button onClick={(e) => updateDirec(e)} className="btn_primary">Tasdiqlash (Upd)</button>
                                </span>
                            )}
                    </div>
                </div>
            </div>

            <div className="adm_news_head">
                <span>
                    <h2>Universitetlar</h2>
                    <h6>Ta’lim muassasalari ro‘yxati.</h6>
                </span>
                <button onClick={(e) => openCreateModal(e)} className="btn_primary" type="button">
                    <img src={plus} alt="" />
                    Universitet qo‘shish
                </button>
            </div>

            <div className="adm_unv_wrap">
                {direcs?.map((item, index) => {
                    return (
                        <div key={index + 1} className="adm_unv_box">
                            <div className="adm_unv_box_top">
                                <h4>{item.name}</h4>
                                <div className="unv_pp_dots">
                                    <img onClick={(e) => showPpModal(e, item.id)} src={pdots} alt="" />
                                    <div className={`unv_pp_window`} id={item.visible ? `open_unv_pp_window` : ""}>
                                        <span onClick={(e) => openUpdateModal(e, { title: item.name, id: item.id })}>
                                            <img src={edit} alt="" />
                                            <h6>Taxrirlash</h6>
                                        </span>
                                        <span onClick={(e)=>openDeleteModal(e, item.id, item.name)}>
                                            <img src={del} alt="" />
                                            <h6>O‘chirib tashlash</h6>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="adm_unv_box_bot">
                                <img src={users} alt="" />
                                <h5>Talabalar soni: {item.user_count}</h5>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}