import '../../../App.css';

interface UsersListProps {
  users: string[];
}

const UsersList = ({ users }: UsersListProps) => {
  return (
    <ul id="usersOnline">
      {users.map((user, index) => (
        <li key={index}>{user}</li>
      ))}
    </ul>
  );
};

export default UsersList;