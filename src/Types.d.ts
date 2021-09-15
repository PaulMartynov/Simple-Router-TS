type State = {
  [key: string]: string;
};
type pathFunction = (path: string) => boolean;
type hookFunction = (state: State) => Promise<void>;
type Route = string | RegExp | pathFunction;

interface Hooks {
  onEnter?: hookFunction[];
  onLeave?: hookFunction[];
  beforeEnter?: hookFunction[];
}

interface Listener {
  route: Route;
  hooks: Hooks;
}
