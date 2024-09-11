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
    // todo
  } else {
    // 组件初次渲染
    hook = { memorizedState: null, next: null };
    if (workInProgressHook) {
      // hook0 --next--> hook1 --next--> hook2 ...
      workInProgressHook = workInProgressHook.next = hook
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

  if (!currentlyRenderingFiber.alternate) {
    hook.memorizedState = initalState
  }


  const dispatch = () => {
    console.log("dispatch");
  };

  return [initalState, dispatch];
}
