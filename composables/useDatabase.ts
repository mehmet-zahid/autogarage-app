import  Database  from '@tauri-apps/plugin-sql';
import type { Customer, Vehicle, Technician, Service, UserLogin } from '~/types/business';

const db = await Database.load('sqlite:auto-repair-shop.db');

export const useDatabase = () => { 

  const dbName = 'auto-repair-shop.db';
  const tables = {
    users: 'AuthUser',
    services: 'Service',
    service_types: 'ServiceType',
    service_operations: 'ServiceOperation',
    vehicles: 'Vehicle',
    customers: 'Customer',
    technicians: 'Technician',
  };

  // User Db Functions
  async function getUsers(): Promise<UserLogin[]> {
    const query = `SELECT * FROM ${tables.users}`;
    const results = await db.select(query);
    return results as UserLogin[];
    
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
    getUsers,
    getServices,
    getServicesByVehicleId,
    createService,
    updateService,
    deleteService,
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