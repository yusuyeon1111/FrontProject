import React, { useEffect, useState } from 'react';
import '../css/Mypage.css';
import Header from './Header';
import axios from 'axios';
import { MdEdit } from "react-icons/md";
import {Tabs, Tab, Modal, Box, TextField, Button, Stack, Chip } from '@mui/material';
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
  const [memberData, setMemberData] = useState(null);
  const [stackInput, setStackInput] = useState("");
  const [stackList, setStackList] = useState([]);
  const username = localStorage.getItem("username")

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
          setMemberData(response.data);
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
    }, []);

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
  
  return (
    <div className="mypage-container">
      <div className='mypage-inner'>
      <div className="myInfo-container">
        {memberData ? (
          <>
           <div className='myInfo-inner'>
            <div className="profile-header">
              <span className="nickname">{memberData.nickname}</span>
              <span className="role-badge">{memberData.preferredPosition}</span>
               <>
                  <MdEdit id="editIcon" onClick={handleOpen} style={{ cursor: "pointer" }} />
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
             {memberData.preferredTechStacks.map((stack, index) => (
              <span key={index} className="stack-pill"># {stack}</span>
            ))}
            </div>
            </div>
            <div className='profile-info'>
              <div>
                <p>신청내역</p>
                <p>7</p>
              </div>
              <div>
                <p>참여중</p>
                <p>7</p>
              </div>
              <div>
                <p>작성글</p>
                <p>7</p>
              </div>
              <div>
                <p>찜한글</p>
                <p>7</p>
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
            📝 내가 작성한 글 리스트
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            📩 신청한 스터디 내역
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            👥 참여 중인 스터디 목록
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            📌 찜한 스터디 목록
          </CustomTabPanel>
        </Box>
      </div>
    </div>
    </div>
  );
}

export default MyPage;
