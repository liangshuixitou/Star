<template>
  <el-container class="home-container">
    <el-container>
      <el-header>
        <el-row style="width: 100%">
          <el-col :span="15">
            <img src="../assets/images/ai_icon.svg" width="35px">
            <a style="color: #358ccd; margin-left: 10px">Onion</a>
          </el-col>
          <el-col :span="9">
            <el-menu
              :default-active="$route.path"
              class="el-menu-vertical-demo"
              background-color="#fff"
              text-color="#358ccd"
              unique-opened
              :router="true"
              @select="handleSelect"
              active-text-color="#1989fa"
              mode="horizontal">
              <el-menu-item index="/index">
                <!--            <i class="el-icon-s-home"></i>-->
                <span slot="title">Home</span>
              </el-menu-item>
              <el-submenu index="/cv">
                <template slot="title">
                  <!--              <i class="el-icon-data-board"></i>-->
                  <span>CV Attacks</span>
                </template>
                <el-menu-item index="/cv-attack">
                  <span slot="title">Visualize Attack</span>
                </el-menu-item>
                <el-menu-item index="/cv-attack-result">
                  <span slot="title">Analyse Attackers</span>
                </el-menu-item>
                <el-menu-item index="/cv-classifier">
                  <span slot="title">Classify an Image</span>
                </el-menu-item>
                <el-menu-item index="/cv-papers">
                  <span slot="title">Paper List</span>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="/nlp">
                <template slot="title">
                  <span>NLP Attacks</span>
                </template>
                <el-menu-item index="/nlp-attack">
                  <span slot="title">Visual Attack</span>
                </el-menu-item>
                <el-menu-item index="/nlp-papers">
                  <!--              <i class="el-icon-document"></i>-->
                  <span slot="title">Paper List</span>
                </el-menu-item>
              </el-submenu>
              <el-submenu index="/inter">
                <template slot="title">
                  <!--              <i class="el-icon-s-platform"></i>-->
                  <span>AI Interpret</span>
                </template>
                <el-menu-item index="/in-explain">
                  <!--              <i class="el-icon-data-analysis"></i>-->
                  <span slot="title">Visual Explain</span>
                </el-menu-item>
                <el-menu-item index="/in-papers">
                  <!--              <i class="el-icon-document"></i>-->
                  <span slot="title">Paper List</span>
                </el-menu-item>
              </el-submenu>
              <el-menu-item index="/about">
                <!--            <i class="el-icon-s-home"></i>-->
                <span slot="title">About</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 菜单是否折叠
      isCollapsed: false,
      type: 0,
      name: '',
      typeName: ''
    };
  },
  created () {
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    handleSelect (key) {
      console.log(key);
      window.sessionStorage.setItem('activePath', key);
    }
  }
};
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-row {
    display:flex;
    align-items:center;
  }
  .el-header {
    background-color: #fff;
    padding-left: 10px;
    color: #ffffff;
    font-size: 35px;
    font-family: "微软雅黑", "Helvetica Neue", Helvetica, "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    border-bottom: solid 2px #e6e6e6;
    .el-menu {
      border-bottom: solid 2px #e6e6e6;
    }
  }
  .el-main {
    background-color: #ffffff;
    padding: 0;
  }
</style>
