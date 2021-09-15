// eslint-disable-next-line max-classes-per-file
export abstract class Router {
  private listeners: Map<Route, Listener> = new Map<Route, Listener>();

  private currentPath: string;

  private previousPath: string;

  constructor() {
    this.currentPath = this.getPath();
    this.previousPath = this.currentPath;
    document.body.addEventListener("click", (event: Event) => {
      event.preventDefault();
      const url = (event.target as HTMLLinkElement).getAttribute("href") ?? "";
      window.history.pushState(
        { currentPath: url, previousPath: this.currentPath },
        "",
        url
      );
      this.go();
    });
  }

  getPath = (): string => "";

  private isMatch = (match: Route, path: string) =>
    (match instanceof RegExp && match.test(path)) ||
    (typeof match === "function" && match(path)) ||
    (typeof match === "string" && match === path);

  private callHooks = async (hooks: hookFunction[], state: State) => {
    hooks.forEach((hook) => {
      hook(state);
    });
  };

  private handleListener = async (listener: Listener) => {
    const args = {
      currentPath: this.currentPath,
      previousPath: this.previousPath,
      state: window.history.state,
    };

    const { route, hooks } = listener;

    if (this.isMatch(route, this.currentPath) && hooks.beforeEnter) {
      await this.callHooks(hooks.beforeEnter, args);
    }

    if (this.isMatch(route, this.currentPath) && hooks.onEnter) {
      await this.callHooks(hooks.onEnter, args);
    }
    if (this.isMatch(route, this.previousPath) && hooks.onLeave) {
      await this.callHooks(hooks.onLeave, args);
    }
  };

  private handleAllListeners = () =>
    this.listeners.forEach(this.handleListener);

  on = async (route: Route, hooks: Hooks): Promise<() => void> => {
    const listener = { route, hooks };
    this.listeners.set(route, listener);
    await this.handleListener(listener);
    return () => {
      this.listeners.delete(route);
    };
  };

  go = (): void => {
    this.previousPath = this.currentPath;
    this.currentPath = this.getPath();

    this.handleAllListeners();
  };
}

export class HashRouter extends Router {
  constructor() {
    super();
    window.addEventListener("hashchange", this.go);
  }

  getPath = (): string => {
    return window.location.hash.slice(1);
  };
}

export class HistoryRouter extends Router {
  constructor() {
    super();
    window.addEventListener("popstate", this.go);
  }

  getPath = (): string => {
    return window.location.pathname + window.location.search;
  };
}
