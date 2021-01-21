import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Flex } from 'theme-ui';
import { Link } from 'react-router-dom';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { RoomState, RoomEvent, GameEvent, GameState, PlayerAction } from 'shared';
import { gameIO } from 'lib/socket';
import { Layout } from 'components/Layout';
import { useUserData } from 'components/UserContext';
import { Log } from 'components/Log';
import { Game } from './Game';
import { theme } from 'theme';

type Props = {
  status: RoomState;
  action?: string;
  error: string;
};

const RoomSwitch = ({ status, action, error }: Props) => {
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
          <Flex sx={{ height: '100%', flexDirection: ['column', null, 'row'] }}>
            <Box sx={{ flex: 1 }}>
              <Game />
            </Box>
            <Box sx={{ flex: [0, null, '0 0 25%'], height: '100%' }}>
              <Log event={action} />
            </Box>
          </Flex>
        </Layout>
      );
    default:
    case RoomState.Failed:
      return (
        <Box>
          Error: {error}
          <Box mt={3}>
            <Link to="/">
              <Button>Back to Lobby</Button>
            </Link>
          </Box>
        </Box>
      );
  }
};

export const Room = () => {
  const [status, setStatus] = useState<RoomState>(RoomState.Pending);
  const [errorMessage, setErrorMessage] = useState('');
  const { roomName } = useParams<{ roomName: string }>();
  const { username } = useUserData();
  const [playerAction, setPlayerAction] = useState<string>();

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
    const handleLogs = (_: GameState, action?: PlayerAction) => {
      setPlayerAction(action?.description);
    };
    gameIO.on(GameEvent.CurrentState, handleLogs);

    return () => {
      gameIO.off(GameEvent.CurrentState, handleLogs);
    };
  }, []);

  return (
    <Box key={roomName}>
      <RoomSwitch status={status} error={errorMessage} action={playerAction} />
    </Box>
  );
};
