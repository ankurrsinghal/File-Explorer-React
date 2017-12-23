import React, { Component } from 'react';
import {Link, Route} from 'react-router-dom';

import FileModel from './models/File';
import FolderModel from './models/Folder';

import DB from './db';

class File extends Component {

  constructor() {
    super();

    this.state = {
      name: '',
      created_on: '',
      folder_name: '',
      file_key: '',
      parent_folder_key: ''
    }
  }

  componentDidMount() {

    let folderKey = this.props.match.params.folderKey;
    let fileKey = this.props.match.params.fileKey;

    let db = new DB(() => {
      db.getFile(Number(fileKey), (result) => {
        this.setState({
          name: result.name,
          created_on: result.created_on,
          file_key: fileKey,
          parent_folder_key: folderKey
        });

        db.getFolder(Number(folderKey), (result) => {
          this.setState({
            folder_name: result.name
          })
        });

      });
    },
    (e) => { console.log(e); });

  }

  deleteFile() {

    let db = new DB(() => {
      db.deleteFileFromFolder(Number(this.state.file_key), Number(this.state.parent_folder_key), (result) => {
        window.location.replace(`/folders/${this.state.parent_folder_key}`);
      });
    },
    (e) => { console.log(e); });

  }

  pushRouter(key, e) {
    e.preventDefault();
  }

  render() {

    let folderKey = this.props.match.params.folderKey;
    let date = (new Date(Number(this.state.created_on))).toString();

    return (
      <main className="main-app">
        <header className="top-header clearfix">
          <div className="logo pull-left">
            <Link to="/">File System</Link>
          </div>
          <div className="header-actions pull-right">
            <div className="back-to-folder">
              <Link onClick={this.pushRouter.bind()} to={`/folders/${folderKey}`}>Back To Folder :- {this.state.folder_name}</Link>
            </div>
          </div>
        </header>

        <section className="main-section">
          <header>
            <h1 className="full-path">{this.state.name}</h1>
            <button onClick={this.deleteFile.bind(this)} className="btn btn-solid btn-black btn-sm">Delete</button>
          </header>
          <div className="objects-board">
            <h1 className="file-date">Create On : {date}</h1>
          </div>
        </section>
      </main>
    );
  }
}

export default File;
