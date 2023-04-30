<template>
  <div class="app-container">
    <el-table
      v-if="data"
      v-loading="isLoading"
      :data="data"
      style="width: 100%"
      border
      highlight-current-row
    >
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">
          {{ scope.$index + (currentPage - 1) * eachPage + 1 }}
        </template>
      </el-table-column>

      <el-table-column
        prop="description"
        label="头像"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.avatar"
            fit="contain"
          ></el-image
        ></template>
      </el-table-column>

      <el-table-column
        prop="scanNumber"
        label="昵称"
        width="120"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.nickname }}</template>
      </el-table-column>

      <el-table-column
        prop="commentNumber"
        label="评论文章"
        width="120"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.blog.title }}</template>
      </el-table-column>

      <el-table-column prop="description" label="评论内容" align="center">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>

      <el-table-column
        prop="description"
        width="230"
        label="创建日期"
        align="center"
      >
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
      </el-table-column>
      <el-table-column label="操作" width="140" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="删除"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="deleComment(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      v-if="data"
      style="margin-top: 30px"
      background
      layout="prev, pager, next ,total,->,sizes,jumper"
      :total="count"
      :page-sizes="[5, 10, 20]"
      :page-size="eachPage"
      :current-page.sync="pagerCurrentPage"
      @size-change="sizeChangeHandel"
      @current-change="currentChangeHandel"
      @prev-click="prevClickHandel"
      @next-click="nextClickHandel"
    >
    </el-pagination>
  </div>
</template>

<script>
import { server_URL } from "@/urlConfig";
import { getComment, deltComment } from "@/api/comment";
import { formtDate } from "@/utils/tools";
export default {
  data() {
    return {
      data: [], //数据表格
      isLoading: false,
      eachPage: 1,
      count: 0, //数据总条数
      currentPage: 1, //当前页码
      eachPage: 10, //每页显示条数
      pagerCurrentPage: 1, //分栏当前页码
      totalPaget: 0, //总条数
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.isLoading = true;
      getComment(this.currentPage, this.eachPage).then(({ data }) => {
        this.isLoading = false;
        this.data = data.rows;
        this.count = data.total; //总条数
        this.totalPaget = Math.ceil(this.count / this.eachPage); //总页数
        if (this.currentPage > this.totalPaget) {
          this.currentPage = this.totalPaget;
          this.fetchData();
        }
        for (let item of this.data) {
          item.createDate = formtDate(item.createDate);
        }
        // for (let item of this.data) {
          // item.avatar = server_URL + item.avatar;
        // }
      });
    },
    // 分页事件
    sizeChangeHandel(pageNumber) {
      this.eachPage = parseInt(pageNumber);
      this.currentPage = 1;
      this.pagerCurrentPage = 1;
      this.fetchData();
    },
    currentChangeHandel(pageNum) {
      this.currentPage = parseInt(pageNum);
      this.fetchData();
    },
    prevClickHandel() {
      this.currentPage -= 1;
    },
    nextClickHandel() {
      his.currentPage += 1; //下一页
    },

    // 删除评论
    deleComment({ id }) {
      this.$confirm("石否删除该此条评论?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deltComment(id).then((res) => {
            this.fetchData();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>