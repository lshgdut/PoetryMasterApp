# 诗词大师 PoetryMasterApp

一款用 React Native 构建的诗词背诵与学习 iOS 应用。

## 功能特色

- **🏠 首页** — 查看总积分、连续天数、今日背诵数；展示当前等级与升级进度
- **🎤 背诵模式** — 随机抽取诗词，通过语音识别模拟（模拟器模式）验证背诵，支持全文对照和译文展示
- **📚 诗词库** — 浏览 20 首经典诗词，支持按类别（唐诗/宋词/元曲）筛选和关键词搜索
- **👥 小圈子** — 加入诗词学习圈子，与同好一起进步
- **🏆 排行榜** — 全站排名，实时显示你的位置

## 积分规则

| 类型 | 条件 | 积分 |
|------|------|------|
| 首次背诵 | 该诗词从未背诵过 | +10 |
| 普通背诵 | 距上次背诵 ≥3 天 | +5 |
| 快速背诵 | 距上次背诵 <3 天 | +3 |

## 等级体系

| 等级 | 名称 | 最低积分 |
|------|------|----------|
| 🌱 | 诗词小白 | 0 |
| 📚 | 诗词学徒 | 50 |
| 🎓 | 诗词少年 | 150 |
| ✍️ | 诗词书生 | 300 |
| 🌟 | 诗词才子 | 500 |
| 🏆 | 诗词达人 | 800 |
| 💫 | 诗词高手 | 1200 |
| 🎭 | 诗词大师 | 1800 |
| 👑 | 诗词宗师 | 2500 |
| ✨ | 诗仙 | 3500 |

## 技术栈

- React Native 0.83
- React Navigation 7（底部 Tab + 栈导航）
- Context + useReducer 状态管理（AsyncStorage 持久化）
- 语音识别模拟（Levenshtein 距离计算匹配度）

## 运行方式

```bash
cd PoetryMasterApp

# 安装依赖
npm install

# 安装 iOS CocoaPods
cd ios && bundle exec pod install && cd ..

# 启动 Metro 开发服务器
npm start

# 构建 iOS（另一个终端）
cd ios
xcodebuild -workspace PoetryMasterApp.xcworkspace \
  -scheme PoetryMasterApp \
  -configuration Debug \
  -destination 'platform=iOS Simulator,name=iPhone 15 Pro' \
  build
```

## 项目结构

```
src/
├── App.tsx              # 导航配置
├── data/
│   ├── poems.ts         # 20首诗词数据
│   ├── circles.ts       # 圈子 + 排行榜 + 等级
│   └── types.ts         # TypeScript 类型定义
├── screens/
│   ├── HomeScreen.tsx   # 首页
│   ├── ReciteScreen.tsx # 背诵模式
│   ├── LibraryScreen.tsx # 诗词库
│   ├── CircleScreen.tsx # 圈子
│   └── LeaderboardScreen.tsx # 排行榜
├── store/
│   └── useAppStore.tsx  # 全局状态管理
└── services/
    └── speechRecognition.ts # 语音识别 + 相似度
```

## 截图

模拟器截图位于 `../sim_screen*.png`（共 37 张）