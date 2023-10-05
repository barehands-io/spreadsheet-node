export type RouteType =
    | "Skilled Worker"
    | "Global Business Mobility: Senior or Specialist Worker"
    | "Tier 2 Ministers of Religion"
    | "Creative Worker"
    | "International Sportsperson"
    | "Religious Worker"
    | "Charity Worker"
    | "Global Business Mobility: Graduate Trainee"
    | "Government Authorised Exchange"
    | "International Agreement"
    | "Global Business Mobility: UK Expansion Worker"
    | "Scale-up"
    | "Global Business Mobility: Service Supplier"
    | "Seasonal Worker"
    | "Global Business Mobility: Secondment Worker"
    | "Intra Company Transfers (ICT)"
    | "Intra-company Routes";

// For the result structure:
export type RouteCount = {
    _id: RouteType;
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
