import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base } from "wagmi/chains";
import { baseAccount, injected } from "wagmi/connectors";
import { DATA_SUFFIX } from "@/lib/attribution";
import { SITE_META } from "@/lib/site";

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    baseAccount({
      appName: SITE_META.name,
      appLogoUrl: SITE_META.iconUrl
    })
  ],
  dataSuffix: DATA_SUFFIX,
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    [base.id]: http("https://mainnet.base.org")
  },
  ssr: true
});
