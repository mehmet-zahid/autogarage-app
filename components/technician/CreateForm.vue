<script setup lang="ts">
import type {Technician } from '~/types/business'
const emit = defineEmits(['closeModal', 'refreshData'])
const { createTechnician} = useDatabase()
// do not use same name with ref
const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  description:''
 
})

const technician:Ref<Technician> = computed(() => {
  return {
    fullName: form.fullName,
    email: form.email,
    phone: form.phone,


  }
})

const onSubmit = async () => {
  try{
    const create_tech = await createTechnician(technician.value)
    useShowToast('Teknisyen başarıyla eklendi','success')
    emit("closeModal")
    emit("refreshData")

  }catch(e){
    useShowToast(" eklenirken bir sorun oluştu", "error")
  }


}
</script>


<template>
<el-form :model="form" label-width="auto" style="max-width: 600px">
    <el-form-item label="Teknisyen adı">
      <el-input v-model="form.fullName" />
    </el-form-item>
    <el-form-item label=" Teknisyen Telefon">
      <el-input v-model="form.email" />
    </el-form-item>
    <el-form-item label=" Marka Modeli">
      <el-input v-model="form.phone" />
    </el-form-item>
   
   

    <el-form-item label="Açıklama">
      <el-input v-model="form.description" type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">Kaydet </el-button>
      <el-button @click="$emit('closeModal')">Vazgeç</el-button>
    </el-form-item>
  </el-form>

</template>