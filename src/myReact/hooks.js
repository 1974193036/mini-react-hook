import { scheduleUpdateOnFiber } from "./ReactFiberWorkLoop";

// 当前函数组件对应的 fiber
let currentlyRenderingFiber = null;

let workInProgressHook = null;

export function renderWithHooks(wip) {
  console.log(wip);
  currentlyRenderingFiber = wip;
  currentlyRenderingFiber.memorizedState = null;
  workInProgressHook = null;
}

function updateWorkInProgressHook() {
  let hook;
  // old fiber
  const current = currentlyRenderingFiber.alternate;
  if (current) {
    // 组件更新
    currentlyRenderingFiber.memorizedState = current.memorizedState;
    if (workInProgressHook) {
      // hook0 --next--> hook1 --next--> hook2 ...
      workInProgressHook = hook = workInProgressHook.next;
    } else {
      // hook0
      workInProgressHook = hook = currentlyRenderingFiber.memorizedState;
    }
  } else {
    // 组件初次渲染
    hook = { memorizedState: null, next: null };
    if (workInProgressHook) {
      // hook0 --next--> hook1 --next--> hook2 ...
      workInProgressHook = workInProgressHook.next = hook;
    } else {
      // hook0
      workInProgressHook = currentlyRenderingFiber.memorizedState = hook;
    }
  }

  return hook;
}

export function useReducer(reducer, initalState) {
  // 当前useReducer对应的hook
  const hook = updateWorkInProgressHook();

  // 初次渲染
  if (!currentlyRenderingFiber.alternate) {
    hook.memorizedState = initalState;
  }

  const dispatch = () => {
    console.log("dispatch");

    // 1. 修改状态值
    hook.memorizedState = reducer(hook.memorizedState);

    // 2. 更新组件
    currentlyRenderingFiber.alternate = { ...currentlyRenderingFiber };
    scheduleUpdateOnFiber(currentlyRenderingFiber);
  };

  return [hook.memorizedState, dispatch];
}
