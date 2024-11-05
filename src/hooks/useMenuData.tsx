'use client';

import { useMenuContext } from '@/contexts/menuContext';
import dynamic from 'next/dynamic';
import { MenuItem } from '@/types/menu';

export const useMenuData = () => {
  const { menuData } = useMenuContext();

  const findMenuItem = (path: string): MenuItem | undefined => {
    // 先处理顶级菜单
    const topLevelItem = menuData.find(item => item.path === path);
    if (topLevelItem) {
      return topLevelItem;
    }

    // 如果不是顶级菜单，则在所有子菜单中查找
    for (const item of menuData) {
      if (item.children?.length) {
        const childItem = item.children.find(child => child.path === path);
        if (childItem) {
          return childItem;
        }
      } else {
        // 没有children属性但路径匹配的情况（比如表单设计器）
        if (item.path === path) {
          return item;
        }
      }
    }

    return undefined;
  };
  
  const getComponentForSlug = (slug: string, subSlug: string) => {
    const path = subSlug ? `/${slug}/${subSlug}` : `/${slug}`;
    const menuItem = findMenuItem(path);
    if (!menuItem || !menuItem.component_path) return null;

    return dynamic(() => import(`@/components/${menuItem.component_path}`).then(mod => mod.default), {
      ssr: false // 禁用服务器端渲染
    });
  };

  return { menuData, getComponentForSlug };
};