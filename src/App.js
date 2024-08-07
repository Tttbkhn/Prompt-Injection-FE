import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatBox from './components/chatbox';
import TextInput from './components/textinput';
import Navbar from './components/navbar';
import Login from './components/login';
import Signup from './components/signup';
import './App.css';
import ConversationList from './components/conversationlist';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/conversations?username=${currentUser}`);
        const data = await response.json();
        setConversations(data);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    if (isAuthenticated && currentUser) {
      fetchConversations();
    }
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!currentConversation) return;
      try {
        const response = await fetch(`http://localhost:5000/api/messages?conversation_id=${currentConversation}`);
        const chatHistory = await response.json();
        setMessages(chatHistory);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    if (isAuthenticated && currentConversation) {
      fetchChatHistory();
    } else {
      setMessages([]); // Ensuring chatbox is empty when no conversation is selected
    }
  }, [isAuthenticated, currentConversation]);

  const handleLogin = (username, signup = false) => {
    if (signup) {
      setShowSignup(true);
    } else {
      setIsAuthenticated(true);
      setShowSignup(false);
      setCurrentUser(username);
    }
  };

  const handleSignup = () => {
    setShowSignup(true);
    setIsAuthenticated(false);
  };

  const handleBackToLogin = () => {
    setShowSignup(false);
    setIsAuthenticated(false);
  };

  const sendMessage = async (message) => {
    if (!currentConversation) {
      try {
        // Creating a new conversation thread
        const response = await fetch('http://localhost:5000/api/conversation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: currentUser }),
        });

        const data = await response.json();
        setConversations([...conversations, { _id: data.conversation_id }]);
        setCurrentConversation(data.conversation_id);

        // Sending the message to the newly created conversation thread
        const messageResponse = await fetch('http://localhost:5000/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, conversation_id: data.conversation_id }),
        });

        const messageData = await messageResponse.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, user: 'user' },
          messageData,
        ]);
      } catch (error) {
        console.error('Error creating conversation or sending message:', error);
      }
    } else {
      try {

        // Sending the message to the current conversation thread
        const response = await fetch('http://localhost:5000/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message, conversation_id: currentConversation }),
        });

        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: message, user: 'user' },
          data,
        ]);
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };  
  
  // Creating a new conversation thread // For when user clicks "New Conversation" button on the threads panel
  const createNewConversation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: currentUser }),
      });

      const data = await response.json();
      setConversations([...conversations, { _id: data.conversation_id }]);
      setCurrentConversation(data.conversation_id);
      setMessages([]); // Reset messages for the new conversation
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  // Deleting a conversation thread
  const deleteConversation = async (conversationId) => {
    try {
      await fetch(`http://localhost:5000/api/conversation/${conversationId}`, {
        method: 'DELETE',
      });

      setConversations(conversations.filter((conv) => conv._id !== conversationId));
      if (currentConversation === conversationId) {
        setCurrentConversation(null);
      }
      setMessages([]); // Clearing messages immediately
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };
  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} currentUser={currentUser} />

        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <div className="main-content">
                  <ConversationList
                    conversations={conversations}
                    currentConversation={currentConversation}
                    onSelectConversation={setCurrentConversation}
                    onCreateConversation={createNewConversation}
                    onDeleteConversation={deleteConversation}
                  />
                  <div className="chat-container">
                    <ChatBox messages={messages || []} />
                    <TextInput sendMessage={sendMessage} />
                  </div>
                </div>
              ) : showSignup ? (
                <Signup
                  onSignup={handleLogin}
                  onBackToLogin={handleBackToLogin}
                />
              ) : (
                <Login onLogin={handleLogin} onSignup={handleSignup} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
