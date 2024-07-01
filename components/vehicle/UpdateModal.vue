<script setup lang="ts">
import type { Vehicle } from '~/types/business'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'

const modal = useModal()

const props = defineProps<{
    vehicle: Vehicle
}>()

const loading = ref(false)

const emit = defineEmits(['refreshData'])

const { updateVehicle } = await useDatabase()

interface RuleForm {
    id: number
    customer_id: number;
    registeredAt: Date;
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
    id: props.vehicle.id,
    customer_id: props.vehicle.customer_id,
    make: props.vehicle.make,
    model: props.vehicle.model,
    vin: props.vehicle.vin,
    year: props.vehicle.year,
    color: props.vehicle.color,
    description: props.vehicle.description,
    plateNumber: props.vehicle.plateNumber,
    mileage: props.vehicle.mileage,
})

// Store initial vehicle data to compare with later
const initialVehicle = { ...props.vehicle }

watch(
    () => props.vehicle,
    (newVehicle) => {
        ruleForm.id = newVehicle.id
        ruleForm.customer_id = newVehicle.customer_id
        ruleForm.make = newVehicle.make
        ruleForm.model = newVehicle.model
        ruleForm.vin = newVehicle.vin
        ruleForm.year = newVehicle.year
        ruleForm.color = newVehicle.color
        ruleForm.description = newVehicle.description
        ruleForm.plateNumber = newVehicle.plateNumber
        ruleForm.mileage = newVehicle.mileage
        Object.assign(initialVehicle, newVehicle) // Update initial data
    },
    { immediate: true, deep: true }
)

const rules = reactive<FormRules<RuleForm>>({
    make: [{ required: true, message: 'Marka bilgisi gereklidir', trigger: 'blur' }],
    model: [{ required: true, message: 'Model bilgisi gereklidir', trigger: 'blur' }],
    vin: [{ required: false, message: 'Şasi numarası gereklidir', trigger: 'blur' }],
    year: [{ required: true, message: 'Yıl bilgisi gereklidir', trigger: 'blur' }],
    color: [{ required: true, message: 'Renk bilgisi gereklidir', trigger: 'blur' }],
    description: [{ required: false, message: 'Açıklama bilgisi gereklidir', trigger: 'blur' }],
    plateNumber: [{ required: true, message: 'Plaka numarası gereklidir', trigger: 'blur' }],
    mileage: [{ required: true, message: 'Kilometre bilgisi gereklidir', trigger: 'blur' }],
})

// Function to check if form data has changed
const isFormChanged = () => {
    return Object.keys(ruleForm).some(key => ruleForm[key] !== initialVehicle[key])
}

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            if (!isFormChanged()) {
                useShowToast("Verilerde herhangi bir değişiklik yok", "warning")
                return
            }
            loading.value = true
            try {
                console.log("Rule Form", ruleForm)
                const update_res = await updateVehicle(ruleForm)
                console.log("Update Response", update_res)
                useShowToast('Araç Bilgileri Başarıyla Güncellendi.', 'success')
                emit("refreshData")
                modal.close()
            } catch (e) {
                useShowToast("Araç bilgileri güncellenirken bir hata oluştu", "error")
                console.log("Error", e)
            }
            loading.value = false
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
            <el-form-item label="Açıklama" prop="description">
                <el-input v-model="ruleForm.description" placeholder="Açıklama" clearable></el-input>
            </el-form-item>
            <el-form-item label="Plaka Numarası" prop="plateNumber">
                <el-input v-model="ruleForm.plateNumber" placeholder="Plaka Numarası" clearable></el-input>
            </el-form-item>
            <el-form-item label="Kilometre" prop="mileage">
                <el-input v-model="ruleForm.mileage" placeholder="Kilometre" clearable></el-input>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="submitForm(ruleFormRef)">
                    Güncelle
                </el-button>
                <el-button @click="modal.close()">İptal et</el-button>
            </el-form-item>
        </el-form>
    </UModal>
</template>
