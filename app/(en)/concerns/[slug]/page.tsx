import { concernStaticParams, createConcernPage } from "@/components/pages/ConcernPage";

export const dynamicParams = false;
export function generateStaticParams() {
  return concernStaticParams();
}

const { generateMetadata, Page } = createConcernPage("en");
export { generateMetadata };
export default Page;
