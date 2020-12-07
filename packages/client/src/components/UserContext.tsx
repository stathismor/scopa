import { gameIO } from 'lib/socket';
import { useEffect } from 'react';
import { useState } from 'react';
import { FC, createContext, useContext } from 'react';
import { getStoredUsername, persistUsername } from 'utils/storage';
import { UserEvent } from 'shared';

export const UserContext = createContext<{
  userName: string | null;
}>({
  userName: null,
});

const persistedUsername = getStoredUsername();
export const UserProvider: FC = ({ children }) => {
  const [userName, setUsername] = useState<string | null>(persistedUsername);
  if (!userName) {
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

  return <UserContext.Provider value={{ userName }}>{children}</UserContext.Provider>;
};

export const useUserData = () => {
  return useContext(UserContext);
};
