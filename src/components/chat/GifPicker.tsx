import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

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
    <Card className="absolute bottom-12 right-0 w-96 h-96 shadow-card z-50">
      <CardHeader className="p-3 border-b">
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search GIFs..."
            className="flex-1"
          />
          <Button onClick={searchGifs} size="icon" disabled={loading}>
            <Search size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm text-muted-foreground">Searching...</div>
            </div>
          ) : gifs.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-sm text-muted-foreground">
                {searchQuery ? 'No GIFs found' : 'Search for GIFs above'}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1 p-2">
              {gifs.map((gif) => (
                <div
                  key={gif.id}
                  className="cursor-pointer rounded overflow-hidden hover:scale-105 transition-transform"
                  onClick={() => handleGifClick(gif)}
                >
                  <img
                    src={gif.images.fixed_height_small.url}
                    alt={gif.title}
                    className="w-full h-20 object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GifPicker;