import { Link, NavLink, useLocation } from "react-router-dom";
import "../AdminCSS/admBar.css"

import acc_icon from "../Images/account-icon.png"
import log_out_icon from "../Images/log_out_icon.svg"


export default function AdminBar() {

    let location = useLocation();
    let path = location.pathname
    return (
        <div className="adm_bar">
            <div className="bar_top">
                <Link>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M18 20V10M12 20V4M6 20V14"
                            stroke="#717680"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <span>Dashboard</span>
                </Link>
                <Link to={"universities"} className={`${path === "/admin/universities" ? "activeBar" : ""}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M9 22V12H15V22M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                            stroke={path === "/admin/universities" ? "#044EFC" : "rgba(113, 118, 128, 1)"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <span>Universitetlar</span>
                </Link>
                <Link to={"faculties"} className={`${path === "/admin/faculties" ? "activeBar" : ""}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M5 9.99958V16.0107C5 16.3697 5 16.5492 5.05465 16.7076C5.10299 16.8477 5.18187 16.9754 5.28558 17.0813C5.40287 17.201 5.5634 17.2813 5.88446 17.4418L11.2845 20.1418C11.5468 20.273 11.678 20.3386 11.8156 20.3644C11.9375 20.3873 12.0625 20.3873 12.1844 20.3644C12.322 20.3386 12.4532 20.273 12.7155 20.1418L18.1155 17.4418C18.4366 17.2813 18.5971 17.201 18.7144 17.0813C18.8181 16.9754 18.897 16.8477 18.9453 16.7076C19 16.5492 19 16.3697 19 16.0107V9.99958M2 8.49958L11.6422 3.67846C11.7734 3.61287 11.839 3.58008 11.9078 3.56717C11.9687 3.55574 12.0313 3.55574 12.0922 3.56717C12.161 3.58008 12.2266 3.61287 12.3578 3.67846L22 8.49958L12.3578 13.3207C12.2266 13.3863 12.161 13.4191 12.0922 13.432C12.0313 13.4434 11.9687 13.4434 11.9078 13.432C11.839 13.4191 11.7734 13.3863 11.6422 13.3207L2 8.49958Z"
                            stroke={path === "/admin/faculties" ? "#044EFC" : "rgba(113, 118, 128, 1)"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <span>Fakultetlar</span>
                </Link>
                <Link>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
                            stroke="#717680"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>Talabalar</span>
                </Link>
                <Link to={"themes"} className={`${path === "/admin/themes" ? "activeBar" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                            stroke={path === "/admin/themes" ? "#044EFC" : "rgba(113, 118, 128, 1)"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>Mavzular</span>
                </Link>
                <Link to={"terms"} className={`${path === "/admin/terms" ? "activeBar" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M11.6663 1.66699H4.99967C4.55765 1.66699 4.13372 1.84259 3.82116 2.15515C3.5086 2.46771 3.33301 2.89163 3.33301 3.33366V16.667C3.33301 17.109 3.5086 17.5329 3.82116 17.8455C4.13372 18.1581 4.55765 18.3337 4.99967 18.3337H14.9997C15.4417 18.3337 15.8656 18.1581 16.1782 17.8455C16.4907 17.5329 16.6663 17.109 16.6663 16.667V6.66699M11.6663 1.66699L16.6663 6.66699M11.6663 1.66699V6.66699H16.6663M13.333 10.8337H6.66634M13.333 14.167H6.66634M8.33301 7.50033H6.66634"
                            stroke={path === "/admin/terms" ? "#044EFC" : "rgba(113, 118, 128, 1)"}
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <span>Terminlar</span>
                </Link>
                <Link to={"questions"} className={`${path === "/admin/questions" ? "activeBar" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_828_4288)">
                            <path
                                d="M7.57435 7.49935C7.77027 6.94241 8.15698 6.47277 8.66598 6.17363C9.17498 5.87448 9.77343 5.76513 10.3553 5.86494C10.9372 5.96475 11.465 6.26729 11.8452 6.71896C12.2255 7.17063 12.4336 7.74228 12.4327 8.33268C12.4327 9.99935 9.93268 10.8327 9.93268 10.8327M9.99935 14.166H10.0077M18.3327 9.99935C18.3327 14.6017 14.6017 18.3327 9.99935 18.3327C5.39698 18.3327 1.66602 14.6017 1.66602 9.99935C1.66602 5.39698 5.39698 1.66602 9.99935 1.66602C14.6017 1.66602 18.3327 5.39698 18.3327 9.99935Z"
                                stroke={path === "/admin/questions" ? "#044EFC" : "rgba(113, 118, 128, 1)"}
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_828_4288">
                                <rect width="20" height="20" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                    <span>Savollar</span>
                </Link>
                <Link to={"news"} className={`${path === "/admin/news" ? "activeBar" : ""}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M22 8.0004V12.0004M10.25 5.5004H6.8C5.11984 5.5004 4.27976 5.5004 3.63803 5.82738C3.07354 6.115 2.6146 6.57394 2.32698 7.13843C2 7.78016 2 8.62024 2 10.3004L2 11.5004C2 12.4323 2 12.8982 2.15224 13.2658C2.35523 13.7558 2.74458 14.1452 3.23463 14.3482C3.60218 14.5004 4.06812 14.5004 5 14.5004V18.7504C5 18.9826 5 19.0987 5.00963 19.1964C5.10316 20.146 5.85441 20.8972 6.80397 20.9908C6.90175 21.0004 7.01783 21.0004 7.25 21.0004C7.48217 21.0004 7.59826 21.0004 7.69604 20.9908C8.64559 20.8972 9.39685 20.146 9.49037 19.1964C9.5 19.0987 9.5 18.9826 9.5 18.7504V14.5004H10.25C12.0164 14.5004 14.1772 15.4473 15.8443 16.356C16.8168 16.8862 17.3031 17.1513 17.6216 17.1123C17.9169 17.0761 18.1402 16.9435 18.3133 16.7015C18.5 16.4405 18.5 15.9184 18.5 14.8741V5.12668C18.5 4.0824 18.5 3.56025 18.3133 3.29929C18.1402 3.0573 17.9169 2.9247 17.6216 2.88853C17.3031 2.84952 16.8168 3.1146 15.8443 3.64475C14.1772 4.55351 12.0164 5.5004 10.25 5.5004Z"
                            stroke={path === "/admin/news" ? "#044EFC" : "rgba(113, 118, 128, 1)"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>Yangiliklar</span>
                </Link>
            </div>
            <div className="bar_bottom">
                <Link to={"profile"} className={`${path === "/admin/profile" ? "activeBar" : ""}`}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                    >
                        <path
                            d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                            stroke={path === "/admin/profile" ? "#044EFC" : "#717680"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span>Profil</span>
                </Link>
                <div className="bar_line"></div>
                <div className="mob_acc">
                    <div className="mob_acc_data">
                        {!true ? (
                            <img src="" alt="" /> // url image
                        ) :
                            (
                                <img className='account_img' src={acc_icon} alt="account image" />
                            )}
                        <div>
                            <h5>Olivia Rhye</h5>
                            <h6>olivia@untitledui.com</h6>
                        </div>
                    </div>
                    <button type="button" className='logout-btn'>
                        <img className='mob_log_out_icon' src={log_out_icon} alt="log-out icon" />
                    </button>
                </div>
            </div>
        </div>
    )
}