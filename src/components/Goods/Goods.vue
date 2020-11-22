<template>
    <div>
      <!-- 面包屑导航区 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/goods' }">商品</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 数据列表 -->
      <el-card>
        <div id="addGoods">
          <div>
            <i class="el-icon-notebook-2"></i>
            <span style="margin-left: 5px">数据列表</span>
          </div>
          <el-button round size="mini" @click="toAppendGoods">添加</el-button>
        </div>
      </el-card>

      <el-card>
<!--        <el-row :gutter="20">-->
<!--          <el-col :span="8">-->
<!--            <el-input v-model="input" placeholder="请输入内容">-->
<!--              <el-button slot="append" icon="el-icon-search"></el-button>-->
<!--            </el-input>-->
<!--          </el-col>-->
<!--          <el-col :span="4">-->
<!--            <el-button type="primary">添加规则</el-button>-->
<!--          </el-col>-->
<!--        </el-row>-->

        <!-- 树形表格 -->
        <el-table :data="commodityList" border stripe>
          <el-table-column type="index" :index="countIndex" label="编号" align="center" width="80px"></el-table-column>
          <el-table-column prop="commodityName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="categoryName" label="商品分类" align="center" width="250px"></el-table-column>
          <el-table-column label="销量/货号" align="center" width="180px">
            <template slot-scope="scope">
              <div style="margin: 5px;">
                <p>销量: {{ scope.row.saleVolume }} 件</p>
              </div>
              <div style="margin: 5px;">
                <P>货号: {{ scope.row.commodityID }}</P>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="SKU库存" align="center" width="140px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-search" circle @click="showDialog(scope.row)"></el-button>
            </template>
          </el-table-column>
          <el-table-column label="标签" align="center" width="140px">
            <template slot-scope="scope">
              <div style="margin: 10px;">
                <span style="margin-right: 10px">上架:</span>
                <el-switch
                  v-model="scope.row.onSale"
                  @change="changeCommodity(scope.$index)">
                </el-switch>
              </div>
              <div style="margin: 10px;">
                <span style="margin-right: 10px">推荐:</span>
                <el-switch
                  v-model="scope.row.recommend"
                  @change="changeCommodity(scope.$index)">
                </el-switch>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="240px">
            <template slot-scope="scope">
              <div style="margin: 10px;">
                <el-button plain size="small">查看</el-button>
                <el-button plain type="warning" size="small" @click="updateCommodity(scope.row, scope.$index)">编辑</el-button>
              </div>
              <div style="margin: 10px;">
                <el-button plain type="primary" size="small">日志</el-button>
                <el-button plain type="danger" size="small" @click="deleteCommodity(scope.row, scope.$index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="curPage"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="total">
          </el-pagination>
        </div>
      </el-card>

      <!-- 编辑商品信息对话框 -->
      <el-dialog
        @close="getGoodsList"
        title="编辑商品信息"
        :visible.sync="dialogVisible"
        width="40%">
        <el-form :label-position="label_position" label-width="100px" :model="commodityList[index]">
          <el-form-item label="商品名称">
            <el-input v-model="commodityList[index].commodityName"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-select v-model="commodityList[index].categoryName">
              <el-option
                v-for="item in categoryList"
                :key="item.categoryName"
                :label="item.categoryName"
                :value="item.categoryName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch v-model="commodityList[index].onSale"></el-switch>
          </el-form-item>
          <el-form-item label="是否推荐">
            <el-switch v-model="commodityList[index].recommend"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changeCommodity(index)">提交</el-button>
            <el-button @click="dialogVisible = false">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

      <!-- 查看商品属性信息的对话框 -->
      <el-dialog
        title="商品属性信息"
        :visible.sync="showAttrVisible"
        width="40%">
        <el-table :data="commodityAttrList" border stripe>
          <el-table-column label="属性编号" align="center" prop="attributeID"></el-table-column>
          <el-table-column label="属性名称" align="center" prop="attributeName"></el-table-column>
          <el-table-column label="销售价格" align="center" width="120px" prop="price"></el-table-column>
          <el-table-column label="商品库存" align="center" width="120px" prop="stock"></el-table-column>
          <el-table-column label="操作" align="center" width="80px">
            <template slot-scope="scope">
              <el-button plain type="danger" size="mini" @click="deleteConfirm(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showAttrVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      commodityList: [],
      total: 0,
      curPage: 1,
      pageSize: 5,
      showAttrVisible: false,
      dialogVisible: false,
      commodityAttrList: [],
      currentCommodityID: 0,
      index: 0,
      label_position: 'left',
      categoryList: [
        { categoryName: '电子产品/数码设备' },
        { categoryName: '衣物服饰/鞋子' },
        { categoryName: '家用电器' }
      ]
    };
  },
  created () {
    this.getGoodsList();
  },
  methods: {
    // 获取规则数据
    async getGoodsList () {
      const data = {
        curPage: this.curPage,
        pageSize: this.pageSize
      };
      this.dialogVisible = false;
      const { data: res } = await this.$http({
        url: '/commodityList',
        method: 'post',
        data: this.$qs.stringify(data)
      });
      if (!res.flag) {
        this.$message.error(res.errorMsg);
      }
      this.commodityList = res.data.result;
      this.total = res.data.total;
    },
    countIndex (index) {
      return index + 1 + (this.curPage - 1) * this.pageSize;
    },
    handleCurrentChange (currentPage) {
      this.curPage = currentPage;
      this.getGoodsList();
    },
    handleSizeChange (pageSize) {
      this.pageSize = pageSize;
      this.getGoodsList();
    },

    // 修改商品
    async changeCommodity (index) {
      const data = this.commodityList[index];
      const { data: res } = await this.$http({
        url: '/updateCommodity',
        method: 'post',
        data: this.$qs.stringify(data)
      });
      if (!res.flag) {
        this.$message({
          message: res.errorMsg,
          type: 'error',
          duration: 1000
        });
      } else {
        this.$message.success({
          message: '修改成功',
          type: 'success',
          duration: 1000
        });
      }
    },

    // 展示对应商品属性列表
    async showDialog (row) {
      this.showAttrVisible = true;
      const data = {
        commodityID: row.commodityID
      };
      const { data: res } = await this.$http({
        url: '/commodityAttrList',
        method: 'post',
        data: this.$qs.stringify(data)
      });
      console.log(res);
      if (!res.flag) {
        this.$message.error(res.errorMsg);
      }
      this.commodityAttrList = res.data;
    },

    // 删除属性确认
    deleteConfirm (row, index) {
      this.$msgbox.confirm('此操作将永久删除该属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const data = {
          attributeID: row.attributeID
        };
        const { data: res } = await this.$http({
          url: '/deleteCommodityAttr',
          method: 'post',
          data: this.$qs.stringify(data)
        });
        if (!res.flag) {
          this.$message.error(res.errorMsg);
        } else {
          this.showDialog({ commodityID: row.commodityID });
          this.$message.success('属性删除成功');
        }
      }).catch(() => {});
    },

    // 更新商品信息
    updateCommodity (row, index) {
      this.index = index;
      this.dialogVisible = true;
    },

    // 删除商品信息
    deleteCommodity (row, index) {
      this.$msgbox.confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const data = {
          commodityID: row.commodityID
        };
        const { data: res } = await this.$http({
          url: '/deleteCommodity',
          method: 'post',
          data: this.$qs.stringify(data)
        });
        if (!res.flag) {
          this.$message.error(res.errorMsg);
        } else {
          this.getGoodsList();
          this.$message.success('商品删除成功');
        }
      }).catch(() => {});
    },
    toAppendGoods () {
      this.$router.push('/appendGoods');
    }
  }
};
</script>

<style lang="less" scoped>
  .el-breadcrumb {
    margin-bottom: 12px;
    font-size: 15px;
  }
  .el-card {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  #addGoods{
    display: flex;
    justify-content: space-between;
  }

</style>
