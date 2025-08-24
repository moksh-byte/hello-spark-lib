import { useState } from 'react';
import '../../../App.css';

interface Gif {
  id: string;
  title: string;
  images: {
    fixed_height_small: { url: string };
    original: { url: string };
  };
}

interface GifPickerProps {
  onGifSelect: (gifUrl: string, gifTitle: string) => void;
  onClose: () => void;
}

const GifPicker = ({ onGifSelect, onClose }: GifPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);

  const GIPHY_API_KEY = 'lxXvLdVLd40HUmaM1sY0C8Aq9LuSArj6';

  const searchGifs = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchQuery)}&limit=20&rating=g`
      );
      const data = await response.json();
      setGifs(data.data || []);
    } catch (error) {
      console.error('GIPHY search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchGifs();
    }
  };

  const handleGifClick = (gif: Gif) => {
    const cleanTitle = gif.title
      .replace(/-/g, ' ')
      .replace(/GIF$/i, '')
      .trim() || 'Shared a GIF';
    
    onGifSelect(gif.images.original.url, cleanTitle);
  };

  return (
    <div 
      id="gifPicker"
      style={{
        display: 'block',
        position: 'absolute',
        bottom: '60px',
        right: '0px',
        width: '420px',
        maxHeight: '320px',
        backgroundColor: '#2b2d31',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search GIFs..."
          style={{ 
            width: '100%', 
            padding: '8px', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            marginBottom: '8px'
          }}
        />
        <button 
          onClick={searchGifs}
          disabled={loading}
          style={{ 
            padding: '6px 12px', 
            background: '#667eea', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      <div style={{ padding: '10px', maxHeight: '250px', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2em' }}>Searching...</div>
        ) : gifs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
            {gifs.map((gif) => (
              <div
                key={gif.id}
                style={{
                  cursor: 'pointer',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s'
                }}
                onClick={() => handleGifClick(gif)}
                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img
                  src={gif.images.fixed_height_small.url}
                  alt={gif.title}
                  style={{ width: '120px', height: '90px', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '2em' }}>
            No GIFs found for "{searchQuery}"
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#666', padding: '2em' }}>
            Search for GIFs to get started
          </div>
        )}
      </div>
    </div>
  );
};

export default GifPicker;