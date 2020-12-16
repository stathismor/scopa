import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from 'theme-ui';
import { Link } from 'react-router-dom';
import { Layout } from 'components/Layout';
import { gameIO } from 'lib/socket';
import { RoomState, RoomEvent } from 'shared';
import { useUserData } from 'components/UserContext';
import { Game } from './Game';

export const Room = () => {
  const [status, setStatus] = useState<RoomState>(RoomState.Pending);
  const [errorMessage, setErrorMessage] = useState('');
  const { roomName } = useParams<{ roomName: string }>();
  const { username } = useUserData();

  useEffect(() => {
    const handleSuccess = () => {
      setStatus(RoomState.Joined);
    };

    const handleError = (errorMessage: string) => {
      setStatus(RoomState.Failed);
      setErrorMessage(errorMessage);
    };

    gameIO.emit(RoomEvent.Join, roomName, username);

    gameIO.on(RoomEvent.JoinSuccess, handleSuccess);
    gameIO.on(RoomEvent.JoinError, handleError);

    return () => {
      gameIO.off(RoomEvent.JoinSuccess, handleSuccess);
      gameIO.off(RoomEvent.JoinError, handleError);
    };
  }, [roomName, username]);

  switch (status) {
    case RoomState.Pending:
      return <div>Pending</div>;
    case RoomState.Joined:
      return (
        <Layout>
          <Box sx={{ position: 'absolute', left: 0, top: 0 }}>
            <Link to="/">Back</Link>
          </Box>
          <Game />
        </Layout>
      );
    default:
    case RoomState.Failed:
      return <div>Error: {errorMessage}</div>;
  }
};
