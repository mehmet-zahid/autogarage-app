export interface ServiceType {
    id?: number;
    name: string;
    description?: string;
    price?: number;
    createdAt?: Date;
    createdBy?: string;
    isDeleted?: number;
}

export interface ServiceWithOperations {
    id: number;  // service_id
    vehicle_id: number;
    total_cost: number;
    note: string;
    createdAt: Date;
    createdBy: string | null;
    completedAt: Date | null;
    isDeleted?: number;
    operations: ServiceOperation[];
}

export interface ServiceOperationsWithTypes {
    id: number; // operation_id
    service_id: number;
    quantity: number;
    note: string;
    createdAt: Date;
    createdBy: string | null;
    isDeleted?: number;
    service_type: ServiceType;
}

export interface ServiceOperation {
    id?: number;
    service_id: number;
    service_type_id: number;
    quantity: number;
    note?: string;
    createdAt?: Date;
    createdBy?: string;
    isDeleted?: number;
}

export interface UserLogin {
    id?: number;
    username: string;
    password: string;
}


export interface Service {
    id?: number;
    vehicle_id?: number;
    total_cost?: number;
    note?: string;
    createdAt?: Date;
    createdBy?: string;
    completedAt?: Date | null;
    isDeleted?: number;
}

export interface Vehicle {
    id?: number;
    customer_id?: number;
    registeredAt?: Date;
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
    companyName?: string;
    email?: string;
    phone?: string;
    address?: string;
    description: string;
    isDeleted?: number;
}

export interface Technician {
    id?: number;
    name?: string;
    email?: string;
    phone?: string;
    specialty?: string;
    registeredAt?: Date;
    isDeleted?: number;
}

enum LicenseType {
    Trial = "Trial",
    Paid = "Paid"
}



export interface License {
    id?: number;
    token: string;
    license_type?: string
    expiration?: Date;
    isExpired?: number;
    createdAt?: Date;
    updatedAt?: Date | null;
}

