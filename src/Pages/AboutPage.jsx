import "../Styles/about.css"

import email from '../Images/email.svg'
import location from "../Images/location.svg"
import phone from '../Images/location.svg'


export default function AboutPage() {

    return (
        <div className="container_about">
            <section className="about">
                <h5>Biz bilan bog'lanish</h5>
                <h2>Savollaringiz bormi?</h2>
                <p>Bizning do'stona jamoamiz sizga doimo yordam berish uchun shu yerda.</p>
                <div className="about_wrap">
                    <div className="about_box">
                        <img src={email} alt="" />
                        <h4>Email</h4>
                        <h6>Our friendly team is here to help.</h6>
                        <a href="mailto:hi@untitledui.com">hi@untitledui.com</a>
                    </div>
                    <div className="about_box">
                        <img src={location} alt="" />
                        <h4>Office</h4>
                        <h6>Come say hello at our office HQ.</h6>
                        <a href="http://www.google.com/maps">100 Smith Street Collingwood VIC 3066 AU</a>
                    </div>
                    <div className="about_box">
                        <img src={phone} alt="" />
                        <h4>Phone</h4>
                        <h6>Mon-Fri from 8am to 5pm.</h6>
                        <a href="tel:+1 (555) 000-0000">+1 (555) 000-0000</a>
                    </div>
                </div>
            </section>
        </div>

    )
}