import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Video from './components/video/Video';
import Desc from './components/desc/Desc';

export default (
    <Switch>
        <Route path='/move/:id' component={Video} />
        <Route path='/move/:id' component={Desc} />
    </Switch>
)