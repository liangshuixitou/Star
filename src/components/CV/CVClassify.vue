<template>
  <div style="width: 70%; margin: 0 auto">
    <el-card
      class="cf-intro"
      shadow="hover"
      style="margin-top: 60px">
      <h1>
        Classify an image.
      </h1>
    </el-card>
    <el-card
      style="margin-top: 20px"
      class="cf-card"
      shadow="hover">
      <el-row :gutter="80">
        <el-col :span="12">
          <span class="s-cf-intro">Upload an image</span>
          <el-divider></el-divider>
          <el-upload
            class="avatar-uploader"
            action="action"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            :http-request="uploadFile">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <div v-else class="avatar-uploader-icon">
              <i  class="el-icon-plus"></i>
            </div>
          </el-upload>
        </el-col>
        <el-col :span="12">
          <span class="s-cf-intro">Predicted identity</span>
          <el-divider></el-divider>
          <el-table
            :header-cell-style="{background:'#303133', fontFamily:'Helvetica',height:'60px',fontSize:'18px',color:'white'}"
            :cell-style="{color: '#666', fontFamily: 'Arial',fontSize:'18px',height:'60px'}"
            :data="classifyResult"
            style="width: 100%;margin-top: 30px">
            <el-table-column
              prop="label"
              label="Prediction"
              width="300">
            </el-table-column>
            <el-table-column
              prop="percentage"
              label="Probability">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="12">
          <span class="s-cf-intro">Model</span>
          <el-divider></el-divider>
          <el-select
            v-model="classifier"
            placeholder="select a model"
            style="width: 100%; margin-top: 5px"
            stripe
            value-key="name">
            <el-option
              v-for="item in classifiers"
              :key="item.name"
              :label="item.name"
              :value="item">
            </el-option>
          </el-select>
          <el-button @click="classifyImage" style="margin-left: 230px;margin-top: 20px;width: 180px;height: 50px;font-size: 20px" type="info" size="medium">Classify image</el-button>
        </el-col>
        <el-col :span="12">
          <span class="s-cf-intro">About the model</span>
          <el-divider></el-divider>
          <div class="div-cf div-cf-top">
            <span>Classifier: </span>
            <span style="font-weight: 400">{{ classifier.name }}</span>
          </div>
          <div class="div-cf">
            <span>Paper: </span>
            <el-link type="primary" style="font-weight: normal; font-size: 20px" :href="classifier.paper">{{ classifier.paper }}</el-link>
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
      classifiers: [],
      classifier: {
        name: 'ResNet18',
        paper: ' https://arxiv.org/abs/1512.03385'
      },
      classifyResult: []
    };
  },
  created () {
    this.getClassfiers();
  },
  methods: {
    getClassfiers () {
      post('/cv/classifiers', null).then(res => {
        this.classifiers = [{
          name: 'ResNet18',
          paper: ' https://arxiv.org/abs/1512.03385'
        }];
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
    async classifyImage () {
      const data = {
        image_name: this.imageName,
        classifier: this.classifier.name
      };
      const { data: res } = await this.$http({
        method: 'post',
        url: '/cv/classify',
        data: this.$qs.stringify(data)
      });
      this.classifyResult = res.data;
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style lang="less">
  .div-cf-top {
    margin-top: 30px;
  }
  .div-cf {
    border: 1px solid #8c939d;
    border-radius: 5px;
    padding: 15px;
    width: 70%;
    font-size: 20px;
    font-weight: 300;
  }
  .el-row {
    margin-bottom: 30px;
  }
  .s-cf-intro {
    font-size: 30px;
    font-weight: 300;
    color: black;
    font-family: "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  }
  .el-divider {
    margin-top: 10px !important;
    height: 2px !important;
  }

  h1 {
    margin-top: 0px;
    margin-bottom: 0px;
    font-weight: normal;
    font-size: 40px;
    font-family: "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
  }
  .cf-card .cf-intro {
    margin-top: 30px;
  }

  .avatar-uploader .el-upload {
    margin-top: 10px;
    margin-left: 130px;
    border: 1.3px solid #d9d9d9;
    border-radius: 5px;
    cursor: pointer;
    overflow: hidden;
    position: relative;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 380px;
    height: 380px;
    display: inline-block;
    line-height: 380px;
  }
  .avatar {
    width: 380px;
    height: 380px;
    display: block;
  }
</style>
