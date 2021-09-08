import { Router, HistoryRouter, HashRouter } from "./router";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const onEnterFn = jest.fn();
const onLeaveFn = jest.fn();
const BeforeEnterFn = jest.fn();
async function insertString(args: State) {
  (
    document.querySelector("#testData") as HTMLElement
  ).innerHTML = `${args.currentPath} linked`;
}
async function onEnterRegexp() {
  (document.querySelector("#testData") as HTMLElement).innerHTML =
    "links by regexp is linked";
}

describe("testing Router class", () => {
  test("it is a function", () => {
    expect(Router).toBeInstanceOf(Function);
    expect(new HistoryRouter()).toBeInstanceOf(Router);
    expect(new HashRouter()).toBeInstanceOf(Router);
  });
});

describe("testing historyRouter", () => {
  let historyRouter: Router;
  let links: HTMLLinkElement[];
  beforeEach(async () => {
    document.body.innerHTML = `
        <a href="/test1"></a>
        <a href="/test$link1"></a>
        <a href="/test$link2"></a>
        <a href="/link?arg1=a&arg2=2a&arg3=3a"></a>
        <article id="testData"></article>
    `;

    window.history.pushState({}, "", "/");
    historyRouter = new HistoryRouter();
    jest.spyOn(historyRouter, "go");
    // @ts-ignore
    links = document.querySelectorAll("a");
  });
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("on is a functions", async () => {
    expect(historyRouter.on).toBeInstanceOf(Function);
  });
  test("go is a functions", () => {
    expect(new HistoryRouter().go).toBeInstanceOf(Function);
  });
  test("on", async () => {
    await historyRouter.on("/test1", {
      onEnter: [onEnterFn, insertString],
      onLeave: [onLeaveFn],
      beforeEnter: [BeforeEnterFn],
    });

    await historyRouter.on(new RegExp("/test[$link]"), {
      onEnter: [onEnterRegexp],
    });

    await historyRouter.on(
      (path: string): boolean => path.includes("arg2=2a"),
      {
        onEnter: [onEnterFn],
      }
    );

    links[0].click();
    await sleep(10);
    expect(BeforeEnterFn).toHaveBeenCalled();
    expect(window.location.pathname).toBe("/test1");
    expect((document.querySelector("#testData") as HTMLElement).innerHTML).toBe(
      "/test1 linked"
    );
    expect(onLeaveFn).not.toHaveBeenCalled();
    expect(onEnterFn).toHaveBeenCalled();

    links[1].click();
    await sleep(10);
    expect(window.location.pathname).toBe("/test$link1");
    expect(BeforeEnterFn).toBeCalledTimes(1);
    expect((document.querySelector("#testData") as HTMLElement).innerHTML).toBe(
      "links by regexp is linked"
    );

    links[3].click();
    await sleep(10);
    expect(window.location.pathname).toBe("/link");
    expect(onEnterFn).toBeCalledTimes(2);

    expect(historyRouter.go).toBeCalledTimes(3);
  });

  test("deleting route", async () => {
    const hook = jest.fn();
    const deleteRoute = await historyRouter.on("/test1", {
      onEnter: [hook],
    });
    links[0].click();
    await sleep(10);
    expect(hook).toBeCalledTimes(1);

    await deleteRoute();
    links[0].click();
    await sleep(10);
    expect(hook).toBeCalledTimes(1);
  });
});
