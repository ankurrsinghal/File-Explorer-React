import React, { Component } from 'react';
import {Link, Route} from 'react-router-dom';

import File from './models/File';
import FolderModel from './models/Folder';

import DB from './db';

class Folder extends Component {

  constructor() {
    super();

    this.state = {
      name: '',
      folders: [],
      files: [],
      tempFolderName: '',
      tempFileName: '',
      folder_key: '',
      parent_folder_key: '',
    }
  }

  componentDidMount() {

    let folderKey = this.props.folderKey || (this.props.match && this.props.match.params.folderKey);

    let db = new DB(() => {
      db.getFolder(Number(folderKey), (result) => {
        this.setState({
          folders: result.folders,
          files: result.files,
          name: result.name,
          folder_key: result.created_on,
          parent_folder_key: result.parent
        })
      });
    },
    (e) => { console.log(e); });
  }

  setTempFolderName(e) {
    this.setState({
      tempFolderName: e.target.value
    })
  }

  setTempFileName(e) {
    this.setState({
      tempFileName: e.target.value
    })
  }

  addFolder(e) {
    if (this.state.tempFolderName !== '') {

      let folderKey = this.props.folderKey || this.props.match.params.folderKey;

      let db = new DB(() => {
        db.getFolder(Number(folderKey), (result) => {

          let newFolder = new FolderModel(this.state.tempFolderName);
          newFolder.parent = result.created_on;

          db.addFolderToFolder(newFolder, result, (e) => {

            this.setState({
              folders: this.state.folders.concat([newFolder]),
              tempFolderName: ''
            });

           }, (e) => { console.log(e); })
        });
      },
      (e) => { console.log(e); });
    }
  }

  deleteFolder() {

    if (this.state.parent_folder_key === 0) {
      return;
    }

    let db = new DB(() => {
      db.deleteFolderFromFolder(Number(this.state.folder_key), Number(this.state.parent_folder_key), (result) => {
        window.location.replace(`/folders/${this.state.parent_folder_key}`);
      });
    },
    (e) => { console.log(e); });
  }

  addFile(e) {
    if (this.state.tempFileName !== '') {

      let folderKey = this.props.folderKey || this.props.match.params.folderKey;

      let db = new DB(() => {
        db.getFolder(Number(folderKey), (result) => {

          let newFile = new File(this.state.tempFileName);
          newFile.parent = result.created_on;

          db.addFileToFolder(newFile, result, (e) => {

            this.setState({
              files: this.state.files.concat([newFile]),
              tempFileName: ''
            });

           }, (e) => { console.log(e); })
        });
      },
      (e) => { console.log(e); });
    }
  }

  pushRouter(key, e) {
    e.preventDefault();
  }

  render() {

    let folderKey = this.props.folderKey || (this.props.match && this.props.match.params.folderKey);

    let folders = this.state.folders.map((f) => {
      return (
        <li key={f.created_on}>
          <Link className={(f.folders.length > 0) ? "object folder not-empty" : "object folder"} onClick={this.pushRouter.bind(f.created_on)} to={`/folders/${f.created_on}`}>
            <img src="/img/folder.png"></img>
            <p>{f.name}</p>
          </Link>
        </li>
      );
    });

    let files = this.state.files.map((f) => {
      return (
        <li key={f.created_on}>
          <Link className="object file" onClick={this.pushRouter.bind(f.created_on)} to={`/folders/${folderKey}/files/${f.created_on}`}>
            <img src="/img/file.png"></img>
            <p>{f.name}</p>
          </Link>
        </li>
      );
    });

    let deleteButton = '';

    if (this.state.parent_folder_key !== 0) {
      deleteButton = <button onClick={this.deleteFolder.bind(this)} className="btn btn-solid btn-black btn-sm">Delete</button>;
    }

    return (
      <main className="main-app">
        <header className="top-header clearfix">
          <div className="logo pull-left">
            <Link to="/">File System</Link>
          </div>
          <div className="header-actions pull-right">
            <div className="form-group">
              <input className="form-control" onChange={this.setTempFolderName.bind(this)} value={this.state.tempFolderName} type="text" placeholder="Enter Folder Name" />
              <button className="btn btn-solid btn-line btn-black" onClick={this.addFolder.bind(this)}>Add New Folder</button>
            </div>
            <div className="form-group">
              <input className="form-control" onChange={this.setTempFileName.bind(this)} value={this.state.tempFileName} type="text" placeholder="Enter File Name" />
              <button className="btn btn-solid btn-line btn-black" onClick={this.addFile.bind(this)}>Add New File</button>
            </div>
          </div>
        </header>

        <section className="main-section">
          <header>
            <h1 className="full-path">{this.state.name}</h1>
            {deleteButton}
          </header>
          <div className="objects-board">
            <ul className="objects-list">
              {folders}
              {files}
            </ul>
          </div>
        </section>
      </main>
    );
  }
}

export default Folder;
