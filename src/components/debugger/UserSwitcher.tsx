import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function UserSwitcher() {
  const { currentUser, switchUser, getUsers } = useUser();
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser?.id ?? "");

  const handleUserChange = (userId: string) => {    
    setSelectedUserId(userId);
    switchUser(userId);
    // View context will be updated automatically via useEffect in ViewProvider
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>User Switcher</CardTitle>
        <CardDescription>Switch between different user roles to test permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="user-select" className="text-sm font-medium">
              Select User
            </label>
            <Select value={selectedUserId} onValueChange={handleUserChange}>
              <SelectTrigger id="user-select" className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent className="w-full">
                {getUsers().map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentUser && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current User</h4>
              <div className="rounded-md bg-muted p-3 text-sm">
                <p><strong>Name:</strong> {currentUser.name}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Type:</strong> {currentUser.type}</p>
                <p><strong>Roles:</strong> {currentUser.permissions.roles.join(', ')}</p>
                <p><strong>Claims:</strong> {currentUser.permissions.claims.length}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 


