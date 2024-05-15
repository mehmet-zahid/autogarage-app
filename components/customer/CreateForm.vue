<script setup lang="ts">
import type { Customer } from '~/types/business'
const emit = defineEmits(['closeModal', 'refreshData'])
const { createCustomer } = useDatabase()
// do not use same name with ref
const form = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  companyName: '',
  description: ''
})

const customer: Ref<Customer> = computed(() => {
  return {
    fullName: form.name,
    email: form.email,
    phone: form.phone,
    address: form.address,
    companyName: form.companyName,
    description: form.description
  }
})


const onSubmit = async () => {
  try {
    const create_res = await createCustomer(customer.value)
    useShowToast('Müşteri başarıyla eklendi', 'success')
    emit("closeModal")
    emit("refreshData")

  } catch (e) {
    useShowToast("Müşteri eklenirken bir hata oluştu", "error")
  }


}
</script>


<template>
  <el-form :model="form" label-width="auto" style="max-width: 900px">
    <el-form-item label="Müşteri Adı">
      <el-input v-model="form.name" />
    </el-form-item>

    <el-form-item label="Müşteri Email">
      <el-input v-model="form.email" />
    </el-form-item>

    <el-form-item label="Müşteri Şirket">
      <el-input v-model="form.companyName" />
    </el-form-item>

    <el-form-item label="Müşteri Telefon">
      <el-input v-model="form.phone" />
    </el-form-item>
    <el-form-item label="Müşteri Adres">
      <el-input v-model="form.address" />
    </el-form-item>

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
    </el-form-item> -->

    <!-- <el-form-item label="Resources">
      <el-radio-group v-model="form.resource">
        <el-radio value="Sponsor">Sponsor</el-radio>
        <el-radio value="Venue">Venue</el-radio>
      </el-radio-group>
    </el-form-item> -->

    <el-form-item label="Açıklama">
      <el-input v-model="form.description" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Kaydet </el-button>
      <el-button @click="$emit('closeModal')">İptal et</el-button>
    </el-form-item>
  </el-form>

</template>