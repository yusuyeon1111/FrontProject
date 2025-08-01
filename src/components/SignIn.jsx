import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Sign.css';
import axios from 'axios';
import { useForm } from 'react-hook-form'
import kakaoLogo from '../assets/kakao_login_medium_narrow.png'
import naverLogo from '../assets/naver.png'
function Signin() {
  const nav = useNavigate();
  const {
      register,
      handleSubmit,
      watch,
      formState:{errors},
    }= useForm();

  const onsubmit = async (data) => {
    try {
        const response = await axios.post("/api/member/signin", data, {
          headers: { "Content-Type": "application/json" }, 
        });
        console.log("로그인 성공:", response.data);
        localStorage.setItem("accesToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        alert("로그인이 완료되었습니다!");
        nav("/");
      } catch (error) {
        console.error("로그인 오류:", error);
        alert("로그인에 실패했습니다. 다시 시도해주세요.");
      }
  }
  const password = watch("password");
  return (
    <div className='signup-container'>
      <p>로그인</p>
      <form className='signForm' onSubmit={handleSubmit(onsubmit)}>
      <label htmlFor='username'>아이디</label>
        <input {...register("username",{required:"아이디를 입력해주세요"})} />
        {errors.loginId && <p>{errors.loginId.message}</p>}

        <label htmlFor='password'>비밀번호</label>
        <input
        type="password"
        {...register("password", {
          required: "비밀번호를 입력해주세요",
          minLength: { value: 6, message: "6자 이상 입력해주세요!" },
        })}
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button style={{marginTop:30}} type='submit'>로그인</button>
        </form>
        <div className='signin-container'>
          <Link to='/membersignup' className="custom-link">회원가입</Link>
          <Link className="custom-link">아이디 찾기</Link>
          <Link className="custom-link">비밀번호 찾기</Link>
        </div>
        <div className='oauthLogin'>
          <img
            src={kakaoLogo}
            alt="카카오 로그인"
            style={{ cursor: 'pointer' , width:'180px'}}
            onClick={() => {
              window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
            }}
          />
           <img
            src={naverLogo}
            alt="네이버 로그인"
            style={{ cursor: 'pointer' , width:'180px'}}
            onClick={() => {
              window.location.href = "http://localhost:8080/oauth2/authorization/naver";
            }}
          />
        </div>

        
    </div>
  );
}

export default Signin;
