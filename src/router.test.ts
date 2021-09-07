import { Router } from "./router";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("testing Router class", () => {
  test("it is a function", () => {
    expect(Router).toBeInstanceOf(Function);
    expect(new Router()).toBeInstanceOf(Router);
  });
});

describe("testing router public functions", () => {
  let router: Router;
  beforeEach(() => {
    router = new Router();
  });
  test("it is a functions", () => {
    expect(router.on).toBeInstanceOf(Function);
    expect(router.go).toBeInstanceOf(Function);
  });
});
