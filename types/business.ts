export interface ServiceType {
    id?: string;
    name: string;
    description?: string;
    price?: number;
}

export interface Service {
    id?: number;
    customerId?: number;
    technicianIds?: number[];
    vehicleIds?: number[];
    serviceName?: string;
    description?: string;
    price?: number;
    note?: string;
    createdAt?: Date;
}

export interface Vehicle {
    id?: number;
    customerId: number;
    serviceIds?: number[];
    technicianIds?: number[];
    registeredAt?:Date
    make: string;//marka
    model: string;
    plateNumber: string;
    year?: number;
    color?: string;
    description?: string;
    mileage?: number;
}
export interface Customer {
    id?: number;
    fullName: string;
    registeredAt?: Date;
    companyName?:string;
    email?: string;
    phone?: string;
    address?: string;
    vehicleIds?: number[];
    serviceIds?: number[];
    description : string;
}

export interface Technician {
    id?: number;
    fullName: string;
    email?: string;
    phone?: string;
    createdAt?:Date;
}

