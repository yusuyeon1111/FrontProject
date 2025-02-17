import React from 'react';
import '../css/Sign.css';

function Signup() {
  return (
    <div className='signup-container'>
      <p>사업자 회원가입</p>
      <span>회원정보를 입력해주세요.</span>
        
        <label htmlFor='userId'>아이디</label>
        <input type='text' id='userId' placeholder='아이디' />

        <label htmlFor='storeName'>가게 이름</label>
        <input type='text' id='storeName' placeholder='가게 이름' />

        <label htmlFor='userPw'>비밀번호</label>
        <input type='password' id='userPw' placeholder='비밀번호' />

        <label htmlFor='userPwConfirm'>비밀번호 확인</label>
        <input type='password' id='userPwConfirm' placeholder='비밀번호 확인' />

        <label htmlFor='userEmail'>이메일</label>
        <input type='email' id='userEmail' placeholder='이메일' />

        <label htmlFor='userPhone'>연락처</label>
        <input type='text' id='userPhone' placeholder='연락처' />

        <label htmlFor='userAddress'>주소</label>
        <div style={{ display: 'flex', gap: '10px' }}>
            <input type='text' id='userAddress' placeholder='주소' style={{ flex: 1 }} />
            <button>주소검색</button>
      </div>
      
        <label htmlFor='userAddDetail'>상세주소</label>
        <input type='text' id='userAddDetail' placeholder='상세주소를 입력해주세요' />

        <button style={{marginTop:30}}>회원가입</button>
    </div>
  );
}

export default Signup;
