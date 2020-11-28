import { useEffect, useState } from 'react';
import './App.css';
// Front is served on the same domain as server
import { io } from 'socket.io-client';

const socketUrl = process.env.REACT_APP_SOCKET_URL as string;
const socket = io(socketUrl);

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Socket stuff
    socket.on('connect', () => {
      console.log(`connect ${socket.id}`);
    });

    socket.on('message2', (arg: string) => {
      console.log('message2 -', arg);
    });

    socket.emit('message1', 'Hello server');

    // HTTP stuff
    const usersUrl = `${process.env.REACT_APP_HTTP_URL}/users`;
    fetch(usersUrl)
      .then((response) => response.json())
      .then((data) => setUsers(data.data));
  }, []);

  const renderUsers = () => {
    return (
      <div>
        <p>Users:</p>
        {users.map((user) => (
          <p key={user}>{user}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      {renderUsers()}
    </div>
  );
}

export default App;
