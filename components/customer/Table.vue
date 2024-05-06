<script setup lang="ts">
import { ElTable } from 'element-plus'
import type { Customer} from "~/types";
const { getCustomers ,removeCustomer} = useCustomer();

const customers = computed(() =>
  getCustomers().value.map((customer) => ({
    id: customer.id.toString(),
    name: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    companyName: customer.companyName,
    description: customer.description,
    registerDate: new Date(customer.registeredAt).toISOString().split("T")[0],
  }))
);

const currentRow =ref <Customer | undefined>();
const singleTableRef = ref<InstanceType<typeof ElTable>>()

const setCurrent = (row?: Customer) => {
  singleTableRef.value!.setCurrentRow(row)
}
const handleCurrentChange = (val: Customer | undefined) => {
  currentRow.value = val
}

const handleClickDetay = () => {
  if (currentRow.value) {
    useRouter().push({ path: `/oto/customer/${currentRow.value.id}` });
  }
  currentRow.value ? console.log(currentRow.value.id) : null;
  
};
const handleClickDelete = (id)=>{
  //removeCustomer(id);
  console.log(id);
}
</script>

<template>
  <div class="w-max bg-[#562dd4] mx-auto m-5">
    <el-table class="" :data="customers" height="500" style = "width:1000"
     @current-change="handleCurrentChange" ref="singleTableRef">
      <el-table-column fixed prop="name" label="Müşteri Adı" width="150" />
      <el-table-column prop="companyName" label="Şirket Adı" width="200" />
      <el-table-column prop="phone" label="Telefon" width="120" />
      <el-table-column prop="description" label="Açıklama" width="300" />
      <el-table-column prop="registerDate" label="Kayıt Tarihi" width="120" />
      <el-table-column fixed="right" label="İşlemler" width="200">
        <template #default >
          <div class="w-80">
            <el-button link type="primary" size="medium" @click="handleClickDetay">Detay</el-button>
            <el-button link type="primary" size="medium">Düzenle</el-button>
            <el-button link type="primary" size="medium" @click="handleClickDelete()">Sil</el-button>
        </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>





