import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';

interface UsersListProps {
  users: string[];
}

const UsersList = ({ users }: UsersListProps) => {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-2">
        {users.map((user, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {user}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <User size={24} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No users online</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default UsersList;