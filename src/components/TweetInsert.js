import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { db, storage } from 'fbase';
import { addDoc, collection } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'styles/TweetInsert.scss'


function TweetInsert({userObj}) {

  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onChange = (e) =>{
    e.preventDefault();
    const {target: {value}} = e;
    setTweet(value);
  }

  const onSubmit = async(e) =>{
    e.preventDefault();
    try{
      let attachmentUrl = "";
      if(attachment !== ""){
        const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`); //uuid4에서 임의로 문서id 지정받아 저장 경로 지정
        const response = await uploadString(storageRef, attachment, 'data_url')
        console.log("response ->", response)
        attachmentUrl = await getDownloadURL(ref(storage, response.ref)) // response.ref 안에 생성한 URL 존재(https://...)
      }

      const docRef = await addDoc(collection(db, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl // https:// 형태로 만든 이미지 주소를 addDoc
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    setTweet(""); // tweet 버튼 누르고 내용 초기화
    setAttachment("");
  }

  const onFileChange = (e) =>{
    console.log('e->', e);
    const {target: {files}} = e; //구조분해할당
    const theFile = files[0]; //현재 이미지가 들어가 있는 주소 (jpg)
    console.log("theFile->", theFile); 

    const reader = new FileReader(); //FileReader라는 브라우저에서 제공하는 api함수. 브라우저에서 보이려면 사용해야 한다. 미리보기 가능
    reader.onloadend = (finishedEvent) => { //파일을 다 읽고 파라미터에 데이터가 들어온다
      console.log('finishedEvent -> ', finishedEvent); //result에는 사용할 주소(첨부할 파일의 주소) //data:image
      const {currentTarget:{result}} = finishedEvent //구조분해할당
      setAttachment(result); // 결국 result 안에 data:image
    }
    reader.readAsDataURL(theFile); // 아까 불러들였던 이미지 파일을 데이터url로 바꿔 준다 (jpg이미지 -> 데이터url)
  }

  const onclearAttachment = () => {
    setAttachment(""); // Attachment를 비우기(첨부파일 삭제)
  }
  

  return (
    <>
      <form onSubmit={onSubmit} className='InsertForm'>
        <div className='InsertInput_container'>
          <input type='text' placeholder="What's on your mind" value={tweet} onChange={onChange} maxLength={120} className='InsertInput_input' />
          <input type='submit' value='&rarr;' className='InsertInput_arrow' />
        </div>
        <label htmlfor='attachFile' className='InsertInput_label'>
          <span>Add photos</span>
          <FontAwesomeIcon icon='fa-solid fa-plus' />
        </label>
        {/* form의 label for, input id 연결하면 label만 클릭해도 input으로 연결된다 */}
        <input type='file' id='attachFile' accept='image/*' onChange={onFileChange} style={{opacity:0}} /> 
        {attachment && (
          <div className='InsertForm_attachment'>
            <img src={attachment} alt="" style={{backgroundImage:attachment}} />
            <div className='InsertForm_clear' onClick={onclearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon='fa-solid fa-xmark' />
            </div>
          </div>
        )}
      </form>
    </>
  )
}

export default TweetInsert