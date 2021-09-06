import { Router } from "./router";

describe("testing Router class", () => {
  test("it is a function", () => {
    expect(Router).toBeInstanceOf(Function);
    expect(new Router()).toBeInstanceOf(Router);
  });
});
