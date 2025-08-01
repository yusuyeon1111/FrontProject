// pages/OAuth2Success.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OAuth2Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const accessToken = query.get('accessToken');
    const refreshToken = query.get('refreshToken');
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    if (accessToken && refreshToken) {
      alert("로그인 완료!");
      navigate("/"); // 홈으로 리다이렉트
    } else {
      alert("로그인 실패");
      navigate("/signin");
    }
  }, [location, navigate]);

  return <p>로그인 중입니다...</p>;
};

export default OAuth2Success;
