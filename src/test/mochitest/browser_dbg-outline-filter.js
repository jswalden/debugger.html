/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

function getItems(dbg) {
  return findAllElements(dbg, "outlineItems");
}

function getNthItem(dbg, index) {
  return findElement(dbg, "outlineItem", index);
}

// Tests the outline pane fuzzy filtering of outline items
add_task(async function() {
  const dbg = await initDebugger("doc-scripts.html");
  await selectSource(dbg, "long", 1);
  findElementWithSelector(dbg, ".outline-tab").click();

  // turn off alphetical sort if active
  const alphabetizeButton = findElementWithSelector(
    dbg,
    ".outline-footer button"
  );
  if (alphabetizeButton.className === "active") {
    alphabetizeButton.click();
  }

  const outlineFilter = findElementWithSelector(dbg, ".outline-filter-input");
  ok(outlineFilter, "Outline filter is present");

  outlineFilter.blur();
  ok(
    !findElementWithSelector(dbg, ".outline-filter-input.focused"),
    "does not have class focused when not focused"
  );

  outlineFilter.focus();
  ok(
    findElementWithSelector(dbg, ".outline-filter-input.focused"),
    "has class focused when focused"
  );

  is(getItems(dbg).length, 9, "9 items in the unfiltered list");

  // filter all items starting with t
  type(dbg, "t");
  is(getItems(dbg).length, 4, "4 items in the list after 't' filter");
  ok(getItems(dbg)[0].textContent.includes("TodoModel(key)"), "item TodoModel");
  ok(
    getItems(dbg)[1].textContent.includes("toggleAll(checked)"),
    "item toggleAll"
  );
  ok(
    getItems(dbg)[2].textContent.includes("toggle(todoToToggle)"),
    "item toggle"
  );
  ok(getItems(dbg)[3].textContent.includes("testModel()"), "item testModel");

  // filter using term 'tog'
  type(dbg, "og");
  is(getItems(dbg).length, 2, "2 items in the list after 'tog' filter");
  ok(
    getItems(dbg)[0].textContent.includes("toggleAll(checked)"),
    "item toggleAll"
  );
  ok(
    getItems(dbg)[1].textContent.includes("toggle(todoToToggle)"),
    "item toggle"
  );

  pressKey(dbg, "Escape");
  is(getItems(dbg).length, 9, "9 items in the list after escape pressed");

  // Ensure no action is taken when Enter key is pressed
  pressKey(dbg, "Enter");
  is(getItems(dbg).length, 9, "9 items in the list after enter pressed");

  // check that the term 'todo' includes items with todo
  type(dbg, "todo");
  is(getItems(dbg).length, 2, "2 items in the list after 'todo' filter");
  ok(getItems(dbg)[0].textContent.includes("TodoModel(key)"), "item TodoModel");
  ok(getItems(dbg)[1].textContent.includes("addTodo(title)"), "item addTodo");
});
