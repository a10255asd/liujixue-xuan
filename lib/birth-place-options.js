import rawRegionTree from '@province-city-china/level/level.min.json' with { type: 'json' }

const normalizeNode = node => ({
  code: node.c,
  name: node.n,
  children: (node.d || []).map(normalizeNode)
})

export const birthPlaceRegionTree = rawRegionTree.map(normalizeNode)

export const cityCoordinateFallbacks = [
  { aliases: ['北京', '北京市'], address: '北京市, 中国', latitude: 39.9042, longitude: 116.4074 },
  { aliases: ['上海', '上海市'], address: '上海市, 中国', latitude: 31.2304, longitude: 121.4737 },
  { aliases: ['广州', '广州市', '广东广州', '广东省广州市'], address: '广州市, 广东省, 中国', latitude: 23.1291, longitude: 113.2644 },
  { aliases: ['深圳', '深圳市', '广东深圳', '广东省深圳市'], address: '深圳市, 广东省, 中国', latitude: 22.5431, longitude: 114.0579 },
  { aliases: ['黑河', '黑河市', '黑龙江黑河', '黑龙江省黑河', '黑龙江黑河市', '黑龙江省黑河市'], address: '黑河市, 黑龙江省, 中国', latitude: 50.245833, longitude: 127.488333 },
  { aliases: ['天津', '天津市'], address: '天津市, 中国', latitude: 39.3434, longitude: 117.3616 },
  { aliases: ['石家庄', '石家庄市', '河北石家庄'], address: '石家庄市, 河北省, 中国', latitude: 38.0428, longitude: 114.5149 },
  { aliases: ['太原', '太原市', '山西太原'], address: '太原市, 山西省, 中国', latitude: 37.8706, longitude: 112.5489 },
  { aliases: ['呼和浩特', '呼和浩特市', '内蒙古呼和浩特'], address: '呼和浩特市, 内蒙古自治区, 中国', latitude: 40.8426, longitude: 111.7492 },
  { aliases: ['哈尔滨', '哈尔滨市', '黑龙江哈尔滨'], address: '哈尔滨市, 黑龙江省, 中国', latitude: 45.8038, longitude: 126.5349 },
  { aliases: ['长春', '长春市', '吉林长春'], address: '长春市, 吉林省, 中国', latitude: 43.8171, longitude: 125.3235 },
  { aliases: ['沈阳', '沈阳市', '辽宁沈阳'], address: '沈阳市, 辽宁省, 中国', latitude: 41.8057, longitude: 123.4315 },
  { aliases: ['大连', '大连市', '辽宁大连'], address: '大连市, 辽宁省, 中国', latitude: 38.914, longitude: 121.6147 },
  { aliases: ['南京', '南京市', '江苏南京'], address: '南京市, 江苏省, 中国', latitude: 32.0603, longitude: 118.7969 },
  { aliases: ['苏州', '苏州市', '江苏苏州'], address: '苏州市, 江苏省, 中国', latitude: 31.2989, longitude: 120.5853 },
  { aliases: ['杭州', '杭州市', '浙江杭州'], address: '杭州市, 浙江省, 中国', latitude: 30.2741, longitude: 120.1551 },
  { aliases: ['宁波', '宁波市', '浙江宁波'], address: '宁波市, 浙江省, 中国', latitude: 29.8683, longitude: 121.544 },
  { aliases: ['合肥', '合肥市', '安徽合肥'], address: '合肥市, 安徽省, 中国', latitude: 31.8206, longitude: 117.2272 },
  { aliases: ['福州', '福州市', '福建福州'], address: '福州市, 福建省, 中国', latitude: 26.0745, longitude: 119.2965 },
  { aliases: ['厦门', '厦门市', '福建厦门'], address: '厦门市, 福建省, 中国', latitude: 24.4798, longitude: 118.0894 },
  { aliases: ['南昌', '南昌市', '江西南昌'], address: '南昌市, 江西省, 中国', latitude: 28.682, longitude: 115.8579 },
  { aliases: ['济南', '济南市', '山东济南'], address: '济南市, 山东省, 中国', latitude: 36.6512, longitude: 117.1201 },
  { aliases: ['青岛', '青岛市', '山东青岛'], address: '青岛市, 山东省, 中国', latitude: 36.0671, longitude: 120.3826 },
  { aliases: ['郑州', '郑州市', '河南郑州'], address: '郑州市, 河南省, 中国', latitude: 34.7466, longitude: 113.6254 },
  { aliases: ['武汉', '武汉市', '湖北武汉'], address: '武汉市, 湖北省, 中国', latitude: 30.5928, longitude: 114.3055 },
  { aliases: ['长沙', '长沙市', '湖南长沙'], address: '长沙市, 湖南省, 中国', latitude: 28.2282, longitude: 112.9388 },
  { aliases: ['南宁', '南宁市', '广西南宁'], address: '南宁市, 广西壮族自治区, 中国', latitude: 22.817, longitude: 108.3669 },
  { aliases: ['海口', '海口市', '海南海口'], address: '海口市, 海南省, 中国', latitude: 20.044, longitude: 110.1983 },
  { aliases: ['重庆', '重庆市'], address: '重庆市, 中国', latitude: 29.563, longitude: 106.5516 },
  { aliases: ['成都', '成都市', '四川成都'], address: '成都市, 四川省, 中国', latitude: 30.5728, longitude: 104.0668 },
  { aliases: ['贵阳', '贵阳市', '贵州贵阳'], address: '贵阳市, 贵州省, 中国', latitude: 26.647, longitude: 106.6302 },
  { aliases: ['昆明', '昆明市', '云南昆明'], address: '昆明市, 云南省, 中国', latitude: 25.0389, longitude: 102.7183 },
  { aliases: ['拉萨', '拉萨市', '西藏拉萨'], address: '拉萨市, 西藏自治区, 中国', latitude: 29.652, longitude: 91.1721 },
  { aliases: ['西安', '西安市', '陕西西安'], address: '西安市, 陕西省, 中国', latitude: 34.3416, longitude: 108.9398 },
  { aliases: ['兰州', '兰州市', '甘肃兰州'], address: '兰州市, 甘肃省, 中国', latitude: 36.0611, longitude: 103.8343 },
  { aliases: ['西宁', '西宁市', '青海西宁'], address: '西宁市, 青海省, 中国', latitude: 36.6171, longitude: 101.7782 },
  { aliases: ['银川', '银川市', '宁夏银川'], address: '银川市, 宁夏回族自治区, 中国', latitude: 38.4872, longitude: 106.2309 },
  { aliases: ['乌鲁木齐', '乌鲁木齐市', '新疆乌鲁木齐'], address: '乌鲁木齐市, 新疆维吾尔自治区, 中国', latitude: 43.8256, longitude: 87.6168 },
  { aliases: ['香港', '香港特别行政区'], address: '香港特别行政区, 中国', latitude: 22.3193, longitude: 114.1694 },
  { aliases: ['澳门', '澳门特别行政区'], address: '澳门特别行政区, 中国', latitude: 22.1987, longitude: 113.5439 },
  { aliases: ['台北', '台北市', '台湾台北'], address: '台北市, 台湾省, 中国', latitude: 25.033, longitude: 121.5654 }
]

const directAdminCodes = new Set(['110000', '120000', '310000', '500000', '810000', '820000'])

const defaultProvinceCode = '110000'
const defaultCityCode = '110000'
const defaultAreaCode = '110108'
const defaultCoordinates = { longitude: 116.29845, latitude: 39.95933 }

export const isDirectAdminProvince = province => directAdminCodes.has(province?.code)

export const getProvinceOptions = () => birthPlaceRegionTree.map(({ code, name }) => ({ code, name }))

export const getProvinceByCode = code => birthPlaceRegionTree.find(province => province.code === code) || null

export function getCityOptions(provinceCode) {
  const province = getProvinceByCode(provinceCode)
  if (!province) return []

  if (isDirectAdminProvince(province) || province.children.length === 0) {
    return [{ code: province.code, name: province.name, children: province.children }]
  }

  return province.children.map(city => ({
    code: city.code,
    name: city.name,
    children: city.children
  }))
}

export function getAreaOptions(provinceCode, cityCode) {
  const province = getProvinceByCode(provinceCode)
  if (!province) return []

  if (isDirectAdminProvince(province)) return province.children

  return province.children.find(city => city.code === cityCode)?.children || []
}

export function getDefaultSelectionForProvince(provinceCode) {
  const province = getProvinceByCode(provinceCode)
  const city = getCityOptions(provinceCode)[0] || null
  const area = city ? getAreaOptions(provinceCode, city.code)[0] || null : null

  return buildBirthPlaceSelection(province, city, area)
}

export function buildBirthPlaceSelection(province, city, area) {
  if (!province || !city) return null

  const parts = [province.name, city.name, area?.name].filter(Boolean)

  return {
    provinceCode: province.code,
    cityCode: city.code,
    areaCode: area?.code || '',
    label: parts.join(' / '),
    value: parts.join(' ')
  }
}

export function getBirthPlaceSelection(provinceCode, cityCode, areaCode) {
  const province = getProvinceByCode(provinceCode)
  const city = getCityOptions(provinceCode).find(item => item.code === cityCode) || null
  const area = getAreaOptions(provinceCode, cityCode).find(item => item.code === areaCode) || null

  return buildBirthPlaceSelection(province, city, area)
}

export const defaultBirthPlaceSelection = getBirthPlaceSelection(defaultProvinceCode, defaultCityCode, defaultAreaCode)

export const defaultBirthPlaceCoordinates = defaultCoordinates
