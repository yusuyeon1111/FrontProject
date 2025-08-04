import React from 'react';
import '../css/Mypage.css';
import { Tabs, Tab, Box } from '@mui/material';
import Header from './Header';

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
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="mypage-container">
      <Header />

      <div className="myInfo-container">
        <div className="profile-header">
          <span className="nickname">수연</span>
          <span className="role-badge">프론트엔드</span>
        </div>
        <p className="intro-text">
          안녕하세요! 사용자 친화적인 UI에 관심이 많은 프론트엔드 개발자입니다. React와 함께 성장 중이에요 🌱
        </p>
        <div className="myStack-container">
          <span className="stack-pill">React</span>
          <span className="stack-pill">Spring Boot</span>
          <span className="stack-pill">MySQL</span>
        </div>
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
  );
}

export default MyPage;
