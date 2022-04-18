/**
 * 路由配置
 */
import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
import setting from '@/config/setting';
import EleLayout from '@/layout';
import { menuToRoutes } from 'ele-admin-pro';
import NProgress from 'nprogress';
import { SysConfigApi } from '@/api/SysConfigApi';
import { SsoUtil } from '@/utils/sso';

// 静态路由
const routes = [
  {
    path: '/login',
    component: () => import('@/views/login/login'),
    meta: { title: '登录' }
  },
  {
    path: '/forget',
    component: () => import('@/views/login/forget'),
    meta: { title: '忘记密码' }
  },
  {
    path: '/sso',
    component: () => import('@/views/login/sso'),
    meta: { title: '单点登录' }
  },
  {
    path: '/init',
    component: () => import('@/views/init/index'),
    meta: { title: '初始化系统配置' }
  },
  {
    path: '/demo',
    component: () => import('@/views/demo/index'),
    meta: { title: '演示页面' }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/exception/404')
  }
];

const router = createRouter({
  routes,
  history: createWebHistory()
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 网站顶部小进度条开启
  NProgress.start();

  // 更新浏览器标题
  updateTitle(to);

  // 判断是否登录
  if (setting.takeToken()) {
    // 校验系统是否初始化过
    validateInitFlag(to, from, next).then(() => {
      // 加载系统菜单
      loadMenus(to, from, next);
    });
  }
  // 如果跳转的路径在白名单
  else if (setting.whiteList.includes(to.path)) {
    // 如果开启了sso，并且未携带有errorCode（单点返回来的），跳转到单点detection
    if (setting.ssoFlag && !to.query.errorCode && !to.query.token) {
      SsoUtil.redirectDetection();
    } else {
      // 未开启sso，直接放过跳转到path
      next();
    }
  }
  // 其他情况（没有登录，也没再白名单地址）
  else {
    // 如果开启了sso，跳转到sso detection地址
    if (setting.ssoFlag) {
      SsoUtil.redirectDetection();
    } else {
      // 未登录跳转登录页面
      next({ path: '/login', query: to.path === '/' ? {} : { from: to.path } });
    }
  }
});

router.afterEach(() => {
  setTimeout(() => {
    NProgress.done(true);
  }, 300);
});

export default router;

/**
 * 更新浏览器标题
 * @param route 路由
 */
function updateTitle(route) {
  if (!route.path.startsWith('/redirect/')) {
    let names = [];
    if (route && route.meta && route.meta.title) {
      names.push(route.meta.title);
    }
    const appName = process.env.VUE_APP_NAME;
    if (appName) {
      names.push(appName);
    }
    document.title = names.join(' - ');
  }
}

/**
 * 判断是否系统初始化过
 *
 * @author fengshuonan
 * @date 2021/7/9 17:04
 */
function validateInitFlag(to, from, next) {
  // store中是否装载了，初始化标识
  if (store.state.system.alreadyInitConfig === null) {
    // 判断是否系统初始化过配置
    SysConfigApi.getInitConfigFlag()
      .then(alreadyInit => {
        // 设置store中维护初始化标识
        store.dispatch('system/updateInitFlag', alreadyInit).then(() => {
          // 如果没有初始化系统配置，并且当前跳转的界面不是init界面，则跳转到init界面
          if (!alreadyInit && to.path !== '/init') {
            next({ path: '/init' });
          }
        });
      })
      .catch(() => {
        next();
      });
  }
  return Promise.resolve();
}

/**
 * 获取动态路由，加载菜单
 *
 * @author fengshuonan
 * @date 2021/7/9 16:51
 */
function loadMenus(to, from, next) {
  // 判断是否已经注册动态路由
  if (!store.state.user.menus) {
    // 获取动态路由
    store
      .dispatch('user/getMenus')
      .then(({ menus, home }) => {
        // menuToRoutes方法是把菜单数据转成路由数据格式
        router.addRoute({
          path: '/',
          component: EleLayout,
          redirect: setting.homePath || home,
          children: menuToRoutes(menus, component => import('@/views' + component))
        });
        next({ ...to, replace: true });
      })
      .catch(() => {
        next();
      });
  } else {
    next();
  }
}
