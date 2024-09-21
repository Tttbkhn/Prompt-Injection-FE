import React from 'react';
import { FaPlusCircle, FaTrashAlt } from 'react-icons/fa';
import { useAuth } from './hooks/useAuth';

const ConversationList = ({ conversations, currentConversation, onSelectConversation, onCreateConversation, onDeleteConversation, setCurrentUser, setIsAuthenticated }) => {
    const { user } = useAuth();
    setCurrentUser(user?.username);
    setIsAuthenticated(user?.username ? true : false);

    return (
        <div className="conversation-list">
            <h2>Threads</h2>
            <ul>
                {conversations?.map((conv, index) => (
                    <li
                        key={conv._id}
                        className={conv._id === currentConversation ? 'active' : ''}
                        onClick={() => onSelectConversation(conv._id)} // Select the conversation on click
                    >
                        Conversation {index + 1} {}
                        <FaTrashAlt
                            onClick={e => {
                                e.stopPropagation(); 
                                onDeleteConversation(conv._id); 
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
