import { isArray, isStringOrNumber, Update, updateNode } from "./utils";
import { createFiber } from "./ReactFiber";
import { renderWithHooks } from "./hooks";

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
  }
  updateNode(wip.stateNode, {}, wip.props);
  reconcilerChildren(wip, wip.props.children);
}

// 函数组件
export function updateFunctionComponent(wip) {
  renderWithHooks(wip);

  const { type, props } = wip;
  const children = type(props);

  reconcilerChildren(wip, children);
}

// 初次渲染
// 协调 伪diff
// old abc
// new bc
function reconcilerChildren(wip, children) {
  if (isStringOrNumber(children)) {
    return;
  }
  const newChildren = isArray(children) ? children : [children];

  let previousNewFiber = null;
  let oldFiber = wip.alternate?.child;
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild == null) {
      continue;
    }

    const newFiber = createFiber(newChild, wip);
    const same = sameNode(newFiber, oldFiber);

    if (same) {
      // 复用 old fiber
      Object.assign(newFiber, {
        stateNode: oldFiber.stateNode,
        alternate: oldFiber,
        flags: Update,
      });
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (previousNewFiber == null) {
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}

// 同级，同类型，同key
function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}
