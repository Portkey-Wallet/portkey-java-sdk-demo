import { GlobalService } from "../service/basic/global_service";
import assert from "node:assert";

GlobalService.init(true);

describe("apis", () => {
  test("getChainStatus", async () => {
    const res = await GlobalService.getInstance().getChainStatus();
    expect(res.ChainId).toBe("AELF");
  });
});
