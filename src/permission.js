import router from '@/router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import { buildMenus } from '@/api/menu'
import { filterAsyncRouter } from '@/store/modules/menupermission'

let a = 1

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      // 动态路由，拉取菜单
      if(a==1){
        a=2;
        
      }
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          console.log("已进入获取用户信息接口")
          loadMenus(next, to);
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch('updateLoadMenus').then(res => {})
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

let param = [{
  "path": "/do",
  "component": "Layout",
  "redirect": "do/departmentCate",
  "name": "do",
  "meta": {"title": "在线医生", "icon": "order"},
  "children": [
    {
      "path": "departmentCate",
      "name": "departmentCate",
      "component":"do/departmentCate/index",
      "meta": {"title": "科室列表", "icon": "product-list"}
    },
    {
      "path": "addDepartmentCate",
      "name": "addDepartmentCate",
      "component":"do/departmentCate/add",
      "meta": {"title": "添加科室分类"},
      "hidden": true
    },
    {
      "path": "updateDepartmentCate",
      "name": "updateDepartmentCate",
      "component":"do/DepartmentCate/update",
      "meta": {"title": "修改科室分类"},
      "hidden": true
    }
 ]
}
]

export const loadMenus = (next, to) => {
  buildMenus().then(res => {
    const asyncRouter = filterAsyncRouter(param);
    //asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
      console.log(asyncRouter);
      console.log(router.options.routes);
      router.options.routes.push(asyncRouter[0]);
      console.log(router.options.routes);
      router.addRoutes(asyncRouter) // 动态添加可访问路由表
      global.antRouter = asyncRouter
      console.log(router);
      next({ ...to, replace: true })
    })
  })
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
