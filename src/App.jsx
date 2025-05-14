import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { useEffect } from 'react'


function App() {
  let location = useLocation()
  useEffect(() => {
    if (location.pathname === "/terms" || location.pathname === '/questions') {
      document.body.style.backgroundColor = "white";
    } else {
      document.body.style.backgroundColor = "#044efc08";
    }

    // Cleanup qismi — sahifa o'zgarganda
    return () => {
      document.body.style.backgroundColor = "#044efc08";
    };
  }, [location.pathname]);
  return (
    <>
      <Header />
      <Outlet />
      {location === "/sign-up" || location === "/login" ?
        <div></div> :
        <Footer />
      }
    </>
  )
}

export default App
