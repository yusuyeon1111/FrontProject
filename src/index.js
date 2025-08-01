import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import OAuth2Success from './components/OAuth2Success';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import reportWebVitals from './reportWebVitals';
import MemberSignUp from './components/MemberSignUp';
import MyPage from './components/MyPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename = {process.env.PUBLIC_URL}>
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="/signin" element={<SignIn/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/membersignup" element={<MemberSignUp/>}/>
      <Route path="/myPage" element={<MyPage/>}/>
      <Route path="/oauth2/success" element={<OAuth2Success/>}/>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
