import "../Styles/news.css"

import left_pagin from "../Images/pagin_left.svg"
import right_pagin from "../Images/pagin_right.svg"

import { useCallback, useEffect, useReducer, useState } from "react"

import { useRef } from "react";
import { mURL } from "../mURL"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';

export default function News() {

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

    const [direcs, setDirecs] = useState(0);
    const getDirecs = useCallback(async () => {
            try {
                let fetchData = await fetch(`${mURL}/news/`, {
                    method: 'GET',
                    headers: {
                        // 'Authorization': `Bearer ${takeOriginalValue('access_token')}`
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
    }, [navigate, saveEncryptedCookie, takeOriginalValue]);

    useEffect(() => {
        getDirecs();
    }, [ignore, getDirecs])

    let[news_number, setNews_number] = useState(0);
    let news_length = direcs?.length
    let available_news = direcs ? direcs[news_number] : {title: "Yangilik Mavzusi...", content:"Yangilik Tavsifi...", image:"https://miro.medium.com/max/1200/1*kkp0yU4Aucdk-Ol87vivYQ.jpeg"}
    return (
        <section className="news">
            <div className="container_news">
                <div className="news_box">
                    <div className="news_wrap">
                        <div className="news_text">
                            <h4>Yangiliklar</h4>
                            <h2>{available_news?.title}</h2>
                            <p>{available_news?.content}</p>
                        </div>
                        <img src={available_news?.image} alt="" />
                    </div>
                    <div className="news_pagin">
                        <span className={news_number === 0 ? "pagin_passiv" : ""} onClick={(e)=>setNews_number(--news_number)}>
                            <img src={left_pagin} alt="" />
                            <h5>Oldingi</h5>
                        </span>
                        <span className={news_number === news_length - 1 ? "pagin_passiv" : ""} onClick={(e)=>setNews_number(++news_number)}>
                            <h5>Keyingi</h5>
                            <img className="pagin_left_icon" src={right_pagin} alt="" />
                        </span>
                    </div>
                </div>

            </div>
        </section>
    )
}