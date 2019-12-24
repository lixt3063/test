<template>
  <el-card class="form-container" shadow="never">
    <el-form :model="departmentCate"
             :rules="rules"
             ref="departmentCateFrom"
             label-width="150px">
      <el-form-item label="分类名称：" prop="name">
        <el-input v-model="departmentCate.name"></el-input>
      </el-form-item>
      <el-form-item label="上级分类：">
        <el-select v-model="departmentCate.parentId"
                   placeholder="请选择分类">
          <el-option
            v-for="item in selectDepartmentCateList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室名称：">
        <el-input v-model="departmentCate.name"></el-input>
      </el-form-item>
      <el-form-item label="排序：">
        <el-input v-model="departmentCate.sort"></el-input>
      </el-form-item>
      <el-form-item label="首字母：">
        <el-input v-model="departmentCate.firstLetter"></el-input>
      </el-form-item>
      <el-form-item label="科室icon：" prop="icon">
        <single-upload v-model="departmentCate.icon"></single-upload>
      </el-form-item>
      <el-form-item label="关联疾病：">
        <el-transfer
          style="display: inline-block"
          filterable
          :filter-method="filterMethod"
          filter-placeholder="请输入专题名称"
          v-model="selectDisease"
          :titles="diseaseTitles"
          :data="diseaseList">
        </el-transfer>
      </el-form-item>
      <el-form-item label="科室简介：">
        <el-input type="textarea" :autosize="true" v-model="departmentCate.introduction"></el-input>
      </el-form-item>
      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="科室详情" name="mobile">
            <tinymce :width="595" :height="300" v-model="departmentCate.content"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('departmentCateFrom')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('departmentCateFrom')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
  import {fetchList, createDepartmentCate, updateDepartmentCate, getDepartmentCate} from '@/api/departmentCate';
  import SingleUpload from '@/components/Upload/singleUpload';
  import Tinymce from '@/components/Tinymce';
  import {fetchListAll as fetchDiseaseList} from '@/api/disease'

  const defaultDepartmentCate = {
    diseaseDepartmentRelationList:[],
    introduction: '',
    firstLetter:'',
    name: '',
    icon:'',
    parentId: 0,
    sort: 0
  };
  export default {
    name: "DepartmentCateDetail",
    components: {SingleUpload,Tinymce},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        //所有专题列表
        diseaseList: [],
        //专题左右标题
        diseaseTitles: ['待选择', '已选择'],
        activeHtmlName: 'mobile',
        departmentCate: Object.assign({}, defaultDepartmentCate),
        selectDepartmentCateList: [],
        rules: {
          name: [
            {required: true, message: '请输入品牌名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
        },
        filterAttrs: []
      }
    },
    created() {
      if (this.isEdit) {
        getDepartmentCate(this.$route.query.id).then(response => {
          this.departmentCate = response.data;
        });
      } else {
        this.departmentCate = Object.assign({}, defaultDepartmentCate);
      }
      this.getSelectDepartmentCateList();
      this.getDiseaseList();
    },computed:{
      //选中的专题
      selectDisease:{
        get:function () {
          let diseases =[];
          if(this.departmentCate.diseaseDepartmentRelationList==null||this.departmentCate.diseaseDepartmentRelationList.length<=0){
            return diseases;
          }
          for(let i=0;i<this.departmentCate.diseaseDepartmentRelationList.length;i++){
            diseases.push(this.departmentCate.diseaseDepartmentRelationList[i].diseaseId);
          }
          return diseases;
        },
        set:function (newValue) {
          this.departmentCate.diseaseDepartmentRelationList=[];
          for(let i=0;i<newValue.length;i++){
            this.departmentCate.diseaseDepartmentRelationList.push({diseaseId:newValue[i]});
          }
        }
      }
    },
    methods: {
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      getSelectDepartmentCateList() {
        fetchList(0, {pageSize: 100, pageNum: 1}).then(response => {
          this.selectDepartmentCateList = response.data.list;
          this.selectDepartmentCateList.unshift({id: 0, name: '无上级分类'});
        });
      },
      getDiseaseList() {
        fetchDiseaseList().then(response => {
          let list = response.data;
          for (let i = 0; i < list.length; i++) {
            this.diseaseList.push({
              label: list[i].name,
              key: list[i].id
            });
          }
        });
      },
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updateDepartmentCate(this.$route.query.id, this.departmentCate).then(response => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                  });
                  this.$router.back();
                });
              } else {
                createDepartmentCate(this.departmentCate).then(response => {
                  this.$refs[formName].resetFields();
                  this.resetForm(formName);
                  this.$message({
                    message: '提交成功',
                    type: 'success',
                    duration: 1000
                  });
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.departmentCate = Object.assign({}, defaultDepartmentCate);
        this.getSelectDepartmentCateList();
        this.filterDepartmentAttrList = [{
          value: []
        }];
      }
    },
    filters: {
      filterLabelFilter(index) {
        if (index === 0) {
          return '筛选属性：';
        } else {
          return '';
        }
      }
    }
  }
</script>

<style scoped>

</style>
