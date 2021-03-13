import './App.css';
import MoveList from './components/move/MoveList';
import Desc from './components/desc/Desc';
import Video from './components/video/Video';
import Auth from './components/auth/Auth';
import User from './components/User';
import HomeIcon from '@material-ui/icons/Home';
import {Switch, Route, Link} from 'react-router-dom';
import Routes from './Routes';
import About from './components/About';

function App() {
  return (
    <div className="App">
        <header>
            {/* <Link to='/'><HomeIcon className="home"/></Link> */}
            <Link to='/'><h1>Capoeira Mastery</h1></Link>
            <Auth />
          </header>
          {/* <About /> */}
        <div className='content'>
            <Switch>
              <Route path='/' exact>
                <div className="main">
                  <MoveList />
                  <Video />
                </div>
                <Desc />
              </Route>
              <Route path='/user' component={User} />
            </Switch>
        </div>
    </div>
  );
}

export default App;
