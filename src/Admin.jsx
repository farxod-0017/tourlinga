import { Outlet } from "react-router-dom"
import AdminHeader from "./AdminPages/AdminHeader"
import AdminBar from "./AdminPages/AdminBar"



function Admin() {
    return (
        <main className="AdminPanel">
            <AdminHeader/>
            <AdminBar/>
            <Outlet/>
        </main>
    )
}
export default Admin