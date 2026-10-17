import { caseStaticParams, createCasePage } from "@/components/pages/CasePage";

export const dynamicParams = false;
export function generateStaticParams() {
  return caseStaticParams();
}

const { generateMetadata, Page } = createCasePage("ar");
export { generateMetadata };
export default Page;
