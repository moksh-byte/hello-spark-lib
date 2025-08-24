import '../../../App.css';

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
    <div 
      id="emojiPicker" 
      style={{
        display: 'block',
        position: 'absolute',
        bottom: '60px',
        right: '0px',
        background: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 1000,
        padding: '10px',
        maxWidth: '320px'
      }}
    >
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(10, 1fr)',
        gap: '5px'
      }}>
        {emojis.map((emoji, index) => (
          <button
            key={index}
            style={{
              border: 'none',
              background: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '5px',
              borderRadius: '4px'
            }}
            onClick={() => onEmojiSelect(emoji)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiPicker;