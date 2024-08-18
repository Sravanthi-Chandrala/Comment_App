import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import '../CSS/Comment.css';

function Comment({ comment, onReply, onLike, onDislike, currentUser }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [expanded, setExpanded] = useState(false);


  if (!comment) {
    return null; 
  }

  const handleReply = () => {
    onReply(comment.id, replyText);
    setReplyText('');
    setShowReplyForm(false);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const highlightMentions = (text) => {
    return text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
  };

  const handleLike = () => {
    onLike(comment.id);
  };

  const handleDislike = () => {
    onDislike(comment.id);
  };

  const commentLines = comment.text.split('\n');
  const isLongComment = commentLines.length > 5;
  const displayText = expanded ? comment.text : commentLines.slice(0, 5).join('\n');

  return (
    <div className="comment">
      <div className="comment-header">
        <img src={comment.user.picture} alt={comment.user.name} className="avatar" />
        <h3 className="user-name">{comment.user.name}</h3>
      </div>
      <div className="comment-body">
        <p dangerouslySetInnerHTML={{ __html: highlightMentions(displayText) }}></p>
        {isLongComment && (
          <button className="expand-button" onClick={toggleExpand}>
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
        {comment.attachments && comment.attachments.length > 0 && (
          <div className="comment-attachments">
            {comment.attachments.map((file, index) => (
              <div key={index} className="attachment-item">
                <img src={URL.createObjectURL(file)} alt={file.name} />
              </div>
            ))}
          </div>
        )}
        <div className="comment-actions">
          <button className="reaction-button" onClick={handleLike}>👍 {comment.reactions.likes}</button>
          <button className="reaction-button" onClick={handleDislike}>👎 {comment.reactions.dislikes}</button>
          <button className="reply-button" onClick={() => setShowReplyForm(!showReplyForm)}>Reply</button>
          <span className="timestamp">{formatDistanceToNow(comment.timestamp)} ago</span>
        </div>
        {showReplyForm && (
          <div className="reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
            />
            <button onClick={handleReply}>Send Reply</button>
          </div>
        )}
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onLike={onLike}
              onDislike={onDislike}
              currentUser={currentUser}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Comment;
