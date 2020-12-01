import { gameIO } from 'lib/socket';
import { useEffect } from 'react';
import { useState } from 'react';
import { FC, createContext, useContext } from 'react';
import { getPersistedUserName, persistUserName } from 'utils/localStorageUtils';

export const UserContext = createContext<{
  userName: string | null;
}>({
  userName: null,
});

const persistedUserName = getPersistedUserName();
export const UserProvider: FC = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(persistedUserName);
  if (!userName) {
    gameIO.emit('request-username');
  }

  useEffect(() => {
    gameIO.on('connect', () => {
      console.log(`connect ${gameIO.id}`);
    });
    const handleUsernameRequested = (usrName: string) => {
      setUserName(usrName);
      persistUserName(usrName);
    };
    gameIO.on('username-requested', handleUsernameRequested);
    return () => {
      gameIO.off('username-requested', handleUsernameRequested);
    };
  }, []);

  return <UserContext.Provider value={{ userName }}>{children}</UserContext.Provider>;
};

export const useUserData = () => {
  return useContext(UserContext);
};
