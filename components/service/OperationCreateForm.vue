<script setup lang="ts">
import type { ServiceOperation, ServiceType } from '~/types/business'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

const props = defineProps<{
    service_id: number
}>()
const loading = ref(false);
const dialog = ref(false)

const username = useLocalStorage('username', '')

const emit = defineEmits(['closeModal', 'refreshData'])

const { createServiceOperation, getServiceTypes } = useDatabase()

const serviceTypes = ref<ServiceType[]>([])

const callGetServiceTypes = async () => {
    console.log("Getting Service Types")
    serviceTypes.value = await getServiceTypes()
}

onMounted(async () => {
    await callGetServiceTypes()
})

interface RuleForm {
    service_type_name: string
    quantity: number
    note: string
}

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    service_type_name: '',
    quantity: 1,
    note: '',

})

const rules = reactive<FormRules<RuleForm>>({
    service_type_name: [
        { required: true, message: 'Operasyon türü seçiniz', trigger: 'blur' },
    ],
    quantity: [
        { required: false, message: 'Miktar giriniz', trigger: 'blur' },
    ],
    note: [
        { required: false, message: 'Not giriniz', trigger: 'blur' },
    ],
})




const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            loading.value = true;
            try {

                const create_res = await createServiceOperation({
                    service_id: props.service_id,
                    service_type_id: serviceTypes.value.find((st) => st.name === ruleForm.service_type_name)?.id,
                    quantity: ruleForm.quantity,
                    note: ruleForm.note,
                    createdBy: username.value
                })
                console.log("Create Response", create_res)
                useShowToast('Operasyon oluşturma Başarılı', 'success')
                emit("closeModal")
                emit("refreshData")

            } catch (e) {
                useShowToast("Operasyon oluşturulurken bir hata oluştu", "error")
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
        <el-tooltip class="box-item" effect="dark" content="Servis Op. Türü Kaydı(Örneğin: Teker tamiratı)" placement="top">
                    <el-button type="success" plain @click="dialog = true">Servis Op. Türü Ekle</el-button>
                </el-tooltip>
        <el-form-item label="Servis Operasyon Türü" prop="service_type_name">
            <div class="flex gap-2 justify-center">
                <el-select clearable v-model="ruleForm.service_type_name" placeholder="Operasyon türü seçiniz" size="large"
      style="width: 240px">
                    <el-option v-for="item in serviceTypes" :key="item.id" :label="item.name" :value="item.name" />
                </el-select>
                

                <el-drawer v-model="dialog" title="Servis Operasyon Türü Oluştur" direction="ltr">
                    
                        <ServiceTypeCreateForm :close-modal="()=>dialog=false" :refresh-data="callGetServiceTypes" />
                    
                </el-drawer>

            </div>
        </el-form-item>

        <el-form-item label="Miktar" prop="quantity">
            <el-input-number v-model="ruleForm.quantity" :min="1" :max="1000" :step="1" />
        </el-form-item>

        <el-form-item label="Not" prop="note">
            <el-input v-model="ruleForm.note" clearable />
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading">
                Oluştur
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
            <el-button @click="$emit('closeModal')">İptal et</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped>
.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
</style>