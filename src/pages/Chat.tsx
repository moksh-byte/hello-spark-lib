import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';
import EmojiPicker from '@/components/chat/EmojiPicker';
import GifPicker from '@/components/chat/GifPicker';
import MessageList from '@/components/chat/MessageList';
import UsersList from '@/components/chat/UsersList';
import ServerControls from '@/components/chat/ServerControls';
import '../App.css';

interface Message {
  msg_id: string;
  username: string;
  text?: string;
  type?: 'gif';
  content?: string;
  gif_title?: string;
  file_url?: string;
  file_name?: string;
  reply_to?: string;
  reply_preview?: string;
}

interface ServerData {
  server_id: string;
  server_name: string;
  history: Message[];
  users_online: string[];
}

const Chat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [username, setUsername] = useState<string>('');
  const [currentServer, setCurrentServer] = useState<{ id: string; name: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; preview: string } | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('matladu_username');
    if (!storedUsername) {
      navigate('/');
      return;
    }
    setUsername(storedUsername);

    // Initialize Socket.IO connection
    const newSocket = io('http://localhost:5000', {
      transports: ['websocket'],
      upgrade: false,
      rememberUpgrade: false,
      timeout: 60000,
      forceNew: true
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      toast({
        title: "Connected",
        description: "Successfully connected to Matladu",
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      toast({
        title: "Disconnected",
        description: "Connection lost. Please refresh.",
        variant: "destructive"
      });
    });

    newSocket.on('joined_server', (data: ServerData) => {
      setCurrentServer({ id: data.server_id, name: data.server_name });
      setMessages(data.history);
      setOnlineUsers(data.users_online);
      toast({
        title: "Joined Server",
        description: `Welcome to ${data.server_name}`,
      });
    });

    newSocket.on('chat_message', (msgData: Message) => {
      setMessages(prev => [...prev, msgData]);
      scrollToBottom();
    });

    newSocket.on('user_list', (users: string[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('server_error', (data: { error: string }) => {
      toast({
        title: "Server Error",
        description: data.error,
        variant: "destructive"
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [navigate, toast]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = messageInput.trim();
    if (text && socket && currentServer) {
      const optimizedText = text.length > 500 ? text.substring(0, 500) + "..." : text;
      
      socket.emit('chat_message', {
        username,
        server_id: currentServer.id,
        text: optimizedText,
        reply_to: replyingTo?.id
      });
      
      setMessageInput('');
      clearReply();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentServer) return;
    
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please choose a file under 2MB",
        variant: "destructive"
      });
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    formData.append('server_id', currentServer.id);

    fetch('http://localhost:5000/upload', {
      method: 'POST',
      body: formData
    }).catch(error => {
      console.error('Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Please try again",
        variant: "destructive"
      });
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleGifSelect = (gifUrl: string, gifTitle: string) => {
    if (socket && currentServer) {
      socket.emit('chat_message', {
        type: 'gif',
        content: gifUrl,
        gif_title: gifTitle,
        server_id: currentServer.id,
        username: username,
        reply_to: replyingTo?.id
      });
      setShowGifPicker(false);
      clearReply();
    }
  };

  const handleReply = (msgId: string, preview: string) => {
    const displayPreview = preview.length > 50 ? preview.substring(0, 50) + "..." : preview;
    setReplyingTo({ id: msgId, preview: displayPreview });
  };

  const clearReply = () => {
    setReplyingTo(null);
  };

  const createServer = (serverName: string) => {
    if (socket) {
      socket.emit('create_server', { username, server_name: serverName });
    }
  };

  const joinServer = (serverId: string) => {
    if (socket) {
      socket.emit('join_server', { username, server_id: serverId.toUpperCase() });
    }
  };

  if (!currentServer) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <ServerControls 
          onCreateServer={createServer}
          onJoinServer={joinServer}
        />
      </div>
    );
  }

  return (
    <div className="main-container">
      <aside className="sidebar">
        <h2>Users Online</h2>
        <UsersList users={onlineUsers} />
      </aside>
      
      <section className="chat-section">
        <div className="server-header">
          <span>{currentServer.name}</span>
          <span> ({currentServer.id})</span>
        </div>
        
        <div className="chat-window">
          <MessageList 
            messages={messages} 
            onReply={handleReply}
            currentUsername={username}
          />
          <div ref={messagesEndRef} />
        </div>

        {replyingTo && (
          <div className="reply-to" style={{ margin: '0 15px', padding: '8px' }}>
            ↪ Replying to: {replyingTo.preview}
            <button 
              onClick={clearReply}
              style={{ 
                marginLeft: '10px', 
                background: '#f44336', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                padding: '2px 6px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
        )}

        <form id="messageForm" onSubmit={handleSendMessage}>
          <input
            type="text"
            id="messageInput"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={replyingTo ? `Replying to: ${replyingTo.preview}` : "Type your message..."}
            maxLength={1000}
            required
          />
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            📎
          </button>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              id="emojiBtn"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
                setShowGifPicker(false);
              }}
            >
              😊
            </button>
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <button
              type="button"
              id="gifBtn"
              onClick={() => {
                setShowGifPicker(!showGifPicker);
                setShowEmojiPicker(false);
              }}
            >
              🎬
            </button>
            {showGifPicker && (
              <GifPicker
                onGifSelect={handleGifSelect}
                onClose={() => setShowGifPicker(false)}
              />
            )}
          </div>

          <button type="submit">Send</button>
        </form>
      </section>
    </div>
  );
};

export default Chat;