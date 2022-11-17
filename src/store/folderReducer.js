import * as actionTypes from './actions';

export const initialState = {
  folder: null,
  selectedFolder: null,
  flattenFolders: [],
};

function getFlattenFolder(folder) {
  let flattenFolder = [...folder];
  folder.forEach((folder) => {
    if (folder.children && folder.children.length)
      flattenFolder = [...flattenFolder, ...getFlattenFolder(folder.children)];
  });
  return flattenFolder.map((folder) => {
    const { children, ...data } = folder;
    return data;
  });
}

const folderReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FOLDER_CHANGE:
      return {
        ...state,
        folder: action.folder,
        selectedFolder: action.folder,
        flattenFolders: action.folder ? getFlattenFolder([action.folder]) : getFlattenFolder([]),
      };
    case actionTypes.SELECTED_FOLDER_CHANGE:
      return {
        ...state,
        selectedFolder: action.selectedFolder,
      };
    default:
      return state;
  }
};

export default folderReducer;
