import React, { useState } from 'react'
import { authService } from 'fbase'
import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AuthForm from 'components/AuthForm';
import 'styles/Auth.scss'

function Auth() {

  const onSocialClick = async(e) =>{ // google / github 로그인
    console.log(e.target.name);
    const {target:{name}} = e;
    let provider;

    if(name === "google"){
      provider = new GoogleAuthProvider();
    } else if(name === 'github'){
      provider = new GithubAuthProvider();
    }

    const data = await signInWithPopup(authService, provider)
    console.log('data->',data)
  }

  return (
    <div className='authContainer'>
      <FontAwesomeIcon icon="fa-brands fa-twitter" size='3x' color={'#04aaff'} style={{marginBottom:30}} />
      <AuthForm />
      <div className='authBtns'>
        <button className='authBtn' name='google' onClick={onSocialClick}>Continue with Google</button>
        <button className='authBtn' name='github' onClick={onSocialClick}>Continue with Github</button>
        {/* form 안에 들어가는 요소를 건들기 위해 name 지정한 것. input, button 등 form 안에 들어가는 요소 말고는 적용되지 않는다 */}
      </div>
    </div>
  )
}

export default Auth