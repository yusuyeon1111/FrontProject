import React, { useState } from 'react'
import '../css/Sign.css'
function MemberSignUp() {
  return (
    <div className='signup-container'>
    <p>회원가입</p>
    <span>회원정보를 입력해주세요.</span>
        <label htmlFor='name'>이름</label>
        <input type='text' id='name' placeholder='아이디' />

        <label htmlFor='loginId'>아이디</label>
        <input type='text' id='loginId' placeholder='아이디' />

        <label htmlFor='password'>비밀번호</label>
        <input type='password' id='password' placeholder='비밀번호' />

        <label htmlFor='pwConfirm'>비밀번호 확인</label>
        <input type='password' id='pwConfirm' placeholder='비밀번호 확인' />

        <label htmlFor='email'>이메일</label>
        <input type='email' id='email' placeholder='이메일' />

        <button style={{marginTop:30}}>회원가입</button>
  </div>
  )
}

export default MemberSignUp
