import "../Styles/hero.css"
import bg_video from "../videos/bg-video.mp4"
import poster from "../Images/video-thumbnail.jpg"

export default function Hero() {

    return (
        <div className="hero-section">
            <video className="background-video" autoPlay loop muted playsInline>
                <source src={bg_video} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            <div className="hero-content">
                <h1>Akademik tarjimon – Maxsus terminlar uchun onlayn platforma</h1>
                <p>
                    Turizm va ilmiy sohalar uchun aniq tarjima, interaktiv o‘rganish va
                    balli tizim!
                </p>

                <div className="video-wrapper">
                    <video controls className="main-video" poster={poster}>
                        <source src={"https://drive.google.com/file/d/1AzpN6DNwLILBtmNcrhWgFOdBEytIMAKn/view?usp=sharing"} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        </div>
    )
}