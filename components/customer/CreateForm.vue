<script setup lang="ts">

import type { Customer } from '~/types/business'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'


const loading = ref(false);


const emit = defineEmits(['closeModal', 'refreshData'])

const { createCustomer } = await useDatabase()

interface RuleForm {
  name: string
  email: string
  phone: string
  address: string
  companyName: string
  description: string
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  name: '',
  email: '',
  phone: '',
  address: '',
  companyName: '',
  description: ''

})

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 5, max: 20, message: 'Length should be 5 to 20', trigger: 'blur' },
  ],
  email: [
    {
      required: true,
      message: 'Please input email address',
      trigger: 'change',
    },
    {
      type: 'email',
      message: 'Please input correct email address',
      trigger: ['blur', 'change'],
    },
  ],
  phone: [
    {
      required: true,
      message: 'Please input phone number',
      trigger: 'change',
    },

  ],
  address: [
    {
      required: true,
      message: 'Please input address',
      trigger: 'change',
    },
  ],
  companyName: [
    {
      required: true,
      message: 'Please input company name',
      trigger: 'change',
    },
  ],
  description: [
    {
      required: true,
      message: 'Please input description',
      trigger: 'change',
    },
  ],
})




const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;
      try {

        const create_res = await createCustomer(ruleForm)
        console.log("Create Response", create_res)
        useShowToast('Müşteri başarıyla eklendi', 'success')
        emit("closeModal")
        emit("refreshData")

      } catch (e) {
        useShowToast("Müşteri eklenirken bir hata oluştu", "error")
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

function formatPhoneNumber(value: string) {
  const cleaned = ('' + value).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return value;
}

function parsePhoneNumber(value: string) {
  return value.replace(/\D/g, '');
}

</script>


<template>
  <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" style="max-width: 600px"
    :size="formSize" status-icon>
    <el-form-item label="Müşteri Adı" prop="name">
      <el-input v-model="ruleForm.name" clearable />
    </el-form-item>

    <el-form-item label="Müşteri Email" prop="email">
      <el-input v-model="ruleForm.email" type="email" clearable />
    </el-form-item>

    <el-form-item label="Müşteri Şirket">
      <el-input v-model="ruleForm.companyName" clearable />
    </el-form-item>

    <el-form-item label="Müşteri Telefon" prop="phone">
      <el-input v-model="ruleForm.phone" clearable :formatter="formatPhoneNumber" :parser="parsePhoneNumber"/>
    </el-form-item>
    <el-form-item label="Müşteri Adres">
      <el-input v-model="ruleForm.address" clearable />
    </el-form-item>

    <el-form-item label="Açıklama">
      <el-input v-model="ruleForm.description" type="textarea" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        Create
      </el-button>
      <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
      <el-button @click="$emit('closeModal')">İptal et</el-button>
    </el-form-item>
  </el-form>

</template>