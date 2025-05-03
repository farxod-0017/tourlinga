import "../Styles/featuresSection.css"

import pin1 from "../Images/pin1.svg"
import pin2 from "../Images/pin2.svg"
import pin3 from "../Images/pin3.svg"
import pin4 from "../Images/pin4.svg"
import pin5 from "../Images/pin5.svg"

import step1 from "../Images/step1.svg"
import step2 from "../Images/step2.svg"
import step3 from "../Images/step3.svg"
import step4 from "../Images/step4.svg"
import step5 from "../Images/step5.svg"

export default function FeaturesSection() {

    const steps = [
        {
            title: "Interaktiv darsliklar",
            description: "Turizmga oid asosiy terminlar va ularning tushuntirishlari.",
            icon: pin1,
            step_icon: step1,
            color: "rgba(230, 237, 255, 1)"
        },
        {
            title: "Test va mashqlar",
            description: "O'rganilgan bilimlarni mustahkamlash uchun interaktiv testlar.",
            icon: pin2,
            step_icon: step2,
            color: "rgba(255, 239, 231, 1)"
        },
        {
            title: "Quiz va o'yinlar",
            description: "O'zlashtirish topshiriqlari orqali terminlarni eslab qolish.",
            icon: pin3,
            step_icon: step3,
            color: "rgba(255, 250, 235, 1)"
        },
        {
            title: "Multimedia materiallar",
            description: "Audio va video darslar, turizm sohasi mutaxassislari bilan intervyular.",
            icon: pin4,
            step_icon: step4,
            color: "rgba(236, 253, 243, 1)"
        },
        {
            title: "Huquqiy hujjatlar",
            description: "O'zbekiston Respublikasining 'Turizm to'g'risida'gi qonuni va nizomlar.",
            icon: pin5,
            step_icon: step5,
            color: "rgba(255, 241, 243, 1)"
        }
    ];
    let windowW = window.innerWidth
    let linesNumber = windowW > 1423 ? 35 : windowW < 1423 && windowW >1050 ? 29 : 0

    return (
        <section className="process-section">
            <div className="containerPS">
                <h3>Xususiyatlari</h3>
                <h2>Saytimizda nimalar mavjud?</h2>
                <h6>Turizm leksikasini mukammal o‘zlashtiring!</h6>
                <div className="horizontal-lines">
                    {[...Array(linesNumber)].map((_, i) => (
                        <div key={i} className="line" />
                    ))}
                </div>
                <div className="process-wrapper">
                    <div className="steps-grid">
                        {[...steps].map((step, index) => {
                            const isLeft = index === 0 || index === 2 || index === 4;  // first 3 boxes on the left, rest on the right
                            const leftPosition = isLeft ? 0 : 832;

                            // Top values based on your description
                            const topValues = [128, 335, 916, 1123, 1704];

                            return (
                                <div
                                    key={index}
                                    className={`step-box step-${index + 1}`}
                                    style={{ top: `${topValues[index]}px`, left: `${leftPosition}px` }}
                                >
                                    <div className="pin-icon"><img src={step.icon} alt="large pin icon" /></div>
                                    <div className="icon-grid" style={{ background: step.color }}>
                                        <div className="small-icon-box"><img src={step.step_icon} alt="icon" /></div>
                                        <h4>{step.title}</h4>
                                        <p>{step.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <svg className="animated-lines" viewBox="0 0 1600 2200" preserveAspectRatio="none">
                            {/* 1 -> 2 */}
                            <path d="M 384 296 Q 700 300 832 455" className="dash-line" />

                            {/* 2 -> 3 */}
                            <path d="M 832 625 Q 600 800 312 916" className="dash-line" />

                            {/* 3 -> 4 */}
                            <path d="M 384 1140 Q 700 1220 832 1323" className="dash-line" />

                            {/* 4 -> 5 */}
                            <path d="M 832 1473 Q 600 1600 344 1704" className="dash-line" />
                        </svg>
                    </div>
                </div>
            </div>
        </section>
    );

}