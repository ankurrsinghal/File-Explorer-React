import Folder from './models/Folder';

let instance = null;

class DB {
  constructor(successCallBack, errorCallBack) {

    if (successCallBack === undefined) {
      successCallBack = () => {};
    }

    if (errorCallBack === undefined) {
      errorCallBack = () => {};
    }

    if (!instance) {
      instance = this;
    }

    this.db = null;

    let openRequest = indexedDB.open("file_system", 2);

    openRequest.onupgradeneeded = (e) => {
      console.log("running onsuccess");

      var thisDB = e.target.result;

      if (!thisDB.objectStoreNames.contains("folders")) {
        var folderStore = thisDB.createObjectStore("folders", { keyPath: "created_on" });
        this.createRootFolder(folderStore, (e) => { window.localStorage.setItem('root_folder_key', e); window.location.reload(); }, (e) => { console.log(e); } );
      }

      if (!thisDB.objectStoreNames.contains("files")) {
        var folderStore = thisDB.createObjectStore("files", { keyPath: "created_on" });
      }

    }

    openRequest.onsuccess = (e) => {
      this.db = e.target.result;
      console.log("running onsuccess");
      successCallBack();
    }

    openRequest.onerror = function(e) {
      console.log("onerror!");
      console.dir(e);
      errorCallBack(e);
    }

    openRequest.onblocked = function(e) {
      console.log("onerror!");
      console.dir(e);
    }

    return instance;
  }


  addFolderToFolder(folder, parentFolder, successCallBack, errorCallBack) {

    console.log("Adding folder " + folder.name + "to folder : " + parentFolder.name);

    if (successCallBack === undefined) {
      successCallBack = () => {};
    }

    if (errorCallBack === undefined) {
      errorCallBack = () => {};
    }

    let transaction = this.db.transaction(["folders"], "readwrite");
    let store = transaction.objectStore("folders");

    parentFolder.folders.push(folder);

    let request = store.put(parentFolder);

    request.onerror = function(e) {
      console.log("Error", e.target.error);
      errorCallBack(e);
    }

    request.onsuccess = function(e) {
      console.log("Successfully added folder: " + folder.name);

      let addRequest = store.add(folder);

      addRequest.onerror = function(e) {
        console.log("Error", e.target.error);
        errorCallBack(e);
      }

      addRequest.onsuccess = function(e) {
        console.log("Successfully added folder: " + folder.name);
        successCallBack(e);
      }
    }
  }

  getAllFoldersForFolder(folder, successCallBack, errorCallBack) {

    let folders = [];
    console.log("Fetching folders for folder " + folder.name);

    if (successCallBack === undefined) {
      successCallBack = () => {};
    }

    if (errorCallBack === undefined) {
      errorCallBack = () => {};
    }

    let transaction = this.db.transaction(["folders"], "readonly");
    let store = transaction.objectStore("folders");

    let request = store.get(folder.created_on);

    request.onerror = function(e) {
      console.log("Error", e.target.error);
    }

    request.onsuccess = function(e) {
      let result = e.target.result;
      console.log("Successfully fetcheds folders: ", result);
      successCallBack(result);
    }

  }

  createRootFolder(store, successCallBack, errorCallBack) {

    console.log("Adding Root Folder");

    if (successCallBack === undefined) {
      successCallBack = () => {};
    }

    if (errorCallBack === undefined) {
      errorCallBack = () => {};
    }

    let request = store.add(new Folder("Home"));

    request.onerror = function(e) {
      console.log("Error", e.target.error);
      errorCallBack(e);
    }

    request.onsuccess = function(e) {
      console.log("Successfully added root folder");
      successCallBack(e.target.result);
    }

  }

  getFolder(key, successCallBack, errorCallBack) {

    console.log("Fetching Folder for key : " + key);

    if (successCallBack === undefined) {
      successCallBack = () => {};
    }

    if (errorCallBack === undefined) {
      errorCallBack = () => {};
    }

    let transaction = this.db.transaction(["folders"], "readonly");
    let store = transaction.objectStore("folders");

    let request = store.get(key);

    request.onerror = function(e) {
      console.log("Error", e.target.error);
    }

    request.onsuccess = function(e) {
      let result = e.target.result;
      console.log("Successfully fetched folder : ", key);
      successCallBack(result);
    }

  }

  deleteFolderFromFolder(key, parent_key, successCallBack, errorCallBack) {

    console.log("Deleting Folder for key : " + key);

    if (successCallBack === undefined) {
      successCallBack = () => {};
    }

    if (errorCallBack === undefined) {
      errorCallBack = () => {};
    }

    let transaction = this.db.transaction(["folders"], "readwrite");
    let store = transaction.objectStore("folders");

    let request = store.get(parent_key);

    request.onerror = function(e) {
      console.log("Error", e.target.error);
    }

    request.onsuccess = function(e) {
      let result = e.target.result;
      console.log("Successfully deleted folder : ", key);

      result.folders = result.folders.filter((f) => {
        return f.created_on !== key;
      });

      let request = store.put(result);

      request.onerror = function(e) {
        console.log("Error", e.target.error);
      }

      request.onsuccess = function(e) {
        let result = e.target.result;
        console.log("Successfully deleted folder : ", key);

        let request = store.delete(key);

        request.onerror = function(e) {
          console.log("Error", e.target.error);
        }

        request.onsuccess = function(e) {
          let result = e.target.result;
          console.log("Successfully deleted folder : ", key);
          successCallBack(result);
        }
      }
    }

  }

  deleteFileFromFolder(key, parent_key, successCallBack, errorCallBack) {

    console.log("Deleting File for key : " + key);

    let db = this.db;

    if (successCallBack === undefined) {
      successCallBack = () => {};
    }

    if (errorCallBack === undefined) {
      errorCallBack = () => {};
    }

    let transaction = db.transaction(["folders"], "readwrite");
    let store = transaction.objectStore("folders");

    let request = store.get(parent_key);

    request.onerror = function(e) {
      console.log("Error", e.target.error);
    }

    request.onsuccess = function(e) {
      let result = e.target.result;
      console.log("Successfully deleted folder : ", key);

      result.files = result.files.filter((f) => {
        return f.created_on !== key;
      });

      let request = store.put(result);

      request.onerror = function(e) {
        console.log("Error", e.target.error);
      }

      request.onsuccess = function(e) {
        let result = e.target.result;
        console.log("Successfully deleted folder : ", key);

        let transaction = db.transaction(["files"], "readwrite");
        let store = transaction.objectStore("files");

        let request = store.delete(key);

        request.onerror = function(e) {
          console.log("Error", e.target.error);
        }

        request.onsuccess = function(e) {
          let result = e.target.result;
          console.log("Successfully deleted folder : ", key);
          successCallBack(result);
        }
      }
    }

  }


  addFileToFolder(file, parentFolder, successCallBack, errorCallBack) {

    console.log("Adding file " + file.name + "to folder : " + parentFolder.name);

    if (successCallBack === undefined) {
      successCallBack = () => {};
    }

    if (errorCallBack === undefined) {
      errorCallBack = () => {};
    }

    var db = this.db;

    let transaction = db.transaction(["folders"], "readwrite");
    let store = transaction.objectStore("folders");

    parentFolder.files.push(file);

    let request = store.put(parentFolder);

    request.onerror = function(e) {
      console.log("Error", e.target.error);
      errorCallBack(e);
    }

    request.onsuccess = function(e) {

      let transaction = db.transaction(["files"], "readwrite");
      let store = transaction.objectStore("files");

      let addRequest = store.add(file);

      addRequest.onerror = function(e) {
        console.log("Error", e.target.error);
        errorCallBack(e);
      }

      addRequest.onsuccess = function(e) {
        console.log("Successfully added file: " + file.name);
        successCallBack(e);
      }
    }
  }


  getFile(key, successCallBack, errorCallBack) {

    console.log("Fetching File for key : " + key);

    if (successCallBack === undefined) {
      successCallBack = () => {};
    }

    if (errorCallBack === undefined) {
      errorCallBack = () => {};
    }

    let transaction = this.db.transaction(["files"], "readonly");
    let store = transaction.objectStore("files");

    let request = store.get(key);

    request.onerror = function(e) {
      console.log("Error", e.target.error);
    }

    request.onsuccess = function(e) {
      let result = e.target.result;
      console.log("Successfully fetched folder : ", key);
      successCallBack(result);
    }

  }

  getRootFolderKey(successCallBack, errorCallBack) {

    if (successCallBack === undefined) {
      successCallBack = () => {};
    }

    if (errorCallBack === undefined) {
      errorCallBack = () => {};
    }

    var transaction = this.db.transaction(["folders"], "readonly");
    var folder = transaction.objectStore("folders");
    var cursor = folder.openCursor();

    cursor.onsuccess = function(e) {
      var cursor = e.target.result;

      if (cursor) {
        successCallBack(cursor.key);
      }
    }

    transaction.oncomplete = function() {
      // $("#results").html(s);
    }
  }


}

export default DB;
