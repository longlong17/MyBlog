//处理日期

export function formtDate(timestamp) {
  let date = new Date(timestamp);
  let year = date.getFullYear(); //年
  let month = (date.getMonth() + 1).toString().padStart(2, "0"); //月
  let day = date.getDate().toString().padStart(2, "0"); //日
  let hour = date.getHours().toString().padStart(2, "0"); //时
  let minutes = date.getMinutes().toString().padStart(2, "0"); //分
  let seconds = date.getSeconds(); //秒

  let wekArr = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];

  let week = wekArr[date.getDay()]; //星期几

  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds + ' ' + week
  );
}
