import '../Styles/header.css'
import { Link, NavLink } from 'react-router-dom'

import acc_icon from "../Images/account-icon.png"
import logo from '../Images/logo.svg'
import log_out_icon from "../Images/log_out_icon.svg"
import burger_icon from "../Images/burger.svg"
import search_icon from "../Images/search_icon.svg"
import close_icon from "../Images/close_icon.svg"

import { useRef, useState } from 'react'

export default function Header({ info }) {
    const mobileModal = useRef();
    const header_section = useRef();
    const [burger, setBurger] = useState(true)
    function openMobModal(e) {
        setBurger(false)
        mobileModal.current.classList.add("open_mob_modal");
        header_section.current.classList.add("header_fixed")
    }
    function closeMobModal(e) {
        setBurger(true);
        mobileModal.current.classList.remove("open_mob_modal");
        header_section.current.classList.remove("header_fixed")
    }
    const isLogin = sessionStorage.getItem('userId');

    function logOut(e) {
        sessionStorage.clear('userId');
        window.location.href = ('/login')
    }

    return (
        <section ref={header_section} className="header">
            <div ref={mobileModal} className="mobile_modal">
                <nav>
                    <Link to="/">Bosh sahifa</Link>
                    <Link to="/contact">Biz haqimizda</Link>
                    <Link to="/statistics">Statistika</Link>
                    <Link to="/terms">Terminlar</Link>
                    <Link to="/questions">Savol-javob</Link>
                </nav>
                <div className="mob_footer">
                    <hr />
                    <label htmlFor="search_mob_modal">
                        <img src={search_icon} alt="" />
                        <input type="text" name='search_mob_modal' id='search_mob_modal' className='mob_search' placeholder='Qidirish' />
                    </label>
                    {isLogin ? (
                        <div className="mob_acc">
                            <div className="mob_acc_data">
                                {info?.image ? (
                                    <img src={info?.image} alt="img" className='head_acc_img'  /> // url image
                                ) :
                                    (
                                        <img className='account_img' src={acc_icon} alt="account image" />
                                    )}
                                <div>
                                    <h5>{info?.first_name + " " + info?.last_name}</h5>
                                    <h6>{info?.email}</h6>
                                </div>
                            </div>
                            <button onClick={(e)=>logOut(e)} type="button" className='logout-btn'>
                                <img className='mob_log_out_icon' src={log_out_icon} alt="log-out icon" />
                            </button>
                        </div>
                    ) : (
                        <div className="mob_login">
                            <Link to={"/sign-up"}><button type="button" className='btn_primary'>Ro‘yxatdan o‘tish</button></Link>
                            <Link to={'/login'}><button type="button" className='mob_secont_btn btn_outline'>Tizimga kirish</button></Link>
                        </div>
                    )}
                </div>
            </div>
            <div className="container">
                <div className="head_wrap">
                    <div className="head_left">
                        <img src={logo} alt="" />
                        <nav>
                            <Link to={"/"}>Bosh sahifa</Link>
                            <Link to={"/statistics"}>Statistika</Link>
                            <Link to={"/terms"}>Terminlar</Link>
                            <Link to={"/questions"}>Savol-javob</Link>
                            <Link to={"/contact"}>Aloqa</Link>
                        </nav>
                    </div>
                    <div className="head_right">
                        <select>
                            <option value="1">UZ</option>
                            <option value="2">RU</option>
                            <option value="3">ENG</option>
                        </select>
                        {isLogin ? (
                            <div className="head_account head_unv">
                                {info?.image ? (
                                    <img src={info?.image} alt="img" className='head_acc_img' /> // url image
                                ) :
                                    (
                                        <img className='account_img' src={acc_icon} alt="account image" />
                                    )}
                                <Link to={"/profile"}>
                                    <div className='head_acc_text'>
                                        <h5>{info?.first_name + " " + info?.last_name}</h5>
                                        <h6>{info?.email}</h6>
                                    </div>
                                </Link>
                                <img onClick={(e)=>logOut(e)} className='log_out_icon' src={log_out_icon} alt="log-out icon" />
                                <NavLink to={"/profile"}>
                                    <div className="user-info-box">
                                        <div className="user-texts">
                                            <p className="user-name">{info?.first_name + " " + info?.last_name}</p>
                                            <p className="user-email">{info?.email}</p>
                                        </div>
                                        <button className="logout-btn" title="Log out">
                                            <img src={log_out_icon} alt="" />
                                        </button>
                                    </div>
                                </NavLink>

                            </div>
                        ) : (
                            <div className="head_login head_unv">
                                <Link to={"/login"}><h4>Tizimga kirish</h4></Link>
                                <Link to={"/sign-up"}>
                                    <button className='login_desktop' type="button">Ro‘yxatdan o‘tish</button>
                                </Link>
                                <div className="hover_icon">
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="user-login-icon"
                                    >
                                        <path
                                            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4 -4 1.79-4 4 1.79 4 4 4zM4 20c0-2.67 5.33-4 8-4s8 1.33 8 4v1H4v-1z"
                                            fill="#7da0c0"
                                        />
                                        <circle cx="19" cy="5" r="2" fill="#f95c5c" />
                                    </svg>
                                    <div className="hover_menu">
                                        <Link to={"/login"}><button>Tizimga kirish</button></Link>
                                        <Link to={"/sign-up"}><button>Ro'yxatdan o'tish</button></Link>
                                    </div>
                                </div>
                            </div>
                        )
                        }
                        {
                            burger ? (
                                <button onClick={(e) => openMobModal(e)} className='burger'>
                                    <img src={burger_icon} alt="burger icon" />
                                </button>
                            ) : (
                                <button onClick={(e) => closeMobModal(e)} className='burger'>
                                    <img src={close_icon} alt="" />
                                </button>
                            )
                        }

                    </div>
                </div>
            </div>
        </section>
    )
}