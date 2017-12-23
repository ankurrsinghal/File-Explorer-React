import React, { Component } from 'react';
import {Link, Route} from 'react-router-dom';

import FolderComponent from './Folder';

class Main extends Component {

  render() {

    let root_folder_key = window.localStorage.getItem('root_folder_key');

    return (
      <FolderComponent folderKey={Number(root_folder_key)}></FolderComponent>
    );
  }
}

export default Main;
