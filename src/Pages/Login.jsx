import "../Styles/login.css"

import { Link } from "react-router-dom"
import logo from "../Images/logo.svg"

import { mURL } from "../mURL"
import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';
import { toast, ToastContainer } from 'react-toastify';

export default function () {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const secret_key = import.meta.env.VITE_SECRET_KEY;
    const saveEncryptedCookie = (key, value) => {
        let encrypted_value = CryptoJS.AES.encrypt(value, secret_key).toString();
        Cookies.set(key, encrypted_value);
    }
    function navigateToRole(role, message) {
        if (role === "student") {
            navigate('/profile', { state: { toastMessage: message } })
        } else if (role === "Admin") {
            saveEncryptedCookie('user_role', "Admin")
            navigate('/admin', { state: { toastMessage: message } })
        }
        // navigate(role === 'student' ? '/profile' : role === 'Admin' ? '/admin' : '/login');
        // setTimeout(() => {
        //     window.location.reload();
        // }, 1000);
    }
    const takeOriginalValue = (shifr_key) => {
        const encryptedValue = Cookies.get(shifr_key);
        if (encryptedValue) {
            const bytes = CryptoJS.AES.decrypt(encryptedValue, secret_key);
            const origin_value = bytes.toString(CryptoJS.enc.Utf8);
            return origin_value
        }

    }

    let loginId = useRef();
    let password = useRef();
    async function submitLogin(e) {
        e.preventDefault();
        let readyPost = {
            tel: loginId.current.value,
            password: password.current.value,
        }
        try {
            setIsLoading(true)
            let fetchData = await fetch(`${mURL}/users/login/`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(readyPost)
            });
            let data = await fetchData.json();
            console.log(data);
            if (fetchData.ok) {
                saveEncryptedCookie('access_token', data.access);
                const stored_time = new Date().toISOString();
                saveEncryptedCookie('stored_time', stored_time);
                saveEncryptedCookie('refresh_token', data.refresh);
                sessionStorage.setItem('userId', data.user.id)
                navigateToRole(data.user.type, "Tizimga muvaffaqqiyatli kirdingiz");
            } else {
                toast.error(`Login muvaffaqqiyatsiz: ${data?.error}`);
            }
        } catch (error) {
            toast.error('Хатолик юз берди', error);
        } finally {
            setIsLoading(false);
            // window.location.reload()
        }

    };
    return (
        <section className="login">
            <ToastContainer />
            <div className="login_box">
                <img src={logo} alt="logo" />
                <h2>Akkauntingizga kiring</h2>
                <p>Qaytib kelganingizdan xursandmiz! Ma’lumotlaringizni kiriting.</p>
                <h5>Telefon raqam</h5>
                <input ref={loginId} type="text" placeholder="Telefon raqamingizni kiriting" />
                <h5>Parol</h5>
                <input ref={password} type="password" placeholder=" Enter password" />
                <span>
                    <span>
                        <input type="checkbox" />
                        <h6>30 kungacha eslab qolish</h6>
                    </span>
                    <h3>Parolni unutdingizmi?</h3>
                </span>
                {
                    isLoading === false ?
                        <button onClick={(e) => submitLogin(e)} type="button" className="btn_primary">Tizimga kirish</button>
                        :
                        <button className='Loading' type="button"></button>
                }

                <h4>Akkauntingiz yo'qmi? <Link to={"/sign-up"}>Ro'yxatdan o'ting</Link></h4>
            </div>
        </section>
    )
}