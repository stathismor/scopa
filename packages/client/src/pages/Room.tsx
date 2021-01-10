import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Grid } from 'theme-ui';
import { Link } from 'react-router-dom';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { RoomState, RoomEvent, GameEvent, GameState, GameStatus, PlayerAction, Score } from 'shared';
import { gameIO } from 'lib/socket';
import { Layout } from 'components/Layout';
import { useUserData } from 'components/UserContext';
import { Log } from 'components/Log';
import { Game } from './Game';
import { theme } from 'theme';

const INITIAL_STATE = {
  status: GameStatus.Waiting,
  activePlayer: '',
  deck: [],
  table: [],
  players: [],
  latestCaptured: '',
  activePlayerCard: null,
  activeCardsOnTable: [],
};

export const Room = () => {
  const [status, setStatus] = useState<RoomState>(RoomState.Pending);
  const [errorMessage, setErrorMessage] = useState('');
  const { roomName } = useParams<{ roomName: string }>();
  const { username } = useUserData();
  const [{ playerAction, ...gameState }, setGameState] = useState<GameState & { playerAction?: PlayerAction }>(
    INITIAL_STATE,
  );
  const [gameScore, setGameScore] = useState<Score[]>();

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
    const handleCurrentGameState = (state: GameState, action?: PlayerAction) => {
      setGameState({
        ...state,
        playerAction: action,
      });
    };
    const handleGameEnded = (score: Score[]) => {
      setGameScore(score);
    };

    gameIO.on(GameEvent.CurrentState, handleCurrentGameState);
    gameIO.on(GameStatus.Ended, handleGameEnded);

    return () => {
      gameIO.off(GameEvent.CurrentState, handleCurrentGameState);
      gameIO.off(GameStatus.Ended, handleGameEnded);
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
            <Game gameState={gameState} gameScore={gameScore} playerAction={playerAction} />
            <Log event={playerAction?.description} />
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
