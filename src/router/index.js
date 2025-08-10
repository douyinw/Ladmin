import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore, useMenuStore } from '@/store'
import NProgress from "nprogress"
import storage from '@/utils/storage'
import { appApi } from '@/api/system'

// 基础路由
const routes = [
    {
        path: '/',
        name: 'layout',
        component: () => import('@/layout/layout.vue'),
        redirect: '/dashboard',
        children: []
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login.vue')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/layout/404.vue')
    },
]

// 创建路由实例
const router = createRouter({
    history: createWebHistory(),
    routes
})


let isRoutesLoaded = false;

// 使用 Glob 模式预加载所有组件
const modules = import.meta.glob('../views/**/*.vue', { eager: true });

// 动态加载路由的函数
const loadDynamicRoutes = async () => {
    try {
        // 从API获取菜单数据
        const Menu = await appApi('system.menu').list({route: true});

        // 存储菜单数据
        useMenuStore()?.setMenus(Menu.list);
        // 预加载404组件
        const component404 = modules['../layout/404.vue']?.default;
        // 转换菜单数据为路由配置
        function convertMenuToRoute(node) {
            // 构造标准化路径
            const componentPath = `../views/${node.component || 'router'}.vue`;
            // 检查组件是否存在
            let component = modules[componentPath]?.default;
            // 如果组件不存在，使用404组件
            if (!component) {
                console.warn(`组件不存在: ${componentPath}`);
                component = component404
            }

            return {
                path: node.path ?? '',
                name: node.name ?? '',
                component: component,
                meta: { title: node.title, controller: node.controller },
                children: node.children?.map(child => convertMenuToRoute(child))
            };
        }

        // 生成动态路由配置
        const dynamicRoutes = Menu.list.map(item => convertMenuToRoute(item));
        // 添加到路由配置
        dynamicRoutes.forEach(route => router.addRoute('layout', route));
        // 添加404通配路由
        router.addRoute({ path: '/:pathMatch(.*)*', redirect: '/404' });
        isRoutesLoaded = true;
        return true
    } catch (error) {
        console.error('加载路由失败:', error);
        return false
    }
}

const getMenuPath = (value) => {
    const filter = (data, value, path = []) => {
        // 遍历所有节点
        for (let node of data ?? []) {
            // 创建当前节点的新路径
            let newPath = [...path, node];
            // 如果找到目标节点，返回路径
            if (node.key === value) {
                return newPath;
            }
            // 如果有子节点，递归查找
            if (node.children && node.children.length > 0) {
                let foundPath = filter(node.children, value, newPath);
                // 如果找到，返回路径
                if (foundPath) return foundPath;
            }
        }
        return null;
    }
    useAppStore().tags = filter(useMenuStore().menus, value);
}



router.beforeEach(async (to, from, next) => {

    NProgress.start()
    try {
        // 白名单直接放行
        if (['/login', '/404'].includes(to.path)) return next();
        // 权限验证
        const token = storage.get('userToken');
        if (!token) return next('/login');
        // 加载动态路由
        if (!isRoutesLoaded) {
            const success = await loadDynamicRoutes();
            if (success) {
                getMenuPath(to.path);
                return next({ ...to, replace: true });
            }
            return next('/404')
        }

        document.title = to.meta?.title;
        getMenuPath(to.path);

        next()
    } catch (error) {
        console.error('路由守卫异常:', error);
        return next('/404');
    } finally {
        NProgress.done()
    }
})

router.afterEach(() => {
    NProgress.done()
})

export default router