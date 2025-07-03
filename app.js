function flatArr(arr) {
  let flat = [];
  for (let item of arr) {
    if (Array.isArray(item)) {
      flat = flat.concat(flatArr(item));
    } else {
      flat.push(item);
    }
  }
  return flat;
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: flatArr(
        children.map((child) =>
          typeof child === "object" ? child : createTextElement(child)
        )
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

// const isEvent = key => key.startsWith("on");

function isEvent(key) {
  return key.startsWith("on");
}
// const isProperty = key => key !== "children" && !isEvent(key);

function isProperty(key) {
  return key !== "children" && !isEvent(key);
}
// const newProp = (prev, next) => key => prev[key] !== next[key];

function newProp(prev, next, key) {
  return prev[key] !== next[key];
}
// const isGone = (prev, next) => key => !(key in next);
function removedProp(prev, next, key) {
  return !(key in next);
}

function updateDom(dom, prevProps, nextProps) {
  //Remove old or changed event listeners
  Object.keys(prevProps)
    .filter((key) => isEvent(key))
    .filter((key) => !(key in nextProps) || newProp(prevProps, nextProps, key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // Remove old properties
  Object.keys(prevProps)
    .filter((key) => isProperty(key))
    .filter((key) => removedProp(prevProps, nextProps, key))
    .forEach((name) => {
      dom[name] = "";
    });

  // Set new or changed properties
  Object.keys(nextProps)
    .filter((key) => isProperty(key))
    .filter((key) => newProp(prevProps, nextProps, key))
    .forEach((name) => {
      if (name === "style" && typeof nextProps[name] === "object") {
        Object.assign(dom.style, nextProps[name]);
      } else {
        dom[name] = nextProps[name];
      }
    });

  // Add event listeners
  Object.keys(nextProps)
    .filter((key) => isEvent(key))
    .filter((key) => newProp(prevProps, nextProps, key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

let nextWork = null;
let currentRoot = null;
let rootToRender = null;
let deletions = null;

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function render(element, container) {
  rootToRender = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextWork = rootToRender;
}

function workLoop(deadline) {
  let outOfTime = false;
  while (nextWork && !outOfTime) {
    nextWork = performUnitOfWork(nextWork);
    outOfTime = deadline.timeRemaining() < 1;
  }

  if (!nextWork && rootToRender) {
    deletions.forEach(commitWork);
    commitWork(rootToRender.child);
    currentRoot = rootToRender;
    rootToRender = null;
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    if (!fiber.dom) {
      fiber.dom = createDom(fiber);
    }
    updateChildNodes(fiber, fiber.props.children);
  }
  if (fiber.child) {
    return fiber.child;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

let wipFiber = null;
let hookIndex = null;

function updateFunctionComponent(componentNode) {
  wipFiber = componentNode;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [componentNode.type(componentNode.props)];
  updateChildNodes(componentNode, children);
}

function useState(initial) {
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(typeof action === "function" ? action : () => action);
    rootToRender = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextWork = rootToRender;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

// updates the child nodes for a parent node
function updateChildNodes(parentNode, newElements) {
  let childIndex = 0; // Start at the first child
  let oldChild = parentNode.alternate && parentNode.alternate.child; // Old first child
  let previousNewSibling = null; // To link new siblings

  // Keep going while there are new elements or old children to process
  while (childIndex < newElements.length || oldChild != null) {
    let newElement = newElements[childIndex];
    let newChildNode = null;

    // Check if the old child and new element are the same type
    let isSameType =
      oldChild && newElement && oldChild.type === newElement.type;

    if (isSameType) {
      // If same type, update the existing node
      newChildNode = {
        type: oldChild.type,
        props: newElement.props,
        dom: oldChild.dom,
        parent: parentNode,
        alternate: oldChild,
        effectTag: "UPDATE",
      };
    }

    if (newElement && !isSameType) {
      // If new element and different type, add a new node
      newChildNode = {
        type: newElement.type,
        props: newElement.props,
        dom: null,
        parent: parentNode,
        alternate: null,
        effectTag: "PLACEMENT",
      };
    }

    if (oldChild && !isSameType) {
      // If old child and different type, delete
      oldChild.effectTag = "DELETION";
      deletions.push(oldChild);
    }

    // Move to the next old child
    if (oldChild) {
      oldChild = oldChild.sibling;
    }

    // Attach the new child node to the parent or as a sibling
    if (childIndex === 0) {
      parentNode.child = newChildNode;
    } else if (newElement) {
      previousNewSibling.sibling = newChildNode;
    }

    // Remember this new child as the previous sibling for the next loop
    previousNewSibling = newChildNode;
    childIndex++;
  }
}

const Ract = {
  createElement,
  render,
  useState,
};

const posts = ["post1", "p2", "p4"];

/** @jsx Ract.createElement */

function ThemeApp() {
  const [theme, setTheme] = Ract.useState(
    localStorage.getItem("themes") || "light"
  );

  const themes = {
    light: {
      background: "#fff",
      color: "#222",

      transition: "all 0.3s",
    },
    dark: {
      background: "#222",
      color: "#fff",

      transition: "all 0.3s",
    },
    solarized: {
      background: "#f2ead3",
      color: "#4b595e",

      transition: "all 0.3s",
    },
    catpuccin: {
      background: "#1e1e2e", // Mocha base
      color: "#cba6f7",
      borderRadius: "16px",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      transition: "all 0.3s",
    },
  };

  let themesName = Object.keys(themes);
  function toggleTheme() {
    let index = themesName.indexOf(theme);

    let nextIndex = (index + 1) % themesName.length;
    let nextTheme = themesName[nextIndex];
    setTheme(nextTheme);
    localStorage.setItem("themes", nextTheme);

    //  let savedTheme
    //  if(theme === 'light'){
    //   savedTheme = 'dark'
    //  }
    //  else if (theme === 'dark'){
    //   savedTheme = 'solarized'
    //  }
    //  else {
    //   savedTheme = 'light'
    //  }
    //  setTheme(savedTheme)
    //  localStorage.setItem('theme', savedTheme)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        ...themes[theme],
      }}
    >
      <button
        style={{
          marginTop: "10rem",
          padding: "1rem 2rem",
          fontSize: "1.8rem",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          ...themes[theme],
          transition: "all 0.3s",
        }}
        onClick={toggleTheme}
      >
        Switch {theme} Mode
      </button>
      <p style={{ fontSize: "2rem", marginTop: "2rem" }}>
        This UI changes theme using custom React framework!
      </p>
    </div>
  );
}

const element = <ThemeApp />;

const container = document.getElementById("root");
Ract.render(element, container);
