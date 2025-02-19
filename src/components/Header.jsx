import React from 'react'
import Login from './Login';
import SignIn from './SignIn';
import '../css/Header.css'
import { useNavigate } from 'react-router-dom';
import { FaUserCircle} from "react-icons/fa";
import { IoBookmark } from "react-icons/io5";

function Header() {
  const navigate = useNavigate();

  const goToSign = () => {
    navigate("/membersignup")
  }

  return (
    <div className='header-container'> 
      <div className='logo-container'>
        <IoBookmark id='bookmark'/>
        <span id='logo'>북테이블</span>
        <span id='logoex'>간편한 식당 예약 시스템</span>
      </div>
      <div className='member-container'>
          <FaUserCircle onClick={goToSign} id='userIcon'/>
      </div>
    </div>
  )
}

export default Header