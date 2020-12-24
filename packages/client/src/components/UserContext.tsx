import { gameIO } from 'lib/socket';
import { useState, useEffect, useRef, FC, createContext, useContext } from 'react';
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
  const hasUserName = useRef(username !== '');

  const handleUsernameCreated = (randomUsername: string) => {
    setUsername(randomUsername);
    persistUsername(randomUsername);
    hasUserName.current = false;
  };

  useEffect(() => {
    gameIO.on('connect', () => {
      console.log(`connect ${gameIO.id}`);
    });

    // We check if username exists to avoid double-registering the callback.
    // Same for de-registering.
    if (!hasUserName.current) {
      gameIO.emit(UserEvent.UsernameMissing);
      gameIO.on(UserEvent.UsernameCreated, handleUsernameCreated);
    }

    return () => {
      if (!hasUserName.current) {
        gameIO.off(UserEvent.UsernameCreated, handleUsernameCreated);
      }
    };
  }, []);

  return (
    <UserContext.Provider value={{ username: username }}>{username ? children : 'Pending ...'}</UserContext.Provider>
  );
};

export const useUserData = () => {
  return useContext(UserContext);
};
