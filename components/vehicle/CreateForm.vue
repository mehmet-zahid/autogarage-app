<script setup lang="ts">
import type {Vehicle } from '~/types/business'
const emit = defineEmits(['closeModal', 'refreshData'])
const { createVehicle} = useDatabase()
// do not use same name with ref
const form = reactive({
  plate: '',
  model: '',
  make:'',
  year: '',
  color:'',
  description: '',
  mileage:'',
})

const vehicle: Ref<Vehicle> = computed(() => {
  return {
    plateNumber: form.plate,
    make: form.model,
    model: form.year,
    year:form.year,
    color:form.color,
    description: form.description,
    mileage:form.mileage
  }
})

const onSubmit = async () => {
  try{
    const create_veh = await createVehicle(vehicle.value)
    useShowToast('Araç başarıyla eklendi','success')
    emit("closeModal")
    emit("refreshData")

  }catch(e){
    useShowToast("Araç eklenirken bir sorun oluştu", "error")
  }


}
</script>


<template>
<el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="Araç Plakası">
      <el-input v-model="form.plate" />
    </el-form-item>
    <el-form-item label="Araç Kilometresi">
      <el-input v-model="form.mileage" />
    </el-form-item>
    <el-form-item label="Araç Marka Modeli">
      <el-input v-model="form.model" />
    </el-form-item>
    <el-form-item label="Araç Üretim Yılı">
      <el-input v-model="form.year" />
    </el-form-item>
    <el-form-item label="Araç Rengi">
      <el-input v-model="form.color" />
    </el-form-item>
   
<!--     
    <el-form-item label="Activity time">
      <el-col :span="11">
        <el-date-picker
          v-model="form.date1"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </el-col>
      <el-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </el-col>
      <el-col :span="11">
        <el-time-picker
          v-model="form.date2"
          placeholder="Pick a time"
          style="width: 100%"
        />
      </el-col>
    </el-form-item> -->
    <!-- <el-form-item label="Instant delivery">
      <el-switch v-model="form.delivery" />
    </el-form-item> -->
    <!-- <el-form-item label="Activity type">
      <el-checkbox-group v-model="form.type">
        <el-checkbox value="Online activities" name="type">
          Online activities
        </el-checkbox>
        <el-checkbox value="Promotion activities" name="type">
          Promotion activities
        </el-checkbox>
        <el-checkbox value="Offline activities" name="type">
          Offline activities
        </el-checkbox>
        <el-checkbox value="Simple brand exposure" name="type">
          Simple brand exposure
        </el-checkbox>
      </el-checkbox-group> 
    </el-form-item>-->
    <!-- <el-form-item label="Resources">
      <el-radio-group v-model="form.resource">
        <el-radio value="Sponsor">Sponsor</el-radio>
        <el-radio value="Venue">Venue</el-radio>
      </el-radio-group>
    </el-form-item> -->
    <el-form-item label="Activity form">
      <el-input v-model="form.description" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Kaydet </el-button>
      <el-button @click="$emit('closeModal')">Vazgeç</el-button>
    </el-form-item>
  </el-form>

</template>