import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from 'routes/Home'
import Auth from 'routes/Auth'
import Navigation from 'components/Navigation'
import Profiles from './routes/Profiles';

function AppRouter({isLoggedIn, userObj}) {

  return (
    <BrowserRouter>
      {isLoggedIn && <Navigation userObj={userObj} />} 
      {/* && 연산자: true이면 실행하고, false이면 실행 안 함 */}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path='/' element={<Home userObj={userObj}/>} />
            <Route path='/profile' element={<Profiles userObj={userObj} />}/>
          </>
        ) : (
          <Route path='/' element={<Auth />} />
        )}
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter