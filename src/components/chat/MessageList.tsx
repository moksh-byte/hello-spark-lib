import '../../../App.css';

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

interface MessageListProps {
  messages: Message[];
  onReply: (msgId: string, preview: string) => void;
  currentUsername: string;
}

const MessageList = ({ messages, onReply, currentUsername }: MessageListProps) => {
  const getMessagePreview = (msg: Message): string => {
    return msg.text || msg.file_name || msg.gif_title || 'message';
  };

  const isOwnMessage = (username: string) => username === currentUsername;

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.msg_id} className="chat-msg">
          {msg.reply_to && msg.reply_preview && (
            <div className="reply-to">
              ↪ Replying to: {msg.reply_preview}
            </div>
          )}

          <span className="chat-user">{msg.username}</span>:
          
          {msg.type === 'gif' ? (
            <div className="gif-container">
              <div className="gif-title">🎬 {msg.gif_title || 'Shared a GIF'}</div>
              <img 
                src={msg.content} 
                alt={msg.gif_title || 'GIF'} 
                style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '8px', marginTop: '5px' }}
                loading="lazy"
              />
            </div>
          ) : msg.text ? (
            <span>{msg.text}</span>
          ) : null}

          {msg.file_url && (
            msg.file_name?.toLowerCase().endsWith('.gif') ? (
              <div className="gif-container">
                <img 
                  src={msg.file_url} 
                  alt={msg.file_name} 
                  loading="lazy"
                  style={{ maxWidth: '300px', maxHeight: '300px', borderRadius: '8px' }}
                />
              </div>
            ) : (
              <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
                📎 {msg.file_name}
              </a>
            )
          )}

          <button 
            className="reply-btn" 
            onClick={() => onReply(msg.msg_id, getMessagePreview(msg))}
          >
            Reply
          </button>
        </div>
      ))}
    </div>
  );
};

export default MessageList;