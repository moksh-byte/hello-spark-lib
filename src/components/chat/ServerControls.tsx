import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, LogIn, Server } from 'lucide-react';

interface ServerControlsProps {
  onCreateServer: (serverName: string) => void;
  onJoinServer: (serverId: string) => void;
}

const ServerControls = ({ onCreateServer, onJoinServer }: ServerControlsProps) => {
  const [serverName, setServerName] = useState('');
  const [joinCode, setJoinCode] = useState('');

  const handleCreateServer = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = serverName.trim();
    if (trimmedName) {
      onCreateServer(trimmedName);
      setServerName('');
    }
  };

  const handleJoinServer = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedCode = joinCode.trim();
    if (trimmedCode) {
      onJoinServer(trimmedCode);
      setJoinCode('');
    }
  };

  return (
    <Card className="w-full max-w-md shadow-glow border-0">
      <CardHeader className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
          <Server className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Join the Conversation
        </CardTitle>
        <p className="text-muted-foreground">
          Create a new server or join an existing one
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Create Server Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Create New Server</h3>
          </div>
          
          <form onSubmit={handleCreateServer} className="space-y-3">
            <Input
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="Enter server name"
              required
            />
            <Button 
              type="submit" 
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Server
            </Button>
          </form>
        </div>

        <div className="relative">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-card px-3 text-sm text-muted-foreground">
              OR
            </span>
          </div>
        </div>

        {/* Join Server Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LogIn className="w-4 h-4 text-secondary" />
            <h3 className="font-semibold">Join Existing Server</h3>
          </div>
          
          <form onSubmit={handleJoinServer} className="space-y-3">
            <Input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character join code"
              maxLength={6}
              pattern="[A-Za-z0-9]{6}"
              required
            />
            <Button 
              type="submit" 
              variant="secondary"
              className="w-full hover:shadow-sm transition-all duration-300"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Join Server
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerControls;