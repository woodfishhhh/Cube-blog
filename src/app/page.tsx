import { MobileHome } from "@/components/home/MobileHome";
import { HomeExperience } from "@/components/home/HomeExperience";
import { headers } from "next/headers";
import { getHomeData } from "@/lib/content/home-data";

function isMobileHomeRequest(headerList: Headers) {
  if (headerList.get("sec-ch-ua-mobile") === "?1") {
    return true;
  }

  const userAgent = headerList.get("user-agent") ?? "";

  return /Android|iPhone|iPad|iPod|Mobile|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
}

export default async function HomePage() {
  const [data, headerList] = await Promise.all([getHomeData(), headers()]);

  if (isMobileHomeRequest(headerList)) {
    return <MobileHome data={data} />;
  }

  return <HomeExperience data={data} />;
}
