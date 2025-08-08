import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Viewer } from '@toast-ui/react-editor';

function PostView() {
  const { postId } = useParams(); // URL에서 postId 받아오기
  const [post, setPost] = useState(null);

  useEffect(() => {
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

  return (
    <div className="post-view-container">
      <h1>{post.title}</h1>
      <p><strong>작성자:</strong> {post.author}</p>
      <p><strong>방식:</strong> {post.projectType}</p>
      <p><strong>지역:</strong> {post.region}</p>
      <p><strong>사용 스택:</strong> {post.techStacks?.join(', ')}</p>

      <h3>설명</h3>
      <Viewer initialValue={post.content} />
    </div>
  );
}

export default PostView;
