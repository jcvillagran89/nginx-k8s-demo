import type { SectionKey } from '@/components/_test-results/sectionConfig';

export type SectionFormProps = {
  testId: number;
  sectionName: SectionKey | string;
  sectionData: Record<string, unknown>;
  readOnly?: boolean;
  washType?: string | null;
};
