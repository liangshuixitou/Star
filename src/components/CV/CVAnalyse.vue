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
            <div style="font-size: 40px;font-family: Helvetica">Visualize result.</div>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" style="float: right" @click="runAnalyse">Analyse</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card
        shadow="hover"
        style="margin-top: 20px">
        <div class="slider-box">
          <el-carousel indicator-position="outside" height="500px" :interval="3000">
            <el-carousel-item v-for="item in data" :key="item.name">
              <LineChart :chart_data="item" :epsilon="ret_epsilons" class="line-chart"></LineChart>
            </el-carousel-item>
          </el-carousel>
        </div>
      </el-card>
    </div>
    <el-drawer
      title="Options"
      size="25%"
      :visible.sync="visual_drawer"
      direction="ltr">
      <div style="width: 90%; margin: 0 auto">
        <div style="font-size: 20px;font-family: Helvetica;margin-bottom: 10px">Upload image</div>
        <el-upload
          action="action"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :http-request="uploadFile">
          <img v-if="imageUrl" :src="imageUrl" class="pre-image-analyse">
          <div v-else class="uploader-icon-analyse">
            <i  class="el-icon-plus"></i>
          </div>
        </el-upload>
        <div style="font-size: 20px;font-family: Helvetica;margin-top: 20px;margin-bottom: 10px">Select model</div>
          <el-table
            :data="classifiers"
            ref="classifiers"
            style="width: 100%;margin-bottom: 10px">
            <el-table-column
              type="selection"
              width="40">
            </el-table-column>
            <el-table-column
              prop="name"
              label="name">
            </el-table-column>
          </el-table>
        <div style="font-size: 20px;font-family: Helvetica;margin-top: 20px;margin-bottom: 10px">Select attack</div>
        <el-table
          :data="attacks"
          ref="attacks"
          style="width: 100%;margin-bottom: 10px">
          <el-table-column
            type="selection"
            width="40">
          </el-table-column>
          <el-table-column
            prop="name"
            label="name">
          </el-table-column>
        </el-table>
        <div style="font-size: 20px;font-family: Helvetica;margin-top: 20px;margin-bottom: 10px">Choose Epsilon</div>
        <el-slider style="margin-top: 15px;margin-bottom: 20px" v-model="epsilon" :min="0" :max="0.2" :step="step" range show-stops></el-slider>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import post from '../../utils/requests';
import Loading from '../templetes/Loading';
import LineChart from '../templetes/LineChart';

export default {
  name: 'CVAnalyse',
  components: {
    Loading,
    LineChart
  },
  data () {
    return {
      imageUrl: '',
      imageName: '',
      visual_drawer: false,
      classifiers: [],
      attacks: [],
      epsilon: [0.005, 0.03],
      step: 0.005,
      data: [],
      loadingAttack: false,
      ret_epsilons: []
    };
  },
  created () {
    this.getClassfiers();
    this.getAttacks();
  },
  methods: {
    getClassfiers () {
      post('/cv/classifiers', null).then(res => {
        this.classifiers = res.data;
      });
    },
    getAttacks () {
      post('/cv/attacks', null).then(res => {
        this.attacks = res.data;
      });
    },
    handleOptions () {
      this.visual_drawer = true;
    },
    async runAnalyse () {
      if (!this.validateParams()) {
        this.visual_drawer = true;
        return;
      }
      this.loadingAttack = true;
      const data = {
        imageName: this.imageName,
        epsilon: this.epsilon,
        step: this.step,
        classifiers: this.$refs.classifiers.selection,
        attacks: this.$refs.attacks.selection
      };
      const { data: res } = await this.$http({
        method: 'post',
        url: '/cv/analyse',
        header: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify(data)
      });
      this.loadingAttack = false;
      this.data = res.data;
      this.ret_epsilons = res.epsilons;
    },
    validateParams () {
      if (!this.imageName) {
        this.$message.error('Please upload a picture');
        return false;
      }
      if (this.$refs.classifiers.selection.length === 0) {
        this.visual_drawer = true;
        this.$message.error('Please select a model');
        return false;
      }
      if (this.$refs.attacks.selection.length === 0) {
        this.visual_drawer = true;
        this.$message.error('Please select a attack');
        return false;
      }
      return true;
    },
    async uploadFile (params) {
      const data = new FormData();
      data.append('file', params.file);
      const { data: res } = await this.$http({
        method: 'post',
        url: '/save',
        data: data
      });
      this.imageName = res;
    },
    uploadSuccess (res, file) {
      const baseImageUrl = 'http://127.0.0.1:9090/static/tmp/';
      this.imageUrl = baseImageUrl + this.imageName;
    }
  }
};
</script>

<style lang="less">
  .slider-box {
    margin: auto 0;
    .el-carousel__item {
      display: flex;
      align-items: center;
      .line-chart {
        width: 100%;
      }
    }
  }
  .el-drawer__body{
    overflow: auto;
  }
  .el-drawer__container ::-webkit-scrollbar{
    display: none;
  }
  .uploader-icon-analyse {
    font-size: 40px;
    color: #8c939d;
    width: 350px;
    height: 350px;
    display: inline-block;
    line-height: 350px;
  }
  .pre-image-analyse {
    width: 350px;
    height: 350px;
    display: block;
  }
</style>
