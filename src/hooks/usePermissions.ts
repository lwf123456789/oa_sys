import { useMenuContext } from '@/contexts/menuContext';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export const usePermissions = () => {
  const { menuData } = useMenuContext();
  const pathname = usePathname();

  // 构建权限映射
  const permissionsMap = useMemo(() => {
    const map = new Map<string, string[]>();
    
    const processMenuItem = (item: any) => {
      if (item.path && item.permissions) {
        try {
          const perms = typeof item.permissions === 'string' 
            ? JSON.parse(item.permissions) 
            : item.permissions;
          map.set(item.path, perms);
        } catch (e) {
          console.error('解析权限数据失败:', e);
          map.set(item.path, []);
        }
      }
      
      if (item.children?.length) {
        item.children.forEach(processMenuItem);
      }
    };

    menuData.forEach(processMenuItem);
    return map;
  }, [menuData]);

  // 获取当前路径的权限
  const permissions = useMemo(() => {
    return permissionsMap.get(pathname) || [];
  }, [permissionsMap, pathname]);

  // 检查是否有特定权限
  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  return {
    permissions,
    hasPermission
  };
};