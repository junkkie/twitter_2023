import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Link } from 'react-router-dom';

function Navigation({userObj}) {
  console.log("userObj ->",userObj)

  return (
    <div>
      <nav>
        <ul style={{display:'flex', justifyContent:'center', marginTop:50}}>
          <li><Link to={'/'}>
            <FontAwesomeIcon icon="fa-brands fa-twitter" size='2x' color={'#04aaff'} />  
          </Link></li>
          <li><Link to={'/profile'} style={{display:'flex', flexDirection:'column', alignItems:'center', marginLeft:10, fontSize:12}}>
            <FontAwesomeIcon icon='fa-solid fa-user' size='2x' color={'#04aaff'} />
            <span style={{marginTop:10}}>
              {userObj.displayName ? `${userObj.displayName}의 Profile` : 'profile'}
            </span>
            <img src='' alt='' />
          </Link></li>
        </ul>
      </nav>
    </div>
  )
}

export default Navigation