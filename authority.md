### 权限相关接口结构定义

#### 1. 菜单权限

- 层级关系 : 除了一级菜单不需要传 parentId 之外， 二级/三级菜单都需要传 parentId

- 增;

  > method: `POST`

  > url: `/jeecg-boot/sys/permission/add`

  > params: `{title:'我的工作台', describe:'这是首页下的工作台', path:'/home/user', parentId: '父级路由id'}`

- 删;

  > method: `DELETE`

  > url: `/jeecg-boot/sys/permission/delete`

  > params: `{id:'123'}`

- 改;

  > method: `PUT`

  > url: `/jeecg-boot/sys/permission/edit`

  > params: `{title:'我的工作台', describe:'这是首页下的工作台', path:'/home/user', parentId: '父级路由id'}`

- 查;

  > method: `GET`

  > url: `/jeecg-boot/sys/permission/list`

  > params: `{}`

#### 2. 按钮权限

- 增;

  > method: `POST`

  > url: `/jeecg-boot/sys/button/add`

  > params: `{name:'ant.form.submit', describe:'编辑页的提交表单', status: 1}`

- 删;

  > method: `DELETE`

  > url: `/jeecg-boot/sys/button/delete`

  > params: `{id:'123'}`

- 改;

  > method: `PUT`

  > url: `/jeecg-boot/sys/button/edit`

  > params: `{name:'ant.form.submit', describe:'编辑页的提交表单', status: 1}`

- 查;

  > method: `GET`

  > url: `/jeecg-boot/sys/button/list`

  > params: `{}`

### 最终需要的基本数据结构

- URL: `/jeecg-boot/sys/permission/getUserPermissionByToken`
- Method: `GET`
- Param: `{token: xxx}`

> 返回的数据字段是最基本的字段，可以添加其他字段，比如每个的 id

```json
{
  "success": true,
  "message": "查询成功",
  "code": 200,
  "result": {
    "buttonAuth": [
      { "name": "ant.form.submit", "describe": "编辑页提交表单按钮", "status": 1 },
      { "name": "home.menu.edit", "describe": "首页编辑按钮", "status": 2 }
    ],
    "menuAuth": [
      {
        "pathId": 189798731,
        "name": "首页",
        "describe": "首页",
        "path": "/home"
        "children": [
          {
            "pathId": 189798733,
            "name": "我的工作台",
            "describe": "这是首页下的工作台",
            "path": "/home/user"
          }
        ]
      },
        {
        "pathId": 189798732,
        "name": "首页",
        "describe": "首页",
        "path": "/home"
        "children": [
          {
            "pathId": 189798736,
            "name": "我的工作台",
            "describe": "这是首页下的工作台",
            "path": "/home/user"
          },
          {
            "pathId": 189798738,
            "name": "个人中心",
            "describe": "这是首页下的个人中心",
            "path": "/home/center"
             "children": [
                {
                  "pathId": 189798730,
                  "name": "个人设置",
                  "describe": "这是首页个人中心下的个人设置",
                  "path": "/home/center/setting"
                }
              ]
          }
        ]
      }
    ]
  }
}
```
