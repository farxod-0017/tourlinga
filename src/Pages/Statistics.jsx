import { useCallback, useEffect, useReducer, useState } from "react"
import '../Styles/stat.css'
// import upload_icon from "../Images/upload-icon.svg"
// import close_icon from "../Images/close_icon.svg"
import undov from "../Images/undov.svg"
// import edit from "../Images/edit.svg"
// import del from "../Images/del.svg"
import left_pagin from "../Images/pagin_left.svg"
import right_pagin from "../Images/pagin_right.svg"
import arrow_up from '../Images/arrow-up.svg'
import arrow_down from "../Images/arrow-down.svg"


import { mURL } from "../mURL"
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';
import { useDirecs } from "../context/DirecsContext"
import AuthRequired from "../components/AuthRequired"

export default function Statistics() {

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
                    navigate('/login')
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
                        method: "GET",
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

    // statistika Top
    const [stats, setStats] = useState({});
    const getStats = useCallback(async () => {
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
                    setStats(data);
                    console.log(data);
                } else if (fetchData.status === 401) {
                    console.log('Token tekshirilmoqda...');
                    Cookies.remove('role');
                    navigate('/login')
                } else {
                    console.log('Xatolik:', fetchData.statusText);
                }
            } catch (error) {
                console.log(`get Directionsda xatolik:, ${error}`);
            }
        }

    }, [navigate, saveEncryptedCookie, takeOriginalValue]);

    useEffect(() => {
        getStats();
    }, [getStats]);
    // statistika Top END

    // global context
    const info = useDirecs();
    console.log(info);

    // END global context
    const getUserInitials = (user) => {
        if (!user) return '';
        const firstInitial = user.first_name ? user.first_name[0].toUpperCase() : '';
        const lastInitial = user.last_name ? user.last_name[0].toUpperCase() : '';
        return firstInitial + lastInitial;
    };

    return (
        <div className="full_stat">
            {sessionStorage.getItem('userId') ?
                <section className="adm_news adm_stud user_stat">
                    <span className="user_stat_nav">
                        <NavLink to={'/'}>Bosh sahifa</NavLink>
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                            <path
                                d="M6.83 5.29001L2.59 1.05001C2.49704 0.956281 2.38644 0.881887 2.26458 0.831118C2.14272 0.780349 2.01202 0.754211 1.88 0.754211C1.74799 0.754211 1.61729 0.780349 1.49543 0.831118C1.37357 0.881887 1.26297 0.956281 1.17 1.05001C0.983753 1.23737 0.879211 1.49082 0.879211 1.75501C0.879211 2.0192 0.983753 2.27265 1.17 2.46001L4.71 6.00001L1.17 9.54001C0.983753 9.72737 0.879211 9.98082 0.879211 10.245C0.879211 10.5092 0.983753 10.7626 1.17 10.95C1.26344 11.0427 1.37426 11.116 1.4961 11.1658C1.61793 11.2155 1.7484 11.2408 1.88 11.24C2.01161 11.2408 2.14207 11.2155 2.26391 11.1658C2.38575 11.116 2.49656 11.0427 2.59 10.95L6.83 6.71001C6.92373 6.61705 6.99813 6.50645 7.04889 6.38459C7.09966 6.26273 7.1258 6.13202 7.1258 6.00001C7.1258 5.868 7.09966 5.73729 7.04889 5.61543C6.99813 5.49357 6.92373 5.38297 6.83 5.29001Z"
                                fill="#717680"
                            />
                        </svg>
                        <NavLink to={'/statistics'}>Statistika</NavLink>
                    </span>
                    <h2 className="adm_stud_title">Statistika</h2>

                    <div className="adm_home user_stat_box">
                        <h1>Xush kelibsiz {info?.first_name} !</h1>
                        <h3>Ballaringizni kuzatib va ko‘paytirib boring.</h3>
                        <div className="stat_grid">
                            {Object.entries(stats).map(([key, value]) => (
                                <div key={key} className='stat_box'>
                                    <h4>{key === "mavzu" ? "Mavzular soni" : key === "savol" ? "Savollar soni" : key === "termin" ? "Terminlar soni" : key === "talabalar" ? "Talabalar soni" : key === "universitetlar" ? "Universitetlar soni" : key === "talabalar_ball" ? "To‘plangan ballar" : "Ko'rsatkich"}</h4>
                                    <h2>{value.current}</h2>
                                    <div>
                                        {value.percent_change >= 0 ?
                                            <img src={arrow_up} alt="" />
                                            :
                                            <img src={arrow_down} />
                                        }
                                        <h5>
                                            <span>{value.percent_change}%</span>
                                            vs last month
                                        </h5>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

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
                                        <td className="stat_first_td">
                                            {item.image ?
                                                <img src={item.image} alt="rasm" className="row-image" />
                                                : <div className="avatar_fallback">{getUserInitials(item)}</div>
                                            }
                                            <span>
                                                <h5
                                                    dangerouslySetInnerHTML={{
                                                        __html: highlightText(item.fish, searchText),
                                                    }}></h5>
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
                            <span>Oldingi</span>
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
                            <span>Keyingi</span>
                            <img src={right_pagin} alt="" />
                        </button>
                    </div>
                </section>
                :
                <AuthRequired pageName={"Statistika"} />
            }
        </div>

    )
}