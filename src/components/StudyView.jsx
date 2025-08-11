import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Box, MenuItem, Chip, Stack } from '@mui/material';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import axios from 'axios';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';
import '../css/View.css'
import { IoSettingsSharp } from "react-icons/io5";
const regions = [
  '서울특별시','부산광역시','대구광역시','인천광역시','광주광역시','대전광역시','울산광역시','세종특별자치시','경기도',
  '강원도','충청북도','충청남도','전라북도','전라남도','경상북도','경상남도','제주특별자치도',
];

function StudyView() {
  const { postId } = useParams(); // URL에서 postId 받아오기
  const editorRef = useRef();
  const [post, setPost] = useState(null);
  const [type, setType] = useState('online');
  const [region, setRegion] = useState('nothing');
  const [username , setUsername] = useState('');
  const [useUpdate, setUseUpdate] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false)
  const [stackInput, setStackInput] = useState("");
  const [stackList, setStackList] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/post/view/${postId}`);
        console.log(response.data)
        setPost(response.data);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <div>로딩 중...</div>;

 const editMenu = () => {
    setShowEditMenu(prev => {
      return !prev;
    });
  };

  const handleAddStack = () => {
    const trimmed = stackInput.trim();
    if (trimmed && !stackList.includes(trimmed)) {
      setStackList([...stackList, trimmed]);
      setStackInput("");
    }
  };

  const handleDeleteStack = (stackToDelete) => {
    setStackList(stackList.filter((stack) => stack !== stackToDelete));
  };
  
  return (
    <div className="view-container">
        <p className='category-label'>스터디</p>
      <form className='form'>
        {useUpdate ? <>
        <p className="post-info"><strong>📌 스터디 제목:</strong></p>
          <input className="post-title-input" value={post.title}/>
        <div>
          <p className="post-info"><strong>🏢 스터디 방식:</strong></p>
            <div className="project-type-row">
              <select
                name="projectType"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="select"
              >
                <option value="online">온라인</option>
                <option value="offline">오프라인</option>
                <option value="both">온라인/오프라인</option>
              </select>
              <select
                name="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="select"
              >
                <option value="nothing">상관없음</option>
                {type !== 'online' && regions.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        <h3 className="post-section-title">✔️ 설명</h3>
        <div className="editor-wrapper">
          <Editor
            ref={editorRef}
            height="400px"
            initialEditType="wysiwyg"
            previewStyle="vertical"
            initialValue={post.content}
                  />
        </div> 
        <div className='btmBtn-container'>
            <button type='submit' id='submitBtn'>수정</button>
            <button type='button' onClick={() => setUseUpdate(false)} id='cancleBtn'>취소</button>
        </div> 
        </>
        :
        <>
            <div className='view-top'>
              <h2 className="post-title">{post.title}</h2>
              <div style={{ position: 'relative' }}>
                {!useUpdate ? 
                <>
                  <IoSettingsSharp id='settingIcon' onClick={editMenu} />
                  {showEditMenu && (
                  <div className='view-menu'>
                    <p onClick={() => setUseUpdate(true)}>수정</p>
                    <p onClick={() => navigate("/studyform")}>삭제</p>
                  </div>
                )}
                </>
                :<></>}
              </div>
            </div>
            <p className="post-info"><strong>👤 작성자:</strong> {post.nickname}</p>
            <p className="post-info"><strong>🏢 스터디 방식:</strong> 
              {post.projectType === "online" && '온라인으로 진행합니다.'}
              {post.projectType === "offline" && '오프라인으로 진행합니다.'}
              {post.projectType === "both" && '온라인과 오프라인 모두 가능합니다.'}
            </p>
            {post.region !== 'nothing' && (
              <p className="post-info"><strong>🗺️ 지역:</strong> {post.region}</p>
            )}
            {post.category === 'project' ? 
            <>
            <p className="post-info"><strong>🔧 사용 스택:</strong></p>
            <div className="myStack-container">
                {post.techStacks.map((stack, index) => (
                  <span key={index} className="stack-pill"># {stack}</span>
                ))}
            </div>
            </>
            :<></>}
            <h3 className="post-section-title">✔️ 설명</h3>
            <Viewer initialValue={post.content} />
        </>
        }
      </form>
    </div>
  );
}

export default StudyView;
