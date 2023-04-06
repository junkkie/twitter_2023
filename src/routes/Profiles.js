import React, { useEffect, useState } from 'react'
import { authService, db } from 'fbase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import Tweet from 'components/Tweet';
// import { async } from '@fbase/util'
import { updateProfile } from 'firebase/auth';
import 'styles/Profile.scss'

function Profiles({userObj}) {
  const navigate = useNavigate();
  const [tweets, setTweets] = useState([]);
  const [newDisplayName, setNewDisplayName] = useState();

  const onLogOutClick = () =>{
    authService.signOut();
    navigate('/'); // 리다이렉트 기능. 로그아웃 클릭 시 홈화면으로 이동
  }

  useEffect(() =>{
    const q = query(collection(db, "tweets"),
              where("creatorId", "==", userObj.uid),
              orderBy("createAt","desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = [];
      querySnapshot.forEach((doc) => {
        newArray.push({...doc.data(), id:doc.id}); // 기존 문서의 데이터에 새로운 속성 추가(id 지정)
      });
      setTweets(newArray); // setTweets에 새로운 객체 배열 대입
    });
  },[])
  
  const onSubmit = async (e) =>{
    e.preventDefault();
    if(userObj.displayName !== newDisplayName) { // 값 다를 경우에만 업데이트되도록
      await updateProfile(userObj,{
        displayName:newDisplayName,
        // PhotoURL: 
      });
    }
  }

  const onChange = (e) =>{
    const {target:{value}} = e;
    setNewDisplayName(value);
  }

  return (
    <div className='container'>
      <form className='profileForm' onSubmit={onSubmit}>
        <input className='formInput' type='text' placeholder="Display name" value={newDisplayName} onChange={onChange} />
        <input className='formBtn' type='submit' value='Update Profile' />
      </form>
      <span className='formBtn cancelBtn logOut' onClick={onLogOutClick}>Log Out</span>
      <div>
        {tweets.map(tweet =>(
          <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  )
}

export default Profiles