import { Lobby } from 'pages/Lobby';
import { Playground } from 'pages/Playground';
import { Room } from 'pages/Room';
import { UiDocs } from 'pages/UiDocs';
import { Route, Switch } from 'react-router-dom';

function App() {
  return (
    <Switch>
      <Route path="/" exact>
        <Lobby />
      </Route>
      <Route path="/game/:roomName">
        <Room />
      </Route>
      <Route path="/docs">
        <UiDocs />
      </Route>
      <Route path="/playground">
        <Playground />
      </Route>
    </Switch>
  );
}

export default App;
