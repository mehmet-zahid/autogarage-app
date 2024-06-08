export interface ServiceType {
     id?: number;
     name: string;
     description?: string;
     price?: number;
     createdAt?: Date;
     createdBy?: string;
     isDeleted?: number;
 }

export interface ServiceOperation {
     id?: number;
     service_id: number;
     service_type_id: number;
     quantity: number;
     note?: string;
     createdAt?: Date;
     isDeleted?: number;
 }

export interface UserLogin{ 
    username:string;
    password:string;
}


export interface Service {
    id?: number;
    vehicle_id?: number;
    technician_id?: number;
    total_cost?: number;
    note?: string;
    createdAt?: Date;
    createdBy?: string;
    completedAt?:Date;
    isDeleted?: number;
}

export interface Vehicle {
    id?: number;
    customer_id?: number;
    registeredAt?:Date;
    make?: string;
    model: string;
    vin?: string;
    year?: number;
    color?: string;
    description?: string;
    plateNumber: string;
    mileage?: number;
    isDeleted?: number;
}
export interface Customer {
    id?: number;
    name: string;
    registeredAt?: Date;
    companyName?:string;
    email?: string;
    phone?: string;
    address?: string;
    description : string;
    isDeleted?: number;
}

export interface Technician {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    specialty?: string;
    registeredAt?:Date;
    isDeleted?: number;
}

