import React, { useState } from 'react';

const TextInput = ({ sendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="textinput">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default TextInput;

