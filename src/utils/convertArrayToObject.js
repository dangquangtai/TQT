import { v4 as uuidv4 } from 'uuid';


export const convertArrayToObject = (array, key = 'id') => {
  return array.reduce((pre, cur) => {
    const id = cur[key] || uuidv4();
    return ({...pre, [id]: { ...cur, id } })
  }, {})
}; 