export interface BlockedWesbite {
    startDate: string,
    timeLimit: { todayDate: string, limit: number, time: number }
}

export interface BlockedWebsiteMap {
    [key : string]: BlockedWesbite
}