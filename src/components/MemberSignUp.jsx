import React, { useState } from 'react'
import '../css/Sign.css'
import { useForm } from 'react-hook-form'
import axios from 'axios';
function MemberSignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState:{errors},
  }= useForm();

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
    <div className='signup-container'>
    <p>회원가입</p>
    <p>회원정보를 입력해주세요.</p>
    <form className='signForm' onSubmit={handleSubmit(onsubmit)}>
        <label htmlFor='name'>이름</label>
        <input {...register("name",{required:"이름을 입력해주세요"})} />
        {errors.name && <p>{errors.name.message}</p>}

        <label htmlFor='loginId'>아이디</label>
        <input {...register("loginId",{required:"이름을 입력해주세요"})} />
        {errors.loginId && <p>{errors.loginId.message}</p>}

        <label htmlFor='email'>이메일</label>
        <input type='email' {...register("email",emailRules)} />
        {errors.email && <p>{errors.email.message}</p>}

        <label htmlFor='password'>비밀번호</label>
        <input
        type="password"
        {...register("password", {
          required: "비밀번호를 입력해주세요",
          minLength: { value: 6, message: "6자 이상 입력해주세요!" },
        })}
        />
        {errors.password && <p>{errors.password.message}</p>}


        <label htmlFor='pwConfirm'>비밀번호 확인</label>
        <input
        type="password"
        {...register("pwConfirm", {
          required: "비밀번호 확인은 필수입니다",
          validate: (value) => value === password || "비밀번호가 일치하지 않습니다!",
        })}
        />
        {errors.pwConfirm && <p>{errors.pwConfirm.message}</p>}

        
        <button style={{marginTop:30}} type='submit'>회원가입</button>
        </form>
  </div>
  )
}

export default MemberSignUp
