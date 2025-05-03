import "../Styles/usingWeb.css"

import use1 from "../Images/use1.svg"
import use2 from "../Images/use2.svg"
import use3 from "../Images/use3.svg"
import use4 from "../Images/use4.svg"

import usen1 from "../Images/usen1.svg"
import usen2 from "../Images/usen2.svg"
import usen3 from "../Images/usen3.svg"
import usen4 from "../Images/usen4.svg"

import line from "../Images/Line.svg"

export default function UsingWeb() {
    return (
        <section className="using">
            <div className="containerUW">
                <div className="using_wrap">
                    <h6>Foydalanish</h6>
                    <h2>Saytdan qanday foydalanish mumkin?</h2>
                    <h5>Foydalanuvchilar uchun qulay yo‘riqnoma.</h5>
                    <div className="using_grid">
                        <img className="use_line" src={line} alt="" />
                        <div className="using_left">
                            <div className="using_box">
                                <div className="using_stp using_stp1">
                                    <img src={use1} alt="" />
                                    <span></span>
                                </div>
                                <h4>Ro‘yxatdan o‘ting</h4>
                                <p>Shaxsiy kabinet yaratish orqali o‘z natijalaringizni kuzatib boring.</p>
                                <img className="using_stp_num" src={usen1} alt="" />
                            </div>
                            <div className="using_box using_box2">
                                <div className="using_stp using_stp2">
                                    <img src={use2} alt="" />
                                    <span></span>
                                </div>
                                <h4>Terminlarni o‘rganing</h4>
                                <p>Soha bo‘yicha eng muhim tushunchalarni o‘zlashtiring.</p>
                                <img className="using_stp_num" src={usen2} alt="" />
                            </div>
                        </div>
                        <div className="using_left">
                            <div className="using_box">
                                <div className="using_stp using_stp3">
                                    <img src={use3} alt="" />
                                    <span></span>
                                </div>
                                <h4>Huquqiy me’yoriy hujjatlarni o‘rganing </h4>
                                <p>Turizm sohasidagi qonunchilik asoslari bilan tanishing.</p>
                                <img className="using_stp_num" src={usen3} alt="" />
                            </div>
                            <div className="using_box using_box2">
                                <div className="using_stp using_stp4">
                                    <img src={use4} alt="" />
                                    <span></span>
                                </div>
                                <h4>Test topshiring</h4>
                                <p>O‘z bilimlaringizni sinab ko‘ring va sertifikatga ega bo‘ling.</p>
                                <img className="using_stp_num" src={usen4} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}