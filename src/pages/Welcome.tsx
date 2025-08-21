import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Welcome = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = username.trim();
    if (trimmedName && trimmedName.length <= 20) {
      localStorage.setItem('matladu_username', trimmedName);
      navigate('/chat');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-glow border-0">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome to Matladu.com
          </CardTitle>
          <p className="text-muted-foreground">
            Enter your name to start chatting
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              required
              className="text-center text-lg h-12 border-2 focus:border-primary transition-colors"
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-gradient-primary hover:shadow-glow transition-all duration-300 hover:scale-[1.02]"
            >
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Welcome;