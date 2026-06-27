const v=1,_="https://shop-promotion.qq.com/graphql?op=getOrderList",s={TODAY:"today",YESTERDAY:"yesterday",SEVEN_DAYS:"sevenDays",THIRTY_DAYS:"thirtyDays"},D={updatedAt:"UPDATE_TIME",updateTime:"UPDATE_TIME",createdAt:"CREATE_TIME",createTime:"CREATE_TIME"},b=`
query getOrderList($sortDirection: SortDirection = DESC, $liveSortField: LiveOrderSort, $productOrderField: ProductOrderSort, $shopOrderField: ShopOrderSort, $filterBy: OrderFilters!, $pageNum: Int!, $pageSize: Int!) {
  order {
    orders(
      filterBy: $filterBy
      orderBy: {direction: $sortDirection, liveOrderField: $liveSortField, productOrderField: $productOrderField, shopOrderField: $shopOrderField}
      pageNum: $pageNum
      pageSize: $pageSize
    ) {
      totalCount
      startPromotingProductCount
      promotionStatus
      pageInfo {
        pageNum
        pageSize
        totalPage
      }
      tabList {
        tabType
        count
      }
      statusCountList {
        tabType
        count
      }
      summaryMetrics {
        metric
        metricText
        displayValue
      }
      edges {
        node {
          orderId
          orderName
          roi
          nextRoi
          headImgUrl
          materialIds
          bidModifyCount
          productStatus {
            status
            text
          }
          product {
            productId
            title
            headImage
          }
          budget {
            displayValue
            value
          }
          target {
            promotionTarget
            displayValue
          }
          nextTarget {
            promotionTarget
            displayValue
          }
          updateTime {
            displayValue
            value
            show
          }
          createTime {
            displayValue
            value
            show
          }
          metrics {
            indicatorName
            name
            value
            isMoney
            detailedMoney {
              value
              unit
              prefix
              displayValueWithSeparator
              displayValue
            }
          }
        }
      }
    }
  }
}
`;function p(t){return Array.isArray(t)?t:[]}function i(t,r=0){if(t==null||t==="")return r;const e=typeof t=="string"?t.replace(/[￥¥,\s]/g,""):t,a=Number(e);return Number.isFinite(a)?a:r}function A(t=[]){const r={};for(const e of p(t)){const a=e?.tabType||e?.status||e?.key||"";a&&(r[a]=i(e.count))}return r}function Y(t={}){const r=t.detailedMoney||{},e=t.value??r.value??t.displayValue??r.displayValue??r.displayValueWithSeparator??0;return{key:t.indicatorName||t.metric||t.name||"",name:t.metricText||t.name||t.indicatorName||t.metric||"",value:i(e),rawValue:e==null?"":String(e),displayValue:t.displayValue||r.displayValue||r.displayValueWithSeparator||String(e??""),isMoney:t.isMoney===!0}}function g(t=[]){const r={};for(const e of p(t)){const a=Y(e);a.key&&(r[a.key]=a)}return r}function l(t,r=[]){for(const e of r)if(t[e])return i(t[e].value);return 0}function m(t,r=[],e="--"){for(const a of r)if(t[a]?.displayValue)return t[a].displayValue;return e}function $(t,r=2){const e=Number(t);return!Number.isFinite(e)||e<=0?"":e.toFixed(r).replace(/\.?0+$/,"")}function h(t,r){const e=$(r,2);return e?`\u6210\u4EA4ROI ${e}`:t||""}function N(t=""){const r=String(t||"").match(/ROI\s*([0-9]+(?:\.[0-9]+)?)/i);return r?i(r[1]):0}function P(t={}){const r=t?.displayValue||"",e=t?.value??"",a=Number(e);let o=0;if(Number.isFinite(a)&&a>0&&(o=a>1e11?a:a*1e3),!o&&r){const d=Date.parse(String(r).replace(/\//g,"-"));o=Number.isNaN(d)?0:d}const n=o?new Date(o).toISOString():"";return{displayValue:r,value:e==null?"":String(e),timestampMs:o,iso:n,show:t?.show!==!1}}function R(t={},r={}){const e=t.product||{},a=g(t.metrics),o=P(t.updateTime),n=P(t.createTime),d=String(e.productId||t.productId||""),O=String(t.orderId||""),C=e.title||t.orderName||t.title||"",V=t.productStatus?.status||t.status||"",M=t.productStatus?.text||"",T=i(t.roi,N(t.target?.displayValue)),S=i(t.nextRoi,N(t.nextTarget?.displayValue)),f=p(t.materialIds).map(x=>String(x)).filter(Boolean),u={schemaVersion:1,shopId:String(r.shopId||""),shopName:r.shopName||r.shopId||"",orderId:O,productId:d,title:C,status:V,statusText:M,targetRoi:T,nextTargetRoi:S,targetBidText:h(t.target?.displayValue,T),targetText:t.target?.displayValue||"",targetType:t.target?.promotionTarget||"",nextTargetBidText:h(t.nextTarget?.displayValue,S),nextTargetText:t.nextTarget?.displayValue||"",nextTargetType:t.nextTarget?.promotionTarget||"",budgetText:t.budget?.displayValue||"",budgetValue:i(t.budget?.value),materialCount:f.length,materialIds:f,bidModifyCount:i(t.bidModifyCount),headImage:e.headImage||t.headImgUrl||"",metrics:a,exposureCount:l(a,["exposureCount"]),cost:l(a,["cost"]),totalPayAmount:l(a,["totalPayAmount","directPayAmount"]),totalPayRoi:l(a,["totalPayRoi","directPayRoi"]),totalPayNum:l(a,["totalPayNum","directPayNum","convertCount"]),convertCost:l(a,["convertCost"]),costDisplay:m(a,["cost"],"\uFFE50.00"),exposureDisplay:m(a,["exposureCount"],"0"),totalPayAmountDisplay:m(a,["totalPayAmount","directPayAmount"],"\uFFE50.00"),totalPayRoiDisplay:m(a,["totalPayRoi","directPayRoi"],"0.00"),totalPayNumDisplay:m(a,["totalPayNum","directPayNum","convertCount"],"0"),convertCostDisplay:m(a,["convertCost"],"\uFFE50.00"),updatedAt:o.iso,updatedAtMs:o.timestampMs,updatedAtDisplay:o.displayValue,createdAt:n.iso,createdAtMs:n.timestampMs,createdAtDisplay:n.displayValue,syncedAt:r.syncedAt||""};return u.searchText=[u.shopName,u.orderId,u.productId,u.title,u.status,u.statusText,u.targetText,u.nextTargetText].filter(Boolean).join(" ").toLowerCase(),u}function w(t={},r={}){const e=t?.data?.order?.orders;if(!e||typeof e!="object"){const o=new Error("getOrderList response does not contain data.order.orders");throw o.code="AD_PRODUCT_EMPTY_RESPONSE",o.details={topLevelKeys:Object.keys(t||{}),dataKeys:Object.keys(t?.data||{}),orderKeys:Object.keys(t?.data?.order||{}),errorMessages:p(t?.errors).map(n=>n?.message||String(n)).filter(Boolean).slice(0,5)},o.retryable=!0,o}const a=p(e.edges).map(o=>R(o?.node||{},r)).filter(o=>o.orderId||o.productId);return{schemaVersion:1,items:a,counts:A(e.tabList),statusCounts:A(e.statusCountList),summary:g(e.summaryMetrics),totalCount:i(e.totalCount,a.length),startPromotingProductCount:i(e.startPromotingProductCount),promotionStatus:e.promotionStatus||"",pageInfo:{pageNum:i(e.pageInfo?.pageNum,1),pageSize:i(e.pageInfo?.pageSize,a.length||10),totalPage:Math.max(1,i(e.pageInfo?.totalPage,1))}}}function c(t=new Date){const r=t instanceof Date?t:new Date(t),e=Number.isNaN(r.getTime())?new Date:r,a=new Date(e.getFullYear(),e.getMonth(),e.getDate(),0,0,0,0),o=new Date(e.getFullYear(),e.getMonth(),e.getDate(),23,59,59,999);return{startTime:String(Math.floor(a.getTime()/1e3)),endTime:String(Math.floor(o.getTime()/1e3))}}function E(t){const r=String(t||"").trim();return r===s.YESTERDAY?s.YESTERDAY:r===s.SEVEN_DAYS||r==="7d"||r==="last7Days"?s.SEVEN_DAYS:r===s.THIRTY_DAYS||r==="30d"||r==="last30Days"?s.THIRTY_DAYS:s.TODAY}function y(t,r){const e=t instanceof Date?t:new Date(t),a=Number.isNaN(e.getTime())?new Date:e;return new Date(a.getFullYear(),a.getMonth(),a.getDate()+r,12,0,0,0)}function I(t={}){if(t.startTime&&t.endTime)return{preset:t.datePreset||t.preset||"custom",cacheKey:t.cacheKey||`range-${t.startTime}-${t.endTime}`,startTime:String(t.startTime),endTime:String(t.endTime),persistent:!1};const r=E(t.datePreset||t.preset),e=t.now||t.date||new Date;if(r===s.YESTERDAY){const a=c(y(e,-1));return{preset:r,...a,cacheKey:`${r}-${a.startTime}-${a.endTime}`,persistent:!1}}if(r===s.SEVEN_DAYS){const a=c(y(e,-7)).startTime,o=c(y(e,-1)).endTime;return{preset:r,startTime:a,endTime:o,cacheKey:`${r}-${a}-${o}`,persistent:!1}}if(r===s.THIRTY_DAYS){const a=c(y(e,-30)).startTime,o=c(y(e,-1)).endTime;return{preset:r,startTime:a,endTime:o,cacheKey:`${r}-${a}-${o}`,persistent:!1}}return{preset:s.TODAY,cacheKey:s.TODAY,...c(e),persistent:!0}}function L(t={}){const r=I(t),e=t.sortBy||"updatedAt",a=D[e]||D.updatedAt,o=String(t.sortDir||"desc").toLowerCase()==="asc"?"ASC":"DESC",n=Math.min(100,Math.max(1,Number(t.pageSize)||50)),d={productSearchTab:t.productSearchTab||t.status||"ALL",promotionType:t.promotionType||"PROMOTION_PRODUCT_TYPE",startTime:String(r.startTime),endTime:String(r.endTime)};return t.keyword&&(d.keyword=String(t.keyword)),{operationName:"getOrderList",variables:{sortDirection:o,productOrderField:a,pageNum:Math.max(1,Number(t.pageNum)||1),pageSize:n,filterBy:d},query:b}}module.exports={AD_PRODUCT_ORDER_LIST_URL:_,AD_PRODUCT_SCHEMA_VERSION:1,DATE_PRESETS:s,createAdProductDateRange:I,createAdProductListPayload:L,getLocalDayRangeSeconds:c,normalizeDatePreset:E,normalizeAdProductListResponse:w,normalizeAdProductRow:R,normalizeMetricMap:g,toNumber:i};
