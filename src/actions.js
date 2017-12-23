export const addFolder = (folderName = 'New Folder') => {
  return {
    type: 'app/addFolder',
    payload: {
      folderName
    }
  }
};
