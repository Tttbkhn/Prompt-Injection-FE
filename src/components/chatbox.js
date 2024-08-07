import React, { useEffect, useRef } from 'react';
import helpGif from '../images/img2.gif'; 

const ChatBox = ({ messages = [], currentConversation }) => {
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {  //Scrolls to bottom when new messages are added
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Logic to save file
  const saveChatAsFile = () => {
    const chatText = messages.map((msg) => `${msg.user}: ${msg.text}`).join('\n');
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'chat_history.txt';
    link.click();

    URL.revokeObjectURL(url);
  };

  // Displaying the welcome message
  if (!currentConversation && messages.length === 0) {
    return (
      <div className="chatbox empty-chatbox">
        <img src={helpGif} alt="Help" className="help-gif" />
        <h2>How can I help you today?</h2>
      </div>
    );
  }

  return (
    <div className="chatbox">
      {messages.map((message, index) => (
        <div key={index} className={`message ${message.user}`}>
          {message.text}
        </div>
      ))}
      <div ref={chatEndRef} />
      <button onClick={saveChatAsFile} className="save-chat-button">
        Save Chat
      </button>
    </div>
  );
};

export default ChatBox;
