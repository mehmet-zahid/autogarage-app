import type { Customer } from "~/types";

export const useCustomer = () => {

    const getCustomers = () => {
        return useLocalStorage('customers', []);
    }
    
    const getCustomer = (id: string) => {
        const customers = getCustomers();
        return customers.value.find((customer: Customer) => customer.id === id);
    }

    const addCustomer = (customer: Customer) => {
        const customers = getCustomers();
        customer.id = customers.value.length + 1;
        customer.registeredAt = new Date();
        customer.isDeleted = false;
        customer.phone = ''
        customer.services = []
        customer.address = ''
        customer.email = ''
        customer.cars = []
        customers.value.push(customer);
    }

    const updateCustomer = (customer: Customer) => {
        const customers = getCustomers();
        const index = customers.value.findIndex((c: Customer) => c.id === customer.id);
        customers.value[index] = customer;
    }

    const removeCustomer = (id: string) => {
        const customers = getCustomers();
        const index = customers.value.findIndex((c: Customer) => c.id === id);
        customers.value.splice(index, 1);
    }
    
    return { 
        getCustomer, 
        getCustomers, 
        addCustomer, 
        updateCustomer, 
        removeCustomer
    };
    }