import request from '@/utils/request'
export function fetchList(parentId,params) {
  return request({
    url:'/systemCategory/list/'+parentId,
    method:'get',
    params:params
  })
}
export function fetchListByCode(params) {
  return request({
    url:'/systemCategory/getCateByCode',
    method:'get',
    params:params
  })
}
export function deleteSystemCate(id) {
  return request({
    url:'/systemCategory/delete/'+id,
    method:'post'
  })
}

export function createSystemCate(data) {
  return request({
    url:'/systemCategory/create',
    method:'post',
    data:data
  })
}

export function updateSystemCate(id,data) {
  return request({
    url:'/systemCategory/update/'+id,
    method:'post',
    data:data
  })
}

export function getSystemCate(id) {
  return request({
    url:'/systemCategory/'+id,
    method:'get',
  })
}

export function fetchListWithChildren() {
  return request({
    url:'/systemCategory/list/withChildren',
    method:'get'
  })
}
