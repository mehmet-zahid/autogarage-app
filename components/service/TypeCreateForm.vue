<script setup lang="ts">
import type { ServiceType } from '~/types/business'
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'


const loading = ref(false);
const username = useLocalStorage('username', '')

const emit = defineEmits(['closeModal', 'refreshData'])

const { createServiceType } = await useDatabase()

const formSize = ref<ComponentSize>('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<ServiceType>({
    name: '',
    description: '',
    price: 0
})

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




const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            loading.value = true;
            try {

                const create_res = await createServiceType({
                    name: ruleForm.name,
                    description: ruleForm.description,
                    price: ruleForm.price,
                    createdBy: username.value
                })
                console.log("Create Response", create_res)
                useShowToast('Servis türü oluşturuldu', 'success')
                emit("closeModal")
                emit("refreshData")

            } catch (e) {
                useShowToast("Servis türü oluşturulurken bir hata vuku buldu", "error")
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
        <div class="flex flex-col gap-4 justify-center">
        <el-form-item label="Servis Türü" prop="name">
            <el-input v-model="ruleForm.name" placeholder="Servis Operasyon adı"></el-input>
        </el-form-item>
        <el-form-item label="Açıklama" prop="description">
            <el-input v-model="ruleForm.description" placeholder="Açıklama"></el-input>
        </el-form-item>
        <el-form-item label="Fiyat" prop="price">
            <el-input v-model="ruleForm.price" placeholder="Fiyat"></el-input>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="loading">
                Oluştur
            </el-button>
            <el-button @click="resetForm(ruleFormRef)">Reset</el-button>
            <el-button @click="$emit('closeModal')">İptal et</el-button>
        </el-form-item>
      </div>
    </el-form>
</template>