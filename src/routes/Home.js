import { db, storage } from 'fbase';
import React, { useEffect, useState } from 'react'
import { collection, addDoc, getDocs, onSnapshot, query, orderBy } from "firebase/firestore";
import Tweet from 'components/Tweet';
import TweetInsert from 'components/TweetInsert';

function Home({userObj}) {
  const [tweets, setTweets] = useState([]);

  useEffect(() =>{
    // getTweets();
    const q = query(collection(db, "tweets"), // 데이터 가져오기??
              orderBy("createdAt", "desc")); // tweet한 데이터 시간순(createAt)으로 정렬
    const unsubscribe = onSnapshot(q, (querySnapshot) => { // 정렬한 query를 onSnapshot으로 실시간으로 읽어들임
      const newArray = [];
      querySnapshot.forEach((doc) => {
          newArray.push({...doc.data(), id:doc.id}); // 새로운 배열에 정렬한 문서 객체 넣어 줌, id 지정
      });
      setTweets(newArray); // setTweets에 객체 배열 대입
    });
  },[]);


  return (
      <div className='container'>
        <TweetInsert userObj={userObj}/>
        <div>
          {tweets.map(tweet =>(
            <Tweet key={tweet.id} tweetObj={tweet} isOwner={tweet.creatorId === userObj.uid} /> 
                                                    // 로그인된 유저의 id와 작성한 글을 쓴 유저의 uid가 같아야 됨
          ))}
        </div>
        <footer>&copy; {new Date().getFullYear()} Twitter App</footer>
      </div>
  )
}

export default Home