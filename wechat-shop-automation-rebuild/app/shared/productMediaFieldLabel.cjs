function asString(value) {
  if (value === undefined || value === null) return ''
  return String(value)
}

function mediaFieldLabel(field = '') {
  const source = asString(field)
  let match = source.match(/^head_imgs\[(\d+)\]$/)
  if (match) return `主图第 ${Number(match[1]) + 1} 张`
  match = source.match(/^desc_info\.imgs\[(\d+)\]$/)
  if (match) return `详情图第 ${Number(match[1]) + 1} 张`
  match = source.match(/^skus\[(\d+)\]\.thumb_img$/)
  if (match) return `SKU 图第 ${Number(match[1]) + 1} 张`
  match = source.match(/^product_qua_infos\[(\d+)\]\.qua_url\[(\d+)\]$/)
  if (match) return `资质图第 ${Number(match[1]) + 1} 组第 ${Number(match[2]) + 1} 张`
  match = source.match(/^head_videos\[(\d+)\]\.video_url$/)
  if (match) return `视频第 ${Number(match[1]) + 1} 个`
  return ''
}

module.exports = {
  mediaFieldLabel
}
