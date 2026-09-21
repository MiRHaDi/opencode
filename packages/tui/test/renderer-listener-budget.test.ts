import { expect, test } from "bun:test"
import { createAppFixture } from "./fixture/app"

test("local app stays within the renderer listener budget", async () => {
  await using app = await createAppFixture({
    channel: "local",
    fetch: (url) =>
      url.pathname === "/api/info"
        ? Response.json({ version: "test", pid: 0, urls: ["http://test"], paths: { tmp: "/tmp" } })
        : undefined,
  })
  await app.ready
  await Bun.sleep(100)

  expect(app.renderer.listenerCount("resize")).toBeLessThanOrEqual(app.renderer.getMaxListeners())
})
