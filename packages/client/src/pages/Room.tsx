import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Grid } from 'theme-ui';
import { Link } from 'react-router-dom';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { RoomState, RoomEvent, GameEvent, GameState, PlayerAction } from 'shared';
import { gameIO } from 'lib/socket';
import { Layout } from 'components/Layout';
import { useUserData } from 'components/UserContext';
import { Log } from 'components/Log';
import { Game } from './Game';
import { theme } from 'theme';

export const Room = () => {
  const [status, setStatus] = useState<RoomState>(RoomState.Pending);
  const [errorMessage, setErrorMessage] = useState('');
  const { roomName } = useParams<{ roomName: string }>();
  const { username } = useUserData();
  const [action, setAction] = useState<PlayerAction>();

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

  useEffect(() => {
    const handleCurrentGameState = (_: GameState, playerAction?: PlayerAction) => {
      if (playerAction) {
        setAction(playerAction);
      }
    };
    gameIO.on(GameEvent.CurrentState, handleCurrentGameState);

    return () => {
      gameIO.off(GameEvent.CurrentState, handleCurrentGameState);
    };
  }, []);

  switch (status) {
    case RoomState.Pending:
      return <Box>Pending</Box>;
    case RoomState.Joined:
      return (
        <Layout>
          <Box sx={{ position: 'absolute', left: 1, top: 1 }}>
            <Link to="/" aria-label="Back to Lobby">
              <FiArrowLeftCircle title="Back to Lobby" size={24} color={theme.colors.text} />
            </Link>
          </Box>
          <Grid columns={['auto', null, '75% 25%']} sx={{ height: '100%' }}>
            <Game />
            <Log event={action?.description} />
          </Grid>
        </Layout>
      );
    default:
    case RoomState.Failed:
      return (
        <Box>
          Error: {errorMessage}
          <Box mt={3}>
            <Link to="/">
              <Button>Back to Lobby</Button>
            </Link>
          </Box>
        </Box>
      );
  }
};
