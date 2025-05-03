import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'


function App() {
  let location = useLocation().pathname

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
