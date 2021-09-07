type functionPath = (path: string) => boolean;
type Route = string | RegExp | functionPath;

interface Hooks {
  onEnter?: any;
  onLeave?: any;
  beforeEnter?: any;
}

interface Listener {
  route: Route;
  hooks: Hooks;
}
