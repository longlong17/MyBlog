<template>
  <div class="app-container">
    <!-- 数据表格 -->
    <el-table v-loading="isLoading" :data="data" style="width: 100%" border>
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{
          scope.$index + (currentPage - 1) * eachPage + 1
        }}</template>
      </el-table-column>

      <el-table-column prop="title" label="文章名称" width="150" align="center">
        <template slot-scope="scope">
          <!-- {{ scope.row.title }} -->
          <el-popover
            placement="top-start"
            title="博客预览图"
            width="230"
            trigger="hover"
          >
            <el-image
              style="width: 200px"
              :src="scope.row.thumb"
              fit="contain"
              :preview-src-list="srcList"
            ></el-image>
            <a
              href="#"
              slot="reference"
              target="_blank"
              @click.prevent="goToTitilhandel(scope.row)"
              >{{ scope.row.title }}</a
            >
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column prop="description" label="文章描述">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>

      <el-table-column prop="scanNumber" label="浏览数" align="center">
        <template slot-scope="scope">{{ scope.row.scanNumber }}</template>
      </el-table-column>

      <el-table-column prop="commentNumber" label="评论量" align="center">
        <template slot-scope="scope">{{ scope.row.commentNumber }}</template>
      </el-table-column>

      <el-table-column prop="description" label="所属分类" align="center">
        <template slot-scope="scope">{{
          scope.row.category ? scope.row.category.name : "未分类"
        }}</template>
      </el-table-column>

      <el-table-column prop="description" width="230" label="创建日期">
        <template slot-scope="scope">{{ scope.row.createDate }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑"
            placement="top"
            :hide-after="2000"
          >
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              size="mini"
              @click="editBannerHandle(scope.row)"
            ></el-button>
          </el-tooltip>

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
              @click="deleBlock(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      style="margin-top: 30px"
      background
      layout="prev, pager, next ,total,->,sizes,jumper"
      :total="count"
      :page-sizes="[5, 10, 20]"
      :page-size="eachPage"
      :current-page.sync="pagerCurrenPage"
      @size-change="sizeChangeHandel"
      @current-change="currentChangeHandel"
      @prev-click="prevClickHandel"
      @next-click="nextClickHandel"
    >
    </el-pagination>
  </div>
</template>

<script>
import { findBlog, deleteBlog, editBlog, findOneBlog } from "@/api/blog.js";
import { formtDate } from "@/utils/tools.js";
import { server_URL, frontEnd_URL } from "@/urlConfig.js";
export default {
  data() {
    return {
      data: [], // 存储数据
      srcList: [], //预览图链接数组
      eachPage: 5, //每一页显示的条数
      currentPage: 1, // 当前的页码默认是第一页
      totalPage: 0, //总页数
      count: 0, //数据的总条数
      isLoading: false,
      pagerCurrenPage: 1, // 分页的当前页码
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.isLoading = true;
      findBlog(this.currentPage, this.eachPage).then((res) => {
        this.isLoading = false;
        this.data = res.data.rows;
        for (let i of this.data) {
          i.createDate = formtDate(i.createDate);
          // i.thumb = server_URL + i.thumb;
          this.srcList.push(i.thumb);
        }
        this.count = res.data.total;
        this.totalPage = Math.ceil(this.count / this.eachPage);
        if (this.currentPage > this.totalPage) {
          this.currentPage = this.totalPage;
          this.fetchData();
        }
      });
    },
    goToTitilhandel(blogInfo) {
      //跳转到具体的文章
      window.open(`${frontEnd_URL}/article${blogInfo.id}`);
    },
    deleBlock(blogInfo) {
      //删除文章
      this.$confirm(
        "删除改文章会将改文章下面的评论一并删除, 是否继续?",
        "是否删除此片文章",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          deleteBlog(blogInfo.id).then((res) => {
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
    //分页相关事件
    sizeChangeHandel(pageNumber) {
      this.eachPage = parseInt(pageNumber);
      this.currentPage = 1;
      this.pagerCurrenPage = 1;
      this.fetchData();
    },
    currentChangeHandel(pageNumber) {
      this.currentPage = parseInt(pageNumber);
      this.fetchData();
    },
    prevClickHandel() {
      this.currentPage -= 1; //上一页
    },
    nextClickHandel() {
      this.currentPage += 1; //下一页
    },
    //编辑文章
    editBannerHandle(blogInfo) {
      console.log(blogInfo);
      this.$router.push(`/editBlog/${blogInfo.id}`);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>