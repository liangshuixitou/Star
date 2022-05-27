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
            <div style="font-size: 40px;font-family: Helvetica">Visualize attack.</div>
          </el-col>
          <el-col :span="2">
            <el-button style="float: right;height: 100%" type="danger" @click="runAttack">Run</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card
        shadow="hover"
        style="margin-top: 20px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div style="margin-bottom: 10px;font-size: 25px;font-family: Helvetica">Origin image</div>
            <el-upload
              action="action"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :http-request="uploadFile">
              <img v-if="imageUrl" :src="imageUrl" class="pre-image">
              <div v-else class="uploader-icon">
                <i  class="el-icon-plus"></i>
              </div>
            </el-upload>
          </el-col>
          <el-col :span="8">
            <div style="margin-bottom: 10px;font-size: 25px;font-family: Helvetica">Result image</div>
            <el-image :src="result_image_url" class="result-image" fit="contain">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-col>
          <el-col :span="8">
            <div style="margin-bottom: 10px;font-size: 25px;font-family: Helvetica">Difference image</div>
            <el-image :src="difference_image_url" class="result-image" fit="fill">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-col>
        </el-row>
        <el-row v-if="attackResult.length !== 0 && classifyResult.length !== 0" :gutter="20">
          <el-col :span="8">
            <LabelPerTable :tableData="classifyResult">
            </LabelPerTable>
          </el-col>
          <el-col :span="8">
              <LabelPerTable :tableData="attackResult">
            </LabelPerTable>
          </el-col>
          <el-col :span="8">
            <div class="atk-abt atk-about-top">
              <span style="font-family: Helvetica">Model: </span>
              <el-link type="primary" style="font-weight: normal; font-size: 16px" :href="classifier.paper">{{ classifier.paper }}</el-link>
            </div>
            <div class="atk-abt">
              <span style="font-family: Helvetica">Attack: </span>
              <el-link type="primary" style="font-weight: normal; font-size: 16px" :href="attack.paper">{{ attack.paper }}</el-link>
            </div>
          </el-col>
        </el-row>
      </el-card>
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
            v-model="attack"
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
          <div style="font-size: 20px;font-family: Helvetica;margin-top: 40px">Choose Epsilon</div>
          <el-slider style="margin-top: 15px" v-model="epsilon" :min="0" :max="1" :step="0.01" show-input></el-slider>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import post from '../../utils/requests';
import LabelPerTable from '../templetes/LabelPerTable';
import Loading from '../templetes/Loading';

export default {
  name: 'CVClassify',
  components: {
    LabelPerTable,
    Loading
  },
  data () {
    return {
      imageUrl: '',
      imageName: '',
      result_image_name: '',
      difference_image_name: '',
      result_image_url: '',
      difference_image_url: '',
      classifiers: [],
      attacks: [],
      classifier: null,
      attack: null,
      classifyResult: [],
      attackResult: [],
      visual_drawer: false,
      epsilon: 0.05,
      loadingAttack: false
    };
  },
  created () {
    this.getClassfiers();
    this.getAttacks();
  },
  methods: {
    handleOptions () {
      this.visual_drawer = true;
    },
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
    },
    validateParams () {
      if (!this.classifier) {
        this.visual_drawer = true;
        this.$message.error('Please select a model');
        return false;
      }
      if (!this.attack) {
        this.visual_drawer = true;
        this.$message.error('Please select a attack');
        return false;
      }
      if (!this.imageName) {
        this.$message.error('Please upload a picture');
        return false;
      }
      return true;
    },
    async runAttack () {
      if (!this.validateParams()) {
        return;
      }
      const data = {
        image_name: this.imageName,
        classifier: this.classifier.name,
        attack: this.attack.name,
        epsilon: this.epsilon
      };
      this.loadingAttack = true;
      const { data: res } = await this.$http({
        method: 'post',
        url: '/cv/attack',
        data: this.$qs.stringify(data)
      });
      const baseImageUrl = 'http://127.0.0.1:9090/static/tmp/';
      this.result_image_name = res.result_image_name;
      this.difference_image_name = res.difference_image_name;
      this.result_image_url = baseImageUrl + this.result_image_name;
      this.difference_image_url = baseImageUrl + this.difference_image_name;
      this.runClassify(this.imageName, this.classifier.name).then(res => {
        this.classifyResult = this.pre_show_data(res);
      });
      this.runClassify(this.result_image_name, this.classifier.name).then(res => {
        this.attackResult = this.pre_show_data(res);
      });
      this.loadingAttack = false;
      this.$message.success('Attack successful!');
    },
    async runClassify (imageName, classifier) {
      const data = {
        image_name: imageName,
        classifier: classifier
      };
      const { data: res } = await this.$http({
        method: 'post',
        url: '/cv/classify',
        data: this.$qs.stringify(data)
      });
      return res.data;
    },
    pre_show_data (result) {
      for (let i = 0; i < result.length; ++i) {
        result[i].percentage = this.render_float(result[i].percentage);
      }
      return result;
    },
    render_float (num) {
      return (num.toFixed(4)) + '%';
    }
  }
};
</script>

<style lang="less">
  .el-card {
    border: #8c939d 1px solid !important;
  }
  .icon-menu {
    width: 30px;
    height: 6px;
    border-top: 12px double;
    border-bottom: 4px solid;
  }
  .result-image {
    width: 450px;
    height: 450px;
    border-radius: 5px;
    border: 1px solid #8c939d;
  }
  .result-image:hover {
    border-color: #409EFF;
  }
  .atk-about-top {
    margin-top: 30px;
  }
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    font-size: 40px;
  }
  .atk-abt {
    border: 1px solid #8c939d;
    border-radius: 5px;
    padding: 15px;
    font-size: 20px;
    font-weight: 300;
  }
  .el-upload {
    border: 1.3px solid #d9d9d9;
    border-radius: 5px;
    cursor: pointer;
    overflow: hidden;
    position: relative;
  }
  .uploader-icon {
    font-size: 40px;
    color: #8c939d;
    width: 450px;
    height: 450px;
    display: inline-block;
    line-height: 450px;
  }

  .el-upload:hover {
    border-color: #409EFF;
  }
  .pre-image {
    width: 450px;
    height: 450px;
    display: block;
  }
  .el-aside {
    background-color: rgba(216, 220, 233,0.5);
  }
</style>
