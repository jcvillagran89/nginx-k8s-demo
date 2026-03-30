import { useLayoutContext } from '@/context/useLayoutContext';
import HorizontalLayout from '@/layouts/HorizontalLayout';
import VerticalLayout from '@/layouts/VerticalLayout';
import { ChildrenType } from '@/types/component-props';
import GlobalAlert from '@/components/_general/GlobalAlert';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toggleDocumentAttribute } from '@/utils/layout';

const TEXTILE_LAB_ROOTS = new Set([
  'admin',
  'committee',
  'providers',
  'reports',
  'supervision',
  'test',
  'tests',
  'test-results',
]);

const MainLayout = ({ children }: ChildrenType) => {
  const { layoutOrientation } = useLayoutContext();
  const { component } = usePage();

  useEffect(() => {
    const root = component.split('/')[0];
    const isTextileLab = TEXTILE_LAB_ROOTS.has(root);

    if (isTextileLab) {
      toggleDocumentAttribute('data-textile-lab', 'true');
    } else {
      toggleDocumentAttribute('data-textile-lab', 'true', true);
    }

    return () => {
      toggleDocumentAttribute('data-textile-lab', 'true', true);
    };
  }, [component]);

  return (
    <>  
      <GlobalAlert />
      {layoutOrientation === 'vertical' && <VerticalLayout>{children}</VerticalLayout>}
      {layoutOrientation === 'horizontal' && <HorizontalLayout>{children}</HorizontalLayout>}
    </>
  );
};

export default MainLayout;
