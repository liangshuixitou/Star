<template>
  <div>
    <div style="text-align: right">
      <div v-if="loadingAttack">
        <Loading></Loading>
      </div>
      <img src="../../assets/images/menu.png" style="height: 30px;position:absolute;top:8.8%;left:97%" @click="handleOptions" />
    </div>
    <div style="width: 70%; margin: 0 auto">
      <el-card
        shadow="hover"
        style="margin-top: 40px">
        <el-row :gutter="20" style="display: flex;align-items: center">
          <el-col :span="22">
            <div style="font-size: 40px;font-family: Helvetica">
              Visualize attack.
            </div>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" style="float: right" @click="runAttack">Attack</el-button>
          </el-col>
        </el-row>
        <h1>
        </h1>
      </el-card>
      <!--  sentences card  -->
      <el-card
        shadow="hover"
        style="margin-top: 20px">
        <el-row :gutter="20" style="margin-bottom: 0px;display: flex;align-items: center">
          <el-col :span="9">
            <div style="font-size: 25px;font-family: Helvetica">Origin sentences</div>
          </el-col>
          <el-col :span="2">
            <el-select v-model="total" placeholder="items total" style="width:100px;">
              <el-option
                v-for="item in totalOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value">
                <span style="float: left">{{ item.value }}</span>
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1">
            <el-button circle @click="getSamples" type="primary" class="el-icon-refresh-right" style="float: right"></el-button>
          </el-col>
          <el-col :span="10">
            <div style="font-size: 25px;font-family: Helvetica">Result sentences</div>
          </el-col>
          <el-col :span="2">
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 15px">
          <el-col :span="12">
            <el-table
              border
              :header-cell-style="{fontFamily:'微软雅黑',height:'60px',fontSize:'18px'}"
              :cell-style="{color: '#666', fontFamily: 'Times New Roman',fontSize:'18px',height:'60px'}"
              :data="origin_samples"
              :row-class-name="origin_table_row"
              height="500">
              <el-table-column
                prop="x"
                label="sentence"
                width="530">
              </el-table-column>
              <el-table-column
                prop="label"
                label="label">
              </el-table-column>
            </el-table>
          </el-col>
          <el-col :span="12">
            <el-table
              border
              :data="result_samples"
              :header-cell-style="{fontFamily:'微软雅黑',height:'60px',fontSize:'18px'}"
              :cell-style="{color: '#666', fontFamily: 'Times New Roman',fontSize:'18px',height:'60px'}"
              height="500">
              <el-table-column
                prop="result"
                label="sentence"
                width="530">
              </el-table-column>
              <el-table-column
                prop="y"
                label="label">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>
      <!--     -->
      <el-card
        shadow="hover"
        style="margin-top: 20px"
        v-show="attack_history.length !== 0">
        <el-row :gutter="20">
          <el-col :span="22">
            <div style="font-size: 25px;font-family: Helvetica">Attack Metrics</div>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" style="float: right" @click="clear_history">Clear</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-table
              style="margin-top: 20px"
              border
              :data="attack_history"
              :header-cell-style="{fontFamily:'微软雅黑',fontSize:'15px'}"
              :cell-style="{color: '#666', fontFamily: 'Times New Roman',fontSize:'18px',height:'60px'}">
              <el-table-column
                prop="attacker"
                label="Attacker"
                width="120">
              </el-table-column>
              <el-table-column
                prop="classifier"
                label="Classifier"
                width="120">
              </el-table-column>
              <el-table-column
                prop="total"
                label="Total Instances"
                width="150">
              </el-table-column>
              <el-table-column
                prop="total_success"
                label="Successful Instances"
                width="180">
              </el-table-column>
              <el-table-column
                prop="accuracy"
                label="Classifier Accuracy"
                width="180">
              </el-table-column>
              <el-table-column
                prop="attack_success_rate"
                label="Attack Success Rate"
                width="180">
              </el-table-column>
              <el-table-column
                prop="avg_victim_model_queries"
                label="Avg. Victim Model Queries">
              </el-table-column>
              <el-table-column
                prop="date"
                label="Time">
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <el-drawer
      title="Options"
      size="20%"
      :visible.sync="visual_drawer"
      direction="ltr">
      <div style="width: 90%; margin: 0 auto">
        <div style="font-size: 20px;font-family: Helvetica;margin-top: 20px">Select model</div>
        <el-select
          v-model="classifier"
          style="width: 100%; margin-top: 15px"
          stripe
          value-key="name">
          <el-option
            v-for="item in classifiers"
            :key="item.name"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
        <div style="font-size: 20px;font-family: Helvetica;margin-top: 40px">Select attack</div>
        <el-select
          v-model="attacker"
          style="width: 100%; margin-top: 15px"
          stripe
          value-key="name">
          <el-option
            v-for="item in attacks"
            :key="item.name"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import post from '../../utils/requests';
import Loading from '../templetes/Loading';

export default {
  components: {
    Loading
  },
  name: 'CVClassify',
  data () {
    return {
      classifiers: [],
      attacks: [],
      classifier: null,
      attacker: null,
      // sample sentences
      start: -1,
      total: 10,
      totalOptions: [
        { value: 5 },
        { value: 10 },
        { value: 20 },
        { value: 50 }
      ],
      origin_samples: [],
      result_samples: [],
      // show data
      attack_history: [],
      visual_drawer: false,
      loadingAttack: false
    };
  },
  created () {
    this.getClassfiers();
    this.getAttacks();
    this.getSamples();
  },
  methods: {
    handleOptions () {
      this.visual_drawer = true;
    },
    clear_history () {
      this.attack_history = [];
    },
    origin_table_row ({ row, rowIndex }) {
      if (typeof (row.flag) === 'undefined') {
        return '';
      }
      return row.flag + '-row';
    },
    result_table_row ({ row, index }) {
      if (row.y === 1) {
        return 'success-row';
      } else {
        return 'error-row';
      }
    },
    getClassfiers () {
      post('/nlp/classifiers', null).then(res => {
        this.classifiers = res.data;
      });
    },
    getAttacks () {
      post('/nlp/attacks', null).then(res => {
        this.attacks = res.data;
      });
    },
    getSamples () {
      const data = {
        start: -1,
        total: this.total
      };
      this.loadingAttack = true;
      post('/nlp/data_samples', data).then(res => {
        // set the label into fractionDigits: 4
        const sentences = res.data;
        for (let i = 0; i < sentences.length; ++i) {
          sentences[i].label = sentences[i].label.toFixed(4);
        }
        this.origin_samples = sentences;
        this.start = res.start;
        this.$message.success('Get samples successful!');
      });
      this.loadingAttack = false;
    },
    async runAttack () {
      if (!this.validateParams()) {
        this.visual_drawer = true;
        return;
      }
      this.loadingAttack = true;
      const data = {
        start: this.start,
        total: this.total,
        classifier_name: this.classifier.name,
        attacker_name: this.attacker.name
      };
      const { data: res } = await this.$http({
        method: 'post',
        url: '/nlp/attack',
        data: this.$qs.stringify(data)
      });
      // set the label into fractionDigits: 4
      const sentences = res.data.origin_samples;
      for (let i = 0; i < sentences.length; ++i) {
        sentences[i].label = sentences[i].label.toFixed(4);
      }
      this.origin_samples = sentences;
      this.result_samples = res.data.result_samples;
      this.loadingAttack = false;
      // set the show data
      const metrics = {
        attacker: this.attacker.name,
        classifier: this.classifier.name,
        total: this.origin_samples.length,
        total_success: this.result_samples.length,
        accuracy: (res.data.accuracy * 100).toFixed(4) + '%',
        attack_success_rate: (res.data.attack_success_rate * 100).toFixed(4) + '%',
        avg_running_time: res.data.avg_running_time,
        avg_victim_model_queries: res.data.avg_victim_model_queries,
        date: new Date().toLocaleString()
      };
      this.attack_history.push(metrics);
      this.$message.success('Attack successful!');
    },
    validateParams () {
      if (!this.classifier) {
        this.$message.error('Please select a model');
        return false;
      }
      if (!this.attacker) {
        console.log(this.attacker);
        this.$message.error('Please select a attack');
        return false;
      }
      return true;
    }
  }
};
</script>

<style lang="less">
  .el-table .error-row {
    background: rgb(253,226,226);
  }

  .el-table .warning-row {
    background: rgb(250,236,216);
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
