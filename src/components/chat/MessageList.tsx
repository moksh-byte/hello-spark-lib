import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Reply, Film, Paperclip } from 'lucide-react';

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
    <div className="space-y-3">
      {messages.map((msg) => (
        <Card 
          key={msg.msg_id} 
          className={`p-4 transition-all hover:shadow-sm border-l-4 ${
            isOwnMessage(msg.username) 
              ? 'border-l-primary bg-primary/5' 
              : 'border-l-muted bg-card'
          }`}
        >
          {/* Reply indicator */}
          {msg.reply_to && msg.reply_preview && (
            <div className="mb-2 text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1 inline-block">
              ↪ Replying to: {msg.reply_preview}
            </div>
          )}

          {/* Message header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge 
                variant={isOwnMessage(msg.username) ? "default" : "secondary"}
                className="font-medium"
              >
                {msg.username}
              </Badge>
              {msg.type === 'gif' && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Film size={12} />
                  <span>shared a GIF</span>
                </div>
              )}
              {msg.file_url && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Paperclip size={12} />
                  <span>uploaded a file</span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onReply(msg.msg_id, getMessagePreview(msg))}
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 px-2"
            >
              <Reply size={12} />
            </Button>
          </div>

          {/* Message content */}
          <div className="space-y-2">
            {/* Text content */}
            {msg.text && (
              <div className="text-sm leading-relaxed">
                {msg.text}
              </div>
            )}

            {/* GIF content */}
            {msg.type === 'gif' && msg.content && (
              <div className="space-y-2">
                {msg.gif_title && (
                  <div className="text-sm font-medium text-muted-foreground">
                    🎬 {msg.gif_title}
                  </div>
                )}
                <img
                  src={msg.content}
                  alt={msg.gif_title || 'GIF'}
                  className="max-w-xs max-h-60 rounded-lg shadow-sm"
                  loading="lazy"
                />
              </div>
            )}

            {/* File content */}
            {msg.file_url && (
              <div>
                {msg.file_name?.toLowerCase().endsWith('.gif') ? (
                  <img
                    src={msg.file_url}
                    alt={msg.file_name}
                    className="max-w-xs max-h-60 rounded-lg shadow-sm"
                    loading="lazy"
                  />
                ) : (
                  <a
                    href={msg.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Paperclip size={14} />
                    {msg.file_name}
                  </a>
                )}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MessageList;