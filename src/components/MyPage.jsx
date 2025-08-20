import React, { use, useEffect, useState } from 'react';
import '../css/Mypage.css';
import Header from './Header';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import {Tabs, Tab, Modal,Typography, Box, TextField, Button, Stack, Chip, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const roleTextMap = {
  backend: "BACKEND",
  frontend: "FRONTEND",
  pm: "기획",
  design: "디자인",
  etc: "기타",
};
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function MyPage() {
  const [open, setOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [memberData, setMemberData] = useState([]);
  const [postData, setPostData] = useState([]);
  const [applyData, setApplyData] = useState([]);
  const [acceptData, setAcceptData] = useState([]);
  const [likeData, setLikeData] = useState([]);
  const [stackInput, setStackInput] = useState("");
  const [stackList, setStackList] = useState([]);
  const username = localStorage.getItem("username")
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
   const [selectedPost, setSelectedPost] = useState(null);
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '8px',
    boxShadow: 24,
    p: 4,
  } 

   useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get("/api/member/myPage", {
            params: { username }  
          });
          setMemberData(response.data.member);
          setAcceptData(response.data.acceptPosts)
          setApplyData(response.data.applyPosts)
          setLikeData(response.data.likePosts)
          setPostData(response.data.posts)
          console.log(response.data)
        } catch (error) {
          if (error.response) {
            alert(error.response.data); 
          } else {
            alert("네트워크 에러");
          }
        }
      };

      fetchData();  // 호출
    }, [username]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpen = () => {
    if (memberData) {
      setNickname(memberData.nickname);
      setIntroduce(memberData.introduce || "");
      setStackList(memberData.preferredTechStacks || []);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    try {
      const updatedData = {
        username: localStorage.getItem("username"),
        nickname,
        introduce,
        preferredTechStacks: stackList,
      };

      await axios.post('/api/member/update', updatedData);

      alert("수정 완료");

      // 상태 업데이트로 화면 갱신
      setMemberData(prev => ({
        ...prev,
        nickname: updatedData.nickname,
        introduce: updatedData.introduce,
        preferredTechStacks: updatedData.preferredTechStacks,
      }));

      handleClose();
    } catch (err) {
      alert("수정 실패");
    }
  };

      // 스택 추가
    const handleAddStack = () => {
      const trimmed = stackInput.trim();
      if (trimmed && !stackList.includes(trimmed)) {
        setStackList((prev) => [...prev, trimmed]);
        setStackInput("");
      }
    };

    // 스택 삭제
    const handleDeleteStack = (stackToDelete) => {
      setStackList((prev) => prev.filter((stack) => stack !== stackToDelete));
    };
  
    // 모달 열기
     const handleOpenModal = async (postId) => {
      try{
        const response = await axios.get(`/api/post/postMember/${postId}`)
        setSelectedPost(response.data);
        console.log(response.data)
        } catch (error) {
          alert.error("정보를 불러오는 데 실패했습니다. 다시 시도해주세요.")
        }
      setOpenModal(true);
    };

    const handleCloseModal = () => {
      setOpenModal(false);
      setSelectedPost(null);
    };

   const handleAccept = async (postId, positionId, postPositionId) => {
      try {
        const response = await axios.post("/api/post/accept", {
          postId,
          positionId,
          postPositionId,
          username,
        });

        // 서버에서 최신 신청자 목록 받아서 바로 상태 업데이트
        setSelectedPost(response.data);
        alert("수락되었습니다.");
      } catch (error) {
        alert(error.response?.data || "에러가 발생했습니다.");
      }
    };

    const handleReject = async (postId, positionId, postPositionId) => {
      try {
        const response = await axios.post("/api/post/reject", {
          postId,
          positionId,
          postPositionId,
          username,
        });

        setSelectedPost(response.data);
        alert("거절되었습니다.");
      } catch (error) {
        alert(error.response?.data || "에러가 발생했습니다.");
      }
    };


  return (
    <div className="mypage-container">
      <div className='mypage-inner'>
      <div className="myInfo-container">
        {memberData ? (
          <>
           <div className='myInfo-inner'>
            <div id="editIcon"><span>프로필 수정</span><MdEdit size={22} onClick={handleOpen} style={{ cursor: "pointer" }} /></div>
            
            <div className="profile-header">
              <span className="nickname">{memberData.nickname}</span>
              {memberData?.preferredPosition && (
                <span className="role-badge">{memberData.preferredPosition}</span>
              )}
               <>
                  {/* 모달 */}
                  <Modal open={open} onClose={handleClose}>
                    <Box sx={modalStyle}>
                      <h3>프로필 수정</h3>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="소개"
                        multiline
                        rows={4}
                        value={introduce}
                        onChange={(e) => setIntroduce(e.target.value)}
                      />
                      <div className='modal-stack'>
                            <TextField
                              variant="outlined"
                              label="기술스택"
                              size="small"
                              value={stackInput}
                              onChange={(e) => setStackInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddStack();
                                }
                              }}
                              sx={{
                                flex: 1,
                                minWidth: 0,
                                '& .MuiOutlinedInput-root': {
                                  padding: 0,
                                  fontSize: '14px',
                                },
                                '& .MuiOutlinedInput-input': {
                                  padding: '12px',
                                },
                              }}
                            />
                            <button type="button" onClick={handleAddStack}>+</button>
                          <Stack direction="row" spacing={1} flexWrap="wrap" mt={2}>
                            {stackList.map((stack, index) => (
                              <Chip
                                key={index}
                                label={stack}
                                onDelete={() => handleDeleteStack(stack)}
                                color="primary"
                                sx={{ mb: 1 }}
                              />
                            ))}
                          </Stack>
                          </div>
                      <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
                        <Button variant="outlined" onClick={handleClose}>취소</Button>
                        <Button variant="contained" onClick={handleSave}>저장</Button>
                      </Box>
                    </Box>
                  </Modal>
                </>
            </div>
            <p className="intro-text">
              {memberData.introduce != null ? memberData.introduce : "소개멘트를 작성해주세요"}
            </p>
            <div className="myStack-container">
             {memberData?.preferredTechStacks?.map((stack, index) => (
                <span key={index} className="stack-pill"># {stack}</span>
              ))}

            </div>
            </div>
            <div className='profile-info'>
              <div>
                <span>작성글</span>
                <span>{postData.length}</span>
              </div>
              <div>
                <span>신청내역</span>
                <span>{applyData.length}</span>
              </div>
              <div>
                <span>참여중</span>
                <span>{acceptData.length}</span>
              </div>
              <div>
                <span>찜한글</span>
                <span>{likeData.length}</span>
              </div>
            </div>
          </>
        ) : (
          <p>불러오는 중...</p>
        )}
      </div>


      <div className="myAct-container">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="작성글" {...a11yProps(0)} />
              <Tab label="신청내역" {...a11yProps(1)} />
              <Tab label="참여중" {...a11yProps(2)} />
              <Tab label="찜한글" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <div className='postData-container'>
            { postData.length > 0 ? postData.map((post)=>(
              <div className='postItemTop' key={post.id} >
              <div className='postItem'>
                 {post.category === 'study' ?
                <span id='studylabel'>스터디</span>
                :<span id='projectlabel'>프로젝트</span>}
                <span className='myTitle' onClick={() => navigate(post.category === 'study'? `/study/${post.id}`: `/post/${post.id}`)}>
                  {post.title}</span>
                {post.status === 'END' ? (
                  <span className='status' data-type="end">모집완료</span>
                ) : (
                  <span className='status' data-type="active">모집중</span>
                )}
                <div className='dataInner'>
                  <span className='myDate'> 작성일자 : {!post.updated ? post.created : post.updated}</span><span className='line'>|</span>
                  <span className='myDate'> 기간 : {post.startDate} - {post.endDate}  {post.postStatus === 'END' ? '종료' : '진행중'}</span><span className='line'>|</span>
                  <span className='myDate'> 조회수 {post.viewCount}</span><span className='line'>|</span>
                  <span className='myDate'> ❤️ {post.likeCount}</span>
                </div>
                </div>
                <button id='applyMngBtn' onClick={() => handleOpenModal(post.id)}>👤 신청자관리</button>
              </div>
            )):<div><p>데이터 없음.</p></div>}
            </div>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            {applyData.length > 0 ? 
             applyData.map((post)=>(
              <div key={post.postId} className='postItem'>
                {post.category === 'study' ?
                <span id='studylabel'>스터디</span>
                :<span id='projectlabel'>프로젝트</span>}
                <span className='myTitle' onClick={() => navigate(post.category === 'study'? `/study/${post.postId}`: `/post/${post.postId}`)}>
                  {post.postTitle}</span>
                <span
                  className={`like ${
                    post.applyStatus === 'APPLY'
                      ? 'status-pending'
                      : post.applyStatus === 'ACCEPT'
                      ? 'status-accepted'
                      : post.applyStatus === 'REJECT'
                      ? 'status-rejected'
                      : 'status-unknown'
                  }`}
                >
                  {post.applyStatus === 'APPLY'
                    ? '대기'
                    : post.applyStatus === 'ACCEPT'
                    ? '승인'
                    : post.applyStatus === 'REJECT'
                    ? '거절'
                    : '알 수 없음'}
                </span>

                <div className='dataInner'>
                  <span className='myDate'> 신청일자 : {post.appliedAt}</span>
                  {post.category === 'project' && <><span className='line'>|</span><span className='myDate'> 신청분야 : {roleTextMap[post.positionName]}</span></>}
                </div>
              </div>
            ))
            : <div><p>데이터 없음.</p></div>
          }
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            {applyData.length > 0 ? applyData.map((post)=>(
              <div key={post.postId} className='postItem'>
                {post.category === 'study' ?
                <span id='studylabel'>스터디</span>
                :<span id='projectlabel'>프로젝트</span>}
                <span className='myTitle' onClick={() => navigate(post.category === 'study'? `/study/${post.postId}`: `/post/${post.postId}`)}>
                  {post.postTitle}</span>
                {post.postStatus === 'END' ? (
                  <span className='status' data-type="end">진행완료</span>
                ) : (
                  <span className='status' data-type="active">진행중</span>
                )}
                <div className='dataInner'>
                  <span className='myDate'>참여일자 : {post.acceptedAt}</span>
                  <span className='myDate'> 기간 : {post.startDate} - {post.endDate}</span><span className='line'>|</span>
                  <span className='myDate'> 참여분야 : {roleTextMap[post.positionName]}</span>
              </div>
              </div>
            )): <div><p>데이터 없음.</p></div>}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            {likeData.length > 0 ? likeData.map((post)=>(
              <div key={post.id} className='postItem'>
                 {post.category === 'study' ?
                <span id='studylabel'>스터디</span>
                :<span id='projectlabel'>프로젝트</span>}
                <span className='myTitle' onClick={() => navigate(post.category === 'study'? `/study/${post.id}`: `/post/${post.id}`)}>
                  {post.title}</span>
                {post.status === 'END' ? (
                  <span className='status' data-type="end">모집완료</span>
                ) : (
                  <span className='status' data-type="active">모집중</span>
                )}

                <div className='dataInner'>
                  <span className='myDate'> 작성일자 : {!post.updated ? post.created : post.updated}</span><span className='line'>|</span>
                  <span className='myDate'> 기간 : {post.startDate} - {post.endDate}  {post.postStatus === 'END' ? '종료' : '진행중'}</span><span className='line'>|</span>
                  <span className='myDate'> 조회수 {post.viewCount}</span><span className='line'>|</span>
                  <span className='myDate'> ❤️ {post.likeCount}</span>
                </div>
                  
              </div>
            )): <div><p>데이터 없음.</p></div>}
          </CustomTabPanel>
        </Box>
      </div>
    </div>
     {/* 신청자 관리 모달 */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" mb={2}>
            {selectedPost?.title} 신청자 관리
          </Typography>
          {selectedPost?.length > 0 ? (
            <List>
              {selectedPost.map((post) => (
                <ListItem key={post.id}>
                  <ListItemText
                    primary={post.nickname}
                    secondary={
                      <>
                        신청일: {post.appliedAt}
                        <span className={`like ${
                          post.status === 'APPLY' ? 'status-pending' :
                          post.status === 'ACCEPT' ? 'status-accepted' :
                          post.status === 'REJECT' ? 'status-rejected' : 'status-unknown'
                        }`}>
                          {post.status === 'APPLY' ? '대기' :
                          post.status === 'ACCEPT' ? '승인' :
                          post.status === 'REJECT' ? '거절' : '알 수 없음'}
                        </span>
                        {post.category === 'project' && (
                          <span className='myDate'> 참여분야: {roleTextMap[post.role]}</span>
                        )}
                      </>
                    }
                  />
                  {post.status === 'APPLY' && (
                    <>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        sx={{ ml: 1 }}
                        onClick={() => handleAccept(post.postId, post.positionId, post.postPositionId)}
                      >
                        승인
                      </Button>
                      <Button 
                        size="small" 
                        variant="outlined" 
                        color="error" 
                        sx={{ ml: 1 }}
                        onClick={() => handleReject(post.postId, post.positionId, post.postPositionId)}
                      >
                        거절
                      </Button>
                    </>
                  )}
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography>신청자가 없습니다.</Typography>
          )}
          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={handleCloseModal}>닫기</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default MyPage;
