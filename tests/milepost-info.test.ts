import { getRouteList } from "../src/routeList";
import { describe, it, expect } from "bun:test";

// create test suite to test getRouteList function
describe("getRouteList", () => {
  it("should return a list of routes", async () => {
    const routes = await getRouteList();
    expect(routes.length).toBeGreaterThan(0);
    for (const { RouteID, Direction, MinSrmp, MaxSrmp } of routes) {
      [RouteID, Direction].forEach((x) => {
        expect(x).toBeTypeOf("string");
      });
      // expect(RouteID).length.to.be.at.least(3);
      // expect(RouteID).length.to.not.be.greaterThan(12);
      // expect(Direction).length.to.be.at.least(1);
      expect(RouteID.length).toBeGreaterThanOrEqual(3);
      expect(RouteID.length).toBeLessThanOrEqual(12);
      expect(Direction.length).toBeGreaterThanOrEqual(1);
      [MinSrmp, MaxSrmp].forEach((x) => {
        // expect(x).to.be.a("number");
        // expect(x).to.be.at.least(0);
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeTypeOf("number");
      });
    }
  });
});
