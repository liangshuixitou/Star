<template>
  <div>
    <el-table
      :header-cell-style="{background:'rgb(53, 140, 205)', height:'30px',fontSize:'15px',color:'white'}"
      :cell-style="{color: '#666',fontSize:'15px',height:'30px'}"
      :data="data"
      border
      style="width: 100%;margin-top: 30px">
      <el-table-column
        prop="label"
        label="Prediction"
        style="width: 50%">
      </el-table-column>
      <el-table-column
        align="right"
        prop="percentage"
        label="Probability">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'LabelPerTable',
  props: ['tableData'],
  data () {
    return {
      data: this.tableData
    };
  },
  watch: {
    tableData: {
      handler (n, o) {
        this.data = n;
      }
    }
  }
};
</script>

<style scoped>
</style>
