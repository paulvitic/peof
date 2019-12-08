export type DataCollectionState = {
    running: boolean
    averageDuration: number
}

export interface DataCollectionMonitor {
    isRunning(): boolean
    state(): DataCollectionState;
}
