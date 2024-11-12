'use client';

import { notFound } from 'next/navigation';
import { useMenuData } from '@/hooks/useMenuData';
import { Spin } from 'antd';

const DynamicPageContent = ({ params }: { params: { slug: string, subSlug: string } }) => {
  const { slug, subSlug } = params;
  const { menuData, getComponentForSlug } = useMenuData();

  if (!menuData || menuData.length === 0) {
    return null;
  }

  // 根据是否有 subSlug 来决定如何获取组件
  const Component = getComponentForSlug(slug, subSlug);

  if (!Component) {
    return notFound();
  }

  return (
    <div>
      <Component />
    </div>
  );
};

export default DynamicPageContent;