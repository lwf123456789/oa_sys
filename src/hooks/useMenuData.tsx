import { useMenuContext } from '@/contexts/menuContext';
import dynamic from 'next/dynamic';
import { MenuItem } from '@/types/menu';

export const useMenuData = () => {
  const { menuData } = useMenuContext();

  const findMenuItem = (path: string): MenuItem | undefined => {
    const topLevelItem = menuData.find(item => item.path === path);
    if (topLevelItem) return topLevelItem;

    for (const item of menuData) {
      if (item.children?.length) {
        const childItem = item.children.find(child => child.path === path);
        if (childItem) return childItem;
      }
    }
    return undefined;
  };
  
  const getComponentForSlug = (slug: string, subSlug: string) => {
    const path = subSlug ? `/${slug}/${subSlug}` : `/${slug}`;
    const menuItem = findMenuItem(path);
    if (!menuItem?.component_path) return null;

    return dynamic(() => import(`@/components/${menuItem.component_path}`), {
      ssr: false
    });
  };

  return { menuData, getComponentForSlug };
};