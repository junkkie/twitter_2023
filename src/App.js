import AppRouter from 'Router'
import { useState, useEffect } from 'react';
import { authService } from 'fbase';
import { onAuthStateChanged } from "firebase/auth";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faTwitter, faGoogle, faGithub)

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  console.log('authService.currentUser->', authService.currentUser) //현재 로그인한 유저 확인하는 방법
  const [userObj, setUserObj] = useState(null);
  const [init, setInit] = useState(false);

  useEffect(() =>{ // 데이터 불러ㅓ오기
    onAuthStateChanged(authService, (user) => { // 로그인 후 바뀐 사용자 정보 불러오기 (파이어베이스 인증상태 관찰자 설정)
      console.log('user ->', user)
      if (user) {
        setIsLoggedIn(user);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  },[]); // 대괄호 비어 있으면 최초 한 번만 실행 componentDidMount 시점

  return (
    <>
      {init ?
        (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj}/>
        ):(
        "initializing..."
        )}
    </>
  );
}

export default App;
