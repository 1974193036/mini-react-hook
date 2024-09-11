import { isArray, isStringOrNumber, updateNode } from "./utils";
import { createFiber } from "./ReactFiber";

export function updateHostComponent(wip) {
  if (!wip.stateNode) {
    wip.stateNode = document.createElement(wip.type);
  }
  updateNode(wip.stateNode, {}, wip.props);
  reconcilerChildren(wip, wip.props.children);
}

// 函数组件
export function updateFunctionComponent(wip) {
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
  for (let i = 0; i < newChildren.length; i++) {
    const newChild = newChildren[i];
    if (newChild == null) {
      continue;
    }

    const newFiber = createFiber(newChild, wip);
    if (previousNewFiber == null) {
      wip.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}
