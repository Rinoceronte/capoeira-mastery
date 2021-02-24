import './App.css';
import MoveList from './components/move/MoveList';
import Desc from './components/desc/Desc';
import Video from './components/video/Video';
import Auth from './components/auth/Auth';
import User from './components/User';
import {Switch, Route, Link} from 'react-router-dom';
import Routes from './Routes';

function App() {
  return (
    <div className="App">
        <header>
            <Link to='/'>Home</Link>
            <h1>Capoeira Mastery</h1>
            <Auth />
          </header>
        <div className='content'>
            <Switch>
              <Route path='/' exact>
                <MoveList />
                <Video />
                <Desc />
              </Route>
              <Route path='/user' component={User} />
            </Switch>
        </div>
    </div>
  );
}

export default App;
