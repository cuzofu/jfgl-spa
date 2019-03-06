export const getNation = () => {
  return [
    {
      id: '01',
      name: '汉族',
    },
    {
      id: '02',
      name: '蒙古族',
    },
    {
      id: '03',
      name: '回族',
    },
    {
      id: '04',
      name: '藏族',
    },
    {
      id: '05',
      name: '维吾尔族',
    },
    {
      id: '06',
      name: '苗族',
    },
    {
      id: '07',
      name: '彝族',
    },
    {
      id: '08',
      name: '壮族',
    },
    {
      id: '09',
      name: '布依族',
    },
    {
      id: '10',
      name: '朝鲜族',
    },
    {
      id: '11',
      name: '满族',
    },
    {
      id: '12',
      name: '侗族',
    },
    {
      id: '13',
      name: '瑶族',
    },
    {
      id: '14',
      name: '白族',
    },
    {
      id: '15',
      name: '土家族',
    },
    {
      id: '16',
      name: '哈尼族',
    },
    {
      id: '17',
      name: '哈萨克族',
    },
    {
      id: '18',
      name: '傣族',
    },
    {
      id: '19',
      name: '黎族',
    },
    {
      id: '20',
      name: '傈僳族',
    },
    {
      id: '21',
      name: '佤族',
    },
    {
      id: '22',
      name: '畲族',
    },
    {
      id: '23',
      name: '高山族',
    },
    {
      id: '24',
      name: '拉祜族',
    },
    {
      id: '25',
      name: '水族',
    },
    {
      id: '26',
      name: '东乡族',
    },
    {
      id: '27',
      name: '纳西族',
    },
    {
      id: '28',
      name: '景颇族',
    },
    {
      id: '29',
      name: '柯尔克孜族',
    },
    {
      id: '30',
      name: '土族',
    },
    {
      id: '31',
      name: '达斡尔族',
    },
    {
      id: '32',
      name: '仫佬族',
    },
    {
      id: '33',
      name: '羌族',
    },
    {
      id: '34',
      name: '布朗族',
    },
    {
      id: '35',
      name: '撒拉族',
    },
    {
      id: '36',
      name: '毛难族',
    },
    {
      id: '37',
      name: '仡佬族',
    },
    {
      id: '38',
      name: '锡伯族',
    },
    {
      id: '39',
      name: '阿昌族',
    },
    {
      id: '40',
      name: '普米族',
    },
    {
      id: '41',
      name: '塔吉克族',
    },
    {
      id: '42',
      name: '怒族',
    },
    {
      id: '43',
      name: '乌孜别克族',
    },
    {
      id: '44',
      name: '俄罗斯族',
    },
    {
      id: '45',
      name: '鄂温克族',
    },
    {
      id: '46',
      name: '崩龙族',
    },
    {
      id: '47',
      name: '保安族',
    },
    {
      id: '48',
      name: '裕固族',
    },
    {
      id: '49',
      name: '京族',
    },
    {
      id: '50',
      name: '塔塔尔族',
    },
    {
      id: '51',
      name: '独龙族',
    },
    {
      id: '52',
      name: '鄂伦春族',
    },
    {
      id: '53',
      name: '赫哲族',
    },
    {
      id: '54',
      name: '门巴族',
    },
    {
      id: '55',
      name: '珞巴族',
    },
    {
      id: '56',
      name: '基诺族',
    },
  ];
};

// 学历
export const cultureLevel = [
  {
    level: 0,
    desc: '小学',
  },
  {
    level: 1,
    desc: '初中',
  },
  {
    level: 2,
    desc: '高中',
  },
  {
    level: 3,
    desc: '中专',
  },
  {
    level: 4,
    desc: '大专',
  },
  {
    level: 5,
    desc: '本科',
  },
  {
    level: 6,
    desc: '硕士',
  },
  {
    level: 7,
    desc: '博士',
  },
  {
    level: 8,
    desc: '文盲',
  },
];

export const getCultureByLevel = level => {
  let rtn = '未知学历';
  cultureLevel.forEach(c => {
    if (level === c.level) {
      rtn = c.desc;
    }
  });
  return rtn;
};

export const jobs = [
  {
    code: '090101',
    value: '木工',
  },
  {
    code: '090102',
    value: '抹灰工',
  },
  {
    code: '090103',
    value: '建筑油漆工',
  },
  {
    code: '090104',
    value: '钢筋工',
  },
  {
    code: '090105',
    value: '砌筑工',
  },
  {
    code: '090106',
    value: '混凝土工',
  },
  {
    code: '090107',
    value: '测量放线工',
  },
  {
    code: '090108',
    value: '试验工',
  },
  {
    code: '090109',
    value: '混凝土模具工',
  },
  {
    code: '090110',
    value: '水暖工',
  },
  {
    code: '090111',
    value: '管道工',
  },
  {
    code: '090112',
    value: '装饰装修工',
  },
  {
    code: '090113',
    value: '防水工',
  },
  {
    code: '090114',
    value: '金属门窗工',
  },
  {
    code: '090115',
    value: '幕墙工',
  },
  {
    code: '090116',
    value: '植保工',
  },
  {
    code: '090117',
    value: '育苗工',
  },
  {
    code: '090118',
    value: '花卉工',
  },
  {
    code: '090119',
    value: '绿化工',
  },
  {
    code: '090201',
    value: '建筑电工',
  },
  {
    code: '090202',
    value: '建筑架子工',
  },
  {
    code: '090203',
    value: '建筑起重机械司机',
  },
  {
    code: '090204',
    value: '建筑起重机械安装拆卸工',
  },
  {
    code: '090205',
    value: '高处作业吊篮工',
  },
  {
    code: '090206',
    value: '建筑电焊工',
  },
  {
    code: '090207',
    value: '建筑中小型机械工',
  },
  {
    code: '090208',
    value: '建筑起重信号司索工',
  },
];

export const getJobByCode = code => {
  let job = '未知';
  jobs.forEach(c => {
    if (code === c.code) {
      job = c.value;
    }
  });
  return job;
};
