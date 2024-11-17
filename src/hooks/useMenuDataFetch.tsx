'use client';

import { useState, useEffect, useRef } from 'react';
import { $clientReq } from '@/utils/clientRequest';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const useMenuDataFetch = () => {
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // 初始状态设为 false
  const pathname = usePathname();
  const { data: session } = useSession();
  const mountedRef = useRef(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      // 只在已登录且非登录页面时获取菜单数据
      if (pathname === '/' || !session) return;

      try {
        setIsLoading(true);
        const data = await $clientReq.get('/menus/getMenusByUser');
        if (mountedRef.current) {
          setMenuData(prev => {
            if (JSON.stringify(prev) !== JSON.stringify(data.data)) {
              return data.data;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('获取菜单数据失败:', error);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    fetchMenuData();

    return () => {
      mountedRef.current = false;
    };
  }, [pathname, session]); // 添加 session 作为依赖

  return { menuData, isLoading };
};