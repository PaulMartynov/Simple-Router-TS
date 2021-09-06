type functionPath = (path: string) => boolean;
type Route = string | RegExp | functionPath;

interface Listener {
  route: Route;
  onEnter?: any;
  onLeave?: any;
  beforeEnter?: any;
}
