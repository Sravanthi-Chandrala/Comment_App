import React, { useState, useEffect } from 'react';
import { GoogleLogin, GoogleOAuthProvider, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CommentInput from './CommentInput';
import CommentList from './CommentList';
import '../CSS/Main.css';

function Main() {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([
  
    {
      id: 1,
      user: { name: 'Floyd Miles', picture: 'https://i.pravatar.cc/40?img=1' },
      text: 'Actually, now that I try out this on my message, above none of them took me to the source site. Only my shortcut worked!',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), 
      reactions: { likes: 4, dislikes: 1 },
      replies: []
    },
   
  ]);
  const [sortBy, setSortBy] = useState('latest');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('comments', JSON.stringify(comments));
  }, [comments]);

  const handleLogin = async (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential);
      
      const userObject = {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        picture: decodedToken.picture || 'https://via.placeholder.com/150', 
      };
      console.log(decodedToken.picture);

      
      setUser(userObject);
      setUsers(prevUsers => {
        if (!prevUsers.some(u => u.Sid === userObject.id)) {
          return [...prevUsers, userObject];
        }
        return prevUsers;
      });
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    googleLogout();
    setUser(null);
    toast.info('Logged out successfully.');
  };

  const handleAddComment = (text, attachments, mentions) => {
    if (!user) {
      toast.error('Please log in to comment.');
      return;
    }

    const newComment = {
      id: Date.now(),
      user: { id: user.id, name: user.name, picture: user.picture },
      text,
      attachments,
      timestamp: new Date(),
      reactions: { likes: 0, dislikes: 0 },
      replies: [],
      mentions,
    };
    setComments(prevComments => [newComment, ...prevComments]);
    toast.success('Comment added successfully!');
  };

  const handleReply = (parentId, replyText) => {
    if (!user) {
      toast.error('Please log in to reply.');
      return;
    }

    setComments(prevComments => 
      prevComments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [
              ...comment.replies,
              {
                id: Date.now(),
                user: { id: user.id, name: user.name, picture: user.picture },
                text: replyText,
                timestamp: new Date(),
                reactions: { likes: 0, dislikes: 0 },
              }
            ]
          };
        }
        return comment;
      })
    );
    toast.success('Reply added successfully!');
  };

  const handleLike = (commentId) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, reactions: { ...comment.reactions, likes: comment.reactions.likes + 1 }}
          : comment
      )
    );
  };

  const handleDislike = (commentId) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, reactions: { ...comment.reactions, dislikes: comment.reactions.dislikes + 1 }}
          : comment
      )
    );
  };

  return (
    <GoogleOAuthProvider clientId="611384406991-aun9mgf7vhm7ta7nsp0h2mh22tug88es.apps.googleusercontent.com">
      <div className="App">
        <ToastContainer />
        <header className="header">
          {user ? (
            <>
              <div className="user-info">
                <img src={user.picture} alt={user.name} className="user-avatar" />
                <span>{user.name}</span>
              </div>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <GoogleLogin
              onSuccess={handleLogin}
              onError={() => toast.error('Login Failed')}
              className="google-login-button"
            />
          )}
        </header>
        <div className="comments-section">
          <div className="comments-header">
            <h2>Comments({comments.length})</h2>
            <div className="sort-buttons">
              <button className={sortBy === 'latest' ? 'active' : ''} onClick={() => setSortBy('latest')}>Latest</button>
              <button className={sortBy === 'popular' ? 'active' : ''} onClick={() => setSortBy('popular')}>Popular</button>
            </div>
          </div>
          {user && (
            <CommentInput
              onAddComment={handleAddComment}
              user={user}
              users={users} 
            />
          )}
          <CommentList
      comments={comments}
      sortBy={sortBy}
      onReply={handleReply}
      onLike={handleLike}
      onDislike={handleDislike}
      currentUser={user}
    />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Main;




