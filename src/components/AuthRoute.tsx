import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useMenuContext } from '@/contexts/menuContext';
import { Spin } from 'antd';

export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const { isLoading } = useMenuContext();
  const router = useRouter();
  const pathname = usePathname();

  if (status === 'loading' || (pathname !== '/' && isLoading)) {
    return <Spin className="flex justify-center items-center h-screen" />;
  }

  if (!session && pathname !== '/') {
    router.replace('/');
    return null;
  }

  if (session && pathname === '/') {
    router.replace('/system/user');
    return null;
  }

  return <>{children}</>;
};