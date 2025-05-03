import "../Styles/advantages.css"

import icon1 from "../Images/advan1.svg"
import icon2 from "../Images/advan2.svg"
import icon3 from "../Images/advan3.svg"

export default  function Advantages() {

    const boxes_data = [
        {
            title:"Turizm sohasi talabalari",
            desc:"Dars jarayonida qo‘shimcha material sifatida foydalanish uchun.",
            color:"rgba(240, 249, 255, 1)",
            icon:icon1,
        },
        {
            title:"Turizm mutaxassislari",
            desc:" Ish faoliyatida kasbiy terminlarni va huquqiy asoslarni yaxshiroq tushunish uchun.",
            color:"rgba(240, 249, 255, 1)",
            icon:icon2,
        },
        {
            title:"Sayohat ixlosmandlar",
            desc:" Chet elga chiqishda foydali atamalar va turizm qonun-qoidalarini o‘rganish uchun.",
            color:"rgba(255, 239, 231, 1)",
            icon:icon3,
        },
    ]
      return (
        <section className="advan">
            <div className="container_advan">
                <div className="advan_wrap">
                    <h5>Afzalliklari</h5>
                    <h2>Kimlar uchun foydali?</h2>
                    <h6>Akademik Tarjimon quyidagi foydalanuvchilar uchun foydalidir:</h6>
                    <div className="advan_grid">
                        {[...boxes_data.map((box, index)=> {
                            return (
                                <div key={index+1} style={{background:box.color}} className="adv_box">
                                    <img src={box.icon} alt="icon" />
                                    <h4>{box.title}</h4>
                                    <p>{box.desc}</p>
                                </div>
                            )
                        })]}
                    </div>
                </div>
            </div>
        </section>
      )
}