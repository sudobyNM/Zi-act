"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function flatArr(arr) {
  var flat = [];
  var _iterator = _createForOfIteratorHelper(arr),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;
      if (Array.isArray(item)) {
        flat = flat.concat(flatArr(item));
      } else {
        flat.push(item);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return flat;
}
function createElement(type, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }
  return {
    type: type,
    props: _objectSpread(_objectSpread({}, props), {}, {
      children: flatArr(children.map(function (child) {
        return _typeof(child) === "object" ? child : createTextElement(child);
      }))
    })
  };
}
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}
function createDom(fiber) {
  var dom = fiber.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}

// const isEvent = key => key.startsWith("on");

function isEvent(key) {
  return key.startsWith('on');
}
// const isProperty = key => key !== "children" && !isEvent(key);

function isProperty(key) {
  return key !== 'children' && !isEvent(key);
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
  Object.keys(prevProps).filter(function (key) {
    return isEvent(key);
  }).filter(function (key) {
    return !(key in nextProps) || newProp(prevProps, nextProps, key);
  }).forEach(function (name) {
    var eventType = name.toLowerCase().substring(2);
    dom.removeEventListener(eventType, prevProps[name]);
  });

  // Remove old properties
  Object.keys(prevProps).filter(function (key) {
    return isProperty(key);
  }).filter(function (key) {
    return removedProp(prevProps, nextProps, key);
  }).forEach(function (name) {
    dom[name] = "";
  });

  // Set new or changed properties
  Object.keys(nextProps).filter(function (key) {
    return isProperty(key);
  }).filter(function (key) {
    return newProp(prevProps, nextProps, key);
  }).forEach(function (name) {
    if (name === 'style' && _typeof(nextProps[name]) === 'object') {
      Object.assign(dom.style, nextProps[name]);
    } else {
      dom[name] = nextProps[name];
    }
  });

  // Add event listeners
  Object.keys(nextProps).filter(function (key) {
    return isEvent(key);
  }).filter(function (key) {
    return newProp(prevProps, nextProps, key);
  }).forEach(function (name) {
    var eventType = name.toLowerCase().substring(2);
    dom.addEventListener(eventType, nextProps[name]);
  });
}
var nextWork = null;
var currentRoot = null;
var rootToRender = null;
var deletions = null;
function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  var domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  var domParent = domParentFiber.dom;
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
      children: [element]
    },
    alternate: currentRoot
  };
  deletions = [];
  nextWork = rootToRender;
}
function workLoop(deadline) {
  var outOfTime = false;
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
  var isFunctionComponent = fiber.type instanceof Function;
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
  var nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
var wipFiber = null;
var hookIndex = null;
function updateFunctionComponent(componentNode) {
  wipFiber = componentNode;
  hookIndex = 0;
  wipFiber.hooks = [];
  var children = [componentNode.type(componentNode.props)];
  updateChildNodes(componentNode, children);
}
function useState(initial) {
  var oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex];
  var hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };
  var actions = oldHook ? oldHook.queue : [];
  actions.forEach(function (action) {
    hook.state = action(hook.state);
  });
  var setState = function setState(action) {
    hook.queue.push(typeof action === 'function' ? action : function () {
      return action;
    });
    rootToRender = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
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
  var childIndex = 0; // Start at the first child
  var oldChild = parentNode.alternate && parentNode.alternate.child; // Old first child
  var previousNewSibling = null; // To link new siblings

  // Keep going while there are new elements or old children to process
  while (childIndex < newElements.length || oldChild != null) {
    var newElement = newElements[childIndex];
    var newChildNode = null;

    // Check if the old child and new element are the same type
    var isSameType = oldChild && newElement && oldChild.type === newElement.type;
    if (isSameType) {
      // If same type, update the existing node
      newChildNode = {
        type: oldChild.type,
        props: newElement.props,
        dom: oldChild.dom,
        parent: parentNode,
        alternate: oldChild,
        effectTag: "UPDATE"
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
        effectTag: "PLACEMENT"
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
var Ract = {
  createElement: createElement,
  render: render,
  useState: useState
};
var posts = ['post1', 'p2', 'p4'];

/** @jsx Ract.createElement */

function ThemeApp() {
  var _Ract$useState = Ract.useState(localStorage.getItem('themes') || 'light'),
    _Ract$useState2 = _slicedToArray(_Ract$useState, 2),
    theme = _Ract$useState2[0],
    setTheme = _Ract$useState2[1];
  var themes = {
    light: {
      background: "#fff",
      color: "#222",
      boxShadow: 'none',
      transition: "all 0.3s"
    },
    dark: {
      background: "#222",
      color: "#fff",
      boxShadow: 'none',
      transition: "all 0.3s"
    },
    solarized: {
      background: "#f2ead3",
      color: "#4b595e",
      boxShadow: 'none',
      transition: "all 0.3s"
    },
    catpuccin: {
      background: "#1e1e2e",
      // Mocha base
      color: "#cba6f7",
      boxShadow: "0 2px 16px 0 #a6adc8",
      borderRadius: "16px",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      transition: "all 0.3s"
    }
  };
  var themesName = Object.keys(themes);
  function toggleTheme() {
    var index = themesName.indexOf(theme);
    var nextIndex = (index + 1) % themesName.length;
    var nextTheme = themesName[nextIndex];
    setTheme(nextTheme);
    localStorage.setItem('themes', nextTheme);

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
  return Ract.createElement("div", {
    style: _objectSpread({
      minHeight: "100vh"
    }, themes[theme])
  }, Ract.createElement("button", {
    style: _objectSpread(_objectSpread({
      marginTop: '10rem',
      padding: "1rem 2rem",
      fontSize: "1.8rem",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer"
    }, themes[theme]), {}, {
      transition: "all 0.3s"
    }),
    onClick: toggleTheme
  }, "Switch ", theme, " Mode"), Ract.createElement("p", {
    style: {
      fontSize: '2rem',
      marginTop: '2rem'
    }
  }, "This UI changes theme using custom React framework!"));
}
var element = Ract.createElement(ThemeApp, null);
var container = document.getElementById("root");
Ract.render(element, container);
