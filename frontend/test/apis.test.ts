import { GlobalService } from "../service/basic/global_service";
import assert from "node:assert";

describe("apis", () => {
  test("getChainStatus", async () => {
    const res = await GlobalService.getChainStatus();
    assert.equal(res.ChainId, "AELF");
  });
});
