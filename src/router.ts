export class Router {
  private listeners: Map<Route, Listener> = new Map<Route, Listener>();

  private currentPath: string;

  private previousPath: string;

  constructor() {
    this.currentPath = window.location.pathname + window.location.search;
    this.previousPath = this.currentPath;
    window.addEventListener("popstate", this.handleAllListeners);
    document.body.addEventListener("click", (event: Event) => {
      event.preventDefault();
      const url = (event.target as HTMLLinkElement).getAttribute("href") ?? "";
      window.history.pushState({}, "", url);
      this.go(url);
    });
  }

  private isMatch = (match: Route, path: string) =>
    (match instanceof RegExp && match.test(path)) ||
    (typeof match === "function" && match(path)) ||
    (typeof match === "string" && match === path);

  private handleListener = async (listener: Listener) => {
    const args = {
      currentPath: this.currentPath,
      previousPath: this.previousPath,
      state: window.history.state,
    };

    const { route, hooks } = listener;

    if (this.isMatch(route, this.currentPath) && hooks.beforeEnter) {
      await hooks.beforeEnter(args);
    }

    if (this.isMatch(route, this.currentPath) && hooks.onEnter) {
      await hooks.onEnter(args);
    }
    if (this.isMatch(route, this.previousPath) && hooks.onLeave) {
      await hooks.onLeave(args);
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

  go = (url: string, state = {}): void => {
    this.previousPath = this.currentPath;
    this.currentPath = window.location.pathname + window.location.search;
    window.history.pushState(state, url, url);

    this.handleAllListeners();
  };
}
