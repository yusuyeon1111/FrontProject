import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Sign.css';
import axios from 'axios';
import { useForm } from 'react-hook-form'
import kakaoLogo from '../assets/kakaoLogo.png'
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
     <div className="auth-container">
      <h2>로그인</h2>
      <form className="auth-form" onSubmit={handleSubmit(onsubmit)} noValidate>
        <label htmlFor="username">아이디</label>
        <input
          id="username"
          type="text"
          {...register('username', { required: '아이디를 입력해주세요' })}
        />
        {errors.username && <p className="error">{errors.username.message}</p>}

        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          {...register('password', { required: '비밀번호를 입력해주세요' })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <button type="submit">로그인</button>
      </form>

      <div className="auth-links">
        <a href="/signup">회원가입</a>
        <a href="/find-id">아이디 찾기</a>
        <a href="/find-pw">비밀번호 찾기</a>
      </div>

      <div className="oauth-buttons">
        <button className="kakao-login" onClick={()=>{window.location.href = "http://localhost:8080/oauth2/authorization/kakao";}}>카카오 로그인</button>
        <button className="naver-login" onClick={()=>{window.location.href = "http://localhost:8080/oauth2/authorization/naver";}}>네이버 로그인</button>
      </div>
    </div>

  );
}

export default Signin;
