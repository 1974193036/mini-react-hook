
// wip: work in progress 当前正在工作中的
let wip = null

export function scheduleUpdateOnFiber(fiber) {
    wip = fiber
}

// 1. 处理wip
// 2. 更新wip
function performUnitWork() {
    console.log(wip)
}

function workLoop(IdleDeadLine) {
    if (IdleDeadLine.timeRemaining() > 0 && wip) {
        performUnitWork()
    }
   
    // commit阶段：不可中断的

    // requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)
