import React from 'react';
import './chatting_Chatbox.css';

// chat message interface
interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

// friend data interface
interface Friend {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
}

// chatbox props interface
interface ChatboxProps {
  friend: Friend;                              // Friend data for the current chat
  onBack: () => void;                         // Callback for back button
  onSendMessage?: (message: string) => void;   // Optional callback for sending messages
}

// chatbox component
const Chatbox: React.FC<ChatboxProps> = ({ 
  friend, 
  onBack, 
  onSendMessage = () => {} 
}) => {
  // State for new message input
  const [newMessage, setNewMessage] = React.useState('');

  // Sample hardcoded messages 
  const staticMessages: Message[] = [
    {
      id: '1',
      text: 'Chào',
      timestamp: '22:07',
      isOwn: true
    },
    {
      id: '2',
      text: 'Chào gì mà chào',
      timestamp: '22:07',
      isOwn: false
    },
    {
      id: '3',
      text: ':)))',
      timestamp: '22:07',
      isOwn: true
    },
    {
      id: '4',
      text: '123123',
      timestamp: '22:08',
      isOwn: true
    },
    {
      id: '5',
      text: '44444',
      timestamp: '13:37',
      isOwn: false
    }
  ];

  /**
   * Handles message submission
   * @param e - Form submit event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="chatbox">
      {/* Chat header with friend info */}
      <div className="chatbox__header">
        <button className="chatbox__button--back" onClick={onBack}>
          <i className="fa-solid fa-caret-left"></i>
        </button>
        <div className="chatbox__user">
          <div className="chatbox__avatar">
            <img src={friend.avatar} alt={friend.name} />
          </div>
          <div className="chatbox__user--info">
            <span className="chatbox__username">{friend.name}</span>
            <span className="chatbox__user--status">
              <i className="fa-solid fa-circle"></i>
            </span>
          </div>
        </div>
      </div>

      {/* Messages container */}
      <div className="chatbox__messages">
        {staticMessages.map((message) => (
          <div key={message.id} className="chatbox__message">
            <div className={`chatbox__bubble--${message.isOwn ? 'sent' : 'received'}`}>
              {message.text}
            </div>
            {message.isOwn && <span className="chatbox__timestamp">{message.timestamp}</span>}
          </div>
        ))}
      </div>

      {/* Message input form */}
      <form className="chatbox__input--container" onSubmit={handleSubmit}>
        <input
          type="text"
          className="chatbox__input"
          placeholder="Message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="chatbox__button--send">
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
