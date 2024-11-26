'use client';

import React, { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';
import { $clientReq } from '@/utils/clientRequest';
import { MenuItem } from '@/types/menu';
import useSWR from 'swr';

interface MenuContextType {
  menuData: MenuItem[];
  isLoading: boolean;
  error: any;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

const fetchMenuData = async () => {
  const response = await $clientReq.get('/menus/getMenusByUser');
  return response.data;
};

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();

  const { data: menuData, error, isLoading } = useSWR(
    session ? 'menuData' : null,
    fetchMenuData,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      refreshInterval: 1000 * 60 * 5
    }
  );

  return (
    <MenuContext.Provider value={{
      menuData: menuData || [],
      isLoading,
      error
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenuContext must be used within a MenuProvider');
  }
  return context;
};