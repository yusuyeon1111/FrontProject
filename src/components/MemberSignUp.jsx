import React, { useState } from 'react'
import '../css/Sign.css'
import { useForm } from 'react-hook-form'
import axios from 'axios';
import { Navigate } from 'react-router-dom';
function MemberSignUp() {

  const {
    register,
    handleSubmit,
    watch,
    formState:{errors},
  }= useForm();

  const idCheck = async () => {
    try {
      const username = watch("username"); // react-hook-form에서 입력값 가져오기
      if (!username) {
        alert("아이디를 입력해주세요");
        return;
      }
      const response = await axios.get("/api/member/idCheck", {
        params: { username }  // 쿼리 파라미터로 전달
      });
      alert(response.data); // 서버에서 보낸 메시지 출력
    } catch (error) {
      if (error.response) {
        alert(error.response.data); // 에러 메시지 보여주기
      } else {
        alert("네트워크 에러");
      }
    }
  };

  const onsubmit = async (data) => {
    try {
        const response = await axios.post("/api/member/signup", data, {
          headers: { "Content-Type": "application/json" }, 
        });
        console.log("회원가입 성공:", response.data);
        alert("회원가입이 완료되었습니다!");
      } catch (error) {
        console.error("회원가입 오류:", error);
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
  }

  const password = watch("password");

  const emailRules = {
    required: "이메일을 입력해주세요",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // 정규식 수정
      message: "올바른 이메일 형식이 아닙니다.",
    },
    minLength: {
      value: 6,
      message: "이메일은 최소 6자 이상이어야 합니다.",
    },
  };
  
  return (
    <div className='auth-container'>
      <h2>회원가입</h2>
      <p className='subtitle'>회원 정보를 입력해주세요</p>
      <form className='auth-form' onSubmit={handleSubmit(onsubmit)}>
        <label htmlFor='name'>이름</label>
        <input {...register("name", { required: "이름을 입력해주세요" })} />
        {errors.nickname && <p className='error'>{errors.nickname.message}</p>}
        
        <label htmlFor='nickname'>닉네임</label>
        <input {...register("nickname", { required: "닉네임을 입력해주세요" })} />
        {errors.nickname && <p className='error'>{errors.nickname.message}</p>}
        
        <label htmlFor='username'>아이디</label>
        <div className="input-button-group">
          <input {...register("username", { required: "아이디를 입력해주세요" })} />
          <button type="button" onClick={() => idCheck()}>중복체크</button>
        </div>
        {errors.username && <p className='error'>{errors.username.message}</p>}

        <label htmlFor='email'>이메일</label>
        <input type='email' {...register("email", emailRules)} />
        {errors.email && <p className='error'>{errors.email.message}</p>}

        <label htmlFor='password'>비밀번호</label>
        <input
          type="password"
          {...register("password", {
            required: "비밀번호를 입력해주세요",
            minLength: { value: 6, message: "6자 이상 입력해주세요!" },
          })}
        />
        {errors.password && <p className='error'>{errors.password.message}</p>}

        <label htmlFor='pwConfirm'>비밀번호 확인</label>
        <input
          type="password"
          {...register("pwConfirm", {
            required: "비밀번호 확인은 필수입니다",
            validate: (value) => value === password || "비밀번호가 일치하지 않습니다!",
          })}
        />
        {errors.pwConfirm && <p className='error'>{errors.pwConfirm.message}</p>}
        <label htmlFor='preferredPosition'>희망 포지션</label>
        <select id='preferredPosition' name='preferredPosition'>
          <option value='backend'>BACKEND</option>
          <option value='frontend'>FRONTEND</option>
          <option value='pm'>기획</option>
          <option value='design'>디자인</option>
          <option value='etc'>기타</option>
        </select>
        <button type='submit'>회원가입</button>
      </form>
    </div>

  )
}

export default MemberSignUp
