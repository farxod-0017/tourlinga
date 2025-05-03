import "../Styles/footer.css"

import { Link } from "react-router-dom"
import logo from "../Images/logo.svg"

export default function Footer() {

    return (
        <section className="footer">
            <div className="foot_top">
                <div className="foot_tleft">
                    <img src={logo} alt="logo" />
                    <ul>
                        <li><Link to={"/"}>Bosh sahifa</Link></li>
                        <li><Link to={"/contact"}>Biz haqimizda</Link></li>
                        <li><Link>Statistika</Link></li>
                        <li><Link>Terminlar</Link></li>
                        <li><Link>Savol-javob</Link></li>
                    </ul>
                </div>
                <hr className="foot_tablet_line"/>
                <div className="foot_tright">
                    <h5>Yangiliklardan xabardor bo‘lib turing</h5>
                    <div className="foot_email">
                        <input placeholder="E-mail kiriting" type="email" />
                        <button type="button">Obuna boʻlish</button>
                    </div>
                </div>
            </div>
            <hr />
            <p>© 2025 RedFox agency. Barcha huquqlar himoyalangan.</p>
        </section>
    )
}