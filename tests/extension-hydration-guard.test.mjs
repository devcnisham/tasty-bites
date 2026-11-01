import assert from "node:assert/strict";
import { test } from "node:test";
import { JSDOM } from "jsdom";
import { createElement, act } from "react";
import { renderToString } from "react-dom/server";
import { extensionHydrationGuard } from "../lib/extension-hydration-guard.mjs";

const tick = (window) =>
  new Promise((resolve) => window.setTimeout(resolve, 0));
function setup(html) {
  return new JSDOM(html, {
    runScripts: "outside-only",
    url: "http://localhost/",
  });
}

test("removes the extension marker without changing controls, values or other attributes", () => {
  const dom = setup(
    '<button id="offer" fdprocessedid="extension" aria-label="Next offer" data-keep="yes">Next</button><input id="email" fdprocessedid="field" value="baker@example.com"><div id="other" fdprocessedid="not-a-control"></div>',
  );
  const { document } = dom.window;
  const button = document.getElementById("offer");
  let clicks = 0;
  button.addEventListener("click", () => clicks++);
  dom.window.eval(extensionHydrationGuard);
  assert.equal(button.hasAttribute("fdprocessedid"), false);
  assert.equal(
    document.getElementById("email").hasAttribute("fdprocessedid"),
    false,
  );
  assert.equal(button.getAttribute("aria-label"), "Next offer");
  assert.equal(button.dataset.keep, "yes");
  assert.equal(document.getElementById("email").value, "baker@example.com");
  assert.equal(
    document.getElementById("other").getAttribute("fdprocessedid"),
    "not-a-control",
  );
  button.click();
  assert.equal(clicks, 1);
  dom.window.close();
});

test("handles markers inserted during HTML streaming and stops after hydration", async () => {
  const dom = setup('<main id="page"></main>');
  const { document } = dom.window;
  dom.window.eval(extensionHydrationGuard);
  const section = document.createElement("section");
  section.innerHTML =
    '<button fdprocessedid="streamed">Next</button><textarea fdprocessedid="notes"></textarea>';
  document.getElementById("page").append(section);
  await tick(dom.window);
  assert.equal(section.querySelectorAll("[fdprocessedid]").length, 0);
  const button = section.querySelector("button");
  button.setAttribute("fdprocessedid", "injected-again");
  await tick(dom.window);
  assert.equal(button.hasAttribute("fdprocessedid"), false);
  dom.window.dispatchEvent(new dom.window.Event("tb:hydrated"));
  button.setAttribute("fdprocessedid", "after-hydration");
  await tick(dom.window);
  assert.equal(button.getAttribute("fdprocessedid"), "after-hydration");
  dom.window.close();
});

test("React hydrates the server markup without an extension-attribute warning", async () => {
  const tree = createElement(
    "button",
    { "aria-label": "Next class or offer" },
    "Next",
  );
  const dom = setup(`<div id="root">${renderToString(tree)}</div>`);
  const oldWindow = globalThis.window,
    oldDocument = globalThis.document;
  const oldAct = globalThis.IS_REACT_ACT_ENVIRONMENT;
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const errors = [];
  const oldError = console.error;
  console.error = (...args) => errors.push(args.map(String).join(" "));
  let root;
  try {
    dom.window.document
      .querySelector("button")
      .setAttribute("fdprocessedid", "extension-before-react");
    dom.window.eval(extensionHydrationGuard);
    const { hydrateRoot } = await import("react-dom/client");
    await act(async () => {
      root = hydrateRoot(dom.window.document.getElementById("root"), tree);
    });
    assert.equal(
      errors.some((message) => /hydrat|didn.t match/i.test(message)),
      false,
      errors.join("\n"),
    );
    assert.equal(
      dom.window.document.querySelector("button").textContent,
      "Next",
    );
  } finally {
    if (root) await act(async () => root.unmount());
    console.error = oldError;
    globalThis.window = oldWindow;
    globalThis.document = oldDocument;
    globalThis.IS_REACT_ACT_ENVIRONMENT = oldAct;
    dom.window.close();
  }
});
