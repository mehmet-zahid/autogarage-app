<script setup lang="ts">
import type {Vehicle } from '~/types'
const emit = defineEmits(['closeModal'])
const { addVehicle} = useVehicle()
// do not use same name with ref
const form = reactive({
  plate: '',
  model: '',
  year: '',
  description: '',
  mileage:'',
})

const vehicle: Vehicle = computed(() => {
  return {
    name: form.plate,
    email: form.model,
    phone: form.year,
    address: form.address,
  }
})

const onSubmit = () => {
  try{
    addVehicle(vehicle.value)
    useShowMessage('Araç başarıyla eklendi','success')
    emit("closeModal")
  }catch(e){
    console.log(e);
    useShowMessage("Bir sorun oluştu")
  }


}
</script>


<template>
<el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="Araç Plakası">
      <el-input v-model="form.plate" />
    </el-form-item>
    <el-form-item label="Araç Modeli">
      <el-input v-model="form.model" />
    </el-form-item>
    <el-form-item label="Araç Üretim Yılı">
      <el-input v-model="form.year" />
    </el-form-item>
    <el-form-item label="Araç Açıklaması">
      <el-input v-model="form.description" />
    </el-form-item>
    <el-form-item label="Araç Kilometresi">
      <el-input v-model="form.mileage" />
    </el-form-item>
    
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
    </el-form-item>
    <el-form-item label="Instant delivery">
      <el-switch v-model="form.delivery" />
    </el-form-item>
    <el-form-item label="Activity type">
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
    </el-form-item>
    <el-form-item label="Resources">
      <el-radio-group v-model="form.resource">
        <el-radio value="Sponsor">Sponsor</el-radio>
        <el-radio value="Venue">Venue</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Activity form">
      <el-input v-model="form.desc" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Create </el-button>
      <el-button @click="$emit('closeModal')">Cancel</el-button>
    </el-form-item>
  </el-form>

</template>