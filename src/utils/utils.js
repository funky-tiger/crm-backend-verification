import { parse } from 'querystring';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export const isUrl = path => reg.test(path);
export const isAntDesignPro = () => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}; // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export const isAntDesignProOrDev = () => {
  const { NODE_ENV } = process.env;

  if (NODE_ENV === 'development') {
    return true;
  }

  return isAntDesignPro();
};
export const getPageQuery = () => parse(window.location.href.split('?')[1]);

export const throttle = (func, wait, options) => {
  let pre = 0;
  let timeout;
  let now = Date.now();

  /* leading为false 把当前时间赋给上次时间pre */
  if (!options.leading) pre = now;

  return function () {
    if (now - pre > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      func.apply(this, arguments);
      pre = now;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, wait - (now - pre));
    }
  };
  function later() {
    /* 如果leading为false 校正pre时间为0 */
    pre = options.leading === false ? 0 : Date.now();
    func.apply(this, arguments);
  }
};

// getMenuPathArr = arr => {
//   console.log('arr', arr)
//   const _arr = [];
//   for (let i = 0; i < arr.length; i++) {
//     const path_arr = arr[i].path.split('/');
//     if (path_arr.length > 1) {
//       if (this.checkRepeat(_arr, arr[i].path)) {
//         _arr.push(this.checkRepeat(_arr, arr[i].path));
//       }
//       const _path = path_arr.filter((ele, idx, __arr) => __arr.length - 1 !== idx).join('/');

//       if (this.checkRepeat(_arr, _path)) {
//         _arr.push(this.checkRepeat(_arr, _path));
//       }
//     } else if (this.checkRepeat(_arr, arr[i].path)) {
//       _arr.push(this.checkRepeat(_arr, arr[i].path));
//     }
//   }
//   const finalArr = _arr.filter(item => item);
//   console.log('finalArr', finalArr)
//   // this.setState({ menuPathArr: finalArr });
// };

// checkRepeat = (arr, str) => {
//   if (arr.indexOf(str) !== -1) {
//     return false;
//   }
//   if (str[0] === '/') {
//     return str;
//   }
//   return `/${str}`;
// };
