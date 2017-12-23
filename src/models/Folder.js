class Folder {
  constructor(name = 'New Folder') {
    this.name = name;
    this.created_on = +new Date();
    this.files = [];
    this.folders = [];
    this.parent = 0;
  }

  setFolders(folders = []) {
    this.folders = folders;
  }


  setFiles(files = []) {
    this.files = files;
  }
}

export default Folder;
