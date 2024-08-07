import React from 'react';
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa';

const ConversationList = ({ conversations, currentConversation, onSelectConversation, onCreateConversation, onDeleteConversation }) => {
  return (
    <div className="conversation-list">
      <h2>Threads</h2>
      <ul>
        {conversations.map((conv, index) => (
          <li
            key={conv._id}
            className={conv._id === currentConversation ? 'active' : ''}
            onClick={() => onSelectConversation(conv._id)} // Select the conversation on click
          >
            Conversation {index + 1} {/* This will display the thread as "Conversation 1", "Conversation 2"..... */}
            <FaTrashAlt 
              onClick={(e) => {
                e.stopPropagation(); // Prevent the click event on delete button from bubbling up to the parent. Otherwise the delete button selects the conversation to be displayed as well as deleting the conversation.
                onDeleteConversation(conv._id); // Delete conversation
              }} 
              className="delete-icon" 
            />
          </li>
        ))}
      </ul>
      <button onClick={onCreateConversation} className="new-conversation">
        <FaPlusCircle /> New Conversation
      </button>
    </div>
  );
};

export default ConversationList;
