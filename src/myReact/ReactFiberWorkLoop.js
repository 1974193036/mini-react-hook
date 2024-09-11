import {
  updateFunctionComponent,
  updateHostComponent,
} from "./ReactFiberReconciler";
import { FunctionComponent, HostComponent } from "./ReactWorkTags";
import { Placement, Update, updateNode } from "./utils";

// wip: work in progress 当前正在工作中的
let wip = null;
let wipRoot = null;

export function scheduleUpdateOnFiber(fiber) {
  wip = fiber;
  wipRoot = fiber;
}

// 1. 处理wip
// 2. 更新wip
// 这个函数会在空闲时间一直执行，不在空闲时间则中断执行，空闲时继续执行
function performUnitWork() {
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

  // 2. 更新wip 国王的故事 深度优先
  if (wip.child) {
    wip = wip.child;
    return;
  }

  let next = wip;
  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    next = next.return;
  }
  wip = null;
}

function workLoop(IdleDeadLine) {
  if (IdleDeadLine.timeRemaining() > 0 && wip) {
    performUnitWork();
  }

  // commit阶段：不可中断的
  if (!wip && wipRoot) {
    // 构建完成链表，去commit
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function commitRoot() {
  // 最终构建出来的 fiber
  console.log(wipRoot);
  commitWorker(wipRoot);
  wipRoot = null;
}

function commitWorker(wip) {
  if (!wip) {
    return;
  }
  // 1. 提交自己
  const { flags, stateNode } = wip;
  const parentNode = getParentNode(wip.return);
  // 插入（初次渲染、更新移动位置）
  if (flags & Placement && stateNode) {
    // 0010 Placement
    // 0010 新增 （符合）
    // 0100 更新
    // 1000 删除
    parentNode.appendChild(stateNode);
  }

  if (flags & Update && stateNode) {
    console.log(111);
    updateNode(wip.stateNode, wip.alternate.props, wip.props);
  }

  // 2. 提交子节点
  commitWorker(wip.child);
  // 3. 提交兄弟节点
  commitWorker(wip.sibling);
}

// 有没有可能找不到
function getParentNode(wip) {
  let tem = wip;

  while (tem) {
    if (tem.stateNode) {
      return tem.stateNode;
    }
    tem = tem.return;
  }
}
