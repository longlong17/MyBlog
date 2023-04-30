<template>
  <div class="app-container">
    <!-- 搜索框 -->
    <div style="margin-top: 15px">
      <el-input
        placeholder="请输入要添加的分类，左边选择该分类的等级"
        v-model="input"
        class="input-with-select bloginput"
      >
        <el-select v-model="select" slot="prepend" placeholder="请选择">
          <el-option label="1" value="1"></el-option>
          <el-option label="2" value="2"></el-option>
          <el-option label="3" value="3"></el-option>
          <el-option label="4" value="4"></el-option>
          <el-option label="5" value="5"></el-option>
        </el-select>
      </el-input>
      <el-button
        type="primary"
        style="margin-left: 10px"
        @click="addBlogTypeHdelr"
        >添加</el-button
      >
    </div>
    <!-- 表格 -->
    <el-table :data="data" style="width: 100%" border v-loading="loading">
      <el-table-column prop="date" label="序号" width="60" align="center">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column prop="date" label="博客类别" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column prop="title" label="文章数量" align="center">
        <template slot-scope="scope">{{ scope.row.articleCount }}</template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <!-- 编辑按钮 -->
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
              @click="editBlogTypeHandle(scope.row)"
            ></el-button>
          </el-tooltip>
          <!-- 删除 -->
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
              @click="deleBlogTypeHandel(scope.row)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑文章分类 -->
    <el-dialog title="编辑文章分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类的名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="排序等级">
          <el-select v-model="form.order" placeholder="请选择活动区域">
            <el-option label="1" value="1"></el-option>
            <el-option label="2" value="2"></el-option>
            <el-option label="3" value="3"></el-option>
            <el-option label="4" value="4"></el-option>
            <el-option label="5" value="5"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmEditBlogTypeHande"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBlogType,
  addBlogType,
  delBlogType,
  findOneBlogType,
  updateOneBlogType,
} from "@/api/blogType.js";
export default {
  data() {
    return {
      input: "",
      select: "1",
      listLoading: false,
      data: [],
      dialogFormVisible: false,
      form: {
        name: "",
        order: "",
      },
      loading: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      (this.listLoading = true),
        getBlogType().then((res) => {
          console.log(res);
          this.listLoading = false;
          this.data = res.data;
        });
    },
    //编辑文章
    editBlogTypeHandle({ id }) {
      this.loading = true;
      findOneBlogType(id).then((res) => {
        console.log(res);
        this.loading = false;
        this.form = res.data;
        this.dialogFormVisible = true;
      });
    },
    deleBlogTypeHandel({ id }) {
      //删除文章
      this.$confirm(
        "石否删除该文章分类删除后该分类所有文章将变为未分类?",
        "是否删除此片文章分类",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          delBlogType(id).then((res) => {
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
    //添加文章分类
    addBlogTypeHdelr() {
      this.loading = true;
      if (this.input) {
        addBlogType({ name: this.input, order: this.select }).then((res) => {
          this.loading = false;
          this.fetchData();
          this.$message.success("添加分类成功");
          this.input = "";
        });
      } else {
        this.$message.error("分类名称不能为空");
      }
    },
    // 确认编辑
    confirmEditBlogTypeHande() {
      console.log(this.form);
      updateOneBlogType({
        id: this.form.id,
        data: this.form,
      }).then(() => {
        this.fetchData();
        this.$message.success("更新分类信息成功");
        this.dialogFormVisible = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bloginput {
  width: 400px;
  margin-bottom: 20px;
}
</style>