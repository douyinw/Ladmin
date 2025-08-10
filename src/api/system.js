import request from '@/utils/request'

// 通用接口封装
export const appApi = (controller) => ({
  // 基本请求方法
  get: (action, data) => request({
    url: `${controller}/${action}`,
    method: 'GET',
    data
  }),
  
  post: (action, data) => request({
    url: `${controller}/${action}`,
    method: 'POST',
    data
  }),
  
  // 标准CRUD操作
  list: (data) => request({
    url: `${controller}/index`,
    method: 'GET',
    data
  }),
  
  read: (data) => request({
    url: `${controller}/read`,
    method: 'GET',
    data
  }),
  
  add: (data) => request({
    url: `${controller}/add`,
    method: 'POST',
    data
  }),
  
  edit: (data) => request({
    url: `${controller}/save`,
    method: 'PATCH',
    data
  }),
  
  update: (data) => request({
    url: `${controller}/update`,
    method: 'PUT',
    data
  }),
  
  delete: (data) => request({
    url: `${controller}/delete`,
    method: 'DELETE',
    data
  }),

  upload: (data) => request({
    url: `${controller}/upload`,
    method: 'POST',
    data
  })
});
