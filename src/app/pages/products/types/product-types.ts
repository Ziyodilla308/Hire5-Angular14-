export interface TProduct {
    id: number;
    name: string;
    description: string;
    sku: string;
    cost: number;
    profile: TProductProfile;
}

export interface TProductProfile {
    type: string;
}
