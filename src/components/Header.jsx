import React, { useEffect, useState } from 'react'
import SignIn from './SignIn';
import '../css/Header.css'
import { useNavigate } from 'react-router-dom';
import { FaUserCircle} from "react-icons/fa";
import { IoBookmark } from "react-icons/io5";
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import { FaBell } from "react-icons/fa6";

function Header() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  useEffect(()=>{
    setAccessToken(localStorage.getItem("accessToken"));
  }, [])
 
  const toggleMenu = () => {
      setShowMenu(prev => !prev);
    };

  const goToLogout = () => {
    try {
    axios.post("/api/member/logout", null, {
          headers: { Authorization: `Bearer ${accessToken}` }, 
        });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
    alert("로그아웃 되었습니다.");
      } catch(error) {
        console.error("로그아웃 실패", error);
        alert("로그아웃 중 오류가 발생했습니다.");
      }
  }
 

  return (
    <div className='header-container'> 
      <div className='logo-container'>
        <IoBookmark id='bookmark'/>
        <span id='logo' onClick={()=>navigate("/")}>팀해요</span>
      </div>
      <div className='member-container'>
         <FaBell className='memberIcon'/>
         <MdEdit className='memberIcon' onClick={() => navigate("/postform")}/>
         <span id='line'>|</span>
         <FaUserCircle onClick={toggleMenu} id='userIcon'/>
        
        {showMenu && (
          <div className='menu-container'>
            {!accessToken ? (
              <>
                <p onClick={() => navigate("/signin")}>로그인</p>
                <p onClick={() => navigate("/membersignup")}>회원가입</p>
              </>
            ) : (
              <>
                <p onClick={() => navigate("/myPage")}>마이페이지</p>
                <p onClick={goToLogout}>로그아웃</p>
              </>
            )}
          </div>
           )}
      </div>
    </div>
  )
}

export default Header