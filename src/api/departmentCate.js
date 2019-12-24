import request from '@/utils/request'
export function fetchList(parentId,params) {
  return request({
    url:'/departmentCategory/list/'+parentId,
    method:'get',
    params:params
  })
}
export function deleteDepartmentCate(id) {
  return request({
    url:'/departmentCategory/delete/'+id,
    method:'post'
  })
}

export function createDepartmentCate(data) {
  return request({
    url:'/departmentCategory/create',
    method:'post',
    data:data
  })
}

export function updateDepartmentCate(id,data) {
  return request({
    url:'/departmentCategory/update/'+id,
    method:'post',
    data:data
  })
}

export function getDepartmentCate(id) {
  return request({
    url:'/departmentCategory/'+id,
    method:'get',
  })
}

export function fetchListWithChildren() {
  return request({
    url:'/departmentCategory/list/withChildren',
    method:'get'
  })
}
