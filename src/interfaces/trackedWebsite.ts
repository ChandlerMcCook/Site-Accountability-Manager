export interface Day {
    date : string
    time : number
}

export interface TrackedWebsite {
    days : Day[]
    overall : number
}

export interface TrackedWebsiteMap {
    [key : string]: TrackedWebsite
}