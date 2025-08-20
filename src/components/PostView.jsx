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
import LoginRequiredModal from './LoginRequiredModal';
const regions = [
  '서울특별시','부산광역시','대구광역시','인천광역시','광주광역시','대전광역시','울산광역시','세종특별자치시','경기도',
  '강원도','충청북도','충청남도','전라북도','전라남도','경상북도','경상남도','제주특별자치도',
];
const roleTextMap = {
  backend: "BACKEND",
  frontend: "FRONTEND",
  pm: "기획",
  design: "디자인",
  etc: "기타",
};
function PostView() {
  const { postId } = useParams(); // URL에서 postId 받아오기
  const editorRef = useRef();
  const [post, setPost] = useState(null);
  const [useUpdate, setUseUpdate] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false)
  const username = localStorage.getItem("username")
  const [appliedPositions, setAppliedPositions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [like, setLike] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPost = async () => {
      let response = [];
      try {
        if(username) {
        response = await axios.get(`/api/post/viewUsername/${postId}?username=${username}`);
        axios.get(`/api/post/applied/${postId}?username=${username}`)
        .then(res => setAppliedPositions(res.data));
        } else {
          response = await axios.get(`/api/post/view/${postId}`);
        }
        setPost(response.data);
        setStartDate(response.data.startDate ? response.data.startDate.split('T')[0] : '');
        setEndDate(response.data.endDate ? response.data.endDate.split('T')[0] : '');
        if(response.data.likedByUser){
          setLike(true)
        }
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
    const trimmed = post.stackInput?.trim() || "";
    if (trimmed && !post.techStacks.includes(trimmed)) {
      setPost(prev => ({
        ...prev,
        techStacks: [...prev.techStacks, trimmed],
        stackInput: ""
      }));
    }
  };

  const handleDeleteStack = (stackToDelete) => {
    setPost(prev => ({
      ...prev,
      techStacks: prev.techStacks.filter(stack => stack !== stackToDelete)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const markdown = editorRef.current.getInstance().getMarkdown();

    const postData = {
      ...post,
      id: postId,
      content: markdown
    };
    try {
    const response = await axios.post('/api/post/update', postData);

    if (response.status === 200 || response.status === 201) {
      alert('게시글이 수정되었습니다.');
      setUseUpdate(false);
      setPost(prev => ({
        ...prev,
        content: postData.content
      }))
    } else {
      alert('등록에 실패했습니다.');
    }
  } catch (error) {
    console.error('등록 오류:', error);
    alert('오류가 발생했습니다. 다시 시도해 주세요.');
  }
  };
  
  const handleDelete = async (e) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
    const response = await axios.delete(`/api/post/delete/${postId}`);
      alert("게시글이 삭제되었습니다.")
      navigate("/");
    } catch(error) {
      console.error('등록 오류:', error);
      alert('오류가 발생했습니다. 다시 시도해 주세요.');
    }
  }

  const applyPosition = async (positionId) => {
    if(!username) {
      setLoginModalOpen(true);
      return;
    }
    try {
      const response = await axios.post("/api/post/apply", {
        positionId,
        username,
      });
      alert(response.data);
      setAppliedPositions([...appliedPositions, positionId]); // 성공하면 상태에 추가
    } catch (error) {
      alert(error.response.data || "신청 실패");
    }
  }

  const likeHandler = async (postId, nowLike) => {
    if(!username){
      setLoginModalOpen(true);
      return;
    }
      try {
        if(!nowLike) {
          await axios.post("/api/post/like", null, {
          params: {
            postId: postId,
            username: username
          }
        });
        setLike(true);
        } else {
          await axios.delete('/api/post/unLike', { 
          params: { id: postId, username: username } 
        });
        setLike(false);
        }
      } catch (error) {
        alert("실패했습니다. 다시 시도 해주세요.")
      }
    }
  return (
    <div className="view-container">
      <LoginRequiredModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
        {useUpdate ? <>
        <form className='form' onSubmit={handleSubmit}>
          <p className="post-info"><strong>📌 프로젝트 제목:</strong></p>
          <input
            className="post-title-input"
            value={post.title}
            onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
          />
          <div className="date-section">
                      <p className="post-info"><strong>📅 시작일:</strong></p>
                      <TextField
                        type="date"
                        size="small"
                        value={post.startDate}
                        onChange={(e) => setPost(prev => ({ ...prev, startDate: e.target.value }))}
                        className="input"
                        InputLabelProps={{ shrink: true }}
                      />
                      <p className="post-info"><strong>📅 마감일:</strong></p>
                      <TextField
                        type="date"
                        size="small"
                        value={post.endDate}
                        onChange={(e) => setPost(prev => ({ ...prev, endDate: e.target.value }))}
                        className="input"
                        InputLabelProps={{ shrink: true }}
                      />
                  </div>
        <div>
          <p className="post-info"><strong>🏢 프로젝트 방식:</strong></p>
            <div className="project-type-row">
              <select
                name="projectType"
                value={post.projectType}
                onChange={(e) => setPost(prev => ({ ...prev, projectType: e.target.value }))}
                className="select"
              >
                <option value="online">온라인</option>
                <option value="offline">오프라인</option>
                <option value="both">온라인/오프라인</option>
              </select>
              <select
                name="region"
                value={post.region}
                onChange={(e) => setPost(prev => ({ ...prev, region: e.target.value }))}
                className="select"
              >
                <option value="nothing">지역무관</option>
                {post.projectType !== 'online' && regions.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
        <div className="stack-section">
          <p className="post-info"><strong>🔧 사용 스택 :</strong></p>
          <span className="sub">- 프론트엔드, 백엔드, 협업 도구 등 어떤 기술과 도구를 사용할 계획인지 적어 주세요.</span>
          <div className="stack-input">
            <TextField
              variant="outlined"
              size="small"
              value={post.stackInput}
              onChange={(e) => setPost(prev => ({ ...prev, stackInput: e.target.value }))}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddStack();
                }
              }}
              sx={{ flex: 1 }}
            />
            <button type="button" onClick={handleAddStack} style={{fontSize:'25px'}} id='graBtn'>+</button>
          </div>
          <Stack direction="row" spacing={1} flexWrap="wrap" mt={2}>
            {post.techStacks.map((stack, i) => (
              <Chip key={i} label={stack} onDelete={() => handleDeleteStack(stack)} color="primary" />
            ))}
          </Stack>
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
        </form> 
        </>
        :
        <>
        <div className='formDiv'>
        <div className='view-top-container'>
          <p className='category-label'>프로젝트</p>

          <div className='view-top'>
            <h2 className="post-title">{post.title}</h2>
            {!useUpdate && post.author === username && (
              <div className='setting-wrapper'>
                <IoSettingsSharp id='settingIcon' onClick={editMenu} />
                {showEditMenu && (
                  <div className='view-menu'>
                    <p onClick={() => setUseUpdate(true)}>수정</p>
                    <p onClick={() => handleDelete()}>삭제</p>
                  </div>
                )}
              </div>
            )}
            {post.author !== username && (
              <div className='setting-wrapper'>
                {like ? 
                <span id='settingIcon' onClick={()=>likeHandler(post.id, like)}>❤️</span>
                :
                <>
                  <span id='settingIcon' onClick={()=>likeHandler(post.id, like)}>🩶</span>
                </>
                }
              </div>
            )}
          </div>
          <span className="post-info">{post.nickname}</span>
        </div>
          {post.author !== username && post.positions && post.positions.length > 0 && (
            post.positions
              .filter(pos => pos.status !== "END" && pos.count > 0)
              .map(pos => (
                <div className='position' key={pos.id}>
                  <span>{roleTextMap[pos.role]}</span>
                  <span>{pos.count}</span>
                  <>
                  <button
                    className="apply-btn"
                    disabled={appliedPositions.includes(pos.id)}
                    onClick={() => applyPosition(pos.id)}
                  >
                    {appliedPositions.includes(pos.id) ? "신청 완료" : "포지션 신청하기"}
                  </button>
                  </>
                </div>
              ))
          )}

            <span className="post-info"><strong>📅 프로젝트 기간 : </strong> {post.startDate ? post.startDate.split('T')[0] : '미정'} - </span>
            <span className="post-info"><strong></strong> {post.endDate ? post.endDate.split('T')[0] : '미정'}</span>
            <p className="post-info"><strong>🏢 프로젝트 방식:</strong> 
              {post.projectType === "online" && '온라인으로 진행합니다.'}
              {post.projectType === "offline" && '오프라인으로 진행합니다.'}
              {post.projectType === "both" && '온라인과 오프라인 모두 가능합니다.'}
            </p>
            {post.region === 'nothing' ? 
              <p className="post-info"><strong>🗺️ 지역:</strong> 지역무관</p> :
              <p className="post-info"><strong>🗺️ 지역:</strong> {post.region}</p>
            }
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
            </div>
        </>
        }
       
    </div>
  );
}

export default PostView;
