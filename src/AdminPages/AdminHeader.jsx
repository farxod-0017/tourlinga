import logo from "../Images/logo.svg"
import search_icon from "../Images/search_icon.svg"

import "../AdminCSS/admHead.css"
import { NavLink } from "react-router-dom"

export default function AdminHeader() {
    return (
        <section className="adm_header">
            <NavLink to={"/"}>
                <img src={logo} alt="logo" />
            </NavLink>
            <div className="adm_head_right">
                <select>
                    <option value="1">(UZ)</option>
                    <option value="2">(ENG)</option>
                    <option value="3">(RU)</option>
                </select>
                <label htmlFor="search_input_adm">
                    <input placeholder="Search" id="search_input_adm" type="search" />
                    <img src={search_icon} alt="" />
                </label>
            </div>
        </section>
    )
}