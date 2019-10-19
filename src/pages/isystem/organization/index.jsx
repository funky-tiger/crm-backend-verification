/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/no-unused-state */
import {
  Avatar,
  Tree,
  Alert,
  TreeSelect,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Form,
  InputNumber,
  Icon,
  Input,
  List,
  Menu,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Result,
  message,
  Spin,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import styles from './style.less';

@connect(({ listBasicList, loading }) => ({}))
class Organization extends Component {
  state = {
    visible: false,
    done: false,
    current: undefined,
    treeList: [],
    defaultKeys: [],
    activeOrgName: '',
    orgCode: '', // 机构编码
    orgName: '', // 机构名称
    parentName: '', // 上级部门
    companyPhone: '', // 公司电话
    companyAddress: '', // 公司地址
    remarks: '', // 备注
    backupData: {}, // 备份一次数据 避免用户点击取消时 数据丢失
    loading1: true,
    loading2: true,
    actionType: '', // 默认提交按钮看不到
    activeKey: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'Organization/getQueryIdTree',
      cb: data => {
        this.setState({
          treeList: this.resolveTree(data),
          defaultKeys: [data[0].id + ''],
          activeKey: data[0].id,
          loading1: false,
        });
        this.getcompanyDetailById(data[0].id);
      },
    });
  }

  /**
   * 根据id获取公司详情
   * @param id 公司id
   */
  getcompanyDetailById = id => {
    this.props.dispatch({
      type: 'Organization/getQueryById',
      params: { id },
      cb: result => {
        this.props.form.setFieldsValue({
          orgCode: result.orgCode, // 机构编码
          orgName: result.orgName, // 机构名称
          companyPhone: result.mobile, // 公司电话
          companyAddress: result.address, // 公司地址
          remarks: result.memo, // 备注
        });

        this.setState({
          activeOrgName: result.orgName,
          parentName: result.parentId,
          backupData: {
            orgCode: result.orgCode,
            orgName: result.orgName,
            parentName: result.parentId,
            companyPhone: result.mobile,
            companyAddress: result.address,
            remarks: result.memo,
          },
          loading2: false,
        });
      },
    });
  };

  /**
   * 通过id查找公司名字
   * @param id
   */
  findcompanyNameById = id => {
    const { treeList } = this.state;
    if (!id) {
      return '';
    }
    if (treeList[0].id === id) {
      return treeList[0].orgName;
    }
  };

  resolveTree = arr => {
    for (let i = 0; i < arr.length; i++) {
      arr[i].title = arr[i].orgName;
      arr[i].key = arr[i].id;
      arr[i].value = arr[i].id;
      if (Array.isArray(arr[i].children) && arr[i].children.length !== 0) {
        this.resolveTree(arr[i].children);
      }
    }
    return arr;
  };

  selectedItem = () => `当前选择: ${this.state.activeOrgName}`;

  handleSubmit = e => {
    e.preventDefault();
    const { actionType, activeKey } = this.state;
    const { form, dispatch } = this.props;
    const _this = this;
    let username = JSON.parse(localStorage.getItem('userInfo')).userInfo.username;

    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        switch (actionType) {
          case 'add':
            dispatch({
              type: 'Organization/addNewQuery',
              params: {
                orgCode: values.orgCode, // 机构编码
                orgName: values.orgName, // 机构名称
                mobile: values.companyPhone, // 机构电话
                address: values.companyAddress, // 机构地址
                memo: values.remarks, // 备注
                createBy: username, // 创建人
                parentId: activeKey, // 父级id
              },
              cb: () => {
                _this.clearFields();
                dispatch({
                  type: 'Organization/getQueryIdTree',
                  cb: data => {
                    this.setState({
                      treeList: this.resolveTree(data),
                      loading1: false,
                    });
                  },
                });
              },
            });
            break;
          case 'mod':
            dispatch({
              type: 'Organization/updateQuery',
              params: {
                orgCode: values.orgCode, // 机构编码
                orgName: values.orgName, // 机构名称
                mobile: values.companyPhone, // 机构电话
                address: values.companyAddress, // 机构地址
                memo: values.remarks, // 备注
                updateBy: username, // 编辑人
                id: activeKey,
                // createBy: "",
              },
              cb: () => {
                this.clearFields();
                dispatch({
                  type: 'Organization/getQueryIdTree',
                  cb: data => {
                    this.setState({
                      treeList: this.resolveTree(data),
                      loading1: false,
                    });
                    this.getcompanyDetailById(activeKey);
                  },
                });
              },
            });
            break;
          case 'del':
            break;
          default:
            return '';
        }
      }
    });
  };

  handleSelect = item => {
    this.setState({
      loading2: true,
      actionType: '',
      activeKey: item[0],
    });
    this.getcompanyDetailById(item[0]);
  };

  clearFields = () => {
    this.props.form.setFieldsValue({
      orgCode: '', // 机构编码
      orgName: '', // 机构名称
      companyPhone: '', // 公司电话
      companyAddress: '', // 公司地址
      remarks: '', // 备注
    });
  };

  /**
   * 添加结构
   */
  handleAddNew = () => {
    const { activeKey } = this.state;
    this.setState({ actionType: 'add', parentName: activeKey });
    this.clearFields();
  };

  /**
   * 修改结构
   */
  handleModify = () => {
    this.setState({ actionType: 'mod' });
  };

  /**
   * 删除结构
   */
  handleDelete = () => {
    const { activeKey, defaultKeys, activeOrgName } = this.state;
    const { dispatch } = this.props;
    const _this = this;
    if (activeKey === defaultKeys[0]) {
      message.warning('不能删除顶级节点');
      return;
    }
    this.setState({ actionType: 'del' });
    Modal.confirm({
      title: `你要删除 ${activeOrgName} 吗`,
      content: '',
      onOk() {
        return new Promise((resolve, reject) => {
          dispatch({
            type: 'Organization/delOneQuery',
            params: {
              id: activeKey,
            },
            cb: () => {
              _this.clearFields();
              _this.updateData();
              resolve();
            },
          });
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {},
    });
  };

  updateData = () => {
    const { activeKey } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'Organization/getQueryIdTree',
      cb: data => {
        this.setState({
          treeList: this.resolveTree(data),
          loading1: false,
        });
        this.getcompanyDetailById(activeKey);
      },
    });
  };

  /**
   * 用户取消编辑
   */
  handleCancel = () => {
    const { backupData } = this.state;
    this.setState({ actionType: '' });
    this.props.form.setFieldsValue({
      orgCode: backupData.orgCode, // 机构编码
      orgName: backupData.orgName, // 机构名称
      companyPhone: backupData.companyPhone, // 公司电话
      companyAddress: backupData.companyAddress, // 公司地址
      remarks: backupData.remarks, // 备注
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      treeList,
      defaultKeys,
      orgCode,
      orgName,
      parentName,
      companyPhone,
      companyAddress,
      remarks,
      loading1,
      loading2,
      actionType,
    } = this.state;
    return (
      <div>
        <Row>
          <Col span={12}>
            <Spin spinning={loading1}>
              <Card bordered={false} style={{ marginRight: '10px' }}>
                <Row style={{ display: 'flex' }}>
                  <Button
                    className={styles.btn}
                    onClick={this.handleAddNew}
                    type="primary"
                    style={{ marginLeft: '16px' }}
                  >
                    新增
                  </Button>
                  <Button className={styles.btn} onClick={this.handleModify} type="default">
                    修改
                  </Button>
                  <Button
                    className={styles.btn}
                    onClick={this.handleDelete}
                    title="删除多条数据"
                    type="danger"
                  >
                    删除
                  </Button>
                </Row>
                <div
                  style={{
                    background: '#fff',
                    paddingLeft: '16px',
                    height: '100%',
                    margin: '10px 0',
                  }}
                >
                  <Alert message={this.selectedItem()} type="info" showIcon />
                  <Col span={24}>
                    <span style={{ userSelect: 'none' }}>
                      {defaultKeys.length !== 0 && (
                        <Tree
                          // checkable
                          // multiple
                          checkStrictly
                          autoExpandParent
                          defaultExpandedKeys={defaultKeys}
                          defaultSelectedKeys={defaultKeys}
                          // defaultCheckedKeys={defaultKeys}
                          onSelect={select => {
                            this.handleSelect(select);
                          }}
                          // onCheck={e => {
                          //   console.log(e);
                          // }}
                          treeData={treeList}
                        />
                      )}
                    </span>
                  </Col>
                </div>
              </Card>
            </Spin>
          </Col>
          <Col span={12}>
            <Spin spinning={loading2}>
              <Card bordered={false}>
                <Form
                  onSubmit={this.handleSubmit}
                  hideRequiredMark
                  style={{
                    marginTop: 8,
                  }}
                >
                  <Form.Item
                    labelCol={{ xs: { span: 24 }, sm: { span: 5 } }}
                    wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 16 },
                    }}
                    label="机构编码"
                  >
                    {getFieldDecorator('orgCode', {
                      rules: [
                        {
                          required: true,
                          message: '必填',
                        },
                      ],
                      initialValue: orgCode,
                    })(
                      <Input
                        disabled={!(actionType === 'add' || actionType === 'mod')}
                        placeholder="请输入机构编码"
                      />,
                    )}
                  </Form.Item>

                  <Form.Item
                    labelCol={{ xs: { span: 24 }, sm: { span: 5 } }}
                    wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 16 },
                    }}
                    label="机构名称"
                  >
                    {getFieldDecorator('orgName', {
                      rules: [
                        {
                          required: true,
                          message: '必填',
                        },
                      ],
                      initialValue: orgName,
                    })(
                      <Input
                        disabled={!(actionType === 'add' || actionType === 'mod')}
                        placeholder="请输入机构/部门名称"
                      />,
                    )}
                  </Form.Item>

                  <Form.Item
                    labelCol={{ xs: { span: 24 }, sm: { span: 5 } }}
                    wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 16 },
                    }}
                    label="上级部门"
                  >
                    <TreeSelect
                      disabled={true}
                      value={parentName}
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={treeList}
                      placeholder="Please select"
                      treeDefaultExpandAll
                      onChange={this.onChange}
                    />
                  </Form.Item>

                  <Form.Item
                    labelCol={{ xs: { span: 24 }, sm: { span: 5 } }}
                    wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 16 },
                    }}
                    label="电话"
                  >
                    {getFieldDecorator('companyPhone', {
                      rules: [
                        {
                          required: false,
                        },
                      ],
                      initialValue: companyPhone,
                    })(
                      <Input
                        disabled={!(actionType === 'add' || actionType === 'mod')}
                        type="number"
                        placeholder="请输入手机号"
                      />,
                    )}
                  </Form.Item>

                  <Form.Item
                    labelCol={{ xs: { span: 24 }, sm: { span: 5 } }}
                    wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 16 },
                    }}
                    label="地址"
                  >
                    {getFieldDecorator('companyAddress', {
                      rules: [
                        {
                          required: false,
                        },
                      ],
                      initialValue: companyAddress,
                    })(
                      <Input
                        disabled={!(actionType === 'add' || actionType === 'mod')}
                        type="text"
                        placeholder="请输入地址"
                      />,
                    )}
                  </Form.Item>

                  <Form.Item
                    labelCol={{ xs: { span: 24 }, sm: { span: 5 } }}
                    wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 16 },
                    }}
                    label="备注"
                  >
                    {getFieldDecorator('remarks', {
                      rules: [
                        {
                          // required: true,
                          message: '必填',
                        },
                      ],
                      initialValue: remarks,
                    })(
                      <Input.TextArea
                        disabled={!(actionType === 'add' || actionType === 'mod')}
                        placeholder="请输入备注"
                        rows={4}
                      />,
                    )}
                  </Form.Item>

                  {actionType === 'add' || actionType === 'mod' ? (
                    <div style={{ textAlign: 'center' }}>
                      <Button type="primary" htmlType="submit">
                        {actionType === 'add' ? '提交' : actionType === 'mod' ? '修改并保存' : ''}
                      </Button>
                      <Button
                        style={{
                          marginLeft: 8,
                        }}
                        onClick={this.handleCancel}
                      >
                        取消
                      </Button>
                    </div>
                  ) : null}
                </Form>
              </Card>
            </Spin>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Form.create()(Organization);
