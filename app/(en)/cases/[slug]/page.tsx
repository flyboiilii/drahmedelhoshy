import { caseStaticParams, createCasePage } from "@/components/pages/CasePage";

export const dynamicParams = false;
export function generateStaticParams() {
  return caseStaticParams();
}

const { generateMetadata, Page } = createCasePage("en");
export { generateMetadata };
export default Page;
