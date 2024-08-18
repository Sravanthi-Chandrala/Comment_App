import React, { useState, useRef } from 'react';
import '../CSS/CommentInput.css';

function CommentInput({ onAddComment, user , users}) {
  const [text, setText] = useState('');
  const [mentions, setMentions] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);
  const handleMention = (mentionedUser) => {
    const updatedText = `${text}@${mentionedUser.name} `;
    setText(updatedText);
    setMentions([...mentions, mentionedUser.id]);
  };



  const handleFormatting = (tag) => {
    const textarea = document.querySelector('textarea');
    const { selectionStart, selectionEnd } = textarea;
    const selectedText = text.substring(selectionStart, selectionEnd);

    let newText = '';
    switch (tag) {
      case 'B':
        newText = `<b>${selectedText}</b>`;
        break;
      case 'I':
        newText = `<i>${selectedText}</i>`;
        break;
      case 'U':
        newText = `<u>${selectedText}</u>`;
        break;
      default:
        break;
    }

    const updatedText =
      text.substring(0, selectionStart) +
      newText +
      text.substring(selectionEnd);

    setText(updatedText);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setAttachments([...attachments, ...imageFiles]);
  };

  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() || attachments.length > 0) {
      onAddComment(text, attachments, mentions);
      setText('');
      setAttachments([]);
      setMentions([]);
    }
  };

 
  return (
    <form className="comment-input" onSubmit={handleSubmit}>
    <div className="input-container">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        maxLength={250}
      />
      <div className="formatting-buttons">
        <button type="button" onClick={() => handleFormatting('B')}>B</button>
        <button type="button" onClick={() => handleFormatting('I')}>I</button>
        <button type="button" onClick={() => handleFormatting('U')}>U</button>
        <button type="button" onClick={handleImageButtonClick}>🖼️</button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          style={{ display: 'none' }}
        />
        <button type="submit" className="send-button1">Send</button>
      </div>
    </div>
    {attachments.length > 0 && (
      <div className="attachment-preview">
        {attachments.map((file, index) => (
          <div key={index} className="file-preview">
            <img src={URL.createObjectURL(file)} alt={file.name} />
            <span>{file.name}</span>
          </div>
        ))}
      </div>
    )}
    <div className="char-count">{text.length}/250</div>
     <div className="mention-dropdown">
        {users.filter(u => u.id !== user.id).map((u) => (
          <div key={u.id} onClick={() => handleMention(u)}>
            @{u.name}
          </div>
        ))}
      </div>
  </form>
  );
}

export default CommentInput;
