// For the result structure:
export type RouteCount = {
    _id: String;
    count: number;
};

export type RouteDataResult = {
    total: number;
    perPage: number;
    page: number;
    lastPage: number;
    data: RouteCount[];
};

type RouteResponse = {
    data: RouteDataResult;
};

export interface SponsorLooseData {
    "Organisation Name": string;
    "Town/City"?: string;
    "Type & Rating"?: string;
    Route?: string;
    // ... any other properties
}
