import { Attribution } from "ox/erc8021";

export const BUILDER_CODE = "bc_mmzmrela";
export const EXPECTED_DATA_SUFFIX =
  "0x62635f6d6d7a6d72656c610b0080218021802180218021802180218021";

export const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: [BUILDER_CODE]
});

if (DATA_SUFFIX !== EXPECTED_DATA_SUFFIX) {
  throw new Error("Base builder code suffix mismatch. Check the configured builder code.");
}
