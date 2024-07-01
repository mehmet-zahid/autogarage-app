<script setup lang="ts">

import type { Vehicle } from '~/types/business'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'


const loading = ref(false);

const props = defineProps<{
    customer_id: number
}>()
const emit = defineEmits(['closeModal', 'refreshData'])

const { createVehicle } = await useDatabase()

interface RuleForm {
    make: string;
    model: string;
    vin: string;
    year: number;
    color: string;
    description: string;
    plateNumber: string;
    mileage: number;
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  customer_id: props.customer_id,
    make: '',
    model: '',
    vin: '',
    year: 0,
    color: '',
    description: '',
    plateNumber: '',
    mileage: 0

})

const rules = reactive<FormRules<RuleForm>>({
    make: [{ required: true, message: 'Marka adı gereklidir', trigger: 'blur' }],
    model: [{ required: true, message: 'Model adı gereklidir', trigger: 'blur' }],
    vin: [{ required: false, message: 'Şasi numarası gereklidir', trigger: 'blur' }],
    year: [{ required: true, message: 'Yıl bilgisi gereklidir', trigger: 'blur' }],
    color: [{ required: true, message: 'Renk bilgisi gereklidir', trigger: 'blur' }],
    plateNumber: [{ required: true, message: 'Plaka numarası gereklidir', trigger: 'blur' }],
    mileage: [{ required: true, message: 'Kilometre bilgisi gereklidir', trigger: 'blur' }],
    description: [{ required: false, message: 'Açıklama gereklidir', trigger: 'blur' }]
})




const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      try {

        const create_res = await createVehicle(ruleForm)
        console.log("Create Response", create_res)
        useShowToast('Araç başarıyla eklendi', 'success')
        emit("closeModal")
        emit("refreshData")

      } catch (e) {
        if (e.includes('UNIQUE constraint failed: Vehicle.plateNumber')) {
          useShowToast('Bu plaka numarası zaten mevcut. Lütfen farklı bir plaka numarası girin.', 'error');
        } else {
          useShowToast('Bir hata oluştu. Lütfen tekrar deneyin.', 'error');
        }
        
        console.log("Error", e)
      }
      loading.value = false;

    } else {
      console.log('error submit!', fields)
      useShowToast('Lütfen formu doğru doldurunuz', 'error')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

</script>


<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" style="max-width: 600px"
    :size="formSize" status-icon>
    <el-form-item label="Marka" prop="make">
      <el-input v-model="ruleForm.make" placeholder="Marka" clearable></el-input>
    </el-form-item>
    <el-form-item label="Model" prop="model">
      <el-input v-model="ruleForm.model" placeholder="Model" clearable></el-input>
    </el-form-item>
    <el-form-item label="Şasi Numarası" prop="vin">
      <el-input v-model="ruleForm.vin" placeholder="Şasi Numarası" clearable></el-input>
    </el-form-item>
    <el-form-item label="Yıl" prop="year">
      <el-input v-model="ruleForm.year" placeholder="Yıl" clearable></el-input>
    </el-form-item>
    <el-form-item label="Renk" prop="color">
      <el-input v-model="ruleForm.color" placeholder="Renk" clearable></el-input>
    </el-form-item>
    <el-form-item label="Plaka Numarası" prop="plateNumber">
      <el-input v-model="ruleForm.plateNumber" placeholder="Plaka Numarası" clearable></el-input>
    </el-form-item>
    <el-form-item label="Kilometre" prop="mileage">
      <el-input v-model="ruleForm.mileage" placeholder="Kilometre" clearable></el-input>
    </el-form-item>
    <el-form-item label="Açıklama" prop="description">
      <el-input v-model="ruleForm.description" placeholder="Açıklama" clearable></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Oluştur
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      <el-button @click="$emit('closeModal')">İptal et</el-button>
    </el-form-item>
  </el-form>

</template>