import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { base } from "wagmi/chains";
import { coinbaseWallet, injected } from "@wagmi/connectors";
import { DATA_SUFFIX } from "@/lib/attribution";

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({
      appName: "BaseQuest"
    })
  ],
  dataSuffix: DATA_SUFFIX,
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    [base.id]: http("https://mainnet.base.org")
  },
  ssr: true
});
