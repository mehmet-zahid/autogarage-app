import  Database  from '@tauri-apps/plugin-sql';
import type { Customer, Vehicle, Technician, Service } from '~/types/business';

const db = await Database.load('sqlite:auto-repair-shop.db');

export const useDatabase = () => {

  const dbName = 'auto-repair-shop.db';
  const tables = {
    services: 'services',
    vehicles: 'vehicles',
    customers: 'customers',
    technicians: 'technicians',
  };
  // CRUD operations

  // Create
  async function createService(service: Service): Promise<Service> {
    const query = `INSERT INTO ${tables.services} (customerId, technicianIds, vehicleIds, serviceName, description, price, note)
                   VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const params = [
      service.customerId,
      JSON.stringify(service.technicianIds || []), // Convert technicianIds array to JSON string
      JSON.stringify(service.vehicleIds || []), // Convert vehicleIds array to JSON string
      service.serviceName,
      service.description,
      service.price,
      service.note,
    ];
    
    const result = await db.execute(query, params);
    return {
      id: result.lastInsertId,
      ...service,
    };
  }

  async function createVehicle(vehicle: Vehicle): Promise<Vehicle> {
    const query = `INSERT INTO ${tables.vehicles} (customerId, serviceIds, technicianIds, make, model, plateNumber, year, color, description, mileage)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    const params = [
      vehicle.customerId,
      JSON.stringify(vehicle.serviceIds || []), // Convert serviceIds array to JSON string
      JSON.stringify(vehicle.technicianIds || []), // Convert technicianIds array to JSON string
      vehicle.make,
      vehicle.model,
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

  async function createCustomer(customer: Customer): Promise<Customer> {
    const query = `INSERT INTO ${tables.customers} (fullName, companyName, email, phone, address, description)
                   VALUES ($1, $2, $3, $4, $5, $6)`;
    const params = [
      customer.fullName,
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
      registeredAt: new Date(),
    };
  }

  async function createTechnician(technician: Technician): Promise<Technician> {
    const query = `INSERT INTO ${tables.technicians} (fullName, email, phone)
                   VALUES ($1, $2, $3)`;
    const params = [technician.fullName, technician.email, technician.phone];
    
    const result = await db.execute(query, params);
    return {
      id: result.lastInsertId,
      ...technician,
      createdAt: new Date(),
    };

  }

  async function getAllServices(): Promise<Service[]> {
    const query = `SELECT * FROM ${tables.services}`;
    const results = await db.select(query);

    results.forEach((service) => {
      service.technicianIds = JSON.parse(service.technicianIds || '[]'); // Parse technicianIds JSON string back to array
      service.vehicleIds = JSON.parse(service.vehicleIds || '[]'); // Parse vehicleIds JSON string back to array
      service.createdAt = new Date(service.createdAt);
    });

    return results;
  }

  async function getAllVehicles(): Promise<Vehicle[]> {
    const query = `SELECT * FROM ${tables.vehicles}`;
    const results = await db.select(query);

    results.forEach((vehicle) => {
      vehicle.serviceIds = JSON.parse(vehicle.serviceIds || '[]'); // Parse serviceIds JSON string back to array
      vehicle.technicianIds = JSON.parse(vehicle.technicianIds || '[]'); // Parse technicianIds JSON string back to array
      vehicle.registeredAt = new Date(vehicle.registeredAt);
    });

    return results;
  }

  async function getAllCustomers(): Promise<Customer[]> {
    const query = `SELECT * FROM ${tables.customers}`;
    const results = await db.select(query);

    results.forEach((customer) => {
      customer.vehicleIds = JSON.parse(customer.vehicleIds || '[]'); // Parse vehicleIds JSON string back to array
      customer.serviceIds = JSON.parse(customer.serviceIds || '[]'); // Parse serviceIds JSON string back to array
      customer.registeredAt = new Date(customer.registeredAt);
    });

    return results;
  }

  async function getAllTechnicians(): Promise<Technician[]> {
    const query = `SELECT * FROM ${tables.technicians}`;
    const results = await db.select(query);

    results.forEach((technician) => {
      technician.createdAt = new Date(technician.createdAt);
    });

    return results;
  }



  // Read
  async function getServiceById(id: number): Promise<Service | null> {
    const query = `SELECT * FROM ${tables.services} WHERE id = $1`;
    const params = [id];
    const results = await db.select(query, params);

    results.forEach((service) => {
      service.technicianIds = JSON.parse(service.technicianIds || '[]'); // Parse technicianIds JSON string back to array
      service.vehicleIds = JSON.parse(service.vehicleIds || '[]'); // Parse vehicleIds JSON string back to array
      service.createdAt = new Date(service.createdAt);
    });

    return results.length > 0 ? results[0] : null;
  }

  async function getVehicleById(id: number): Promise<Vehicle | null> {
    const query = `SELECT * FROM ${tables.vehicles} WHERE id = $1`;
    const params = [id];
    const results = await db.select(query, params);

    results.forEach((vehicle) => {
      vehicle.serviceIds = JSON.parse(vehicle.serviceIds || '[]'); // Parse serviceIds JSON string back to array
      vehicle.technicianIds = JSON.parse(vehicle.technicianIds || '[]'); // Parse technicianIds JSON string back to array
      vehicle.registeredAt = new Date(vehicle.registeredAt);
    });

    return results.length > 0 ? results[0] : null;
  }

  async function getCustomerById(id: number): Promise<Customer | null> {
    const query = `SELECT * FROM ${tables.customers} WHERE id = $1`;
    const params = [id];
    
    const results = await db.select(query, params);

    results.forEach((customer) => {
      customer.vehicleIds = JSON.parse(customer.vehicleIds || '[]'); // Parse vehicleIds JSON string back to array
      customer.serviceIds = JSON.parse(customer.serviceIds || '[]'); // Parse serviceIds JSON string back to array
      customer.registeredAt = new Date(customer.registeredAt);
    });

    return results.length > 0 ? results[0] : null;
  }

  async function getTechnicianById(id: number): Promise<Technician | null> {
    const query = `SELECT * FROM ${tables.technicians} WHERE id = $1`;
    const params = [id];
    const results = await db.select(query, params);

    results.forEach((technician) => {
      technician.createdAt = new Date(technician.createdAt);
    });

    return results.length > 0 ? results[0] : null;
  }

  // Additional functions (examples)
  async function getServicesByCustomerId(customerId: number): Promise<Service[]> {
      const query = `SELECT * FROM ${tables.services} WHERE customerId = $1`;
      const params = [customerId];
     
      const results = await db.select(query, params);

      return results.map((service) => ({
        ...service,
        technicianIds: JSON.parse(service.technicianIds || '[]'),
        vehicleIds: JSON.parse(service.vehicleIds || '[]'),
        createdAt: new Date(service.createdAt),
      }));
    }
  
    // Update (example)
    async function updateService(service: Service): Promise<void> {
      const query = `UPDATE ${tables.services}
                     SET customerId = $1,
                         technicianIds = $2,
                         vehicleIds = $3,
                         serviceName = $4,
                         description = $5,
                         price = $6,
                         note = $7
                     WHERE id = $8`;
      const params = [
        service.customerId,
        JSON.stringify(service.technicianIds || []),
        JSON.stringify(service.vehicleIds || []),
        service.serviceName,
        service.description,
        service.price,
        service.note,
        service.id,
      ];
      await db.execute(query, params);
    }

    // Update customer (example)
    async function updateCustomer(customer: Customer): Promise<void> {
      const query = `UPDATE ${tables.customers}
                     SET fullName = $1,
                         companyName = $2,
                         email = $3,
                         phone = $4,
                         address = $5,
                         description = $6
                     WHERE id = $7`;
      const params = [
        customer.fullName,
        customer.companyName,
        customer.email,
        customer.phone,
        customer.address,
        customer.description,
        customer.id,
      ];
      await db.execute(query, params);
    }

    // Update vehicle (example)
    async function updateVehicle(vehicle: Vehicle): Promise<void> {
      const query = `UPDATE ${tables.vehicles}
                     SET customerId = $1,
                         serviceIds = $2,
                         technicianIds = $3,
                         make = $4,
                         model = $5,
                         plateNumber = $6,
                         year = $7,
                         color = $8,
                         description = $9,
                         mileage = $10
                     WHERE id = $11`;
      const params = [
        vehicle.customerId,
        JSON.stringify(vehicle.serviceIds || []),
        JSON.stringify(vehicle.technicianIds || []),
        vehicle.make,
        vehicle.model,
        vehicle.plateNumber,
        vehicle.year,
        vehicle.color,
        vehicle.description,
        vehicle.mileage,
        vehicle.id,
      ];
      await db.execute(query, params);
    }

    // Update technician (example)
    async function updateTechnician(technician: Technician): Promise<void> {
      const query = `UPDATE ${tables.technicians}
                     SET fullName = $1,
                         email = $2,
                         phone = $3
                     WHERE id = $4`;
      const params = [technician.fullName, technician.email, technician.phone, technician.id];
      await db.execute(query, params);
    }
  
    // Delete (example)
    async function deleteService(id: number): Promise<void> {
      const query = `DELETE FROM ${tables.services} WHERE id = $1`;
      const params = [id];
      await db.execute(query, params);
    }

    // Delete customer (example)
    async function deleteCustomer(id: number): Promise<void> {
      const query = `DELETE FROM ${tables.customers} WHERE id = $1`;
      const params = [id];
      await db.execute(query, params);
    }

    // Delete vehicle (example)
    async function deleteVehicle(id: number): Promise<void> {
      const query = `DELETE FROM ${tables.vehicles} WHERE id = $1`;
      const params = [id];
      await db.execute(query, params);
    }

    // Delete technician (example)

    async function deleteTechnician(id: number): Promise<void> {
      const query = `DELETE FROM ${tables.technicians} WHERE id = $1`;
      const params = [id];
      await db.execute(query, params);
    }
  
    // You can add similar update and delete functions for other tables (vehicles, customers, technicians)
  
    return {
      // Get All functions
      getAllServices,
      getAllVehicles,
      getAllCustomers,
      getAllTechnicians,
  
      // Create functions
      createService,
      createVehicle,
      createCustomer,
      createTechnician,
  
      // Read functions
      getServiceById,
      getVehicleById,
      getCustomerById,
      getTechnicianById,
  
      // Additional functions (examples)
      getServicesByCustomerId,
  
      // Update functions (example)
      updateService,
      updateCustomer,
      updateVehicle,
      updateTechnician,
  
      // Delete functions (example)
      deleteService,
      deleteCustomer,
      deleteVehicle,
      deleteTechnician,
    };
};