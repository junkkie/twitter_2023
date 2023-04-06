import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from 'react'
import { db, storage } from 'fbase';
import { ref, deleteObject } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import 'styles/Tweet.scss'

function Tweet({tweetObj, isOwner}) {
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [nowDate, setNowDate] = useState(tweetObj.createdAt);

  const onDeleteClick = async () =>{
    const ok = window.confirm("삭제하시겠습니까?"); // 확인 누르면 true 값이 변수에 저장됨
    if(ok){
      const data = await deleteDoc(doc(db, "tweets", `/${tweetObj.id}`));
                                                      // 문자열이 들어가야 하기 때문에 백틱 형태 사용, 슬래시는 '컬렉션' 폴더의 하위 '문서' 폴더이기 때문
      if(tweetObj.attachmentUrl !==""){ //공백이 아닐경우 
        const desertRef = ref(storage, tweetObj.attachmentUrl);
        await deleteObject(desertRef);
      }
    }
  }

  const toggleEditing = () => setEditing((prev) => !prev); // 토글기능 함수 실행되면 setEditing true로?

  const onChange = (e) =>{
    const {target:{value}} = e;
    setNewTweet(value);
  }

  const onSubmit = async (e) =>{
    e.preventDefault();
    const newTweetRef = doc(db, "tweets", `/${tweetObj.id}`);
    await updateDoc(newTweetRef, {
      text: newTweet,
      createdAt: Date.now(),
    });
    setEditing(false);
  }

  useEffect (() =>{ // 업로드 시간 업데이트
    let timeStamp = tweetObj.createdAt;
    const now = new Date(timeStamp);
    setNowDate(now.toUTCString()); // toUTCString: 시,분,초까지 toDateString: 연,월,일,요일까지
  },[])

  return (
    <div className="tweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container tweetEdit">
            <input className="formInput" type="text" onChange={onChange} value={newTweet} required />
            <input className="formBtn" type="submit" value = "Update tweet" />
          </form>
          <button className="formBtn cancelBtn" onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          {tweetObj.text !== "" && (
            <>
              <h4>{tweetObj.text}</h4>
              {tweetObj.attachmentUrl && ( // 이미지 주소가 존재할 때에만 이미지 박스 노출
                <img src={tweetObj.attachmentUrl} width="50" height="50" alt="" />
              )}
              <span>{nowDate}</span>
                {isOwner && ( // && 연산자. isOwner가 true일 경우에만 버튼 보임(로그인한 id가 쓴 글만 수정, 삭제 버튼 보임)
                <div className="tweet_actions">
                  <span onClick={onDeleteClick}>
                    <FontAwesomeIcon icon='fa-solid fa-trash' />
                  </span>
                  <span onClick={toggleEditing}>
                    <FontAwesomeIcon icon='fa-solid fa-pencil' />
                  </span>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}

export default Tweet