# iPhone主屏幕版安全区修复

日期：2026-11-28。

## 截图所示原因

主屏幕图标启动的是独立网页模式。原HTML使用apple-mobile-web-app-status-bar-style=black-translucent，会允许内容延伸到状态栏下方；A版后加的.app padding又覆盖了此前standalone安全区padding，导致标题和主题按钮进入状态栏区域。

修复不是给某个机型固定加几十像素，而是按WebKit提供的env(safe-area-inset-*)动态避让。

## 本轮处理

- 状态栏设置改为default，采用普通状态栏布局。
- 在实际生效的主布局padding中加入顶部、左右安全区；保留原间距和不支持env的回退声明。已有底部安全区不重复累加。
- 分类栏吸顶位置继续避让顶部安全区。
- 底部摘要、已选抽屉按左右安全区居中，避开横屏刘海；底部继续避让Home指示区域。
- 抽屉最大高度同时受动态视口、已有visualViewport测量和上下安全区约束，防止矮视口伸入顶部。保留既有键盘/滚动/抽屉交互。
- 保留缩放能力，未添加user-scalable=no或最大缩放限制；原输入字号仍不低于16px。

六段JavaScript原始字节完全不变，临床计算、药品和操作流程没有改动。HTML除CSS外只变更状态栏meta。输注时间仍在糖脂比下方。

## 手机上的更新方式

1. 将修复包中Huashu并列工作台目录的全部文件上传替换网站目录；仅替换本机文件不会更新手机已安装的网站。
2. 用Safari打开更新后的网站，刷新并完成一次联网加载。
3. 由于主屏幕启动设置可能保留旧值，建议移除旧桌面图标，再从Safari分享菜单“添加到主屏幕”。

本轮没有登录或部署线上站点。新缓存版本为2026-11-28-iphone-safearea-1。

## 依据

- [Apple Safari HTML Reference · status bar meta](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html)：存档文档说明独立网页的状态栏模式差别。
- [WebKit · Designing Websites for iPhone X](https://webkit.org/blog/7929/designing-websites-for-iphone-x/)：viewport-fit=cover后的安全区域、env及回退声明。
- [Apple HIG · Layout / Guides and safe areas](https://developer.apple.com/design/human-interface-guidelines/layout#Guides-and-safe-areas)：重要信息与控件应避开系统及硬件遮挡区域。
- 本机使用hig-foundations的layout参考进行检查；网页采用CSS安全区机制。

## 验证边界

完成修复前后96组静态声明/数值场景对比：12组模拟尺寸与安全区，日夜两主题，浏览器/主屏幕两种模式。旧版在16个场景中复现顶部预留不足；修复后当前48组场景通过顶部、横屏、底部和抽屉边界检查，包括模拟可视高度收缩。这里是CSS声明和数值运算，不是96台真机测试。

原有计算和模拟交互回归通过。未做真实iPhone、Safari截图或系统版本认证；仍需更新后在你的手机主屏幕模式确认。未通过其他浏览器、localhost或Playwright绕过既有本地访问限制。
