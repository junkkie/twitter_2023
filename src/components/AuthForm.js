import React, { useState } from 'react'
import { authService } from './../fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import 'styles/AuthForm.scss'

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newAccount, setNewAccount] = useState(true); // true: 회원가입, false: 로그인
  const [error, setError] = useState('');

  const onChange = (e) =>{ // input
    console.log(e.target.name);
    console.log(e);
    const {target:{name, value}} = e; // target 속성 안에 있는 데이터 중 name, value의 값을 가져오겠다

    if(name === 'email'){
      setEmail(value);
    }else if(name === 'password'){
      setPassword(value);
    }
  }

  const toggleAccount = () => setNewAccount(prev => !prev) // prev라는 파라미터에 기존의 newAccount 값이 들어오고, 그것을 부정하는 함수

  const onSubmit = async(e) =>{ // submit
    e.preventDefault();
    try{
      let data; // 회원가입, 로그인 응답 결과를 변수에 저장
      if(newAccount){ // 회원가입
        data = await createUserWithEmailAndPassword(authService, email, password)
      }else{ // 로그인
        data = await signInWithEmailAndPassword(authService, email, password)
      }
      console.log('data->',data)
    } catch(error) {
      console.log('error ->',error)
      setError(error.message)
    }
  }

  return (
    <>
      <form className='container' onSubmit={onSubmit}>
        {/* 
        여러 인풋을 사용할 경우 인풋에 name 지정
        입력한 값을 바로 보내 주기 위해 value 지정
        */}
        <input className='authInput' name='email' type='email' placeholder='Email'  required value={email} onChange={onChange}/>
        <input className='authInput' name='password' type='password' placeholder='PassWord' value={password} onChange={onChange}/>
        <input className='authInput authSubmit' type='submit' value={newAccount ? 'Create New Account' : 'Log In'} />
        {error && <span className='authError'>{error}</span>}
      </form>
      <span className='authSwitch' onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create New Account"}
      </span>
    </>
  )
}

export default AuthForm