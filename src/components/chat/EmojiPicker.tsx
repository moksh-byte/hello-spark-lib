import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker = ({ onEmojiSelect, onClose }: EmojiPickerProps) => {
  const emojis = [
    "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", 
    "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗",
    "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮",
    "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤",
    "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖",
    "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯",
    "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "😠",
    "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥴",
    "🥺", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓", "😈", "👿",
    "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹"
  ];

  return (
    <Card className="absolute bottom-12 right-0 w-80 shadow-card z-50">
      <CardContent className="p-3">
        <div className="grid grid-cols-10 gap-1">
          {emojis.map((emoji, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-lg hover:bg-muted"
              onClick={() => onEmojiSelect(emoji)}
            >
              {emoji}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmojiPicker;