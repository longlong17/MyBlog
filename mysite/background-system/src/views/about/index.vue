<template>
  <div class="app-container">
    <h3 class="teitle">关于我</h3>
    <el-input style="margin: 15px 0" :value="placeholderURl"></el-input>
    <el-button style="margin: 15px 0" type="primary" @click="open"
      >编辑</el-button
    >

    <!-- 编辑对话框 -->
    <el-dialog title="请填写url地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="URL地址">
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" ref="primary" @click="handelSetAbout"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAblot, setAblot } from "@/api/ablot.js";
export default {
  data() {
    return {
      placeholderURl: "",
      dialogFormVisible: false,
      form: {
        url: "",
      },
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getAblot().then(({ data }) => {
        this.form.url = data;
        this.placeholderURl = data;
      });
    },
    handelChange() {
      console.log("触发了");
      this.$forceUpdate();
    },
    handelSetAbout() {
      setAblot({url : this.form.url}).then((res) => {
        this.fetchData();
        this.dialogFormVisible = false
         this.$message({
          message: '修改成功',
          type: 'success'
        });
      });
    },
    open() {
      this.dialogFormVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.teitle {
  font-weight: 200;
}
</style>