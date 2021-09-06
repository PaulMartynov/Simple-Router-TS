export class Router {
  private listeners = [];

  private currentPath: string;

  private previousPath: string | null;

  constructor() {
    this.currentPath = window.location.pathname;
    this.previousPath = this.currentPath;
  }

  private isMatch = (match: Route, path: string) =>
    (match instanceof RegExp && match.test(path)) ||
    (typeof match === "function" && match(path)) ||
    (typeof match === "string" && match === path);
}
