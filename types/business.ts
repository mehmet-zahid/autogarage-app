export interface ServiceType {
    id: string;
    name: string;
    price?: number;
    createDate:Date // oluşturma tarihi
}

export interface Service {
    id: string;
    carId: string;
    serviceType: ServiceType;
    date: string;
    notes?: string;
    complaint?: string;
    createDate:Date;
    isDeleted:boolean;
}
export interface Vehicle {
    id: number;
    registeredAt:Date
    make?: string;//marka
    model?: string;
    plateNumber: string;
    year?: number;
    color?: string;
    description?: string;
    mileage: number; //km değeri
    isDeleted:boolean;
}
export interface Customer {
    id: string;
    name: string;
    registeredAt: Date;
    registeredTime:Date;
    createDate : Date;
    companyName:string;
    isDeleted?: boolean;
    email?: string;
    phone?: string;
    address?: string;
    cars?: Vehicle[];
    services?: Service[];
    description : string;
}

