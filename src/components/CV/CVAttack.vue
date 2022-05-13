<template>
  <div style="width: 70%; margin: 0 auto">
    <el-card
      shadow="hover"
      style="margin-top: 60px">
      <h1>
        Visualize attack.
      </h1>
    </el-card>
    <el-card
      shadow="hover"
      style="margin-top: 20px">
      <el-row :gutter="20" style="margin-bottom: 0px">
        <el-col :span="11"><span style="font-size: 25px;font-family: Helvetica">Select model</span></el-col>
        <el-col :span="11"><span style="font-size: 25px;font-family: Helvetica">Select attack</span></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="11">
          <el-select
            v-model="classifier"
            style="width: 100%; margin-top: 10px"
            stripe
            value-key="name">
            <el-option
              v-for="item in classifiers"
              :key="item.name"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="11">
          <el-select
            v-model="attack"
            style="width: 100%; margin-top: 10px"
            stripe
            value-key="name">
            <el-option
              v-for="item in attacks"
              :key="item.name"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button style="margin-top: 10px;" type="info" @click="runAttack">Attack</el-button>
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
          <el-image :src="result_image" class="result-image" fit="contain">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-col>
        <el-col :span="8">
          <div style="margin-bottom: 10px;font-size: 25px;font-family: Helvetica">Difference image</div>
          <el-image :src="difference_image" class="result-image" fit="fill">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-col>
      </el-row>
      <el-row v-if="classifyResult.length !== 0" :gutter="20">
        <el-col :span="8">
          <el-table
            :header-cell-style="{background:'#358ccd', fontFamily:'Helvetica',height:'60px',fontSize:'18px',color:'white'}"
            :cell-style="{color: '#666', fontFamily: 'Arial',fontSize:'18px',height:'60px'}"
            :data="classifyResult"
            style="width: 100%;margin-top: 30px">
            <el-table-column
              prop="label"
              label="Prediction"
              width="200">
            </el-table-column>
            <el-table-column
              prop="percentage"
              label="Probability">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="8">
          <el-table
          :header-cell-style="{background:'#358ccd', fontFamily:'Helvetica',height:'60px',fontSize:'18px',color:'white'}"
          :cell-style="{color: '#666', fontFamily: 'Arial',fontSize:'18px',height:'60px'}"
          :data="attackResult"
          style="width: 100%;margin-top: 30px">
          <el-table-column
            prop="label"
            label="Prediction"
            width="200">
          </el-table-column>
          <el-table-column
            prop="percentage"
            label="Probability">
          </el-table-column>
        </el-table></el-col>
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
  </div>
</template>

<script>
import post from '../../utils/requests';

export default {
  name: 'CVClassify',
  data () {
    return {
      imageUrl: '',
      imageName: '',
      result_image: '',
      difference_image: '',
      result_image_name: '',
      classifiers: [],
      attacks: [],
      classifier: null,
      attack: null,
      classifyResult: [],
      attackResult: []
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
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    validateParams () {
      if (!this.classifier) {
        this.$message.error('Please select a model');
        return false;
      }
      if (!this.attack) {
        console.log(this.attack);
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
        attack: this.attack.name
      };
      const { data: res } = await this.$http({
        method: 'post',
        url: '/cv/attack',
        data: this.$qs.stringify(data)
      });
      this.result_image = 'data:img/jpeg;base64,' + res.result_image;
      this.difference_image = 'data:img/jpeg;base64,' + res.difference_image;
      this.result_image_name = res.result_image_name;
      this.runClassify(this.imageName, this.classifier.name).then(res => {
        this.classifyResult = res;
      });
      this.runClassify(this.result_image_name, this.classifier.name).then(res => {
        this.attackResult = res;
      });
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
    }
  }
};
</script>

<style lang="less">
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
</style>
