import { MenuProvider } from '@/contexts/menuContext';
import DynamicPageContent from '../[slug]/[subSlug]/DynamicPageContent';

// 确保组件是一个有效的 React 函数组件
const SingleLevelPage = ({ params }: { params: { slug: string } }) => {
  return (
    <MenuProvider>
      <DynamicPageContent params={{ slug: params.slug, subSlug: '' }} />
    </MenuProvider>
  );
};

// 确保使用 export default
export default SingleLevelPage;