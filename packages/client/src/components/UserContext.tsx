import { gameIO } from 'lib/socket';
import { useEffect } from 'react';
import { useState } from 'react';
import { FC, createContext, useContext } from 'react';
import { getStoredUsername, persistUsername } from 'utils/storage';
import { UserEvents } from 'shared';

export const UserContext = createContext<{
  username: string | null;
}>({
  username: null,
});

const persistedUsername = getStoredUsername();
export const UserProvider: FC = ({ children }) => {
  const [username, setUsername] = useState<string | null>(persistedUsername);
  if (!username) {
    gameIO.emit(UserEvents.UsernameMissing);
  }

  useEffect(() => {
    gameIO.on('connect', () => {
      console.log(`connect ${gameIO.id}`);
    });
    const handleUsernameCreated = (randomUsername: string) => {
      setUsername(randomUsername);
      persistUsername(randomUsername);
    };
    gameIO.on(UserEvents.UsernameCreated, handleUsernameCreated);
    return () => {
      gameIO.off(UserEvents.UsernameCreated, handleUsernameCreated);
    };
  }, []);

  return <UserContext.Provider value={{ username }}>{username ? children : 'Pending ...'}</UserContext.Provider>;
};

export const useUserData = () => {
  return useContext(UserContext);
};
