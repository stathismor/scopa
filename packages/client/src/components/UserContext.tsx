import { gameIO } from 'lib/socket';
import { useEffect } from 'react';
import { useState } from 'react';
import { FC, createContext, useContext } from 'react';
import { getStoredUsername, persistUsername } from 'utils/storage';
import { UserEvent } from 'shared';

export const UserContext = createContext<{
  username: string;
}>({
  username: '',
});

const persistedUsername = getStoredUsername();
export const UserProvider: FC = ({ children }) => {
  const [username, setUsername] = useState<string>(persistedUsername ?? '');
  if (!username) {
    gameIO.emit(UserEvent.UsernameMissing);
  }

  useEffect(() => {
    gameIO.on('connect', () => {
      console.log(`connect ${gameIO.id}`);
    });
    const handleUsernameCreated = (randomUsername: string) => {
      setUsername(randomUsername);
      persistUsername(randomUsername);
    };
    gameIO.on(UserEvent.UsernameCreated, handleUsernameCreated);
    return () => {
      gameIO.off(UserEvent.UsernameCreated, handleUsernameCreated);
    };
  }, []);

  return (
    <UserContext.Provider value={{ username: username }}>{username ? children : 'Pending ...'}</UserContext.Provider>
  );
};

export const useUserData = () => {
  return useContext(UserContext);
};
