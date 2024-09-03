<template>
     <div class="m-4">
     <el-row :gutter="16">
       <el-col :span="8">
         <div class="statistic-card">
           <el-statistic :value="40000">
             <template #title>
               <div style="display: inline-flex; align-items: center">
                 Günlük Kazanç (TL)
                 <el-tooltip
                   effect="dark"
                   content="Günlük kazanç"
                   placement="top"
                 >
                   <el-icon style="margin-left: 4px" :size="12">
                     <Warning />
                   </el-icon>
                 </el-tooltip>
               </div>
             </template>
           </el-statistic>
           <div class="statistic-footer">
             <div class="footer-item">
               <span>Bir önceki günden</span>
               <span class="green">
                 24%
                 <el-icon>
                   <CaretTop />
                 </el-icon>
               </span>
             </div>
           </div>
         </div>
       </el-col>
       <el-col :span="8">
         <div class="statistic-card">
           <el-statistic :value="100">
             <template #title>
               <div style="display: inline-flex; align-items: center">
                 Toplam Müşt. Sayısı
                 <el-tooltip
                   effect="dark"
                   content="Toplam müşteri sayısı"
                   placement="top"
                 >
                   <el-icon style="margin-left: 4px" :size="12">
                     <Warning />
                   </el-icon>
                 </el-tooltip>
               </div>
             </template>
           </el-statistic>
           <div class="statistic-footer">
             <div class="footer-item">
               <span>aylık artış</span>
               <span class="red">
                 12%
                 <el-icon>
                   <CaretBottom />
                 </el-icon>
               </span>
             </div>
           </div>
         </div>
       </el-col>
       <el-col :span="8">
         <div class="statistic-card">
           <el-statistic :value="16" title="New transactions today">
             <template #title>
               <div style="display: inline-flex; align-items: center">
                 Ödeme Bekleyen Servisler
               </div>
             </template>
           </el-statistic>
           <div class="statistic-footer">
             <div class="footer-item">
               <span>dün'den</span>
               <span class="green">
                 16%
                 <el-icon>
                   <CaretTop />
                 </el-icon>
               </span>
             </div>
             <div class="footer-item">
               <el-icon :size="14">
                 <ArrowRight />
               </el-icon>
             </div>
           </div>
         </div>
       </el-col>
     </el-row>
</div>
   </template>
   
   <script lang="ts" setup>
   import {
     ArrowRight,
     CaretBottom,
     CaretTop,
     Warning,
   } from '@element-plus/icons-vue'
   </script>
   
   <style scoped>
   :global(h2#card-usage ~ .example .example-showcase) {
     background-color: var(--el-fill-color) !important;
   }
   
   .el-statistic {
     --el-statistic-content-font-size: 28px;
   }
   
   .statistic-card {
     height: 100%;
     padding: 20px;
     border-radius: 4px;
     background-color: var(--el-bg-color-overlay);
   }
   
   .statistic-footer {
     display: flex;
     justify-content: space-between;
     align-items: center;
     flex-wrap: wrap;
     font-size: 12px;
     color: var(--el-text-color-regular);
     margin-top: 16px;
   }
   
   .statistic-footer .footer-item {
     display: flex;
     justify-content: space-between;
     align-items: center;
   }
   
   .statistic-footer .footer-item span:last-child {
     display: inline-flex;
     align-items: center;
     margin-left: 4px;
   }
   
   .green {
     color: var(--el-color-success);
   }
   .red {
     color: var(--el-color-error);
   }
   </style>
   