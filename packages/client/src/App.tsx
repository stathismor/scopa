import { Lobby } from 'pages/Lobby';
import { Game } from 'pages/Game';
import { Route, Switch } from 'react-router-dom';

import { USER_EVENTS } from 'shared';

console.log(USER_EVENTS);

function App() {
  return (
    <Switch>
      <Route path="/" exact>
        <Lobby />
      </Route>
      <Route path="/game/:roomName">
        <Game />
      </Route>
    </Switch>
  );
}

export default App;
