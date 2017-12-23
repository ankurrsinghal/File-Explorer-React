class File {

  constructor(name = +new Date(), data='') {
    this.name = name;
    this.data = data;
    this.created_on = +new Date();
    this.parent = 0;
  }

}

export default File;
