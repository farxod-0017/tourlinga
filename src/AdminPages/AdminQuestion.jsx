import { useCallback, useEffect, useReducer, useState } from "react"
import "../AdminCSS/admQuestions.css"

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

export default function AdminQuestions() {
    const [modalMood, setModalMood] = useState(true);

    const [error, setError] = useState('');

    let adm_news_modal = useRef("")
    function opentModal() {
        adm_news_modal.current.classList.add("open_news_modal");
    };
    function closeModal() {
        adm_news_modal.current.classList.remove("open_news_modal");
    }

    const [selected, setSelected] = useState(""); // tanlangan checkbox value
    const [inputs, setInputs] = useState({
        A: "",
        B: "",
        C: ""
    });

    const handleInputChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleCheckboxChange = (e) => {
        setSelected(e.target.value);
    };

    const handleSave = () => {
        console.log("To'g'ri javob:", selected);
        console.log(inputs);      
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
        setTermTheme(org_unvs ? org_unvs[0]?.id : "");
        setSelected("");
        setInputs({...inputs, A:"", B:"", C:""})
    }
    async function createDirection(e) {
        e.preventDefault();
        const stored_time = takeOriginalValue('stored_time');
        const currentTime = new Date();
        const timeDiff = (currentTime - new Date(stored_time)) / 60000;
        let readyD = {
            title: direction_name,
            A:inputs.A,
            B:inputs.B,
            C:inputs.C,
            true_answer:selected,
            mavzu_id:termTheme
        };
        // const readyD = new FormData();
        // readyD.append('title', direction_name); // o'rniga input qiymatini qo'ying
        // readyD.append("A", news_tavsif)
        // readyD.append("B", news_tavsif)
        // readyD.append("C", news_tavsif)
        // readyD.append("true_answer", 'B')
        // readyD.append('mavzu_id', "2")
        // readyD.append('image', image); // bu endi real File obyekt

        // let answer = {
        //     answers: [
        //         { id: 3, answer: "A" }
        //     ]
        // }
        if (timeDiff < 900) {
            try {
                setIsLoading(true);
                let fetchData = await fetch(`${mURL}/main/savollar/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(readyD)
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
    const [termTheme, setTermTheme] = useState("")
    const [direcs, setDirecs] = useState([]);
    const getDirecs = useCallback(async () => {
        const current_time = new Date();
        const stored_time = takeOriginalValue('stored_time');
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (timeDiff < 900) {
            try {
                let fetchData = await fetch(`${mURL}/main/savollar`, {
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
        setModalMood(false);
        setUpdingId(data.id);
        setDirectionName(data.title);
        setTermTheme(data.mavzu_id);
        setSelected(data.true_answer);
        setInputs({...inputs, A:data.A, B:data.B, C:data.C})
        // setImage(data.image);
    };

    async function updateDirec(e) {
        e.preventDefault();
        const stored_time = takeOriginalValue('stored_time');
        const currentTime = new Date();
        const timeDiff = (currentTime - new Date(stored_time)) / 60000;
        let readyD = {
            title: direction_name,
            A:inputs.A,
            B:inputs.B,
            C:inputs.C,
            true_answer:selected,
            mavzu_id:termTheme,
        };
        // const readyD = new FormData();
        // readyD.append('title', direction_name);
        // readyD.append("content", news_tavsif)
        // readyD.append('image', image); 

        if (timeDiff < 900) {
            try {
                setIsLoading(true);
                let fetchData = await fetch(`${mURL}/main/savollar/${updingId}/`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`,
                        'Content-Type':"application/json"
                    },
                    body: JSON.stringify(readyD)
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
                let fetchData = await fetch(`${mURL}/main/savollar/${deltingId}/`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    },
                });
                //   const result = await fetchData.json();
                //   console.log(result);
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
    }, [ignore, getDirecs]);
    return (
        <section className="adm_news">
            {/* Modal Delete */}
            <div ref={del_modal} className="adm_news_modal">
                <div className="adm_del_modal_window">
                    <img src={undov} alt="" />
                    <h4>Savolni o'chirish</h4>
                    <p>Haqiqatan ham bu Saavolni({delTitle}) oʻchirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo‘lmaydi.</p>
                    <div className="del_btn_wrap">
                        <button onClick={closeDeleteModal} type="button">Bekor qilish</button>
                        <button onClick={deleteDirecOk} type="button">O‘chirish</button>
                    </div>
                </div>
            </div>

            {/* Modal Post and PUT News */}
            <div ref={adm_news_modal} className="adm_news_modal adm_question_window">
                <div className="adm_modal_window adm_question_modal">
                    <div className="adm_modal_head">
                        <h2>Savol yaratish</h2>
                        <img onClick={closeModal} src={close_icon} alt="" />
                    </div>
                    <div className="quest_mavzu_tanla">
                        <b>Mavzu tanlang</b>
                        <select value={termTheme} onChange={(e) => setTermTheme(e.target.value)}>
                            <option disabled value="0">Mavzuni tanlang</option>
                            {org_unvs?.map((item) => {
                                return (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                )
                            })}
                        </select>

                    </div>
                    <div className="adm_savol_inp">
                        <h4>Savolni kiriting</h4>
                        <textarea value={direction_name} onChange={(e) => setDirectionName(e.target.value)} className="tavsif_text" placeholder="Savol kiriting..."></textarea>
                    </div>

                    <div className="question_adm_box">
                        {["A", "B", "C"].map((label) => (
                            <div className="answer_row" key={label}>
                                <span className="label">{label}</span>
                                <div className="asnwer_right">
                                    <input
                                        type="text"
                                        name={label}
                                        value={inputs[label]}
                                        onChange={handleInputChange}
                                        className="text_input"
                                        placeholder="javob variantingizni kiriting"
                                    />
                                    <div >
                                        <label className="checkbox_wrapper">
                                            <input
                                                type="checkbox"
                                                name="correct"
                                                value={label}
                                                checked={selected === label}
                                                onChange={handleCheckboxChange}
                                            />
                                            <span className="custom_checkbox"></span>
                                        </label>
                                        <h6>Tog‘ri javob</h6>
                                    </div>

                                </div>

                            </div>
                        ))}
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
                    <h2>Savollar</h2>
                    <h6>Savollar ro'yhati</h6>
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
                    Savol qo‘shish
                </button>
            </div>
            {/* Modal Body Table */}
            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>T/R</th>
                            <th>Savol</th>
                            <th>Mavzusi</th>
                            <th>Varian A</th>
                            <th>Varian B</th>
                            <th>Varian C</th>
                            <th>Sozlamalar</th>
                        </tr>
                    </thead>
                    <tbody>
                    {/* .slice()?.reverse()? */}
                        {direcs?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index+1}</td>
                                <td>{item.title}</td>
                                <td className="admin-td-description">{org_unvs?.find(e=> e.id === +item.mavzu_id)?.name}</td>
                                <td className={item.true_answer === "A" ? "adm_true_answer" :""}>
                                    {item.A}
                                </td>
                                <td className={item.true_answer === "B" ? "adm_true_answer" :""}>{item.B}</td>
                                <td className={item.true_answer === "C" ? "adm_true_answer" :""}>{item.C}</td>
                                <td>
                                    <div className="action-buttons">
                                        {/* <button className="btn view-btn">👁️</button> */}
                                        <button onClick={(e) => openUpdateModal(e, { id: item.id, title: item.title, true_answer: item.true_answer, A:item.A, B:item.B, C:item.C, mavzu_id:item.mavzu_id })} className="btn edit-btn"><img src={edit} alt="" /></button>
                                        <button onClick={(e) => openDeleteModal(e, item.id, item.title)} className="btn delete-btn"><img src={del} alt="" /></button>
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