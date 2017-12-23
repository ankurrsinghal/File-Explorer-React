import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import File from './models/File';
import Folder from './models/Folder';

import Main from './Main';
import FolderComponent from './Folder';
import FileComponent from './File';
import NoMatch from './NoMatch';

class App extends Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route exact path="/" component={Main}></Route>
            <Route exact path="/folders/" component={Main}></Route>
            <Route exact path="/folders/:folderKey/" component={FolderComponent}></Route>
            <Route exact path="/folders/:folderKey/files/:fileKey" component={FileComponent}></Route>
            <Route component={NoMatch}></Route>
          </Switch>
        </Router>
    );
  }
}

export default App;
