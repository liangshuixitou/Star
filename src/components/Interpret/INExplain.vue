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
              Visualize explain.
            </div>
          </el-col>
          <el-col :span="2">
            <el-button style="float: right;height: 100%" type="danger" @click="runExplain">Run</el-button>
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
            <div style="margin-bottom: 10px;font-size: 25px;font-family: Helvetica">Cam image</div>
            <el-image :src="cam_image_url" class="result-image" fit="fill">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-col>
          <el-col :span="8">
            <div style="margin-bottom: 10px;font-size: 25px;font-family: Helvetica">GB image</div>
            <el-image :src="gb_image_url" class="result-image" fit="fill">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </el-col>
        </el-row>
      </el-card>
      <el-card
        v-show="histories.length !== 0"
        shadow="hover"
        style="margin-top: 20px">
        <el-row :gutter="20">
          <el-col :span="22">
            <div style="font-size: 25px;font-family: Helvetica">Histories</div>
          </el-col>
          <el-col :span="2">
            <el-button type="danger" style="width: 100%;float: right" @click="clear_history">Clear</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-table
              style="margin-top: 20px"
              border
              :data="histories"
              :header-cell-style="{fontFamily:'微软雅黑',fontSize:'15px'}"
              :cell-style="{color: '#666', fontFamily: 'Times New Roman',fontSize:'18px'}">
              <el-table-column
                align="center"
                label="Method"
                width="180">
                <template slot-scope="scope">
                  {{ scope.row.method.name }}
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="Aug smooth"
                width="150">
                <template slot-scope="scope">
                  <el-switch :value="scope.row.aug_smooth"></el-switch>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="Eigen smooth"
                width="160">
                <template slot-scope="scope">
                  <el-switch :value="scope.row.eigen_smooth"></el-switch>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="Origin image">
                <template slot-scope="scope">
                  <el-image :src="scope.row.image_url" class="table-image" fit="fill" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="Cam image">
                <template slot-scope="scope">
                  <el-image :src="scope.row.cam_image_url" class="table-image" fit="fill" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="GB image">
                <template slot-scope="scope">
                  <el-image :src="scope.row.gb_image_url" class="table-image" fit="fill" />
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="Operation"
                width="140">
                <template slot-scope="scope">
                  <el-button icon="el-icon-zoom-in" type="primary" @click="showHistory(scope.row)"></el-button>
                </template>
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
          v-model="method"
          style="width: 100%; margin-top: 15px"
          stripe
          value-key="name">
          <el-option
            v-for="item in methods"
            :key="item.name"
            :label="item.name"
            :value="item">
          </el-option>
        </el-select>
        <div style="font-size: 20px;font-family: Helvetica;margin-top: 40px">Select options</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-checkbox v-model="aug_smooth" :label="true" border class="radio-class">aug smooth</el-checkbox>
          </el-col>
          <el-col :span="12">
            <el-checkbox v-model="eigen_smooth" :label="true" border class="radio-class">eigen smooth</el-checkbox>
          </el-col>
        </el-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import post from '../../utils/requests';
import Loading from '../templetes/Loading';

export default {
  name: 'CVClassify',
  components: {
    Loading
  },
  data () {
    return {
      // params
      aug_smooth: false,
      eigen_smooth: false,
      method: '',
      imageName: '',
      imageUrl: '',
      methods: [],
      cam_image_url: '',
      gb_image_url: '',
      histories: [],
      loadingAttack: false,
      visual_drawer: false
    };
  },
  created () {
    this.getMethods();
  },
  methods: {
    handleOptions () {
      this.visual_drawer = true;
    },
    getMethods () {
      post('/interpret/methods', null).then(res => {
        this.methods = res.data;
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
    clear_history () {
      this.histories = [];
    },
    showHistory (row) {
      this.aug_smooth = row.aug_smooth;
      this.eigen_smooth = row.eigen_smooth;
      this.method = row.method;
      this.imageName = row.imageName;
      this.imageUrl = row.image_url;
      this.cam_image_url = row.cam_image_url;
      this.gb_image_url = row.gb_image_url;
    },
    validateParams () {
      if (!this.method) {
        this.$message.error('Please select a model');
        return false;
      }
      if (!this.imageName) {
        this.$message.error('Please upload a picture');
        return false;
      }
      return true;
    },
    async runExplain () {
      if (!this.validateParams()) {
        this.visual_drawer = true;
        return;
      }
      this.loadingAttack = true;
      const data = {
        aug_smooth: this.aug_smooth,
        eigen_smooth: this.eigen_smooth,
        method_name: this.method.name,
        image_name: this.imageName
      };
      const { data: res } = await this.$http({
        method: 'post',
        url: '/interpret/explain',
        data: this.$qs.stringify(data)
      });
      const baseUrl = 'http://127.0.0.1:9090/static/grad_cam/';
      this.cam_image_url = baseUrl + res.data.cam_fn;
      this.gb_image_url = baseUrl + res.data.gb_fn;
      this.loadingAttack = false;
      // store the explain to histories
      const history = {
        method: this.method,
        aug_smooth: this.aug_smooth,
        eigen_smooth: this.eigen_smooth,
        image_url: this.imageUrl,
        cam_image_url: this.cam_image_url,
        gb_image_url: this.gb_image_url,
        imageName: this.imageName
      };
      this.histories.push(history);
      this.$message.success('Explain successful!');
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
  .table-image {
    width: 200px;
    height: 200px;
    border-radius: 5px;
    border: 1px solid #8c939d;
  }
  .table-image:hover {
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
  .radio-class {
    margin-top: 10px;
    width: 100%;
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
