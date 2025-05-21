import ReactDOM from 'react-dom/client'
import React from 'react'
import { Route, Routes } from 'react-router-dom'

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import HomePage from './Pages/HomePage.jsx'
import AboutPage from './Pages/AboutPage.jsx'
import ErrorPage from './Pages/ErrorPage.jsx'
import Admin from './Admin.jsx'
import AdminHome from './AdminPages/AdminHome.jsx'
import AdminNews from './AdminPages/AdminNews.jsx'
import AdminProfile from './AdminPages/AdminProfile.jsx'
import Login from './Pages/Login.jsx'
import SignUp from './Pages/SignUp.jsx'
import AdminUnvs from './AdminPages/AdminUnvs.jsx'
import AdminFaculty from './AdminPages/AdminFaculty.jsx'
import AdminThemes from './AdminPages/AdminTheme.jsx'
import AdminTermins from './AdminPages/AdminTermins.jsx'
import AdminQuestions from './AdminPages/AdminQuestion.jsx'
import TermData from './Pages/TermData.jsx'
import QuestData from './Pages/QuestData.jsx'
import UserProfile from './Pages/UserProfile.jsx'
import Statistics from './Pages/Statistics.jsx'
import AdminStatistics from './AdminPages/AdminStatistics.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/contact' element={<AboutPage />} />
          <Route path='/terms' element={<TermData />} />
          <Route path='/questions' element={<QuestData />} />
          <Route path='/login' element={<Login />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/statistics' element={<Statistics />} />
        </Route>
        <Route path='/admin' element={<Admin />}>
          <Route path='/admin' element={<AdminHome />} />
          <Route path='/admin/news' element={<AdminNews />} />
          <Route path='/admin/universities' element={<AdminUnvs />} />
          <Route path='/admin/faculties' element={<AdminFaculty />} />
          <Route path='/admin/profile' element={<AdminProfile />} />
          <Route path='/admin/themes' element={<AdminThemes />} />
          <Route path='/admin/terms' element={<AdminTermins />} />
          <Route path='/admin/questions' element={<AdminQuestions />} />
          <Route path='/admin/students' element={<AdminStatistics />} />
        </Route>
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
