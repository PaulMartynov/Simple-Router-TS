import { Router } from "./router";

(async function () {
  /* Debug */
  window.addEventListener("load", () =>
    console.log(`PAGE FULLY RELOADED ${Date.now()}`)
  );

  const render = (content: any): void => {
    // @ts-ignore
    document.getElementById(
      "root"
    ).innerHTML = `<h2>${content.currentPath}</h2>`;
  };

  const leaving = (content: any): void => {
    // @ts-ignore
    document.getElementById(
      "root"
    ).innerHTML = `<h2>[Leaving] ${content.previousPath}</h2>`;
  };

  const log = (content: any): void => {
    console.log("This is:", content.currentPath);
  };

  const router = new Router();

  await router.on(/.*/, { onEnter: render });
  await router.on(
    (path) => path === "/contacts",
    { onEnter: render, onLeave: leaving, beforeEnter: log } // onEnter
  );
  await router.on("/about", { onEnter: render });
  // await router.on("/about", { onEnter: log });
  await router.on("/about/us", { onEnter: render });
})();
