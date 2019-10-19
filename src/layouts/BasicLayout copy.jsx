/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { SettingDrawer } from '@ant-design/pro-layout';
import React from 'react';
import Link from 'umi/link';
import { connect } from 'dva';
import {
  Avatar,
  Tree,
  Tabs,
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
} from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { isAntDesignPro } from '@/utils/utils';
import { throttle } from '../utils/utils';
import menuNameData from '../locales/zh-CN/menu';
import styles from './layout.less';
import logo from '../assets/logo.svg';
/**
 * use Authorized check all menu item
 */

const footerRender = (_, defaultDom) => {
  if (!isAntDesignPro()) {
    return defaultDom;
  }

  return (
    <>
      {defaultDom}
      <div
        style={{
          padding: '0px 24px 24px',
          textAlign: 'center',
        }}
      >
        <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer">
          <img
            src="https://www.netlify.com/img/global/badges/netlify-color-bg.svg"
            width="82px"
            alt="netlify logo"
          />
        </a>
      </div>
    </>
  );
};

class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.newTabIndex = 0;
    this.indexRoute = '/dashboard/analysis'; // 初始化的首页
    this.activeKey = '';
    this.pathArr = [];
    this.redirectUrl = '';
    this.i = 0;
    this._arr = [];
    this.state = {
      clickIndex: true,
      menuArr: [],
      menuPathArr: [],
      panes: [],
    };
  }

  onChange = activeKey => {
    this.setState({ clickIndex: false });
    this.props.history.push(activeKey);
    this.activeKey = activeKey;
  };

  onEdit = (targetKey, action) => {
    const { panes } = this.state;
    let _panes = panes;
    if (action === 'remove') {
      _panes = panes.filter(item => {
        return item.key !== targetKey;
      });
      this.pathArr = this.pathArr.filter(item => {
        return item !== targetKey;
      });
      if (_panes.length >= 1) {
        this.props.history.push(_panes[_panes.length - 1].key);
      } else {
        this.props.history.push(this.indexRoute);
        this.setState({ clickIndex: true });
      }
      this.setState({ panes: _panes }, () => {});
    }
  };

  findUrlIframe = _path => {
    const { menuArr } = this.state;
    for (let i = 0; i < menuArr.length; i++) {
      if (menuArr[i].path === _path && menuArr[i].redirect) {
        console.log('嵌入页面哦', menuArr[i].redirect);
        this.redirectUrl = menuArr[i].redirect;
        return;
      }
      break;
    }
    this.redirectUrl = '';
  };

  findOkPath = pathname => {
    const { panes } = this.state;
    let ind = this.pathArr.indexOf(pathname);
    if (ind === -1 && pathname !== '/' && pathname !== this.indexRoute) {
      this.pathArr.push(pathname);
      panes.push({ title: this.findMenu(pathname), key: pathname });
    }
    if (!(pathname === this.indexRoute)) {
      this.setState({ clickIndex: false });
    }
    this.activeKey = pathname;
  };

  componentDidMount() {
    const {
 dispatch, children, settings, history
} = this.props;
    history.listen((location, action) => {
      /** 监听路由变化 改变页面 */
      throttle(this.findOkPath(location.pathname), 1000, { leading: false });
      /** 监听路由变化 改变layout */
      throttle(this.findUrlIframe(location.pathname), 1000, { leading: false });
    });
    if (dispatch) {
      dispatch({
        type: 'userLogin/getPermission',
        cb: data => {
          const menuArr = data.result.menu;
          this.setState({ menuArr });
          this.getMenuPathArr(menuArr);
        },
      });
    }
  }

  getMenuPathArr = arr => {
    for (let i = 0; i < arr.length; i++) {
      this._arr.push(arr[i].path);
      if (arr[i].children) {
        this.getMenuPathArr(arr[i].children);
      }
    }
    this.setState({ menuPathArr: this._arr }, () => {
      // console.log(this.state.menuPathArr);
    });
  };

  menuDataRender = menuList => {
    return menuList.map(item => {
      const { menuPathArr } = this.state;
      const keyInd = menuPathArr.indexOf(item.path);
      const localItem = {
        ...item,
        children: item.children ? this.menuDataRender(item.children) : [],
      };
      if (
        keyInd > -1
        && menuPathArr[keyInd].length === item.path.length
        && item.path !== this.indexRoute
      ) {
        return Authorized.check(item.authority, localItem, null);
      }
    });
  };

  handleMenuCollapse = payload => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  };

  findMenu = pathname => {
    let _activeKey = 'menu' + pathname;
    let _mune = _activeKey.split('/').join('.');
    return menuNameData[_mune];
  };

  handleClickIndex = () => {
    this.setState({ clickIndex: true });
    this.props.history.push(this.indexRoute);
  };

  render() {
    const { clickIndex } = this.state;
    return (
      <>
        <ProLayout
          logo={logo}
          onCollapse={this.handleMenuCollapse}
          menuItemRender={(menuItemProps, defaultDom) => {
            if (menuItemProps.isUrl) {
              return defaultDom;
            }

            return <Link to={menuItemProps.path}>{defaultDom}</Link>;
          }}
          breadcrumbRender={(routers = []) => [
            {
              path: '/',
              breadcrumbName: formatMessage({
                id: 'menu.home',
                defaultMessage: 'Home',
              }),
            },
            ...routers,
          ]}
          itemRender={(route, params, routes, paths) => {
            const first = routes.indexOf(route) === 0;
            return first ? (
              <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
            ) : (
              <span>{route.breadcrumbName}</span>
            );
          }}
          footerRender={footerRender}
          menuDataRender={this.menuDataRender}
          formatMessage={formatMessage}
          rightContentRender={rightProps => <RightContent {...rightProps} />}
          {...this.props}
          {...this.props.settings}
        >
          <div className={styles.tabBox} style={{ display: 'flex' }}>
            <Tabs
              hideAdd
              onChange={this.onChange}
              activeKey={this.activeKey}
              type="editable-card"
              onEdit={this.onEdit}
            >
              <Tabs.TabPane  tab={
        <span>
          <Icon type="apple" />
        </span>
      } key="1">
                <div
                  className={styles.indexBox}
                  onClick={() => {
                    this.handleClickIndex();
                  }}
                >
                  <div className={!clickIndex ? styles.index : styles.activeindex}>👋</div>
                </div>
              </Tabs.TabPane>
              {this.state.panes.map(pane => (
                <Tabs.TabPane tab={pane.title} key={pane.key}></Tabs.TabPane>
              ))}
            </Tabs>
          </div>
          {this.redirectUrl ? (
            <React.Fragment>
              <iframe
                src={this.redirectUrl}
                title="test"
                frameBorder="0"
                width="100%"
                height="800px"
                scrolling="auto"
              ></iframe>
            </React.Fragment>
          ) : (
            <React.Fragment>{this.props.children}</React.Fragment>
          )}
        </ProLayout>
        <SettingDrawer
          settings={this.props.settings}
          onSettingChange={config =>
            this.props.dispatch({
              type: 'settings/changeSetting',
              payload: config,
            })
          }
        />
      </>
    );
  }
}

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
