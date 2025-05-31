import '../Styles/questData.css'


import { useCallback, useEffect, useReducer, useRef, useState } from "react"

import { mURL } from "../mURL"
import { NavLink, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

import checked_inp from '../Images/checked_inp.svg'
import success_icon from "../Images/success_icon.svg"
import { useDirecs } from '../context/DirecsContext';
import AuthRequired from '../components/AuthRequired';

export default function QuestData() {

    const [searchType, setSearchType] = useState(true)

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

    const [selectedTmId, setSelectedTmId] = useState(0);

    // get Themes
    const [direcs, setDirecs] = useState([]);
    const [orgDirecs, setOrgDirecs] = useState([]);
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
                    setOrgDirecs(data)
                    let first_id = data[0]?.id
                    setSelectedTmId(first_id);
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

    // get news
    const [terms, setTerms] = useState([]);
    const [orgTerms, setOrgTerms] = useState([])
    const getTerms = useCallback(async () => {
        const current_time = new Date();
        const stored_time = takeOriginalValue('stored_time');
        const timeDiff = (current_time - new Date(stored_time)) / 60000;

        if (selectedTmId) {
            if (timeDiff < 900) {
                try {
                    setIsLoading(true)
                    let fetchData = await fetch(`${mURL}/main/savollar-by-mavzu/${selectedTmId}/`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${takeOriginalValue('access_token')}`
                        }
                    });
                    if (fetchData.ok) {
                        let data = await fetchData.json();
                        setTerms(data)
                        setOrgTerms(data)
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
                } finally {
                    setIsLoading(false)
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

    // END get news

    // Filtrlash funksiyasi
    const [searchText, setSearchText] = useState('')
    const filterPatients = useCallback(() => {
        if (searchType) {
            let result = [...orgDirecs];

            // Ism bo'yicha filtrlash
            if (searchText) {
                result = result.filter((patient) =>
                    patient.name.toLowerCase().includes(searchText.toLowerCase())
                );
            }
            // Filterlangan ro'yxatni faqat o'zgargan holatda yangilash
            if (JSON.stringify(result) !== JSON.stringify(direcs)) {
                setDirecs(result);
            }
        } else {
            let result = [...orgTerms];

            // Ism bo'yicha filtrlash
            if (searchText) {
                result = result.filter((patient) =>
                    patient.title.toLowerCase().includes(searchText.toLowerCase())
                );
            }
            // Filterlangan ro'yxatni faqat o'zgargan holatda yangilash
            if (JSON.stringify(result) !== JSON.stringify(terms)) {
                setTerms(result);
            }
        }

    }, [direcs, orgDirecs, searchText, terms, orgTerms]);

    // "va" qizil rangga kirish funksiyasi
    const highlightText = (text, search) => {
        if (!text || !search) return text;
        const regex = new RegExp(`(${search})`, "gi");
        if (searchType) {
            return text.toString().replace(regex, `<span class="highlight inline_tag">$1</span>`);
        } else {
            return text.toString().replace(regex, `<h5 class="highlight inline_tag">$1</h5>`);
        }
    };
    useEffect(() => {
        filterPatients();
    }, [filterPatients]);
    // Filters For Full Visits END


    const [answers, setAnswers] = useState([]);

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers(prevAnswers => {
            const existing = prevAnswers.find(ans => ans.id === questionId);
            if (existing) {
                return prevAnswers.map(ans =>
                    ans.id === questionId ? { ...ans, answer: selectedOption } : ans
                );
            } else {
                return [...prevAnswers, { id: questionId, answer: selectedOption }];
            }
        });
    };

    // delete news
    const [checked, setChecked] = useState(false);

    let del_modal = useRef("");
    function openDeleteModal(e, id, title) {
        del_modal.current.classList.add("open_news_modal");
    };
    function closeDeleteModal() {
        del_modal.current.classList.remove("open_news_modal");
        setChecked(true)
    };
    // END delete news

    const [result, setResult] = useState([])
    const handleSubmit = async (e) => {
        console.log("APIga yuboriladi:", answers);
        // fetch("/api/submit", { method: "POST", body: JSON.stringify(answers) });
        e.preventDefault();
        const stored_time = takeOriginalValue('stored_time');
        const currentTime = new Date();
        const timeDiff = (currentTime - new Date(stored_time)) / 60000;
        let readyD = {
            answers: answers
        }
        if (timeDiff < 900) {
            try {
                setIsLoading(true);
                let fetchData = await fetch(`${mURL}/main/check-answers/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${takeOriginalValue('access_token')}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(readyD)
                });
                if (fetchData.ok) {
                    const result = await fetchData.json();
                    console.log('direction created sccff:', result);
                    if (result.results.length > 0) {
                        setResult(result);
                        openDeleteModal()
                    }
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
    };

    function goNewTest() {
        setChecked(true);
        window.location.reload()
    }
    // Birlashtirish:
    let merged = terms?.map(itemB => {
        let results = result?.results
        let itemA = results?.find(a => a.id === itemB.id);
        return {
            ...itemB,
            ...(itemA ? { your_answer: itemA.your_answer, correct_answer: itemA.correct_answer } : {}) // A arraydan answer qo‘shiladi, agar topilsa
        };
    });
    console.log(merged);

    // global state
    const info = useDirecs()
    // global stata END
    return (
        <div>
            {sessionStorage.getItem('userId') ?

                <section className='terms'>
                    {/* Modal Result */}
                    <div ref={del_modal} className="adm_news_modal adm_del_modal">
                        <div className="adm_del_modal_window">
                            <img src={success_icon} alt="" />
                            <h4>Test muvaffaqiyatli topshirildi</h4>
                            <p>
                                Savollar soni: {result?.results?.length}   <br />
                                To‘g‘ri javoblar: {result?.total_correct} (siz bu testda {result?.score_added
                                } ballni qo‘lga kiritdingiz) <br />
                                Notog‘ri javoblar: {result?.results?.filter((item) => item.is_correct === false)?.length} <br />
                                Sizning umumiy balingiz: {result?.new_total_score
                                }
                            </p>
                            <div className="del_btn_wrap">
                                <button id='yopish_btn_resul' onClick={closeDeleteModal} type="button">Yopish</button>
                            </div>
                        </div>
                    </div>
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
                                <li>Savol-Javob</li>
                                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                                    <path
                                        d="M6.83 5.29001L2.59 1.05001C2.49704 0.956281 2.38644 0.881887 2.26458 0.831118C2.14272 0.780349 2.01202 0.754211 1.88 0.754211C1.74799 0.754211 1.61729 0.780349 1.49543 0.831118C1.37357 0.881887 1.26297 0.956281 1.17 1.05001C0.983753 1.23737 0.879211 1.49082 0.879211 1.75501C0.879211 2.0192 0.983753 2.27265 1.17 2.46001L4.71 6.00001L1.17 9.54001C0.983753 9.72737 0.879211 9.98082 0.879211 10.245C0.879211 10.5092 0.983753 10.7626 1.17 10.95C1.26344 11.0427 1.37426 11.116 1.4961 11.1658C1.61793 11.2155 1.7484 11.2408 1.88 11.24C2.01161 11.2408 2.14207 11.2155 2.26391 11.1658C2.38575 11.116 2.49656 11.0427 2.59 10.95L6.83 6.71001C6.92373 6.61705 6.99813 6.50645 7.04889 6.38459C7.09966 6.26273 7.1258 6.13202 7.1258 6.00001C7.1258 5.868 7.09966 5.73729 7.04889 5.61543C6.99813 5.49357 6.92373 5.38297 6.83 5.29001Z"
                                        fill="#717680"
                                    />
                                </svg>
                                <li>{selectedTmId ? orgDirecs?.find((item) => item.id === selectedTmId).name : "Barchasi"}</li>
                            </ul>
                            <h1>Savol-Javob</h1>
                        </div>
                        <div className="theme_body">
                            <div className="term_search_wrap">
                                <div>
                                    <span className={searchType ? "selectedTheme" : ""} onClick={() => setSearchType(true)}>Mavzu</span>
                                    <span className={!searchType ? "selectedTheme" : ""} onClick={() => setSearchType(false)}>Savol</span>
                                </div>
                                <input value={searchText} onChange={(e) => setSearchText(e.target.value)} type="text" placeholder='Qidirish' />
                            </div>
                            <ul>
                                {direcs?.map((item) => {
                                    return (
                                        <li
                                            className={item.id === selectedTmId ? "selectedTheme" : ""}
                                            onClick={(e) => setSelectedTmId(item.id)}
                                            key={item.id}
                                            dangerouslySetInnerHTML={{
                                                __html: searchType ? highlightText(item.name, searchText) : item.name,
                                            }}
                                        >

                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="terms_body">
                        <h2>{selectedTmId ? orgDirecs?.find((item) => item.id === selectedTmId).name : "Barchasi"}</h2>
                        <div className="terms_body_head">
                            <nav>
                                <NavLink to={"/terms"}>Terminlar</NavLink>
                                <NavLink to={"/questions"}>Savol-Javob</NavLink>
                            </nav>
                            <h4>To‘plangan ballar: <span>{info?.ball ? info?.ball : "0"}</span></h4>
                        </div>
                        {
                            checked ?
                                <div className="terms_grid quest_grid">
                                    {isLoading ?
                                        <button type="button" className='btn_primary loadingB term_loading_btn'>Yuklanmoqda ...</button> :
                                        !isLoading && !searchType && searchText === "" && terms?.length === 0 ?
                                            <button type="button" className='no_upload_message'>Bu mavzu uchun Savollar bajarilmagan</button>
                                            : !isLoading && searchText !== "" && !searchType && terms?.length === 0 ?
                                                <button type="button" className='no_search_result_message'>Qidiruv natijalari topilmadi</button> :
                                                <noscript></noscript>
                                    }
                                    {merged?.map((q, index) => {
                                        return (
                                            <div key={q.id} className='result_box'>
                                                <h4>{index + 1}. Savol</h4>
                                                <h5
                                                    dangerouslySetInnerHTML={{
                                                        __html: !searchType ? highlightText(q.title, searchText) : q.title,
                                                    }}
                                                >
                                                </h5>
                                                {["A", "B", "C"].map((opt, index) => {
                                                    return (
                                                        <div key={index}>
                                                            {
                                                                q.your_answer === opt && q.correct_answer !== opt ?
                                                                    <span key={index} className='ch_f'>
                                                                        {q[opt]}
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                                                            <g clipPath="url(#clip0_32_25265)">
                                                                                <rect y="0.8" width="16" height="16" rx="4.8" fill="#F04438" fillOpacity="0.1" />
                                                                                <path
                                                                                    d="M5.52517 6.52513L10.4749 11.4749M5.52517 11.4749L10.4749 6.52513"
                                                                                    stroke="#F04438"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                />
                                                                            </g>
                                                                            <rect x="0.4" y="1.2" width="15.2" height="15.2" rx="4.4" stroke="#F04438" strokeWidth="0.8" />
                                                                            <defs>
                                                                                <clipPath id="clip0_32_25265">
                                                                                    <rect y="0.8" width="16" height="16" rx="4.8" fill="white" />
                                                                                </clipPath>
                                                                            </defs>
                                                                        </svg>
                                                                    </span> :
                                                                    q.your_answer !== opt && q.correct_answer !== opt ?
                                                                        <span key={index} className='uch_f'>
                                                                            {q[opt]}
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                                                                <rect x="0.4" y="1.2" width="15.2" height="15.2" rx="4.4" fill="white" />
                                                                                <rect x="0.4" y="1.2" width="15.2" height="15.2" rx="4.4" stroke="#D5D7DA" strokeWidth="0.8" />
                                                                            </svg>
                                                                        </span> :
                                                                        <span key={index} className='t_t'>
                                                                            {q[opt]}
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                                                                                <rect x="0.4" y="2.2" width="15.2" height="15.2" rx="4.4" fill="#E8F8F1" />
                                                                                <rect x="0.4" y="2.2" width="15.2" height="15.2" rx="4.4" stroke="#12B76A" strokeWidth="0.8" />
                                                                                <path d="M11.7333 7L6.59994 12.1333L4.2666 9.8" stroke="#12B76A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                        </span>
                                                            }
                                                        </div>
                                                    )
                                                })

                                                }
                                            </div>
                                        )
                                    })}
                                    <hr />
                                    <button onClick={goNewTest} className='finish_quest btn_primary'>
                                        Testlarga qaytish
                                    </button>
                                </div>

                                :

                                <div className="terms_grid quest_grid">
                                    {isLoading ?
                                        <button type="button" className='btn_primary loadingB term_loading_btn'>Yuklanmoqda ...</button> :
                                        !isLoading && !searchType && searchText === "" && terms?.length === 0 ?
                                            <button type="button" className='no_upload_message'>Bu mavzu uchun Savollar yuklanmagan</button>
                                            : !isLoading && searchText !== "" && !searchType && terms?.length === 0 ?
                                                <button type="button" className='no_search_result_message'>Qidiruv natijalari topilmadi</button> :
                                                <noscript></noscript>
                                    }
                                    {terms?.map((q, index) => (
                                        <div key={q.id} className='quest_box'>
                                            <h4>{index + 1}. Savol</h4>
                                            <h5
                                                dangerouslySetInnerHTML={{
                                                    __html: !searchType ? highlightText(q.title, searchText) : q.title,
                                                }}
                                            ></h5>
                                            {["A", "B", "C"].map(opt => (
                                                <label key={opt} className={`custom-label ${answers.find(a => a.id === q.id)?.answer === opt ? "selected_anw" : ""
                                                    }`}>
                                                    <input
                                                        type="radio"
                                                        name={`question-${q.id}`}
                                                        value={opt}
                                                        checked={answers.find(a => a.id === q.id)?.answer === opt}
                                                        onChange={() => handleAnswerChange(q.id, opt)}
                                                    />
                                                    <span className='clone_inp_radio'>
                                                        <img src={checked_inp} alt="y" />
                                                    </span>
                                                    {opt} {q[opt]}
                                                </label>
                                            ))}
                                        </div>
                                    ))}
                                    <hr />
                                    { orgTerms?.length !== 0 &&
                                        <button className='finish_quest btn_primary' id={answers.length !== orgTerms.length ? "finish_btn_disabled" : ""} onClick={(e) => handleSubmit(e)} disabled={answers.length !== orgTerms.length}>
                                            Testni yakunlash
                                        </button>
                                    }
                                </div>
                        }


                    </div>
                </section>
                :
                <AuthRequired pageName={"Savol-Javob"} />
            }

        </div>

    )
}
