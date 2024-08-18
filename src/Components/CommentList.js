import React, { useState } from 'react';
import Comment from './Comment';
import Pagination from './Pagination';
import "../CSS/CommentList.css";

function CommentList({ comments, sortBy, onReply, onLike, onDislike, currentUser}) {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 8;

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.timestamp) - new Date(a.timestamp);
    } else {
      return (b.reactions.likes - b.reactions.dislikes) - (a.reactions.likes - a.reactions.dislikes);
    }
  });

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = sortedComments.slice(indexOfFirstComment, indexOfLastComment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="comment-list">
     {currentComments.map(comment => (
        comment ? ( 
          <Comment 
            key={comment.id} 
            comment={comment} 
            onReply={onReply}
            onLike={onLike}
            onDislike={onDislike}
            currentUser={currentUser}
          />
        ) : null
      ))}
      <Pagination
        commentsPerPage={commentsPerPage}
        totalComments={comments.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}

export default CommentList;

