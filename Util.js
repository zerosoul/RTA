// 暴露的函数
function computeStats(visitorsData){
  return {
    pages: computePageCounts(visitorsData),
    referrers: computeRefererCounts(visitorsData),
    activeUsers: getActiveUsers(visitorsData)
  };
}

// 获取单独页面的访客数
function computePageCounts(visitorsData) {
  // 举个例子:
  // { "/": 13, "/about": 5 }
  var pageCounts = {};
  for (var key in visitorsData) {
    var page = visitorsData[key].page;
    if (page in pageCounts) {
      pageCounts[page]++;
    } else {
      pageCounts[page] = 1;
    }
  }
  return pageCounts;
}

// 获取来源相同的访客数
function computeRefererCounts(visitorsData) {
  // 举个例子:
  // { "http://example.com/": 3, "http://stackoverflow.com/": 6 }
  var referrerCounts = {};
  for (var key in visitorsData) {
    var referringSite = visitorsData[key].referringSite || '(直接访问)';
    if (referringSite in referrerCounts) {
      referrerCounts[referringSite]++;
    } else {
      referrerCounts[referringSite] = 1;
    }
  }
  return referrerCounts;
}

// 获取在线访客数
function getActiveUsers(visitorsData) {
  return Object.keys(visitorsData).length;
}
module.exports={
  computeStats:computeStats
}