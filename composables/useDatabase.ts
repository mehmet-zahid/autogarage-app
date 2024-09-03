import { loadDatabase } from '~/database'

import type { Customer, Vehicle, Technician, Service, UserLogin, License, ServiceOperation, ServiceType } from '~/types/business';

export const useDatabase = async () => {
  const db = await loadDatabase();

  const dbName = 'auto-repair-shop.db';
  const tables = {
    users: 'AuthUser',
    services: 'Service',
    service_types: 'ServiceType',
    service_operations: 'ServiceOperation',
    vehicles: 'Vehicle',
    customers: 'Customer',
    technicians: 'Technician',
    licenses: 'License'
  };

  async function saveLicense(license: License) {
    const query = `INSERT INTO ${tables.licenses} (token, license_type, isExpired) VALUES ($1, $2, $3)`;
    const params = [license.token, license.license_type, license.isExpired];
    const res = await db.execute(query, params);
    return res;
  }

  async function getLicense() {
    const query = `SELECT * FROM ${tables.licenses}`;
    const res = await db.select(query);
    return res as License[];

  }

  async function updateLicense(license: License) {
    const query = `UPDATE ${tables.licenses} SET token = $1, license_type = $2, isExpired = $3,expiration = $4, updatedAt = $5 WHERE id = $6`;
    const params = [license.token, license.license_type, license.isExpired, license.expiration, new Date(), license.id];
    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error("Could not update License");
    }
    return res.rowsAffected;
  }

  // User Db Functions
  async function getUsers(): Promise<UserLogin[]> {
    const query = `SELECT * FROM ${tables.users}`;
    const results = await db.select(query);
    return results as UserLogin[];

  }

  async function getUserByName(username: string): Promise<UserLogin> {
    const query = `SELECT * FROM ${tables.users} WHERE username = $1`;
    const results = await db.select(query, [username]);
    return results[0] as UserLogin;
  }

  async function updateUser(user: UserLogin): Promise<number> {
    const query = `UPDATE ${tables.users} SET username = $1, password = $2 WHERE id = $3`;
    const params = [user.username, user.password, user.id];
    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error("Could not update User");
    }
    return res.rowsAffected;
  }

  // ----------------------- Service DB Funtions -----------------------

  // Get All Services
  async function getServices(): Promise<Service[]> {
    const query = `SELECT * FROM ${tables.services} WHERE isDeleted = 0`;
    const services = await db.select(query);
    // remove isDeleted from the result
    services.forEach((service: Service) => delete service.isDeleted);
    return services as Service[];
  }

  async function getServicesByVehicleId(vehicle_id: number): Promise<Service[]> {
    const query = `SELECT * FROM ${tables.services} WHERE vehicle_id = $1 AND isDeleted = 0`;
    const services = await db.select(query, [vehicle_id]);
    services.forEach((service: Service) => delete service.isDeleted);
    return services as Service[];
  }

  // Create
  async function createService(service: Service): Promise<Service> {
    const query = `
      INSERT INTO ${tables.services} (vehicle_id, total_cost, note, createdBy)
      VALUES ($1, $2, $3, $4)
    `;
    const params = [
      service.vehicle_id,
      service.total_cost,
      service.note,
      service.createdBy,
    ];

    const result = await db.execute(query, params);
    return {
      id: result.lastInsertId,
      ...service,
    };
  }

  // Update Service
  async function updateService(service: Service): Promise<number> {
    const query = `
      UPDATE ${tables.services}
      SET vehicle_id = $1, total_cost = $2, note = $3, completedAt = $4, isDeleted = $5
      WHERE id = $6
    `;
    const params = [
      service.vehicle_id,
      service.total_cost,
      service.note,
      service.completedAt,
      service.isDeleted,
      service.id
    ];
    const res = await db.execute(query, params);

    if (res.rowsAffected === 0) {
      throw new Error(`Could not update Service with id ${service.id}`);
    }
    return res.rowsAffected;
  }

  // Delete Service
  async function deleteService(id: number): Promise<number> {
    const query = `UPDATE ${tables.services} SET isDeleted = 1 WHERE id = $1`;
    const params = [id];

    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error(`Could not delete Service with id ${id}`);
    }
    return res.rowsAffected;
  }

  // Get Service Operations by Service ID
  async function getServiceOperationsByServiceId(serviceId: number): Promise<ServiceOperation[]> {
    const query = `SELECT * FROM ${tables.service_operations} WHERE service_id = $1 AND isDeleted = 0`;
    const results = await db.select(query, [serviceId]);
    return results as ServiceOperation[];
  }

  // Get All Services with Service Operations
  async function getServicesWithOperationsByVehicleId(vehicleId: number): Promise<any[]> {
    const query = `
      SELECT 
        s.id as service_id, s.vehicle_id, s.total_cost, s.note, s.createdAt as service_createdAt, s.createdBy, s.completedAt, s.isDeleted, 
        so.id as operation_id, so.service_type_id, so.quantity, so.note as operation_note, so.createdAt as operation_createdAt
      FROM 
        ${tables.services} s
      LEFT JOIN 
        ${tables.service_operations} so ON s.id = so.service_id
      WHERE 
        s.vehicle_id = $1 AND s.isDeleted = 0 AND (so.isDeleted = 0 OR so.isDeleted IS NULL)
    `;
    const results = await db.select(query, [vehicleId]);

    // Group the results by service_id
    const servicesMap = new Map<number, Service & { operations: ServiceOperation[] }>();

    results.forEach(row => {
      if (!servicesMap.has(row.service_id)) {
        servicesMap.set(row.service_id, {
          id: row.service_id,
          vehicle_id: row.vehicle_id,
          total_cost: row.total_cost,
          note: row.note,
          createdAt: row.service_createdAt,
          createdBy: row.createdBy,
          completedAt: row.completedAt,
          isDeleted: row.isDeleted,
          operations: []
        });
      }

      if (row.operation_id) {
        servicesMap.get(row.service_id)!.operations.push({
          id: row.operation_id,
          service_id: row.service_id,
          service_type_id: row.service_type_id,
          quantity: row.quantity,
          note: row.operation_note,
          createdAt: row.operation_createdAt,
          isDeleted: row.isDeleted
        });
      }
    });
    // Convert Map values to array and sort by createdAt
    const sortedServices = Array.from(servicesMap.values()).sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    console.log(sortedServices);

    return sortedServices;
  }

  // Get All Services with Service Operations
  async function getServiceOpsWithServiceTypesByServiceId(ServiceId: number): Promise<any[]> {
    const query = `
      SELECT 
        so.id as operation_id, so.service_id, so.quantity, so.note, so.createdAt as service_op_createdAt, so.createdBy, so.isDeleted, 
        st.name as service_type_name, st.id as service_type_id, st.description as service_type_description, st.price as service_type_price
      FROM 
        ${tables.service_operations} so
      LEFT JOIN 
        ${tables.service_types} st ON st.id = so.service_type_id
      WHERE 
        so.service_id = $1 AND so.isDeleted = 0 AND (st.isDeleted = 0 OR st.isDeleted IS NULL)
    `;
    const results = await db.select(query, [ServiceId]);
    console.log(results);

    // Group the results by operation_id
    const operationsMap = new Map<number, ServiceOperation & { service_type: any }>();

    results.forEach(row => {
      if (!operationsMap.has(row.operation_id)) {
        operationsMap.set(row.operation_id, {
          id: row.operation_id,
          service_id: row.service_id,
          quantity: row.quantity,
          note: row.note,
          createdAt: row.service_op_createdAt,
          createdBy: row.createdBy,
          isDeleted: row.isDeleted,
          service_type: {
            id: row.service_type_id,
            name: row.service_type_name,
            description: row.service_type_description,
            price: row.service_type_price
          }
        });
      }
    });

    // Convert Map values to array and sort by createdAt
    const sortedOperations = Array.from(operationsMap.values()).sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
    console.log(sortedOperations);
    return sortedOperations;
  }

  async function createServiceOperation(serviceOperation: ServiceOperation): Promise<ServiceOperation> {
    const query = `
      INSERT INTO ${tables.service_operations} (service_id, service_type_id, quantity, note, createdBy)
      VALUES ($1, $2, $3, $4, $5)
    `;
    const params = [
      serviceOperation.service_id,
      serviceOperation.service_type_id,
      serviceOperation.quantity,
      serviceOperation.note,
      serviceOperation.createdBy,
    ];

    const result = await db.execute(query, params);
    return {
      id: result.lastInsertId,
      ...serviceOperation,
    };
  }

  async function updateServiceOperation(serviceOperation: ServiceOperation): Promise<number> {
    const query = `
      UPDATE ${tables.service_operations}
      SET service_id = $1, service_type_id = $2, quantity = $3, note = $4, isDeleted = $5
      WHERE id = $6
    `;
    const params = [
      serviceOperation.service_id,
      serviceOperation.service_type_id,
      serviceOperation.quantity,
      serviceOperation.note,
      serviceOperation.isDeleted,
      serviceOperation.id
    ];
    const res = await db.execute(query, params);

    if (res.rowsAffected === 0) {
      throw new Error(`Could not update Service Operation with id ${serviceOperation.id}`);
    }
    return res.rowsAffected;
  }

  async function deleteServiceOperation(id: number): Promise<number> {
    const query = `UPDATE ${tables.service_operations} SET isDeleted = 1 WHERE id = $1`;
    const params = [id];

    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error(`Could not delete Service Operation with id ${id}`);
    }
    return res.rowsAffected;
  }

  async function deleteServiceOperations(serviceOperationIds: number[]): Promise<number> {
    // Generate the parameter placeholders dynamically based on the number of IDs
    const placeholders = serviceOperationIds.map((_, index) => `$${index + 1}`).join(', ');
    const query = `UPDATE ${tables.service_operations} SET isDeleted = 1 WHERE id IN (${placeholders})`;
    
    const params = serviceOperationIds;
  
    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error(`Could not delete Service Operations with ids ${serviceOperationIds.join(', ')}`);
    }
    return res.rowsAffected;
  }


  // Service Type DB Functions
  async function getServiceTypes(): Promise<any[]> {
    const query = `SELECT * FROM ${tables.service_types}`;
    const results = await db.select(query);
    return results;
  }

  async function getServiceTypeById(id: number): Promise<any> {
    const query = `SELECT * FROM ${tables.service_types} WHERE id = $1`;
    const results = await db.select(query, [id]);
    return results[0];
  }

  async function createServiceType(serviceType: ServiceType): Promise<any> {
    const query = `INSERT INTO ${tables.service_types} (name, description, price, createdBy) VALUES ($1, $2, $3, $4)`;
    const params = [serviceType.name, serviceType.description, serviceType.price, serviceType.createdBy];
    const res = await db.execute(query, params);
    return res;
  }

  async function updateServiceType(serviceType: ServiceType): Promise<number> {
    const query = `UPDATE ${tables.service_types} SET name = $1, description = $2, price = $3, createdBy = $4 WHERE id = $5`;
    const params = [serviceType.name, serviceType.description, serviceType.price, serviceType.createdBy, serviceType.id];
    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error("Could not update Service Type");
    }
    return res.rowsAffected;
  }

  async function deleteServiceType(id: number): Promise<number> {
    const query = `DELETE FROM ${tables.service_types} WHERE id = $1`;
    const res = await db.execute(query, [id]);
    if (res.rowsAffected === 0) {
      throw new Error("Could not delete Service Type");
    }
    return res.rowsAffected;
  }

  async function deleteServiceTypes(serviceTypeIds: number[]): Promise<number> {
    // Generate the parameter placeholders dynamically based on the number of IDs
    const placeholders = serviceTypeIds.map((_, index) => `$${index + 1}`).join(', ');
    const query = `DELETE FROM ${tables.service_types} WHERE id IN (${placeholders})`;
    
    const params = serviceTypeIds;
  
    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error(`Could not delete Service Types with ids ${serviceTypeIds.join(', ')}`);
    }
    return res.rowsAffected;
    
  }
  // ----------------- Vehicle DB Functions -----------------

  // Get All Vehicles
  async function getVehicles(): Promise<Vehicle[]> {
    const query = `SELECT * FROM ${tables.vehicles} WHERE isDeleted = 0`;
    const vehicles = await db.select(query);
    vehicles.forEach((vehicle: Vehicle) => delete vehicle.isDeleted);
    return vehicles as Vehicle[];
  }

  async function getVehicleById(id: number): Promise<Vehicle> {
    const query = `SELECT * FROM ${tables.vehicles} WHERE id = $1 AND isDeleted = 0`;
    const vehicle = await db.select(query, [id]);
    vehicle.forEach((vehicle: Vehicle) => delete vehicle.isDeleted);
    return vehicle[0] as Vehicle;
  }

  async function getVehiclesByCustomerId(customer_id: number): Promise<Vehicle[]> {
    const query = `SELECT * FROM ${tables.vehicles} WHERE customer_id = $1 AND isDeleted = 0`;
    const vehicles = await db.select(query, [customer_id]);
    return vehicles as Vehicle[];
  }

  // Create Vehicle
  async function createVehicle(vehicle: Vehicle): Promise<Vehicle> {
    const query = `
      INSERT INTO ${tables.vehicles} (customer_id, make, model, vin, plateNumber, year, color, description, mileage)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    const params = [
      vehicle.customer_id,
      vehicle.make,
      vehicle.model,
      vehicle.vin,
      vehicle.plateNumber,
      vehicle.year,
      vehicle.color,
      vehicle.description,
      vehicle.mileage,
    ];

    const result = await db.execute(query, params);
    return {
      id: result.lastInsertId,
      ...vehicle,
    };

  }

  // Update Vehicle
  async function updateVehicle(vehicle: Vehicle): Promise<number> {
    const query = `
      UPDATE ${tables.vehicles}
      SET customer_id = $1, make = $2, model = $3, vin = $4, plateNumber = $5, year = $6, color = $7, description = $8, mileage = $9
      WHERE id = $10
    `;
    const params = [
      vehicle.customer_id,
      vehicle.make,
      vehicle.model,
      vehicle.vin,
      vehicle.plateNumber,
      vehicle.year,
      vehicle.color,
      vehicle.description,
      vehicle.mileage,
      vehicle.id
    ];
    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error(`Could not update Vehicle with id ${vehicle.id}`);
    }
    return res.rowsAffected;
  }

  // Delete Vehicle
  async function deleteVehicle(id: number): Promise<number> {
    const query = `UPDATE ${tables.vehicles} SET isDeleted = 1 WHERE id = $1`;
    const params = [id];

    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error(`Could not delete Vehicle with id ${id}`);
    }
    return res.rowsAffected;
  }

  // ----------------- Customer DB Functions -----------------

  // Get All Customers
  async function getCustomers(): Promise<Customer[]> {
    const query = `SELECT * FROM ${tables.customers} WHERE isDeleted = 0`;
    const customers = await db.select(query);
    customers.forEach((customer: Customer) => delete customer.isDeleted);
    return customers as Customer[];
  }

  async function getCustomerById(id: number): Promise<Customer> {
    const query = `SELECT * FROM ${tables.customers} WHERE id = $1 AND isDeleted = 0`;
    const customer = await db.select(query, [id]);
    customer.forEach((customer: Customer) => delete customer.isDeleted);
    return customer[0] as Customer;
  }

  async function createCustomer(customer: Customer): Promise<Customer> {
    const query = `INSERT INTO ${tables.customers} (name, companyName, email, phone, address, description)
                   VALUES ($1, $2, $3, $4, $5, $6)`;
    const params = [
      customer.name,
      customer.companyName,
      customer.email,
      customer.phone,
      customer.address,
      customer.description,
    ];

    const result = await db.execute(query, params);
    return {
      id: result.lastInsertId,
      ...customer,
    };
  }

  // Update Customer
  async function updateCustomer(customer: Customer): Promise<number> {
    console.log(customer);
    const query = `
      UPDATE ${tables.customers}
      SET name = $1, companyName = $2, email = $3, phone = $4, address = $5, description = $6
      WHERE id = $7
    `;
    const params = [
      customer.name,
      customer.companyName,
      customer.email,
      customer.phone,
      customer.address,
      customer.description,
      customer.id
    ];
    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error(`Could not update Customer with id ${customer.id}`);
    }
    return res.rowsAffected;
  }

  // Delete Customer
  async function deleteCustomer(id: number): Promise<number> {
    const query = `UPDATE ${tables.customers} SET isDeleted = 1 WHERE id = $1`;
    const params = [id];

    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error(`Could not delete Customer with id ${id}`);
    }
    return res.rowsAffected;
  }

  // ----------------- Technician DB Functions -----------------

  // Get All Technicians
  async function getTechnicians(): Promise<Technician[]> {
    const query = `SELECT * FROM ${tables.technicians} WHERE isDeleted = 0`;
    const technicians = await db.select(query);
    technicians.forEach((technician: Technician) => delete technician.isDeleted);
    return technicians as Technician[];
  }

  // Create Technician
  async function createTechnician(technician: Technician): Promise<Technician> {
    const query = `
      INSERT INTO ${tables.technicians} (name, email, phone, specialty)
      VALUES ($1, $2, $3, $4)
    `;
    const params = [
      technician.name,
      technician.email,
      technician.phone,
      technician.specialty,
    ];

    const result = await db.execute(query, params);
    return {
      id: result.lastInsertId,
      ...technician,
    };
  }

  // Update Technician
  async function updateTechnician(technician: Technician): Promise<number> {
    const query = `
      UPDATE ${tables.technicians}
      SET name = $1, email = $2, phone = $3, specialty = $4
      WHERE id = $5
    `;
    const params = [
      technician.name,
      technician.email,
      technician.phone,
      technician.specialty,
      technician.id
    ];
    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error(`Could not update Technician with id ${technician.id}`);
    }
    return res.rowsAffected;
  }

  // Delete Technician
  async function deleteTechnician(id: number): Promise<number> {
    const query = `UPDATE ${tables.technicians} SET isDeleted = 1 WHERE id = $1`;
    const params = [id];

    const res = await db.execute(query, params);
    if (res.rowsAffected === 0) {
      throw new Error(`Could not delete Technician with id ${id}`);
    }
    return res.rowsAffected;
  }

  // ----------------- Special Queries with Joins -----------------

  // Get Services with Related Vehicle and Technician Info
  async function getServiceDetails(): Promise<any[]> {
    const query = `
      SELECT 
        s.id, s.total_cost, s.note, s.createdAt, s.completedAt,
        v.make, v.model, v.year, v.license_plate,
        t.name as technician_name
      FROM ${tables.services} s
      JOIN ${tables.vehicles} v ON s.vehicle_id = v.id
      JOIN ${tables.technicians} t ON s.technician_id = t.id
      WHERE s.isDeleted = 0
    `;
    const serviceDetails = await db.select(query);
    return serviceDetails as any[];
  }

  // Get Vehicle Service History
  async function getVehicleServiceHistory(vehicle_id: number): Promise<any[]> {
    const query = `
      SELECT 
        s.id, s.total_cost, s.note, s.createdAt, s.completedAt,
        t.name as technician_name
      FROM ${tables.services} s
      JOIN ${tables.technicians} t ON s.technician_id = t.id
      WHERE s.vehicle_id = ? AND s.isDeleted = 0
    `;
    const serviceHistory = await db.select(query, [vehicle_id]);
    return serviceHistory as any[];
  }




  return {
    getLicense,
    saveLicense,
    updateLicense,
    getUsers,
    getUserByName,
    updateUser,
    getServices,
    getServicesByVehicleId,
    createService,
    updateService,
    deleteService,
    getServiceOperationsByServiceId,
    getServicesWithOperationsByVehicleId,
    getServiceOpsWithServiceTypesByServiceId,
    createServiceOperation,
    updateServiceOperation,
    deleteServiceOperation,
    deleteServiceOperations,
    getServiceTypes,
    getServiceTypeById,
    createServiceType,
    updateServiceType,
    deleteServiceType,
    deleteServiceTypes,
    getVehicles,
    getVehicleById,
    getVehiclesByCustomerId,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getTechnicians,
    createTechnician,
    updateTechnician,
    deleteTechnician,
    getServiceDetails,
    getVehicleServiceHistory,
  };
};