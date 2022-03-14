<template>
  <div class="cards">
    <el-card shadow="hover">
      <el-table :data="datasets" style="width: 100%; font-size: 16px">
        <el-table-column prop="name" label="Dataset Name" width="480px" />
        <el-table-column label="Paper">
          <template slot-scope="scope">
            <el-link style="font-size: 16px" type="primary" :href="scope.row.paper">
              <span>{{ scope.row.paper }}</span>
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="hover">
      <el-table :data="classifiers" style="width: 100%; font-size: 16px">
        <el-table-column prop="name" label="Classifier Name" width="480px" />
        <el-table-column label="Paper">
          <template slot-scope="scope">
            <el-link style="font-size: 16px" type="primary" :href="scope.row.paper">{{ scope.row.paper }}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="hover">
      <el-table :data="attacks" style="width: 100%; font-size: 16px">
        <el-table-column prop="name" label="Attack Name" width="480px" />
        <el-table-column label="Paper">
          <template slot-scope="scope">
            <el-link style="font-size: 16px" type="primary" :href="scope.row.paper">{{ scope.row.paper }}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>  
import post from '../../utils/requests.js';

export default {
  name: 'Paper',
  props: ['base_url'],
  data () {
    return {
      datasets: [],
      classifiers: [],
      attacks: [],
      url: this.base_url
    };
  },
  created() {
    this.getPapers();
  },
  methods: {
    getPapers() {
      this.getDataSets();
      this.getClassfiers();
      this.getAttacks();
    },

    getDataSets() {
      post(this.url + "/datasets", null).then(res => {
        this.datasets = res.data;  
      });
    },

    getClassfiers() {
      post(this.url + "/classifiers", null).then(res => {
        this.classifiers = res.data;  
      });
    },

    getAttacks() {
      post(this.url + "/attacks", null).then(res => {
        this.attacks = res.data;
      });
    }
  }
};
</script>

<style scoped lang="less">
  .el-card{
    width: 70%;
    margin: 0 auto;
    margin-top: 40px;
  }
</style>
