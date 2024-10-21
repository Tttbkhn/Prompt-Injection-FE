import React, { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import ChatBox from './components/chatbox';
import ConversationList from './components/conversationlist';
import HomePage from './components/homePage';
import { AuthProvider } from './components/hooks/useAuth';
import Login from './components/login';
import Navbar from './components/navbar';
import { PrivateRoute } from './components/privateRoute';
import Signup from './components/signup';
import TextInput from './components/textinput';
import { BASE_URL, LOCAL_URL } from './components/util/constant';
import ForgetPassword from './components/ForgetPassword';
import ResetPassword from './components/ResetPassword';

const DETECTION = true

const App = () => {
    const [messages, setMessages] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState('');
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null);

    const [isSwitchActive, setIsSwitchActive] = useState(false);

    const handleSwitchChange = (event) => {
        setIsSwitchActive(event.target.checked); // event.target.checked gives true/false based on switch state
        console.log('Switch is now:', event.target.checked ? 'Active' : 'Inactive');
    };

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch(`${BASE_URL}/conversations`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.localStorage.getItem('user').slice(1, -1)}`
                    },
                });
                const data = await response.json();
                console.log(data)
                if (data?.length > 0) {
                    setConversations(data);
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
            }
        };

        // if (isAuthenticated && currentUser) {
        fetchConversations();
        // }
    }, [isAuthenticated, currentUser]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            if (!currentConversation) return;
            try {
                const response = await fetch(`${BASE_URL}/messages/${currentConversation}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.localStorage.getItem('user').slice(1, -1)}`
                    },

                });
                const chatHistory = await response.json();
                setMessages(chatHistory);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        // if (isAuthenticated && currentConversation) {
        if (currentConversation) {
            fetchChatHistory();
        } else {
            setMessages([]); // Ensuring chatbox is empty when no conversation is selected
        }
    }, [isAuthenticated, currentConversation]);

    const sendMessage = async message => {
        if (!currentConversation) {
            try {
                const response = await fetch(`${BASE_URL}/conversations`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.localStorage.getItem('user').slice(1, -1)}`
                    },
                    body: JSON.stringify({ name: "New conversation" }),
                });

                const data = await response.json();
                setConversations([...conversations, { _id: data._id }]);
                setMessages([{ text: message, is_bot: false }])

                // Sending the message to the newly created conversation thread
                // const messageResponse = await fetch(`${BASE_URL}/messages/${data._id}?detection=true`, {
                const messageResponse = await fetch(`${BASE_URL}/messages/${data._id}?detection=${isSwitchActive}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.localStorage.getItem('user').slice(1, -1)}`
                    },
                    body: JSON.stringify({ text: message }),
                });

                // const messageData = await messageResponse.json();
                // setConversations([...conversations, { _id: messageData.conversaton._id }]);
                // setCurrentConversation(messageData.conversaton._id);
                // setMessages(prevMessages => [...prevMessages, { text: message, is_bot: false }, messageData.message]);
                const reader = messageResponse.body.getReader();
                let chunks = '';

                let done, value;
                while (!done) {
                    ({ value, done } = await reader.read());
                    if (done) {
                        return chunks;
                    }
                    const strval = new TextDecoder().decode(value)
                    chunks += strval;
                    setMessages(prevMessages => {
                        const updatedMessages = [...prevMessages];
                        if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].is_bot) {
                            updatedMessages[updatedMessages.length - 1].text = chunks;
                            updatedMessages[updatedMessages.length - 1].is_bot = true;
                        } else {
                            updatedMessages.push({ text: chunks, is_bot: true });
                        }
                        return updatedMessages;
                    });
                }

                setCurrentConversation(data._id);
            } catch (error) {
                console.error('Error creating conversation or sending message:', error);
            }
        } else {
            try {
                await setMessages(prevMessages => [...prevMessages, { text: message, is_bot: false }])

                // Sending the message to the current conversation thread
                const response = await fetch(`${BASE_URL}/messages/${currentConversation}?detection=${isSwitchActive}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${window.localStorage.getItem('user').slice(1, -1)}`
                    },
                    body: JSON.stringify({ text: message }),
                });

                if (response.ok) {
                    const reader = response.body.getReader();
                    let chunks = '';

                    let done, value;
                    while (!done) {
                        ({ value, done } = await reader.read());
                        if (done) {
                            return chunks;
                        }
                        const strval = new TextDecoder().decode(value)
                        chunks += strval;
                        // console.log(strval)
                        // await setResponseText((prev) => {
                        //     return prev + strval
                        // })
                        setMessages(prevMessages => {
                            const updatedMessages = [...prevMessages];
                            if (updatedMessages.length > 0 && updatedMessages[updatedMessages.length - 1].is_bot) {
                                updatedMessages[updatedMessages.length - 1].text = chunks;
                                updatedMessages[updatedMessages.length - 1].is_bot = true;
                            } else {
                                updatedMessages.push({ text: chunks, is_bot: true });
                            }
                            return updatedMessages;
                        });
                    }
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    // Creating a new conversation thread // For when user clicks "New Conversation" button on the threads panel
    const createNewConversation = async () => {
        try {
            const response = await fetch(`${BASE_URL}/conversations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${window.localStorage.getItem('user').slice(1, -1)}`
                },
                body: JSON.stringify({ name: "New conversation" }),
            });

            const data = await response.json();
            setConversations([...conversations, { _id: data._id }]);
            setCurrentConversation(data._id);
            setMessages([]); // Reset messages for the new conversation
        } catch (error) {
            console.error('Error creating conversation:', error);
        }
    };

    // Deleting a conversation thread
    const deleteConversation = async conversationId => {
        try {
            await fetch(`${BASE_URL}/conversations/${conversationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${window.localStorage.getItem('user').slice(1, -1)}`
                }
            });

            setConversations(conversations.filter(conv => conv._id !== conversationId));
            if (currentConversation === conversationId) {
                setCurrentConversation(null);
            }
            setMessages([]); // Clearing messages immediately
        } catch (error) {
            console.error('Error deleting conversation:', error);
        }
    };
    return (
        <AuthProvider>
            <div className="app">
                <Navbar isAuthenticated={isAuthenticated} currentUser={currentUser} isSwitchActive={isSwitchActive} handleSwitchChange={handleSwitchChange} />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/sign-up" element={<Signup />} />
                    <Route
                        path="/chat"
                        element={
                            <PrivateRoute>
                                <div className="main-content">
                                    <ConversationList
                                        conversations={conversations}
                                        currentConversation={currentConversation}
                                        onSelectConversation={setCurrentConversation}
                                        onCreateConversation={createNewConversation}
                                        onDeleteConversation={deleteConversation}
                                        setCurrentUser={setCurrentUser}
                                        setIsAuthenticated={setIsAuthenticated}
                                    />
                                    <div className="chat-container">
                                        <ChatBox messages={messages || []} />
                                        <TextInput sendMessage={sendMessage} />
                                    </div>
                                </div>
                            </PrivateRoute>
                        }
                    />
                    <Route path='/forget-password' element={<ForgetPassword />} />
                    <Route path='/reset-password' element={<ResetPassword />} />
                </Routes>
            </div>
        </AuthProvider>
    );
};

export default App;
