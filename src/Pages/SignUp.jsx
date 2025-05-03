import "../Styles/signup.css"
import logo from "../Images/logo.svg"
import checked from "../Images/checked.svg"
import { Link } from "react-router-dom";

import { useCallback, useEffect, useReducer, useState } from "react"
import { useRef } from "react";
import { mURL } from "../mURL"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

export default function SignUp() {
    const [box, setBox] = useState(1);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [match, setMatch] = useState(true);

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setMatch(value === confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setMatch(password === value);
    };
    // HTML structure END

    // get news
    const [direcs, setDirecs] = useState([]);
    const getDirecs = async () => {
        try {
            let fetchData = await fetch(`${mURL}/universities/universities/`, {
                method: 'GET',
            });
            let data = await fetchData.json();
            setDirecs(data)
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
        getDirecs()
        getFaculty();
    }, [])
    // END get news

    // universal blocks
    const [isLoading, setIsLoading] = useState(false);
    // END universal blocks

    let ism = useRef("");
    let familiya = useRef("");
    let phone = useRef("");
    let university = useRef(1);
    let faculty = useRef(1);
    let kurs = useRef(1);

    const signupModal = useRef("")

    async function createDirection(e) {
        e.preventDefault();
        // let readyD = {
        //     title: direction_name,
        //     content: news_tavsif,
        //     image: image
        // };
        let fio = ism.current.value + " " + familiya.current.value
        const readyD = new FormData();
        readyD.append('fish', fio); // o'rniga input qiymatini qo'ying
        readyD.append("tel", phone.current.value);
        readyD.append('type', "student");
        readyD.append('university', +university.current.value);
        readyD.append('fakultet', +faculty.current.value)
        readyD.append('oquvyili', kurs.current.value);
        readyD.append('username', phone.current.value);
        readyD.append('password', password)
        console.log(readyD);

        try {
            setIsLoading(true);
            let fetchData = await fetch(`${mURL}/users/signup/`, {
                method: 'POST',
                body: readyD
            });
            const result = await fetchData.json();
            console.log('direction created sccff:', result);
            if(result.message === "Foydalanuvchi muvaffaqiyatli yaratildi") {
                signupModal.current.classList.add("open_sign_modal")
            }
        } catch (error) {
            console.log('Serverga ulanishda xatolik:', error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="signup">
            <div ref={signupModal} className="signup_modal">
                <div className="signup_modal_window">
                    <img src={checked} alt="" />
                    <h4>Akkaunt muvaffaqiyatli ochildi!</h4>
                    <Link to={"/login"}> <button type="button">Ok</button></Link>
                </div>
            </div>
            <form onSubmit={(e) => createDirection(e)}>
                <div id={box === 1 ? "open_signbox":""} className="sign_box1">
                    <img src={logo} alt="logo" />
                    <h2>Akkaunt ochish</h2>
                    <h5>Ma’lumotlaringizni kiriting.</h5>
                    <div className="sign_wrap">
                        <span>
                            <h4>Ism</h4>
                            <input ref={ism} required placeholder="Ismingizni kiriting" type="text" />
                        </span>
                        <span>
                            <h4>Familiya</h4>
                            <input ref={familiya} required placeholder="Familiyangizni kiriting" type="text" />
                        </span>
                    </div>
                    <h4>Telefon raqam</h4>
                    <input ref={phone} required placeholder="Telefon raqamingizni kiriting" type="number" />
                    <button onClick={(e) => setBox(2)} className="btn_primary" type="button">Davom etish</button>
                    <h3>Akkauntingiz bormi? <Link to={"/login"}>Tizimga kiring</Link></h3>
                </div>
                <div id={box === 2 ? "open_signbox" : ""}  className="sign_box1 sign_box2">
                    <img src={logo} alt="logo" />
                    <h2>Akkaunt ochish</h2>
                    <h5>Ma’lumotlaringizni kiriting.</h5>
                    <h4>Universitet</h4>
                    <select ref={university}>
                        {direcs?.map((item) => {
                            return (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            )
                        })}
                    </select>
                    <div className="sign_wrap">
                        <span>
                            <h4>O‘quv yili</h4>
                            <select ref={kurs}>
                                <option value="1">1-kurs</option>
                                <option value="2">2-kurs</option>
                                <option value="3">3-kurs</option>
                                <option value="4">4-kurs</option>
                            </select>
                        </span>
                        <span>
                            <h4>Fakultet</h4>
                            <select ref={faculty}>
                                {faculs?.map((item) => {
                                    return (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </span>
                    </div>
                    <div className="sign_chek">
                        <input type="checkbox" />
                        <h6>Siz bizning do'stona maxfiylik siyosatimizga rozilik bildirasiz.</h6>
                    </div>
                    <button onClick={() => setBox(3)} className="btn_primary" type="button">Davom etish</button>
                    <h3>Akkauntingiz bormi? <Link to={"/login"}>Tizimga kiring</Link></h3>
                </div>
                <div id={box === 3 ? "open_signbox" : ""} className="sign_box1 sign_box3">
                    <img src={logo} alt="logo" />
                    <h2>Akkaunt ochish</h2>
                    <h5>Ma’lumotlaringizni kiriting.</h5>

                    <h4>Parol kiriting </h4>
                    <input value={password} onChange={(e) => handlePasswordChange(e)} placeholder="password" type="number" />
                    <h4>Parol tastig‘i </h4>
                    <input value={confirmPassword} onChange={(e) => handleConfirmPasswordChange(e)} placeholder="confirm password" type="number" />
                    <h6>Parol 8 sondan iborat bo‘lishi kerak</h6>
                    {
                        match ?
                            <button className="btn_primary" type="submit">Akkaunt ochish</button>
                            :
                            <button className="btn_primary" type="button"><span>Parollar mos emas</span></button>
                    }
                    <h3>Akkauntingiz bormi? <Link to={"/login"}>Tizimga kiring</Link></h3>
                </div>
            </form>
        </section>
    )
}