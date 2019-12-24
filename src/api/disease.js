import request from '@/utils/request'
export function fetchListAll() {
  return request({
    url:'/doDisease/listAll',
    method:'get',
  })
}
export function fetchList(params) {
  return request({
    url:'/doDisease/list',
    method:'get',
    params:params
  })
}
export function deleteDoDisease(id) {
  return request({
    url:'/doDisease/delete/'+id,
    method:'post'
  })
}

export function createDoDisease(data) {
  return request({
    url:'/doDisease/create',
    method:'post',
    data:data
  })
}

export function updateDoDisease(id,data) {
  return request({
    url:'/doDisease/update/'+id,
    method:'post',
    data:data
  })
}

export function getDoDisease(id) {
  return request({
    url:'/doDisease/'+id,
    method:'get',
  })
}

export function updateDeleteStatus(params) {
  return request({
    url:'/product/update/deletes',
    method:'post',
    params:params
  })
}
