/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-duplicate-disable */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable react/no-unused-state */
import {
  Avatar,
  Tree,
  Alert,
  TreeSelect,
  Badge,
  Button,
  Card,
  Divider,
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
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { connect } from 'dva';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import StandardTable from './components/StandardTable';
import styles from './style.less';

const status = ['关闭', '运行中', '已上线', '异常'];
const statusMap = ['default', 'processing', 'success', 'error'];

@connect(({ listBasicList, loading }) => ({
  listBasicList,
  loading: loading.models.listBasicList,
}))
class RoleManagement extends Component {
  state = {
    GroupFormVisible: false,
    FormLoading: false,
    selectedRows: [],
    treeList: [],
    defaultKeys: [],
    pageNumber: 1,
    pageSize: 10,
    activeGroupKey: '',
  };

  columns = [
    {
      title: 'No',
      dataIndex: 'No', // 取数据中的哪个字段
    },
    {
      title: '角色编号',
      dataIndex: 'roleNo',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色类型',
      dataIndex: 'roleType',
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/getQueryRoleTree',
      cb: data => {
        console.log('role', data);
        this.setState(
          {
            treeList: this.resolveTree(data),
            defaultKeys: [data[0].id + ''],
            activeGroupKey: data[0].id,
            //   loading1: false,
          },
          () => {
            console.log('treeList', this.state.treeList);
          },
        );
        // this.getcompanyDetailById(data[0].id);
      },
    });
  }

  resolveTree = arr => {
    for (let i = 0; i < arr.length; i++) {
      arr[i].title = arr[i].roleGroupName;
      arr[i].key = arr[i].id;
      arr[i].value = arr[i].id;
      if (Array.isArray(arr[i].children) && arr[i].children.length !== 0) {
        this.resolveTree(arr[i].children);
      }
    }
    return arr;
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'listTableList/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;

      default:
        break;
    }
  };

  handleSelectRows = rows => {
    // 选中的所有tab
    console.log('rows', rows);
    this.setState({
      selectedRows: rows,
    });
  };

  selectedItem = () => '当前选择:';

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row
          gutter={{
            md: 8,
            lg: 24,
            xl: 48,
          }}
        >
          <Col md={10} sm={24}>
            <Form.Item
              label="角色名称"
              style={{
                width: '100%',
              }}
            >
              {this.props.form.getFieldDecorator('rolename', {
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
              })(<Input placeholder="请输入角色名称查询" />)}
            </Form.Item>
          </Col>
          <Col md={10} sm={24}>
            <Form.Item label="角色类型">
              {this.props.form.getFieldDecorator('roletype')(
                <Select
                  placeholder="全部"
                  style={{
                    width: 200,
                  }}
                >
                  <Select.Option value="0">角色1</Select.Option>
                  <Select.Option value="1">角色2</Select.Option>
                </Select>,
              )}
            </Form.Item>
          </Col>
          <Col md={4} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
              >
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderRightForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Row gutter={16}>
        <Col className="gutter-row" span={3}>
          <Button type="primary">添加角色</Button>
        </Col>
        <Col className="gutter-row" span={3}>
          <Button>编辑角色</Button>
        </Col>
        <Col className="gutter-row" span={3}>
          <Button type="danger">删除角色</Button>
        </Col>
        <Col className="gutter-row" span={3}>
          <Button type="dashed">授权角色</Button>
        </Col>
      </Row>
    );
  }

  renderLeftForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Row gutter={16}>
        <Col className="gutter-row" span={8}>
          <Button
            type="primary"
            onClick={() => {
              this.setState({ GroupFormVisible: true });
            }}
          >
            添加
          </Button>
        </Col>
        <Col className="gutter-row" span={8}>
          <Button>编辑</Button>
        </Col>
        <Col className="gutter-row" span={8}>
          <Button type="danger">删除</Button>
        </Col>
      </Row>
    );
  }

  handleSelect = item => {
    console.log('item::', item);
    this.setState({
      //   loading2: true,
      //   actionType: '',
      activeGroupKey: item[0],
    });
    // this.getRoleDetailById(item[0]);
  };

  /**
   * 根据id获取公司详情
   * @param id 公司id
   */
  getRoleDetailById = id => {
    this.props.dispatch({
      type: 'role/getQueryByRoleGroupId',
      params: { id },
      cb: result => {
        console.log('result:', result);
      },
    });
  };

  render() {
    const { treeList, selectedRows, defaultKeys, GroupFormVisible, FormLoading } = this.state;
    const data = {
      list: [
        {
          roleName: '总公司管理员',
          roleDesc: '',
          roleType: '系统管理',
          roleNo: 'A0001',
          No: '1',
        },
        {
          roleName: '子公司A管理员',
          roleDesc: '',
          roleType: '普通用户',
          roleNo: 'A0002',
          No: '2',
        },
        {
          roleName: '子公司A管理员',
          roleDesc: '',
          roleType: '系统管理',
          roleNo: 'A0003',
          No: '3',
        },
        {
          roleName: '子公司B管理员',
          roleDesc: '',
          roleType: '普通用户',
          roleNo: 'A0004',
          No: '4',
        },
        {
          roleName: '子公司C管理员',
          roleDesc: '',
          roleType: '系统管理',
          roleNo: 'A0005',
          No: '5',
        },
        {
          roleName: '子公司C管理员',
          roleDesc: '',
          roleType: '普通用户',
          roleNo: 'A0006',
          No: '6',
        },
        {
          roleName: '子公司C管理员',
          roleDesc: '',
          roleType: '普通用户',
          roleNo: 'A0007',
          No: '7',
        },
      ],
      pagination: { current: 1, pageSize: 10, total: 8 },
    };
    return (
      <div>
        <Card bordered={false} style={{ marginBottom: 10 }}>
          <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
        </Card>
        <Col span={6}>
          <Card bordered={false} style={{ marginRight: '10px', height: '70vh' }}>
            <div className={styles.tableListForm}>{this.renderLeftForm()}</div>
            <Col>
              <span style={{ userSelect: 'none' }}>
                {defaultKeys.length !== 0 && (
                  <Tree
                    checkStrictly
                    autoExpandParent
                    defaultExpandedKeys={defaultKeys}
                    defaultSelectedKeys={defaultKeys}
                    onSelect={select => {
                      this.handleSelect(select);
                    }}
                    treeData={treeList}
                  />
                )}
              </span>
            </Col>
          </Card>
        </Col>

        <Col span={18}>
          <Card bordered={false} style={{ marginRight: '10px', height: '70vh' }}>
            <div className={styles.tableListForm} style={{ marginBottom: 10 }}>
              {this.renderRightForm()}
            </div>
            <Col>
              <StandardTable
                selectedRows={selectedRows}
                // loading={loading}
                data={data}
                columns={this.columns}
                onSelectRow={this.handleSelectRows}
                onChange={() => {}}
              />
            </Col>
          </Card>
        </Col>
        <Modal
          visible={GroupFormVisible}
          title="Title"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
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
              {this.props.form.getFieldDecorator('orgCode', {
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
                // initialValue: orgCode,
              })(
                <Input
                  // disabled={!(actionType === 'add' || actionType === 'mod')}
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
              {this.props.form.getFieldDecorator('orgName', {
                rules: [
                  {
                    required: true,
                    message: '必填',
                  },
                ],
                // initialValue: orgName,
              })(
                <Input
                  // disabled={!(actionType === 'add' || actionType === 'mod')}
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
                value='parentName'
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
              {this.props.form.getFieldDecorator('companyPhone', {
                rules: [
                  {
                    required: false,
                  },
                ],
                // initialValue: companyPhone,
              })(
                <Input
                  // disabled={!(actionType === 'add' || actionType === 'mod')}
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
              {this.props.form.getFieldDecorator('companyAddress', {
                rules: [
                  {
                    required: false,
                  },
                ],
                // initialValue: companyAddress,
              })(
                <Input
                  // disabled={!(actionType === 'add' || actionType === 'mod')}
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
              {this.props.form.getFieldDecorator('remarks', {
                rules: [
                  {
                    message: '必填',
                  },
                ],
                // initialValue: remarks,
              })(
                <Input.TextArea
                  // disabled={!(actionType === 'add' || actionType === 'mod')}
                  placeholder="请输入备注"
                  rows={4}
                />,
              )}
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <Button type="primary" htmlType="submit" loading={FormLoading} onClick={this.handleOk}>
                提交
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
          </Form>
        </Modal>
      </div>
    );
  }

  showModal = () => {
    this.setState({
      GroupFormVisible: true,
    });
  };

  handleOk = () => {
    this.setState({ FormLoading: true });
    setTimeout(() => {
      this.setState({ FormLoading: false, GroupFormVisible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ GroupFormVisible: false });
  };
}

export default Form.create()(RoleManagement);
