import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Smile, 
  Paperclip, 
  Send, 
  X, 
  Users, 
  Plus,
  Film
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmojiPicker from '@/components/chat/EmojiPicker';
import GifPicker from '@/components/chat/GifPicker';
import MessageList from '@/components/chat/MessageList';
import UsersList from '@/components/chat/UsersList';
import ServerControls from '@/components/chat/ServerControls';

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
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
        <ServerControls 
          onCreateServer={createServer}
          onJoinServer={joinServer}
        />
      </div>
    );
  }

  return (
    <div className="h-screen bg-chat-bg flex">
      {/* Sidebar - Users Online */}
      <div className="w-64 bg-sidebar-bg text-white flex flex-col shadow-card">
        <div className="p-4 border-b border-sidebar-accent">
          <div className="flex items-center gap-2">
            <Users size={20} />
            <h2 className="font-semibold">Users Online</h2>
          </div>
          <Badge variant="secondary" className="mt-2">
            {onlineUsers.length} online
          </Badge>
        </div>
        <UsersList users={onlineUsers} />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-gradient-primary text-white p-4 shadow-sm">
          <h1 className="text-xl font-semibold">{currentServer.name}</h1>
          <p className="text-sm opacity-90">Server ID: {currentServer.id}</p>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <MessageList 
            messages={messages} 
            onReply={handleReply}
            currentUsername={username}
          />
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Reply Indicator */}
        {replyingTo && (
          <div className="px-4 py-2 bg-muted border-l-4 border-primary flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              ↪ Replying to: {replyingTo.preview}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearReply}
              className="h-6 w-6 p-0"
            >
              <X size={14} />
            </Button>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t bg-card p-4">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={replyingTo ? `Replying to: ${replyingTo.preview}` : "Type your message..."}
                maxLength={1000}
                className="pr-4"
              />
            </div>
            
            {/* File Upload */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip size={18} />
            </Button>

            {/* Emoji Picker */}
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setShowEmojiPicker(!showEmojiPicker);
                  setShowGifPicker(false);
                }}
              >
                <Smile size={18} />
              </Button>
              {showEmojiPicker && (
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}
            </div>

            {/* GIF Picker */}
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => {
                  setShowGifPicker(!showGifPicker);
                  setShowEmojiPicker(false);
                }}
              >
                <Film size={18} />
              </Button>
              {showGifPicker && (
                <GifPicker
                  onGifSelect={handleGifSelect}
                  onClose={() => setShowGifPicker(false)}
                />
              )}
            </div>

            <Button type="submit" className="bg-gradient-primary hover:shadow-glow">
              <Send size={18} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;