import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button } from 'theme-ui';
import { Link } from 'react-router-dom';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { Layout } from 'components/Layout';
import { gameIO } from 'lib/socket';
import { RoomState, RoomEvent, GameEvent, GameState, GameStatus, Score, PlayerAction, PlayerActionType } from 'shared';
import { useUserData } from 'components/UserContext';
import { Game } from './Game';
import { theme } from 'theme';

const INITIAL_STATE = {
  status: GameStatus.Waiting,
  activePlayer: '',
  deck: [],
  table: [],
  players: [],
  latestCaptured: '',
};

const ANIMATION_DURATION = {
  [PlayerActionType.Capture]: 1200,
  [PlayerActionType.PlayOnTable]: 600,
};

export const Room = () => {
  const [status, setStatus] = useState<RoomState>(RoomState.Pending);
  const [errorMessage, setErrorMessage] = useState('');
  const { roomName } = useParams<{ roomName: string }>();
  const { username } = useUserData();
  const [gameState, setGameState] = useState<GameState>(INITIAL_STATE);
  const [gameScore, setGameScore] = useState<Score[]>();
  const [latestAction, setLastAction] = useState<PlayerAction>();

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

  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleCurrentGameState = (state: GameState, playerAction: PlayerAction) => {
      setLastAction(playerAction);
      timer.current = setTimeout(() => {
        setGameState(state);
        setLastAction(undefined);
      }, ANIMATION_DURATION[playerAction?.action] ?? 0);
    };
    const handleGameEnded = (score: Score[]) => {
      setGameScore(score);
    };

    gameIO.on(GameEvent.CurrentState, handleCurrentGameState);
    gameIO.on(GameStatus.Ended, handleGameEnded);

    return () => {
      gameIO.off(GameEvent.CurrentState, handleCurrentGameState);
      gameIO.off(GameStatus.Ended, handleGameEnded);
      clearTimeout(timer.current as NodeJS.Timeout);
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
          <Game gameState={gameState} gameScore={gameScore} latestAction={latestAction} />
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
