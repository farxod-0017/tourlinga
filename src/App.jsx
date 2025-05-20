import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'

import { useCallback, useReducer, useEffect, useState } from "react"

import { mURL } from "./mURL"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';


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

  // universal blocks
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const secret_key = import.meta.env.VITE_SECRET_KEY;
  const takeOriginalValue = useCallback((shifr_key) => {
    const encryptedValue = Cookies.get(shifr_key);
    if (encryptedValue) {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, secret_key);
      const origin_value = bytes.toString(CryptoJS.enc.Utf8);
      return origin_value
    }

  }, [secret_key]);
  const saveEncryptedCookie = useCallback((key, value) => {
    let encrypted_value = CryptoJS.AES.encrypt(value, secret_key).toString();
    Cookies.set(key, encrypted_value);
  }, [secret_key]);
  const [ignore, fourceUpdate] = useReducer(x => x + 1, 0);

  // END universal blocks

  // get news
  const [direcs, setDirecs] = useState([]);
  const getDirecs = useCallback(async () => {
    const current_time = new Date();
    const stored_time = takeOriginalValue('stored_time');
    const timeDiff = (current_time - new Date(stored_time)) / 60000;
    if (timeDiff < 900) {
      try {
        let fetchData = await fetch(`${mURL}/users/profile/${sessionStorage.getItem('userId')}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${takeOriginalValue('access_token')}`
          }
        });
        if (fetchData.ok) {
          let data = await fetchData.json();
          console.log(data);
          
          setDirecs(data);
        } else if (fetchData.status === 401) {
          console.log('Token tekshirilmoqda...');
          Cookies.remove('role');
        } else {
          console.log('Xatolik:', fetchData.statusText);
        }
      } catch (error) {
        console.log(`get Directionsda xatolik:, ${error}`);
      }
    } else {
      // Token muddati tugagan, refresh orqali yangi token olish
      let readyPost = {
        userId: takeOriginalValue('user_id'),
        refreshToken: takeOriginalValue('refresh_token')
      }
      try {
        let refreshResponse = await fetch(`${mURL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': "application/json",
          },
          body: JSON.stringify(readyPost)
        });
        if (refreshResponse.ok) {
          let data = await refreshResponse.json();
          saveEncryptedCookie('refresh_token', data.refresh_token);
          saveEncryptedCookie('access_token', data.access_token);
          let current_time = new Date().toISOString();
          saveEncryptedCookie('stored_time', current_time);
          // Yangi token bilan so'rovni qayta amalga oshirish
          getDirecs();
        } else {
          console.log('Refresh token yaroqsiz. Login sahifasiga yonaltirilmoqda...');
          Cookies.remove('role')
        }
      } catch (error) {
        console.error('Serverga ulanishda xatolik (refresh):', error.message);
      }
    }

  }, [navigate, saveEncryptedCookie, takeOriginalValue]);

  useEffect(() => {
    if(sessionStorage.getItem('userId')) {
      getDirecs();
    }
  }, [ignore, getDirecs])
  // END get news

  return (
    <>
      <Header info={direcs}/>
      <Outlet />
      {location.pathname === "/sign-up" || location.pathname === "/login" || location.pathname === "/terms" || location.pathname === "/questions" ?
        <div></div> :
        <Footer />
      }
    </>
  )
}

export default App
