// export interface ServiceType {
//     id?: number;
//     name: string;
//     description?: string;
//     price?: number;
//     createdAt?: Date;
//     createdBy?: string;
//     isDeleted?: number;
// }

// export interface ServiceOperation {
//     id?: number;
//     serviceTypeId: number;
//     note?: string;
//     createdAt?: Date;
//     createdBy?: string;
//     isDeleted?: number;
// }

export interface UserLogin{ // tek kullanıcı full yetki
    username:string;
    password:string;
}


export interface Service {
    id?: number;
    customerId?: number;
    technicianIds?: number[];
    vehicleIds?: number[];
    totalCost?: number;
    //processType tamir yada bakım
    note?: string;
    createdAt?: Date;
    createdBy?: string;
    createDate?:Date;
    isDeleted?: number;
}

export interface Vehicle {
    id?: number;
    plateNumber: string;
    mileage?: number;
    registeredAt?:Date
    make?: string;//marka
    model: string;
    year?: number;
    color?: string;
    description?: string;
    isDeleted?: number;
}
export interface Customer {
    id?: number;
    fullName: string;
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
    fullName?: string;
    email?: string;
    phone?: string;
    createdAt?:Date;
    isDeleted?: number;
}

