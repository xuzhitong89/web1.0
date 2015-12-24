var toast = {
    getProjectTree : getRootPath() + "/product/getProjectTree",
    getProjectOpts : getRootPath() + "/product/getProjectOpts",
    setPageSize : getRootPath() + "/page/setPageSize",
    syncMachineStatus : getRootPath() + "/machine/syncMachineStatus",
    getRunOutput : getRootPath() + "/run/getOutput",
    openRunOutput: getRootPath() + "/run/openOutput",
    getCaseOutput: getRootPath() + "/run/getCaseOutput",
    cancelTaskRun: getRootPath() + "/run/cancel",
    upload: getRootPath() + "/api/upload",
    getDefaultPort: getRootPath() + "/machine/getDefaultPort",
    getMachineStatus: getRootPath() + "/machine/getStatus",
    getMachineOpts: getRootPath() + "/machine/getMachineOpts",
    getCommandOpts : getRootPath() + "/command/getCommandOpts",
    saveTwfDraft: getRootPath() + "/twf/savedraft",
    dropTwfDraft: getRootPath() + "/twf/dropdraft",
    updateAgent: getRootPath() + "/machine/updateAgent",
    deleteMachine: getRootPath() + "/machine/delete",
    machineList: getRootPath() + "/machine/index",
    getMachineListByProduct: getRootPath() + "/machine/getMachineListByProduct",
    viewMachine: getRootPath() + "/machine/view",
    viewMachineTasks: getRootPath() + "/machine/getTasks",
    
    runCommand: getRootPath() + "/command/createRun",
    deleteCommand: getRootPath() + "/command/delete",
    cancelCommandRun: getRootPath() + "/command/cancel",
    feedback: getRootPath() + "/user/feedback",
    getRBStatus: getRootPath() + "/twf/getRBStatus",
    getBvtResult: getRootPath() + "/twf/getBvtResult",
    getUnitTestData: getRootPath() + "/twf/getUnitTestData",
    
    getCode: getRootPath() + "/case/getcode",
    viewCase: getRootPath() + "/case/view/id/",
    
    heartbeat : 5000,
    
    compare: {
        frontcompare: '/home/a/bin/frontcompare'
    },
    
    ut_run: '/home/a/bin/toast/script/unittest_run',
    ci_run: '/home/a/bin/toast/script/ContinuouseIntegration/ci_run.py'
};
