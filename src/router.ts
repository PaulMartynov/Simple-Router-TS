export class Router {
  private listeners: Map<Route, any> = new Map<Route, any>();

  private currentPath: string;

  private previousPath: string;

  constructor() {
    this.currentPath = window.location.pathname;
    this.previousPath = this.currentPath;
    window.addEventListener("popstate", this.handleAllListeners);
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

    const { route, onEnter, onLeave, beforeEnter } = listener;

    if (this.isMatch(route, this.currentPath) && beforeEnter) {
      await beforeEnter(args);
    }

    if (this.isMatch(route, this.currentPath) && onEnter) {
      await onEnter(args);
    }
    if (this.isMatch(route, this.previousPath) && onLeave) {
      await onLeave(args);
    }
  };

  private handleAllListeners = () =>
    this.listeners.forEach(this.handleListener);

  on = async (
    route: Route,
    onEnter: any,
    onLeave: any,
    beforeEnter: any
  ): Promise<void> => {
    const listener = { route, onEnter, onLeave, beforeEnter };
    this.listeners.set(route, listener);
    await this.handleListener(listener);
    this.listeners.delete(route);
  };

  go = (url: string, state: any): void => {
    this.previousPath = this.currentPath;
    window.history.pushState(state, url, url);
    this.currentPath = window.location.pathname;

    this.handleAllListeners();
  };
}
