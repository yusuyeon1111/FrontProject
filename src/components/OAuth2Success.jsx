import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
const OAuth2Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const onsubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
      nickname: formData.get('nickname'),
      preferredPosition: formData.get('preferredPosition'),
      username: localStorage.getItem("username")
    };

    if (!data.nickname) {
      alert("닉네임을 입력해주세요.");
      return;
    }

    try {
      await axios.post("/api/member/update", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });
      alert("정보 등록이 완료되었습니다!");
      navigate("/"); 
    } catch (err) {
      console.error("업데이트 오류:", err);
      alert("정보 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

      useEffect(() => {
      const query = new URLSearchParams(location.search);
      const accessToken = query.get('accessToken');
      const refreshToken = query.get('refreshToken');
      const username = query.get('username')
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("username",username);
        alert("로그인 완료!");
      } else {
        alert("로그인 실패");
        navigate("/signin");
      }
    }, [location, navigate]);


  return(
    <div className="auth-container" >
      <h2>추가 정보 등록</h2>
      <form className="auth-form" onSubmit={onsubmit}>
        <label htmlFor='nickname'>닉네임</label>
        <input id='nickname' name='nickname'/>
        <label htmlFor='preferredPosition'>희망 포지션</label>
        <select id='preferredPosition' name='preferredPosition'>
          <option value='backend'>BACKEND</option>
          <option value='frontend'>FRONTEND</option>
          <option value='pm'>기획</option>
          <option value='design'>디자인</option>
          <option value='etc'>기타</option>
        </select>
        <button type='submit'>등록</button>
       </form>
    </div>
  );
};

export default OAuth2Success;
