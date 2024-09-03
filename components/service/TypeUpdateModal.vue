<script setup lang="ts">

import type { ServiceType } from '~/types/business'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

const modal = useModal()

const props = defineProps<{
  serviceType: ServiceType
}>()

const loading = ref(false);


const emit = defineEmits(['refreshData'])

const { updateServiceType } = await useDatabase()


const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<ServiceType>({
    id: props.serviceType.id,
    name: props.serviceType.name,
    description: props.serviceType.description,
    price: props.serviceType.price

})

// Store initial vehicle data to compare with later
const initialServiceType = { ...props.serviceType }

watch(
  () => props.serviceType,
  (newServiceType) => {
    ruleForm.name = newServiceType.name
    ruleForm.description = newServiceType.description
    ruleForm.price = newServiceType.price
    Object.assign(initialServiceType, newServiceType) // Update initial data
  },
  { immediate: true, deep: true }
)

const rules = reactive<FormRules<ServiceType>>({
    name: [
        { required: true, message: 'Operasyon türü seçiniz', trigger: 'blur' },
    ],
    description: [
        { required: false, message: 'Not giriniz', trigger: 'blur' },
    ],
    price: [
        { required: false, message: 'Miktar giriniz', trigger: 'blur' },
    ],
})

// Function to check if form data has changed
const isFormChanged = () => {
    return Object.keys(ruleForm).some(key => ruleForm[key] !== initialServiceType[key])
}


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (!isFormChanged()) {
                useShowToast("Verilerde herhangi bir değişiklik yok", "warning")
                return
            }
      loading.value = true;
      try {
        console.log("Rule Form", ruleForm)
        const update_res = await updateServiceType(ruleForm)
        console.log("Update Response", update_res)
        useShowToast('Servis türü güncellendi', 'success')
        emit("refreshData")
        modal.close()

      } catch (e) {
        useShowToast("Servis Türü güncellenirken bir hata oluştu", "error")
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
  <UModal>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" style="max-width: 600px"
    :size="formSize" status-icon class="p-3">
    <el-form-item label="Servis Türü" prop="name">
            <el-input v-model="ruleForm.name" placeholder="Servis Operasyon adı"></el-input>
        </el-form-item>
        <el-form-item label="Açıklama" prop="description">
            <el-input v-model="ruleForm.description" placeholder="Açıklama"></el-input>
        </el-form-item>
        <el-form-item label="Fiyat (TL)" prop="price">
            <el-input v-model="ruleForm.price" placeholder="Fiyat"></el-input>
        </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading">
        Güncelle
      </el-button>
      <el-button @click="modal.close()">İptal et</el-button>
    </el-form-item>
  </el-form>
</UModal>
</template>