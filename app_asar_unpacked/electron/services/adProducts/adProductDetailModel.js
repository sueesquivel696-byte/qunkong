const{AD_PRODUCT_SCHEMA_VERSION:y,createAdProductDateRange:c,toNumber:u}=require("./adProductListModel.js"),_=1,T="https://shop-promotion.qq.com/graphql?op=getOrderDetailById",g="https://shop-promotion.qq.com/graphql?op=getAdMetricsAndTrendsByOrderId",f="https://shop-promotion.qq.com/graphql?op=getOrderMaterialListByPromotionType",I=`
query getOrderDetailById($orderId: Long!, $promotionOrderType: PromotionOrderType, $useScene: UseSceneType) {
  order {
    order(orderId: $orderId, promotionOrderType: $promotionOrderType, useScene: $useScene) {
      orderBasic {
        id
        orderId
        orderName
        accountPromotionStatus
        product {
          productId
          headImage
          title
          price
          __typename
        }
        liveStatus {
          status
          text
          __typename
        }
        shopStatus {
          status
          text
          __typename
        }
        target {
          displayValue
          promotionTarget
          __typename
        }
        nextTarget {
          displayValue
          promotionTarget
          __typename
        }
        roi
        nextRoi
        channel {
          nickName
          headImgUrl
          username
          __typename
        }
        channelInfo {
          name
          channelId
          __typename
        }
        createTime {
          displayValue
          value
          __typename
        }
        promoteStartTime {
          displayValue
          value
          show
          __typename
        }
        targeting {
          ageRange {
            label
            value
            __typename
          }
          cityId {
            label
            value
            __typename
          }
          gender {
            label
            value
            __typename
          }
          __typename
        }
        productStatus {
          status
          text
          showText
          disabled
          __typename
        }
        materialIndicatorName
        __typename
      }
      __typename
    }
    __typename
  }
}
`,P=`
query getAdMetricsAndTrendsByOrderId($orderId: Long!, $startTime: Long!, $endTime: Long!) {
  order {
    order(orderId: $orderId) {
      summaryMetrics(startTime: $startTime, endTime: $endTime) {
        updateTime
        metrics {
          cost {
            displayValue
            displayValueWithSeparator
            prefix
            unit
            value
            __typename
          }
          directPayAmount {
            displayValue
            displayValueWithSeparator
            prefix
            unit
            value
            __typename
          }
          directDealCost {
            displayValue
            displayValueWithSeparator
            prefix
            unit
            value
            __typename
          }
          directPayNum
          directPayRoi
          indirectPayAmount {
            displayValue
            displayValueWithSeparator
            prefix
            unit
            value
            __typename
          }
          indirectPayNum
          indirectPayRoi
          exposureCount
          shopViewCount
          shopProductClickCount
          conversionCount
          conversionCost {
            displayValue
            displayValueWithSeparator
            prefix
            unit
            value
            __typename
          }
          netPayAmount {
            displayValue
            displayValueWithSeparator
            prefix
            unit
            value
            __typename
          }
          netPayNum
          netPayRoi
          prevDayNetPayNum
          prevDayNetPayAmount {
            displayValue
            displayValueWithSeparator
            prefix
            unit
            value
            __typename
          }
          liveJoinCount
          liveProductClickCount
          liveTargetConversionCount
          liveTargetConversionCost {
            displayValue
            displayValueWithSeparator
            prefix
            unit
            value
            __typename
          }
          __typename
        }
        __typename
      }
      trendMetrics(endTime: $endTime, startTime: $startTime) {
        ts
        exposureCount
        shopViewCount
        shopProductClickCount
        directPayNum
        directPayRoi
        conversionCount
        cost {
          displayValue
          displayValueWithSeparator
          prefix
          unit
          value
          __typename
        }
        directPayAmount {
          displayValue
          displayValueWithSeparator
          prefix
          unit
          value
          __typename
        }
        conversionCost {
          displayValue
          displayValueWithSeparator
          prefix
          unit
          value
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
`,h=`
query getOrderMaterialListByPromotionType($orderId: Long!, $field: MaterialSortField = DEFAULT, $status: [MaterialAuditStatus!] = [], $beginUploadTime: Long!, $endUploadTime: Long!, $pageNum: Int = 1, $pageSize: Int = 10, $promotionType: PromotionOrderType, $sortOrder: SortDirection!, $materialContentType: MaterialContentType = ALL, $channelVideoQueryInput: ChannelVideoQueryInput) {
  order {
    order(orderId: $orderId, promotionOrderType: $promotionType) {
      materials(
        filterBy: {beginUploadTime: $beginUploadTime, orderId: $orderId, status: $status, endUploadTime: $endUploadTime, materialContentType: $materialContentType, channelVideoQueryInput: $channelVideoQueryInput}
        pageNum: $pageNum
        pageSize: $pageSize
        orderBy: {field: $field, direction: $sortOrder}
      ) {
        pageInfo {
          totalPage
          pageNum
          __typename
        }
        totalCount
        edges {
          node {
            createTime
            materialId
            materialCoverUrl
            materialFileUrl
            materialName
            materialType
            status {
              status
              text
              __typename
            }
            summaryMetrics(endTime: $endUploadTime, startTime: $beginUploadTime) {
              cost {
                prefix
                unit
                value
                displayValue
                displayValueWithSeparator
                __typename
              }
              exposureCount
              clickCount
              videoPlay3sRate
              convertCount
              netPayNum
              payAmount {
                prefix
                unit
                value
                displayValue
                displayValueWithSeparator
                __typename
              }
              netPayAmount {
                prefix
                unit
                value
                displayValue
                displayValueWithSeparator
                __typename
              }
              __typename
            }
            auditMessages {
              label
              value
              auditMessageType
              __typename
            }
            liveProductStateText {
              displayValue
              show
              __typename
            }
            previewInfo {
              preview
              disablePreviewTips
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    __typename
  }
}
`;function s(e){return Array.isArray(e)?e:[]}function i(e){return e==null?"":String(e)}function S(e){if(!e||typeof e!="object")return i(e);const a=e.prefix||"";return e.displayValueWithSeparator!==void 0?`${a}${e.displayValueWithSeparator}`:e.displayValue!==void 0?`${a}${e.displayValue}`:e.value!==void 0?i(e.value):""}function p(e){return e&&typeof e=="object"?S(e):i(e)}function d(e={}){return Array.isArray(e)?e.reduce((a,t)=>{const r=t?.indicatorName||t?.metric||t?.name;return r&&(a[r]=p(t.value??t.displayValue)),a},{}):!e||typeof e!="object"?{}:Object.entries(e).reduce((a,[t,r])=>(t!=="__typename"&&(a[t]=p(r)),a),{})}function n(e){return e?typeof e=="string"?e:e.text||e.showText||e.status||"":""}function l(e){return e?typeof e=="string"?e:e.displayValue||i(e.value):""}function A(e={}){const a=[];for(const t of["gender","ageRange","cityId"]){const r=e?.[t];r&&a.push({key:t,label:r.label||t,value:r.value||"\u4E0D\u9650"})}return a}function C(e={}){const a=e?.data?.order?.order||{},t=a.orderBasic||{},r=t.product||{};return{orderId:i(t.orderId||a.orderId),productId:i(r.productId||t.productId),title:r.title||t.orderName||"",productImage:r.headImage||r.headImgUrl||"",targetRoi:i(t.roi||""),nextTargetRoi:i(t.nextRoi||""),targetText:t.target?.displayValue||"",nextTargetText:t.nextTarget?.displayValue||"",statusText:n(t.productStatus)||n(t.liveStatus)||n(t.shopStatus)||n(t.accountPromotionStatus),status:t.productStatus?.status||t.liveStatus?.status||t.shopStatus?.status||"",channelName:t.channelInfo?.name||t.channel?.nickName||"",channelId:t.channelInfo?.channelId||t.channel?.username||"",promoteStartTime:l(t.promoteStartTime),createTime:l(t.createTime),materialIndicatorName:t.materialIndicatorName||"",targeting:A(t.targeting)}}function M(e={}){const a=e?.data?.order?.order||{},t=a.summaryMetrics?.metrics||a.summaryMetrics;return{summary:d(t),trends:s(a.trendMetrics).map(r=>d(r)),updatedAt:a.summaryMetrics?.updateTime||""}}function V(e={}){const a=d(e.summaryMetrics);return{materialId:i(e.materialId),materialType:e.materialType||"",materialName:e.materialName||e.title||e.name||"",materialCoverUrl:e.materialCoverUrl||e.coverUrl||e.thumbUrl||"",materialFileUrl:e.materialFileUrl||e.videoUrl||e.imageUrl||"",createTime:l(e.createTime),statusText:n(e.status)||e.liveProductStateText?.displayValue||"",auditMessages:s(e.auditMessages).map(t=>({label:t?.label||"",value:t?.value||"",type:t?.auditMessageType||""})).filter(t=>t.label||t.value),preview:e.previewInfo?.preview||"",metrics:{exposureCount:a.exposureCount||"0",clickCount:a.clickCount||"0",cost:a.cost||"\xA50.00",payAmount:a.payAmount||a.netPayAmount||"\xA50.00",convertCount:a.convertCount||a.netPayNum||"0",videoPlay3sRate:a.videoPlay3sRate||""}}}function R(e={}){const a=e?.data?.order?.order?.materials||{},t=s(a.edges);return{pageInfo:{pageNum:u(a.pageInfo?.pageNum,1),totalPage:Math.max(1,u(a.pageInfo?.totalPage,1)),totalCount:u(a.totalCount,t.length)},materials:t.map(r=>V(r?.node||{}))}}function o(e){return i(e).trim()||"0"}function m(e,a=!1){const t=i(e).trim();if(!t)return"";if(/^\d{13,}$/.test(t))return t;if(/^\d{10}$/.test(t))return`${t}${a?"999":"000"}`;const r=Number(t);return Number.isFinite(r)?String(Math.trunc(r<1e12?r*1e3+(a?999:0):r)):t}function x(e={},a=()=>new Date){const t=c({...e,now:e.now||a()});return{...t,startTimeMs:m(t.startTime,!1),endTimeMs:m(t.endTime,!0)}}function $(e){return{operationName:"getOrderDetailById",variables:{orderId:o(e),promotionOrderType:"PROMOTION_PRODUCT_TYPE",useScene:"ORDER_DETAIL"},query:I}}function N(e,a={}){return{operationName:"getAdMetricsAndTrendsByOrderId",variables:{orderId:o(e),startTime:a.startTimeMs,endTime:a.endTimeMs},query:P}}function v(e,a={},t={}){const r=Math.min(50,Math.max(1,Number(t.pageSize)||10));return{operationName:"getOrderMaterialListByPromotionType",variables:{field:"CREATE_TIME",status:["IN_PROGRESS","PASS","PARTIAL_PASS","REJECT","APPEALING"],pageNum:Math.max(1,Number(t.pageNum)||1),pageSize:r,materialContentType:"ALL",orderId:o(e),sortOrder:"DESC",beginUploadTime:a.startTimeMs,endUploadTime:a.endTimeMs,promotionType:"PROMOTION_PRODUCT_TYPE",channelVideoQueryInput:{orderId:o(e)}},query:h}}module.exports={AD_PRODUCT_DETAIL_MATERIALS_URL:f,AD_PRODUCT_DETAIL_METRICS_URL:g,AD_PRODUCT_DETAIL_SCHEMA_VERSION:_,AD_PRODUCT_DETAIL_URL:T,AD_PRODUCT_SCHEMA_VERSION:y,createAdProductDetailDateRange:x,createAdProductDetailPayload:$,createAdProductMaterialsPayload:v,createAdProductMetricsPayload:N,normalizeAdProductDetailResponse:C,normalizeAdProductMaterialsResponse:R,normalizeAdProductMetricsResponse:M,normalizeMetricValue:p,toMillisecondTime:m};
