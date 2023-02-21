import axiosServices from "../../axios";
import { apiEndpoints } from "../../../store/constant";
export const getUserGroupDetail = (group_code, setView) =>{
                  return axiosServices
                  .post(apiEndpoints.get_user_group_detail,{group_code: group_code})
                  .then((response)=>{
                                    if (response.status===200 && response.data.return===200){
                                                      console.log("api")
                                                      const {view, data} = response.data;
                                                      setView({...view, action:'detail'})
                                                      return data;
                                    }
                                    return {};
                  })
                  .catch((error)=>{
                                    console.log(error)
                  })
};
export const getUserGroupList = () =>{
                  return axiosServices
                  .post(apiEndpoints.get_user_group_list,{})
                  .then((response)=>{
                                    if (response.status===200 && response.data.return===200){
                                                      console.log("api")
                                                      const {list} = response.data;
                                                      
                                                      return list;
                                    }
                                    return {};
                  })
                  .catch((error)=>{
                                    console.log(error)
                  })
};
export const createUserGroupDetail = (group_code,group_name,email_list) =>{
                  return axiosServices
                  .post(apiEndpoints.create_user_group_detail,{group_code: group_code, group_name:group_name , email_list:email_list})
                  .then((response)=>{
                                    if (response.status===200 && response.data.return===200){
                                                     
                                                      return true;
                                    }
                                    return false;
                  })
                  .catch((error)=>{
                                    console.log(error)
                  })
};
export const updateUserGroupDetail = (group_code,group_name, email_list,group_code_old) =>{
                  return axiosServices
                  .post(apiEndpoints.update_user_group_detail,
                                    {
                                                      group_code: group_code, 
                                                      group_name:group_name , 
                                                      email_list:email_list, 
                                                      group_code_old:group_code_old})
                  .then((response)=>{
                                    if (response.status===200 && response.data.return===200){
                                                      
                                                      return true;
                                    }
                                    return false;
                  })
                  .catch((error)=>{
                                    console.log(error)
                  })
};

export const getTreeViewMenuList = () =>{
                  return axiosServices
                  .post(apiEndpoints.get_menu_item_tree_view,
                                    {})
                  .then((response)=>{
                                    if (response.status===200 && response.data.return===200){
                                                     const {list} = response.data 
                                                      return list;
                                    }
                                    return [];
                  })
                  .catch((error)=>{
                                    console.log(error)
                  })
};
export const getMenuLookupList = (user_group) =>{
                  return axiosServices
                  .post(apiEndpoints.get_menu_item_lookup_tree_view,
                                    {user_group: user_group})
                  .then((response)=>{
                                    if (response.status===200 && response.data.return===200){
                                                     const {list} = response.data 
                                                      return list;
                                    }
                                    return [];
                  })
                  .catch((error)=>{
                                    console.log(error)
                  })
};
export const updateMenuLookupList = (user_group, menu_list) =>{
                  return axiosServices
                  .post(apiEndpoints.update_menu_item_update_lookup,
                                    {user_group: user_group, menu_list: menu_list})
                  .then((response)=>{
                                    if (response.status===200 && response.data.return===200){
                                                   return true;
                                    }
                                    return false;
                  })
                  .catch((error)=>{
                                    console.log(error)
                  })
};