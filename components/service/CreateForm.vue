<template>
  <el-form :model="form" label-width="auto" style="max-width: 900px">
    <el-row>
      <el-col :span="14">
        <el-form-item label="Araç Plakası">
          <el-select v-model="form.vehicleIds" placeholder="Araç plaka">
            <el-option
              v-for=" vehicle in vehiclesData"
              :key="vehicle.id"
              :label="vehicle.plateNumber"
              :value="vehicle.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" class="ml-3">
        <el-form-item>
          <UButton @click="isModalOpenVehicle = true">Araç Ekle</UButton>
          <div class="p-4">
            <UModal v-model="isModalOpenVehicle">
              <UCard :ui="{ padding: 'p-1' }">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Araç Kayıt</h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isModalOpenVehicle = false" />
                  </div>
                </template>
                <VehicleCreateForm @close-modal="isModalOpenVehicle = false" @refresh-data="refreshData" />
              </UCard>
            </UModal>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    
    <el-row>
      <el-col :span="14">
        <el-form-item label="Müşteri Seçiniz">
          <el-select v-model="form.customerId" placeholder="Müşteri Adı">
            <el-option
              v-for="customer in customersData"
              :key="customer.id"
              :label="customer.fullName"
              :value="customer.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" class="ml-3">
        <el-form-item>
          <UButton @click="isModalOpenCustomer = true">Müşteri Ekle</UButton>
          <div class="p-4">
            <UModal v-model="isModalOpenCustomer">
              <UCard :ui="{ padding: 'p-1' }">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Müşteri Kayıt</h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isModalOpenCustomer = false" />
                  </div>
                </template>
                <CustomerCreateForm @close-modal="isModalOpenCustomer = false" @refresh-data="refreshData" />
              </UCard>
            </UModal>
          </div>
        </el-form-item>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="14">
        <el-form-item label="Teknisyen">
          <el-select v-model="form.technicianIds" placeholder="Teknisyen">
            <el-option
              v-for="technician in techniciansData"
              :key="technician.id"
              :label="technician.fullName"
              :value="technician.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6" class="ml-3">
        <el-form-item>
          <UButton @click="isModalOpenTechnician = true">Teknisyen Ekle</UButton>
          <div class="p-4">
            <UModal v-model="isModalOpenTechnician">
              <UCard :ui="{ padding: 'p-1' }">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">Teknisyen Kayıt</h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="isModalOpenTechnician = false" />
                  </div>
                </template>
                <TechnicianCreateForm @close-modal="isModalOpenTechnician = false" @refresh-data="refreshData" />
              </UCard>
            </UModal>
          </div>
        </el-form-item>
      </el-col>
    </el-row> 
    <el-form-item label="Şikayet">
      <el-input v-model="form.address" type="textarea" rows="3" />
    </el-form-item>

    <el-form-item label="Yapılan İşlemler">
      <el-input v-model="form.companyName" type="textarea" rows="5"/>
    </el-form-item>

    <el-form-item label="Toplam Fiyat">
      <el-input v-model="form.totalCost" />
    </el-form-item>
    
    <el-form-item label="Başlangıç tarihi">
      <el-row>
        <el-time-picker v-model="form.createdAt" placeholder="Saat Seçin" style="width: 100%" />
      </el-row>
    </el-form-item>
    <el-form-item label="Bitiş tarihi">
      <el-row>
        <el-time-picker v-model="form.registeredTime" placeholder="Saat Seçin" style="width: 100%" />
      </el-row>
    </el-form-item>

    <el-form-item label="Açıklama">
      <el-input v-model="form.description" type="textarea" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">Kaydet</el-button>
      <el-button @click="$emit('closeModal')">İptal et</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { Service } from '~/types/business';
const emit = defineEmits(['closeModal', 'refreshData']);
const isModalOpenVehicle = ref(false);
const isModalOpenCustomer = ref(false);
const isModalOpenTechnician = ref(false);
//const isModalOpen = ref(false);

const { createService, getAllCustomers, getAllTechnicians, getAllVehicles } = useDatabase();

const vehiclesData = ref([]);
vehiclesData.value = await getAllVehicles();

const techniciansData = ref([]);
techniciansData.value = await getAllTechnicians();

const customersData = ref([]);
customersData.value = await getAllCustomers();
const refreshData = async () => {
  vehiclesData.value = await getAllVehicles();
  techniciansData.value = await getAllTechnicians();
  customersData.value = await getAllCustomers();
}



const form = reactive({
  customerId: '',
  technicianIds: '',
  vehicleIds: '',
  totalCost: '',
  note: '',
  createdBy: '',
  createdAt:'',
});

const service: Ref<Service> = computed(() => ({
  customerId: form.customerId,
  technicianIds: form.technicianIds,
  vehicleIds: form.vehicleIds,
  totalCost: form.totalCost,
  note: form.note,
  createdBy: form.createdBy,
  createdAt:form.createdAt
}));

const onSubmit = async () => {
  try {
    const create_service = await createService(service.value);
    useShowToast('Müşteri başarıyla eklendi', 'success');
    emit("closeModal");
    emit("refreshData");
    console.log(service.value);
    
  
  } catch (e) {
    console.log(e);
    useShowToast("Bir sorun oluştu");
  }
}
</script>
