import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";


/* const [diagnostics, js] = await Deno.bundle("./src/client.ts", undefined, {
  lib: ["dom", "dom.iterable", "es2018"],
  experimentalDecorators: true
}); // more lib options: https://www.typescriptlang.org/docs/handbook/compiler-options.html
 */

const { files, diagnostics } = await Deno.emit("./src/client.ts", {
  bundle: "esm",
});
const js = files["deno:///bundle.js"]

if (diagnostics.length) {
  // there is something that impacted the emit
  console.warn(Deno.formatDiagnostics(diagnostics));
}


const port = 8001;
const app = new Application();

app.use(async (ctx, next) => {
  console.log(`HTTP ${ctx.request.method} on ${ctx.request.url}`);
  await next();
});


const router = new Router();


router
  .get("/", async (ctx) => {
    const path = await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}`,
      index: `./static/index.html`
    });
  })
  .get("/client.js", (ctx) => {
    ctx.response.body = js;
    ctx.response.type = "application/javascript";
  })
  .get("/static/:filename", async (ctx) => {
    const path = await send(ctx, ctx.request.url.pathname, {
      root: `${Deno.cwd()}` // dont add the 'static' subdir here, because it is already part of the ctx pathname
    });
  });

  app.use(router.routes());

  app.addEventListener("listen", () => {
    console.log(`Listening on localhost:${port}`);
  });
  
  await app.listen({ port });

  