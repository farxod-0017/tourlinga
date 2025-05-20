import { useCallback, useEffect, useReducer, useState } from "react"
import '../AdminCSS/admStat.css'

// import upload_icon from "../Images/upload-icon.svg"
// import close_icon from "../Images/close_icon.svg"
import undov from "../Images/undov.svg"
// import edit from "../Images/edit.svg"
// import del from "../Images/del.svg"
import left_pagin from "../Images/pagin_left.svg"
import right_pagin from "../Images/pagin_right.svg"


import { useRef } from "react";
import { mURL } from "../mURL"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';

export default function AdminStatistics() {
    
     // universal blocks
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

    // get fakults
    const [org_faculs, setOrg_faculs] = useState([])
    const getFaculs = useCallback(async () => {
        const current_time = new Date();
        const stored_time = takeOriginalValue('stored_time');
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (timeDiff < 900) {
            try {
                let fetchData = await fetch(`${mURL}/universities/faculties/`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    }
                });
                if (fetchData.ok) {
                    let data = await fetchData.json();
                    setOrg_faculs(data);
                    console.log(data);
                } else if (fetchData.status === 401) {
                    console.log('Token tekshirilmoqda...');
                    Cookies.remove('role');
                    navigate('/login')
                } else {
                    console.log('Xatolik:', fetchData.statusText);
                }
            } catch (error) {
                console.log(`get Directionsda xatolik:, error`);
            }
        }
    }, [navigate, saveEncryptedCookie, takeOriginalValue]);

    // END get Facults

    // get Unvs
    const [org_unvs, setOrg_unvs] = useState([])
    const getUnvs = useCallback(async () => {
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
                    setOrg_unvs(data);
                    console.log(data);
                } else if (fetchData.status === 401) {
                    console.log('Token tekshirilmoqda...');
                    Cookies.remove('role');
                    navigate('/login')
                } else {
                    console.log('Xatolik:', fetchData.statusText);
                }
            } catch (error) {
                console.log(`get Directionsda xatolik:, error`);
            }
        }
    }, [navigate, saveEncryptedCookie, takeOriginalValue]);

    useEffect(() => {
        getUnvs();
        getFaculs();
    }, [ignore, getUnvs, getFaculs]);

    // END get Unvs

    // get news
    const [direcs, setDirecs] = useState([]);
    const [orgDirecs, setOrgDirecs] = useState([]);

    const [fullPage, setFullPage] = useState(0);

    const [fullNumberSuds, setFullNumberStuds] = useState(0); // for extra table head
    const getDirecs = useCallback(async () => {
        const current_time = new Date();
        const stored_time = takeOriginalValue('stored_time');
        const timeDiff = (current_time - new Date(stored_time)) / 60000;
        if (timeDiff < 900) {
            try {
                let fetchData = await fetch(`${mURL}/users/list/?page=1`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                    }
                });
                if (fetchData.ok) {
                    let data = await fetchData.json();
                    // setDirecs(data)
                    setDirecs(data.results);
                    setOrgDirecs(data.results);
                    let counts = Math.ceil(data.count / 10);
                    setFullPage(counts);
                    setFullNumberStuds(data.count)
                    console.log(data);
                } else if (fetchData.status === 401) {
                    console.log('Token tekshirilmoqda...');
                    Cookies.remove('role');
                    navigate('/login')
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

    const getFullStuds = useCallback(async () => {
        console.log(fullPage);

        if (fullPage > 1) {
            let allData = [...orgDirecs]; // 1-sahifadagi malumotlar

            for (let a = 2; a <= fullPage; a++) {
                console.log(a);

                try {
                    const res = await fetch(`${mURL}/users/list/?page=${a}`, {
                        method:"GET",
                        headers: {
                            'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                        }
                    });

                    if (res.ok) {
                        const data = await res.json();
                        allData = [...allData, ...data.results];
                    } else {
                        console.log(`Sahifa ${a} xatosi:`, res.statusText);
                    }
                } catch (error) {
                    console.log(`Sahifa ${a} yuklashda xatolik:`, error.message);
                }
            }

            setDirecs(allData);
            setOrgDirecs(allData);
            console.log(allData);
            console.log('fp:', fullPage);

        }
    }, [fullPage, takeOriginalValue]);

    useEffect(() => {
        if (fullPage > 1) {
            getFullStuds();
        }
    }, [getFullStuds]);

    useEffect(() => {
        getDirecs();
    }, [ignore, getDirecs]);
    // END get news


    // Filtrlash funksiyasi
    const [filterType, setFilterType] = useState('barcha');
    const [filterFacul, setFilterFacul] = useState('barcha');
    const [filterKurs, setFilterKurs] = useState('barcha');

    const [searchText, setSearchText] = useState('')
    const filterPatients = useCallback(() => {
        let result = [...orgDirecs];

        // Ism bo'yicha filtrlash
        if (searchText) {
            result = result.filter((patient) =>
                patient.fish.toLowerCase().includes(searchText.toLowerCase())
            );
        }
        // Tashrif turi bo'yicha filtrlash
        if (filterType !== "barcha") {
            result = result.filter((patient) => patient.university === +filterType);
        }
        if (filterFacul !== "barcha") {
            result = result.filter((patient) => patient.fakultet === +filterFacul);
        }
        if (filterKurs !== "barcha") {
            result = result.filter((patient) => +patient.oquvyili === +filterKurs);
        }

        // Filterlangan ro'yxatni faqat o'zgargan holatda yangilash
        if (JSON.stringify(result) !== JSON.stringify(direcs)) {
            setDirecs(result);
            console.log(result);

        }
    }, [direcs, orgDirecs, searchText, filterType, filterFacul, filterKurs]);

    // "va" qizil rangga kirish funksiyasi
    const highlightText = (text, search) => {
        if (!text || !search) return text;
        const regex = new RegExp(`(${search})`, "gi");
        return text.toString().replace(regex, `<span class="highlight">$1</span>`);
    };
    useEffect(() => {
        filterPatients();
    }, [filterPatients]);
    // Filters For Full Visits END

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
                let fetchData = await fetch(`${mURL}/news/${deltingId}/`, {
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

    // pagination logic
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(direcs?.length / itemsPerPage);

    const currentData = direcs?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const goToPrev = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const goToNext = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    // pagination logic END

    return (
        <section className="adm_news adm_stud">
            {/* Modal Delete */}
            <div ref={del_modal} className="adm_news_modal">
                <div className="adm_del_modal_window">
                    <img src={undov} alt="" />
                    <h4>Yangilikni o'chirish</h4>
                    <p>Haqiqatan ham bu yanglikni({delTitle}) oʻchirib tashlamoqchimisiz? Bu amalni ortga qaytarib bo‘lmaydi.</p>
                    <div className="del_btn_wrap">
                        <button onClick={closeDeleteModal} type="button">Bekor qilish</button>
                        <button onClick={deleteDirecOk} type="button">O‘chirish</button>
                    </div>
                </div>
            </div>

            <h2 className="adm_stud_title">Barcha Talabalar Ro'yxati</h2>
            <div className="adm_news_head adm_stud_head">
                <span>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="barcha">Universitetlar(barcha)</option>
                        {org_unvs?.map((item) => {
                            return (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            )
                        })}
                    </select>
                    <select value={filterFacul} onChange={(e) => setFilterFacul(e.target.value)}>
                        <option value="barcha">Fakultetlar(barcha)</option>
                        {org_faculs?.map((item) => {
                            return (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            )
                        })}
                    </select>
                    <select value={filterKurs} onChange={(e) => setFilterKurs(e.target.value)}>
                        <option value="barcha">O‘quv yili(barcha)</option>
                        <option value="1">1-kurs</option>
                        <option value="2">2-kurs</option>
                        <option value="3">3-kurs</option>
                        <option value="4">4-kurs</option>
                    </select>
                </span>

                <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="Search by FISh" />
            </div>
            {/* Modal Body Table */}
            <div className="extra_table_head">
                <h3>Talabalar ro‘yxati</h3>
                <span>{fullNumberSuds} foydalanuvchi</span>
            </div>
            <div className="table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>T/R</th>
                            <th>FIO</th>
                            <th>OTM</th>
                            <th>Fakultet</th>
                            <th>O‘quv yili</th>
                            <th>Ballar(Σ:{currentData?.reduce((sum, student) => sum + student.ball, 0)})</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData?.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>
                                    <img src={item.image} alt="rasm" className="row-image" />
                                    <span>
                                        <h5
                                            dangerouslySetInnerHTML={{
                                                __html: highlightText(item.fish, searchText),
                                            }}></h5>
                                        <h6>{item.tel}</h6>
                                    </span>
                                </td>
                                <td className="admin-td-description">{org_unvs?.find((e) => e.id === +item.university)?.name}</td>
                                <td className="admin-td-description">{org_faculs?.find((e) => e.id === +item.fakultet)?.name}</td>
                                <td className="admin-td-description">
                                    {item.oquvyili}-kurs
                                </td>
                                <td>{item.ball}</td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="adm_stud_pagin">
                <button
                    onClick={goToPrev}
                    disabled={currentPage === 1}
                    className="btn_outline"
                    type="button"
                >

                    <img src={left_pagin} alt="" />
                    Oldingi
                </button>
                <div>
                    <span>{currentPage}/{totalPages}</span>

                    {/* <span>10</span> */}
                </div>
                <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className="btn_outline" type="button"
                >
                    Keyingi
                    <img src={right_pagin} alt="" />
                </button>
            </div>
        </section>
    )
}