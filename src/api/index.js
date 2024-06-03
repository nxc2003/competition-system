import axios from './axios';
// 用户登录接口
export const login = data => axios.post('/auth/login', data);
// 获取认证码接口
export const getAuthCode = () => axios.get('/auth/code');
// 获取用户数据接口
export const getUserData = () => axios.get('/get_user');
/**
 * 用户相关接口
 */
// 获取用户列表接口
export const getUserList = params => axios.get('/user/list', { params });
// 添加用户接口--舍弃 直接由后端添加教师/学生时实现
export const addUser = (type, data) => axios.post('/user/add', { type, data });
// 导入用户接口--暂未调试成功
export const importUser = (type, data) => axios.post('/user/import', { type, data });
// 删除用户接口
export const deleteUser = (type, data) => axios.delete('/user/delete', { data: { type, data } });
// 更新用户接口
export const updateUser = (type, data) => axios.put('/user/update', { type, data });
// 更新密码接口
export const updatePassword = data => axios.patch('/user/password', data);
// 重置密码接口
export const resetPassword = data => axios.put('/user/reset', data);
/**
 * 赛事相关接口--调试完成
 */
// 获取赛事列表接口
export const getRaceList = params => axios.get('/race/list', { params });
// 添加赛事接口
export const addRace = data => axios.post('/race/add', data);
// 更新赛事接口
export const updateRace = data => axios.put('/race/update', data);
// 删除赛事接口
export const deleteRace = data => axios.delete('/race/delete', { data });
/**
 * 参赛记录相关接口--调试完成
 */
// 获取参赛记录列表接口
export const getRecordList = params => axios.get('/record/list', { params });
// 添加参赛记录接口
export const addRecord = data => axios.post('/record/add', data);
// 更新参赛记录接口
export const updateRecord = data => axios.patch('/record/update', data);
// 删除参赛记录接口
export const deleteRecord = data => axios.delete('/record/delete', { data });
/**
 * 权限相关接口
 */
// 获取权限列表接口
export const getPermissions = params => axios.get('/permission/list', { params });
// 添加权限接口
export const addPermission = data => axios.post('/permission/add', data);
// 更新权限接口
export const updatePermission = data => axios.post('/permission/update', data);
// 删除权限接口
export const deletePermission = data => axios.delete('/permission/delete', { data });
/**
 * 角色相关接口
 */
// 获取角色列表接口
export const getRoles = params => axios.get('/role/list', { params });
// 添加角色接口
export const addRole = data => axios.post('/role/add', data);
// 更新角色接口
export const updateRole = data => axios.post('/role/update', data);
// 删除角色接口
export const deleteRole = data => axios.delete('/role/delete', { data });
// 授予角色接口
export const grantRole = data => axios.post('/role/grant', data);
