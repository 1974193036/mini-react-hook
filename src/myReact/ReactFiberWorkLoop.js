import {
  updateFunctionComponent,
  updateHostComponent,
} from "./ReactFiberReconciler";
import { FunctionComponent, HostComponent } from "./ReactWorkTags";

// wip: work in progress 当前正在工作中的
let wip = null;

export function scheduleUpdateOnFiber(fiber) {
  wip = fiber;
}

// 1. 处理wip
// 2. 更新wip
// 这个函数会在空闲时间一直执行，不在空闲时间则中断执行，空闲时继续执行
function performUnitWork() {
  console.log(wip);
  // 1. 处理wip
  const { tag } = wip;

  switch (tag) {
    case HostComponent:
      updateHostComponent(wip);
      break;
    case FunctionComponent:
      updateFunctionComponent(wip);
      break;
    default:
      break;
  }
}

function workLoop(IdleDeadLine) {
  if (IdleDeadLine.timeRemaining() > 0 && wip) {
    performUnitWork();
  }

  // commit阶段：不可中断的

  // requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop);
