(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{285:function(e,t,i){"use strict";i.r(t),t.default=[{title:"【应用专题】性能优化",path:"/posts/optimization.html",strippedContent:'# 性能优化  **1、度量标准**  ### 1.1、度量指标  - 首次有效绘制（First Meaningful Paint，简称FMP，当主要内容呈现在页面上） - 英雄渲染时间（Hero Rendering Times，度量用户体验的新指标，当用户最关心的内容渲染完成） - 可交互时间（Time to Interactive，简称TTI，指页面布局已经稳定，关键的页面字体是可见的，并且主进程可用于处理用户输入，基本上用户可以点击UI并与其交互） - 输入响应（Input responsiveness，界面响应用户输入所需的时间） - 感知速度指数（Perceptual Speed Index，简称PSI，测量页面在加载过程中视觉上的变化速度，分数越低越好） - 自定义指标，由业务需求和用户体验来决定。  ---   ### 1.2、设定目标  - 100毫秒的界面响应时间与60FPS - 速度指标（Speed Index）小于1250ms - 3G网络环境下可交互时间小于5s - 重要文件的大小预算小于170kb  详细信息请查看RAIL性能模型。 ### 1.3、网络传输性能检测工具——Page Speed chrome还为我们准备好了一款监测网络传输性能的插件——Page Speed。我们只需要通过下面步骤安装，就可以在chrome devtools里找到它了：chrome菜单→更多工具→拓展程序→chrome网上应用商店→搜索pagespeed后安转即可。  ## 2、编码优化 ** ### 2.1 数据读取速度  - 字面量与局部变量的访问速度最快，数组元素和对象成员相对较慢 - 变量从局部作用域到全局作用域的搜索过程越长速度越慢 - 对象嵌套的越深，读取速度就越慢 - 对象在原型链中存在的位置越深，找到它的速度就越慢  _推荐的做法是缓存对象成员值。将对象成员值缓存到局部变量中会加快访问速度_  ---   ### 2.2 DOM（重排与重绘） 应用在运行时，性能的瓶颈主要在于DOM操作的代价非常昂贵  - 在JS中对DOM进行访问的代价非常高。请尽可能减少访问DOM的次数（建议缓存DOM属性和元素、把DOM集合的长度缓存到变量中并在迭代中使用。读变量比读DOM的速度要快很多。） - 重排与重绘的代价非常昂贵。如果操作需要进行多次重排reflow与重绘repaint，建议先让元素脱离文档流，处理完毕后再让元素回归文档流，这样浏览器只会进行两次重排与重绘（脱离时和回归时）。CSS属性是否会触发重排或重绘 [https://csstriggers.com/text-indent](https://csstriggers.com/text-indent) 1. CSS属性读写分离 1. 切换class或者style.csstext属性去批量操作元素样式 1. DOM元素离线更新： 对DOM进行相关操作时，例如innerHTML、appendChild等都可以使用Document Fragment对象进行离线操作，待元素“组装”完成后再一次插入页面，或者使用`display:none` 对元素隐藏，在元素“消失”后进行相关操作。 1. 将没用的元素设为不可见：`visibility: hidden`，这样可以减小重绘的压力 1. 压缩DOM的深度，一个渲染层内不要有过深的子元素，少用DOM完成页面样式，多使用伪元素或者box-shadow取代。 1. 图片在渲染前指定大小：因为img元素是内联元素，所以在加载图片后会改变宽高，严重的情况会导致整个页面重排，所以最好在渲染前就指定其大小，或者让其脱离文档流。 1. 对页面中可能发生大量重排重绘的元素单独触发渲染层，使用GPU分担CPU压力。（这项策略需要慎用，得着重考量以牺牲GPU占用率能否换来可期的性能优化，毕竟页面中存在太多的渲染层对于GPU而言也是一种不必要的压力，通常情况下，我们会对动画元素采取硬件加速。）transform: translateZ(0) - 善于使用事件委托  ---   ### 2.3 流程控制  - 避免使用for...in（它能枚举到原型，所以很慢） - 在JS中倒序循环会略微提升性能 - 减少迭代的次数 - 基于循环的迭代比基于函数的迭代快8倍 - 用Map表代替大量的if-else和switch会提升性能  ## 3、静态资源优化 ### 3.1 使用Brotli或Zopfli进行纯文本压缩  在最高级别的压缩下Brotli会非常慢（但较慢的压缩最终会得到更高的压缩率）以至于服务器在等待动态资源压缩的时间会抵消掉高压缩率带来的好处，但它非常适合静态文件压缩，因为它的解压速度很快。   使用Zopfli压缩可以比Zlib的最大压缩提升3％至8％。   Brotli 是一个通用目的的无损压缩算法，它通过用变种的 LZ77 算法，Huffman 编码和二阶文本建模进行数据压缩，是一种压缩比很高的压缩方法。在压缩速度上跟 Deflate 差不多，但是提供了更密集的压缩。 [https://github.com/google/brotli](https://github.com/google/brotli)   Zopfli 压缩算法是一个新的兼容 zlib (gzip, deflate) 的压缩器，该压缩器压缩时需要更多的时间（大约慢100倍），但压缩率比 zlib 和其他兼容压缩器要好上 5%。很适合用来做网页静态资源压缩，节约用户下载时间和运营中的流量带宽成本。 [https://github.com/pierreinglebert/node-zopfli](https://github.com/pierreinglebert/node-zopfli)  ---   ### 3.2 图片优化 尽可能通过srcset，sizes和元素使用响应式图片。还可以通过元素使用WebP格式的图像。  [响应式图片](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)可能大家未必听说过，但响应式布局大家肯定都听说过。响应式图片与响应式布局类似，它可以在不同屏幕尺寸与分辨率的设备上都能良好工作（比如自动切换图片大小、自动裁切图片等）。  当然，如果您不满足这种尺度的优化，还可以对图片进行更深层次的优化。例如：模糊图片中不重要的部分以减小文件大小、使用自动播放与循环的**HTML5视频替换GIF图**，因为视频比GIF文件还小（好消息是未来可以通过img标签加载视频）  #### 3.2.1 不要在HTML里缩放图像 #### 3.2.2 使用雪碧图（CSS Sprite） webpack-spritesmith #### 3.2.3 使用字体图标（iconfont） #### 3.2.4 WebP格式的图像 可以使用官网提供的Linux命令行工具对项目中的图片进行WebP编码，也可以使用我们的线上服务，这里我推荐叉拍云（网址：www.upyun.com/webp） ## 4、交付优化 交付优化指的是对页面加载资源以及用户与网页之间的交付过程进行优化。 ### 4.1 异步无阻塞加载JS JS的加载与执行会阻塞页面渲染，可以将Script标签放到页面的最底部。但是更好的做法是异步无阻塞加载JS。有多种无阻塞加载JS的方法：defer、async、动态创建script标签、使用XHR异步请求JS代码并注入到页面。   但更推荐的做法是使用defer或async。如果使用defer或async请将Script标签放到head标签中，以便让浏览器更早地发现资源并在后台线程中解析并开始加载JS。  ---   ### 4.2 使用Intersection Observer实现懒加载 懒加载是一个比较常用的性能优化手段，下面列出了一些常用的做法：  - 可以通过Intersection Observer延迟加载图片、视频、广告脚本、或任何其他资源。 - 可以先加载低质量或模糊的图片，当图片加载完毕后再使用完整版图片替换它。  _延迟加载所有体积较大的组件、字体、JS、视频或Iframe是一个好主意。_  ---   ### 4.3 优先加载关键的CSS CSS资源的加载对浏览器渲染的影响很大，默认情况下浏览器只有在完成<head>标签中CSS的加载与解析之后才会渲染页面。如果CSS文件过大，用户就需要等待很长的时间才能看到渲染结果。针对这种情况可以将首屏渲染必须用到的CSS提取出来内嵌到<head>中，然后再将剩余部分的CSS用异步的方式加载。可以通过Critical做到这一点。  [critical rendering path](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/optimizing-critical-rendering-path?hl=en)  [Critical](https://github.com/addyosmani/critical)，它是一个 Node.js 的第三方库，帮助开发者自动筛选 critical CSS [https://github.com/addyosmani/critical](https://github.com/addyosmani/critical)  ---   ### 4.4 资源提示（Resource Hints） Resource Hints（资源提示）定义了HTML中的[Link](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Link_types)元素与dns-prefetch、preconnect、prefetch与prerender之间的关系。它可以帮助浏览器决定应该连接到哪些源，以及应该获取与预处理哪些资源来提升页面性能。 #### 4.4.1 dns-prefetch dns-prefetch可以指定一个用于获取资源所需的源（origin），并提示浏览器应该尽可能早的解析。  ```html <link rel="dns-prefetch" href="//example.com"> ```  #### 4.4.2 preconnect preconnect用于启动预链接，其中包含DNS查找，TCP握手，以及可选的TLS协议，允许浏览器减少潜在的建立连接的开销。  ```html <link rel="preconnect" href="//example.com"> <link rel="preconnect" href="//cdn.example.com" crossorigin> ```  #### 4.4.3 prefetch Prefetch用于标识下一个导航可能需要的资源。浏览器会获取该资源，一旦将来请求该资源，浏览器可以提供更快的响应。  ```html <link rel="prefetch" href="//example.com/next-page.html" as="html" crossorigin="use-credentials"> <link rel="prefetch" href="/library.js" as="script"> ```  _浏览器不会预处理、不会自动执行、不会将其应用于当前上下文。_ as与crossorigin选项都是可选的。  #### 4.4.4 prerender prerender用于标识下一个导航可能需要的资源。浏览器会获取并执行，一旦将来请求该资源，浏览器可以提供更快的响应。  ```html <link rel="prerender" href="//example.com/next-page.html"> ```   浏览器将预加载目标页面相关的资源并执行来预处理HTML响应。  ### 4.5 Preload 通过一个现有元素（例如：img，script，link）声明资源会将获取与执行耦合在一起。然而应用可能只是想要先获取资源，当满足某些条件时再执行资源。   [Preload](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Preloading_content)提供了预获取资源的能力，可以将获取资源的行为从资源执行中分离出来。因此，Preload可以构建自定义的资源加载与执行。   例如，应用可以使用Preload进行CSS资源的预加载、并且同时具备：高优先级、不阻塞渲染等特性。然后应用程序在合适的时间使用CSS资源：  ```html \x3c!-- 通过声明性标记预加载 CSS 资源 --\x3e <link rel="preload" href="/styles/other.css" as="style">  \x3c!-- 或，通过JavaScript预加载 CSS 资源 --\x3e <script> var res = document.createElement("link"); res.rel = "preload"; res.as = "style"; res.href = "styles/other.css"; document.head.appendChild(res); <\/script> ```  ```html \x3c!-- 使用HTTP头预加载 --\x3e Link: <https://example.com/other/styles.css>; rel=preload; as=style ```  ### 4.6 快速响应的用户界面 PSI（Perceptual Speed Index，感知速度指数）是提升用户体验的重要指标，让用户感觉到页面的反馈比没有反馈体验要好很多。   可以尝试使用骨架屏或添加一些Loading过渡动画提示用户体验。 输入响应（Input responsiveness）指标同样重要，甚至更重要。试想，用户点击了网页后缺毫无反应会是什么心情。JS的单线程大家已经不能再熟悉，这意味着当JS在运行时用户界面处于“锁定”状态，所以JS同步执行的时间越长，用户等待响应的时间也就越长。   据调查，JS执行100毫秒以上用户就会明显觉得网页变卡了。所以要**严格限制每个JS任务执行时间不能超过100毫秒**。 解决方案是可以**将一个大任务拆分成多个小任务分布在不同的Macrotask中执行**（通俗的说是将大的JS任务拆分成多个小任务异步执行）。或者使用WebWorkers，它可以在UI线程外执行JS代码运算，不会阻塞UI线程，所以不会影响用户体验。   ## 5、构建优化 现代前端应用都需要有构建的过程，项目在构建过程中是否进行了合理的优化，会对Web应用的性能有着巨大的影响。例如：影响构建后文件的体积、代码执行效率、文件加载时间、首次有效绘制指标等。 ### 5.1 使用预编译 拿Vue举例，如果您使用单文件组件开发项目，组件会在编译阶段将模板编译为渲染函数。最终代码被执行时可以直接执行渲染函数进行渲染。而如果您没有使用单文件组件预编译代码，而是在网页中引入vue.min.js，那么应用在运行时需要先将模板编译成渲染函数，然后再执行渲染函数进行渲染。相比预编译，多了模板编译的步骤，所以会浪费很多性能。 ### 5.2 使用 Tree-shaking、Scope hoisting、Code-splitting  Tree-shaking是一种在构建过程中清除无用代码的技术。使用Tree-shaking可以减少构建后文件的体积。   目前Webpack与Rollup都支持Scope Hoisting。它们可以检查import链，并尽可能的将散乱的模块放到一个函数中，前提是不能造成代码冗余。所以只有被引用了一次的模块才会被合并。使用Scope Hoisting可以让代码体积更小并且可以降低代码在运行时的内存开销，同时它的运行速度更快。前面2.1节介绍了变量从局部作用域到全局作用域的搜索过程越长执行速度越慢，Scope Hoisting可以减少搜索时间。   code-splitting是Webpack中最引人注目的特性之一。此特性能够把代码分离到不同的bundle中，然后可以按需加载或并行加载这些文件。code-splitting可以用于获取更小的bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。   ### 5.3 服务端渲染（SSR） 单页应用需要等JS加载完毕后在前端渲染页面，也就是说在JS加载完毕并开始执行渲染操作前的这段时间里浏览器会产生白屏。 服务端渲染（Server Side Render，简称SSR）的意义在于弥补主要内容在前端渲染的成本，减少白屏时间，提升首次有效绘制的速度。可以使用服务端渲染来获得更快的首次有效绘制。 比较推荐的做法是：使用服务端渲染静态HTML来获得更快的首次有效绘制，一旦JavaScript加载完毕再将页面接管下来。   ### 5.4 使用import函数动态导入模块 使用import函数可以在运行时动态地加载ES2015模块，从而实现按需加载的需求。   这种优化在单页应用中变得尤为重要，在切换路由的时候动态导入当前路由所需的模块，会避免加载冗余的模块（试想如果在首次加载页面时一次性把整个站点所需要的所有模块都同时加载下来会加载多少非必须的JS，应该尽可能的让加载的JS更小，只在首屏加载需要的JS）。   _使用静态import导入初始依赖模块。其他情况下使用动态import按需加载依赖_ import()返回一个Promise对象  - 按需加载  ```javascript button.addEventListener(\'click\', event => {   import(\'./dialogBox.js\')   .then(dialogBox => {     dialogBox.open();   })   .catch(error => {     /* Error handling */   }) }); ```  - 条件加载  ```javascript if (condition) {   import(\'moduleA\').then(...); } else {   import(\'moduleB\').then(...); } ```  ###  5.5 使用HTTP缓存头(浏览器缓存) 正确设置expires，cache-control和其他HTTP缓存头。 推荐使用Cache-control: immutable避免重新验证。   #### 5.5.1浏览器处理缓存的策略： ![image.png](https://cdn.nlark.com/yuque/0/2019/png/519325/1572864349270-60b1f2a7-8c35-4965-8aa8-4a934579455b.png#align=left&display=inline&height=539&name=image.png&originHeight=539&originWidth=612&search=&size=55310&status=done&width=612)  在服务器上设置的Etag字段。在浏览器接收到服务器响应后，会检测响应头部（Header），如果有Etag字段，那么浏览器就会将本次缓存写入硬盘中`from disk cache`，否则就缓存在内存中`from memory cache`。   以nginx为例，谈谈如何配置缓存: nginx.conf中配置   `etag on;   //开启etag验证 ` `   expires 7d;    //设置缓存过期时间为7天`   如果在响应头部看见Etag和Expires字段，就说明我们的缓存配置成功了。  ### 5.6资源打包压缩 对webpack进行上线配置时，我们要特别注意以下几点：  - JS压缩  ```json    optimization: {             minimizer: [                 new UglifyJsPlugin({                     cache: true,                     parallel: true,                     sourceMap: true// set to true if you want JS source maps                 }),                 ...Plugins             ]         } ```  - HTML压缩  ```json   new HtmlWebpackPlugin({                 template: __dirname + \'/views/index.html\', // new 一个这个插件的实例，并传入相关的参数                 filename: \'../index.html\',                 minify: {                     removeComments: true,                     collapseWhitespace: true,                     removeRedundantAttributes: true,                     useShortDoctype: true,                     removeEmptyAttributes: true,                     removeStyleLinkTypeAttributes: true,                     keepClosingSlash: true,                     minifyJS: true,                     minifyCSS: true,                     minifyURLs: true,                 },                 chunksSortMode: \'dependency\'             }) ```js  我们在使用`html-webpack-plugin` 自动化注入JS、CSS打包HTML文件时，很少会为其添加配置项，这里我给出样例，大家直接复制就行。据悉，在Webpack5中，`html-webpack-plugin` 的功能会像 `common-chunk-plugin` 那样，被集成到webpack内部，这样我们就不需要再install额外的插件了。  PS：这里有一个技巧，在我们书写HTML元素的`src` 或 `href` 属性时，可以省略协议部分，这样也能简单起到节省资源的目的。（虽然其目的本身是为了统一站内的所有协议）  ③提取公共资源： ```js     splitChunks: {           cacheGroups: {             vendor: { // 抽离第三方插件               test: /node_modules/, // 指定是node_modules下的第三方包               chunks: \'initial\',               name: \'common/vendor\', // 打包后的文件名，任意命名               priority: 10// 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包             },             utils: { // 抽离自定义公共代码               test: /\\.js$/,               chunks: \'initial\',               name: \'common/utils\',               minSize: 0// 只要超出0字节就生成一个新包             }           }         } ```  - 提取css并压缩  ```json     const MiniCssExtractPlugin = require(\'mini-css-extract-plugin\')     module: {             rules: [..., {                 test: /\\.css$/,                 exclude: /node_modules/,                 use: [                     _mode === \'development\' ? \'style-loader\' : MiniCssExtractPlugin.loader, {                         loader: \'css-loader\',                         options: {                             importLoaders: 1                         }                     }, {                         loader: \'postcss-loader\',                         options: {                             ident: \'postcss\'                         }                     }                 ]             }]         } ```js  我这里配置预处理器postcss，但是我把相关配置提取到了单独的文件`postcss.config.js`里了，其中**cssnano**是一款很不错的CSS优化插件。  ⑤将webpack开发环境修改为生产环境：  在使用webpack打包项目时，它常常会引入一些调试代码，以作相关调试，我们在上线时不需要这部分内容，通过配置剔除： ```js     devtool: \'false\' ```  在服务器上开启Gzip传输压缩  ```json gzip on; gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php application/vnd.ms-fontobject font/ttf font/opentype font/x-woff image/svg+xml; ```  **【！！！特别注意！！！】**  对图片进行压缩不但会占用后台大量资源，压缩效果其实并不可观，可以说是“弊大于利”，所以请在`gzip_types` 把图片的相关项去掉。  其他一些值得考虑的优化点：  - HTTP2 - 使用最高级的CDN（付费的比免费的强的多） - 优化字体 - 其他垂直领域的性能优化  ## 6、性能监控 ### 6.1需要一个性能检测工具来持续监视网站的性能  ![image.png](https://cdn.nlark.com/yuque/0/2019/png/519325/1572847526542-4cebe483-1359-44d2-abb3-9e83bc907091.png#align=left&display=inline&height=416&name=image.png&originHeight=416&originWidth=619&search=&size=135566&status=done&width=619) ### 6.2网络传输性能优化 浏览器处理用户请求的过程,这是navigation timing监测指标图，从图中我们可以看出，浏览器在得到用户请求之后，经历了下面这些阶段： 重定向→拉取缓存→DNS查询→建立TCP链接→发起请求→接收响应→处理HTML元素→元素加载完成。 ![image.png](https://cdn.nlark.com/yuque/0/2019/png/519325/1572864168515-1f2416e1-2179-4f0f-8c31-c59877881377.png#align=left&display=inline&height=393&name=image.png&originHeight=393&originWidth=662&search=&size=124564&status=done&width=662) '},{title:"【应用专题】web 前端安全总结",path:"/posts/webSafe.html",strippedContent:'# Web 安全   ## 同源策略 如果两个 URL 的协议、域名和端口都相同，我们就称这两个 URL 同源。  - 同源策略限制了来自不同源的 JavaScript 脚本对当前 DOM 对象读和写的操作。 - 同源策略限制了不同源的站点读取当前站点的 Cookie、IndexDB、LocalStorage 等数据。 - 同源策略限制了通过 XMLHttpRequest 等方式将站点的数据发送给不同源的站点。  解决同源策略的方法：  - `跨文档消息机制`:可以通过 window.postMessage 的 JavaScript 接口来和不同源的 DOM 进行通信。 - `跨域资源共享（CORS）`:跨域资源在服务端设置允许跨域，就可以进行跨域访问控制，从而使跨域数据传输得以安全进行。 - `内容安全策略（CSP）`:主要以白名单的形式配置可信任的内容来源，在网页中，能够使白名单中的内容正常执行（包含 JS，CSS，Image 等等），而非白名单的内容无法正常执行。  ## XSS 跨站脚本攻击(Cross Site Scripting) #### 存储型 XSS 攻击 利用漏洞提交恶意 JavaScript 代码，比如在input, textarea等所有可能输入文本信息的区域，输入`<script src="http://恶意网站"><\/script>`等，提交后信息会存在服务器中，当用户再次打开网站请求到相应的数据，打开页面，恶意脚本就会将用户的 Cookie 信息等数据上传到黑客服务器。 #### 反射型 XSS 攻击 用户将一段含有恶意代码的请求提交给 Web 服务器，Web 服务器接收到请求时，又将恶意代码反射给了浏览器端，这就是反射型 XSS 攻击。 在现实生活中，黑客经常会通过 QQ 群或者邮件等渠道诱导用户去点击这些恶意链接，所以对于一些链接我们一定要慎之又慎。 `Web 服务器不会存储反射型 XSS 攻击的恶意脚本，这是和存储型 XSS 攻击不同的地方。` #### 基于 DOM 的 XSS 攻击 基于 DOM 的 XSS 攻击是不牵涉到页面 Web 服务器的。它的特点是在 Web 资源传输过程或者在用户使用页面的过程中修改 Web 页面的数据。比如利用工具(如Burpsuite)扫描目标网站所有的网页并自动测试写好的注入脚本等。 预防策略：  1. 将cookie等敏感信息设置为httponly，禁止Javascript通过`document.cookie`获得 1. 对所有的输入做严格的校验尤其是在服务器端，过滤掉任何不合法的输入，比如手机号必须是数字，通常可以采用正则表达式. 1. 净化和过滤掉不必要的html标签，比如：`<iframe>, alt,<script>` ;净化和过滤掉不必要的Javascript的事件标签，比如：`onclick, onfocus`等 1. 转义单引号，双引号，尖括号等特殊字符，可以采用htmlencode编码 或者过滤掉这些特殊字符 1. CSP,CSP 全称为 Content Security Policy，即内容安全策略。主要以白名单的形式配置可信任的内容来源，在网页中，能够使白名单中的内容正常执行（包含 JS，CSS，Image 等等），而非白名单的内容无法正常执行，从而减少跨站脚本攻击（XSS），当然，也能够减少运营商劫持的内容注入攻击。 配置方式：  ```javascript //1、meta  <meta http-equiv="Content-Security-Policy" content="script-src \'self\'">  //2、Http 头部  Content-Security-Policy: script-src \'unsafe-inline\' \'unsafe-eval\' \'self\' *.54php.cn *.yunetidc.com *.baidu.com *.cnzz.com *.duoshuo.com *.jiathis.com;report-uri /error/csp  ```  ## CSRF跨站请求伪造（Cross-site request forgery） 引诱用户打开黑客的网站，在黑客的网站中，利用用户的登录状态发起的跨站请求。 发起 CSRF 攻击的三个必要条件：  1. 目标站点一定要有 CSRF 漏洞； 1. 用户要登录过目标站点，并且在浏览器上保持有该站点的登录状态； 1. 需要用户打开一个第三方站点，如黑客的站点等。  预防策略：  1. 充分利用好 Cookie 的 SameSite 属性。  SameSite 选项通常有 Strict、Lax 和 None 三个值。  - SameSite 的值是 Strict，那么浏览器会完全禁止第三方 Cookie。 - Lax 相对宽松一点。在跨站点的情况下，从第三方站点的链接打开和从第三方站点提交 Get 方式的表单这两种方式都会携带 Cookie。但如果在第三方站点中使用 Post 方法，或者通过 img、iframe 等标签加载的 URL，这些场景都不会携带 Cookie。 - 而如果使用 None 的话，在任何情况下都会发送 Cookie 数据。 如：  ```javascript set-cookie: 1P_JAR=2019-10-20-06; expires=Tue, 19-Nov-2019 06:36:21 GMT; path=/; domain=.google.com; SameSite=none  ```  2. 验证请求的来源站点  在服务器端验证请求来源的站点，就是验证 HTTP 请求头中的 `Origin` 和 `Referer` 属性。Referer 是 HTTP 请求头中的一个字段，记录了该 HTTP 请求的来源地址，而O rigin 属性只包含了域名信息，并没有包含具体的 URL 路径。这是 Origin 和 Referer 的一个主要区别。 服务器的策略是优先判断 Origin，如果请求头中没有包含 Origin 属性，再根据实际情况判断是否使用 Referer 值。  3. 在请求地址中添加 token 并验证  CSRF 攻击之所以能够成功，是因为黑客可以完全伪造用户的请求，该请求中所有的用户验证信息都是存在于 cookie 中，因此黑客可以在不知道这些验证信息的情况下直接利用用户自己的 cookie 来通过安全验证。因此要抵御 CSRF，关键在于在请求中放入黑客所不能伪造的信息，并且该信息不存在于 cookie 之中。可以在 HTTP 请求中以参数的形式加入一个随机产生的 token，并在服务器端建立一个拦截器来验证这个 token，如果请求中没有 token 或者 token 内容不正确，则认为可能是 CSRF 攻击而拒绝该请求。  4. 在 HTTP 头中自定义属性并验证  这种方法也是使用 token 并进行验证，和上一种方法不同的是，这里并不是把 token 以参数的形式置于 HTTP 请求之中，而是把它放到 HTTP 头中自定义的属性里。通过 XMLHttpRequest 这个类，可以一次性给所有该类请求加上 csrftoken 这个 HTTP 头属性，并把 token 值放入其中。这样解决了上种方法在请求中加入 token 的不便，同时，通过 XMLHttpRequest 请求的地址不会被记录到浏览器的地址栏，也不用担心 token 会透过 Referer 泄露到其他网站中去。 然而这种方法的局限性非常大。XMLHttpRequest 请求通常用于 Ajax 方法中对于页面局部的异步刷新，并非所有的请求都适合用这个类来发起，而且通过该类请求得到的页面不能被浏览器所记录下，从而进行前进，后退，刷新，收藏等操作，给用户带来不便。另外，对于没有进行 CSRF 防护的遗留系统来说，要采用这种方法来进行防护，要把所有请求都改为 XMLHttpRequest 请求，这样几乎是要重写整个网站，这代价无疑是不能接受的。  ## SQL注入 拼接 SQL 时未仔细过滤，黑客可提交畸形数据改变语义。比如查某个文章，提交了这样的数据`id=-1 or 1=1`等。1=1 永远是true，导致where语句永远是ture.那么查询的结果相当于整张表的内容，攻击者就达到了目的。或者，通过屏幕上的报错提示推测 SQL 语句等。 预防策略：  1. 禁止目标网站利用动态拼接字符串的方式访问数据库 1. 减少不必要的数据库抛出的错误信息 1. 对数据库的操作赋予严格的权限控制 1. 净化和过滤掉不必要的SQL保留字，比如：where, or, exec 等  ## 点击劫持  - 诱使用户点击看似无害的按钮（实则点击了透明 iframe 中的按钮）. - 监听鼠标移动事件，让危险按钮始终在鼠标下方. - 使用 HTML5 拖拽技术执行敏感操作（例如 deploy key）.  预防策略：  1. 服务端添加 X-Frame-Options 响应头,这个 HTTP 响应头是为了防御用 iframe 嵌套的点击劫持攻击。 这样浏览器就会阻止嵌入网页的渲染。 1. JS 判断顶层视口的域名是不是和本页面的域名一致，不一致则不允许操作，`top.location.hostname === self.location.hostname`； 1. 敏感操作使用更复杂的步骤（验证码、输入项目名称以删除）。  ## window.opener 安全问题 window.opener 表示打开当前窗体页面的的父窗体的是谁。例如，在 A 页面中，通过一个带有 target="_blank" 的 a 标签打开了一个新的页面 B，那么在 B 页面里，window.opener 的值为 A 页面的 window 对象。 一般来说，打开同源(域名相同)的页面，不会有什么问题。但对于跨域的外部链接来说，存在一个被钓鱼的风险。比如你正在浏览购物网站，从当前网页打开了某个外部链接，在打开的外部页面，可以通过 window.opener.location 改写来源站点的地址。利用这一点，将来源站点改写到钓鱼站点页面上，例如跳转到伪造的高仿购物页面，当再回到购物页面的时候，是很难发现购物网站的地址已经被修改了的，这个时候你的账号就存在被钓鱼的可能了。 预防策略：  1. 设置 rel 属性  ```javascript <a href="https://xxxx" rel="noopener noreferrer"> 外链 <a> ```  el=noopener 规定禁止新页面传递源页面的地址，通过设置了此属性的链接打开的页面，其 window.opener 的值为 null。 2. 将外链替换为内部的跳转连接服务，跳转时先跳到内部地址，再由服务器 redirect 到外链。 3. 可以由 widow.open 打开外链。  ## 文件上传漏洞 服务器未校验上传的文件，致使黑客可以上传恶意脚本等方式。 预防策略：  1. 用文件头来检测文件类型，使用白名单过滤(有些文件可以从其中一部分执行，只检查文件头无效，例如 PHP 等脚本语言)； 1. 上传后将文件彻底重命名并移动到不可执行的目录下； 1. 升级服务器软件以避免路径解析漏洞； 1. 升级用到的开源编辑器； 1. 管理后台设置强密码。  '},{title:"【工具学习】Git学习",path:"/posts/learnGit.html",strippedContent:'# Git  ## 常用命令 ### 初始开发 git 操作流程： ```json 克隆最新主分支项目代码 git clone 地址  创建本地分支 git branch 分支名  查看本地分支 git branch  查看远程分支 git branch -a  切换分支  git checkout 分支名 (一般修改未提交则无法切换，大小写问题经常会有，可强制切换  git checkout 分支名 -f  非必须慎用)  将本地分支推送到远程分支 git push <远程仓库> <本地分支>:<远程分支> ```  ### 查看系统配置： ```json git config --system --list ```  ### 查看当前用户全局配置： ```json git config --global --list ```  ### 查看当前仓库配置： ```json git config --local --list ```  ### 查看是否生成了 SSH 公钥: ```json cd ~/.ssh ls // 其中 id_rsa 是私钥，id_rsa.pub 是公钥 id_rsa      id_rsa.pub      known_hosts ```  ### 配置用户名和邮箱： ```json // 查看是否设置了user.name与user.email，没有的话，去设置 git config user.name git config user.email  // 设置user.name与user.email 其中加上了--global 就是设置全局的 git config [--global] user.name "XX" git config [--global] user.email "XX"  ```  ### 配置SSH： ```json // 配置好用户名和邮箱 // 输入 ssh-keygen 即可（或`ssh-keygen -t rsa -C "email"`） ssh-keygen // 生成之后获取公钥内容，输入 cat ~/.ssh/id_rsa.pub 即可，  // 复制 ssh-rsa 一直到 .local这一整段内容 cat ~/.ssh/id_rsa.pub  eg: $ cat ~/.ssh/id_rsa.pub ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAklOUpkDHrfHY17SbrmTIpNLTGK9Tjom/BWDSU GPl+nafzlHDTYW7hdI4yZ5ew18JH4JW9jbhUFrviQzM7xlELEVf4h9lFX5QVkbPppSwg0cda3 Pbv7kOdJ/MTyBlWXFCR+HAo3FXRitBqxiX1nKhXpHAZsMciLq8V6RjsNAQwdsdMFvSlVK/7XA t3FaoJoAsncM1Q9x5+3V0Ww68/eIFmb1zuUFljQJKprrX88XypNDvjYNby6vw/Pb0rwert/En mZ+AW4OZPnTPI89ZPmVMLuayrD2cE86Z/il8b+gw3r3+1nKatmIkjn2so1d01QraTlMqVSsbx NrRFi9wrf+M7Q== schacon@agadorlaptop.local  // 打开 GitLab 或者 GitHub，点击头像，找到设置页 // 左侧找到 SSH keys 按钮并点击，输入刚刚复制的公钥即可 ```  ### 查看远程仓库地址： ```json git remote -v  origin  git@github.com:michaelliao/learngit.git (fetch) origin  git@github.com:michaelliao/learngit.git (push)  上面显示了可以抓取和推送的origin的地址。如果没有推送权限，就看不到push的地址。 ```  ### 修改远程仓库地址： ```json git remote set-url origin <new url> ```  ### 拉取所有分支并更新： ```json for branch in git branch -a | grep remotes | grep -v HEAD | grep -v master; do git branch --track ${branch##*/} $branch done git fetch --all git pull --all ```  ### http协议下保存用户名和密码（避免每次操作都要输入）： ```json git config --global credential.helper store ```   ## 命令列表 ![image.png](https://cdn.nlark.com/yuque/0/2019/png/519325/1573461815907-f35f0865-4e4b-4103-ad26-405f57bd4ea6.png#align=left&display=inline&height=780&name=image.png&originHeight=780&originWidth=733&search=&size=206154&status=done&width=733) ```json // 初始化目录变成Git可以管理的仓库 git init  // 添加文件到暂存区 git add file2.txt file3.txt  // 添加文件到本地仓库 git commit  -m "add 3 files."  // 显示从最近3次的提交日志 git log // 显示当前最新版本 git log --pretty=oneline  输出： 在Git中，用HEAD表示当前版本，上一个版本就是HEAD^，上上一个版本就是HEAD^^， 往上100个版本写100个^比较容易数不过来，写成HEAD~100。  $ git log commit 1094adb7b9b3807259d8cb349e7df1d4d6477073 (HEAD -> master) Author: Michael Liao <askxuefeng@gmail.com> Date:   Fri May 18 21:06:15 2018 +0800      append GPL  commit e475afc93c209a690c39c13a46716e8fa000c366 Author: Michael Liao <askxuefeng@gmail.com> Date:   Fri May 18 21:03:36 2018 +0800      add distributed  commit eaadf4e385e865d25c48e7ca9c8395c3f7dfaef0 Author: Michael Liao <askxuefeng@gmail.com> Date:   Fri May 18 20:59:18 2018 +0800      wrote a readme file  // Git在内部有个指向当前版本的HEAD指针 // 要把当前版本append GPL回退到上一个版本 git reset --hard HEAD^ // 可以指定回到未来的某个版本 // 1094a版本号没必要写全，前几位就可以了，Git会自动去找。 git reset --hard 1094a  // 查看命令历史 git reflog  // 显示工作目录和暂存区的状态--查看冲突文件 git status  // 查看工作区和版本库里面最新版本的区别 针对特定文件readme.txt   git diff HEAD -- readme.txt   // git add之前撤销操作，把readme.txt文件在工作区的修改全部撤销 git checkout -- readme.txt  //commit之前,把暂存区的修改撤销掉（unstage），重新放回工作区 git reset HEAD readme.txt   // 用命令git rm删掉文件,并且git commit 才会生效 git rm  // 创建SSH Key , id_rsa和id_rsa.pub这两个文件 ssh-keygen -t rsa -C "youremail@example.com"  // 关联一个远程库 git remote add origin <url>  // 用命令git clone克隆一个本地库 // Git支持多种协议，包括https，但通过ssh支持的原生git协议速度最快 git clone git@github.com:michaelliao/gitskills.git  // 创建dev分支，然后切换到dev分支 git checkout -b dev // git checkout命令加上-b参数表示创建并切换,相当于以下两条命令 git branch dev git checkout dev  // 查看所有分支，当前分支前面会标一个*号 git branch  // 把dev分支的工作成果合并到master分支上 // 1. 切换回master分支 git checkout master // 2. 合并--合并指定分支到当前分支 git merge dev  // 删除dev分支 git branch -d dev  // 切换分支 git switch master  // 创建并切换到新的dev分支 git switch -c dev  // checkout 同一个命令，有两种作用 // 切换分支 git checkout <branch> // 撤销修改 git checkout -- <file>  // 查看分支合并图 git log --graph  // 要强行删除一个没有被合并过的分支 git branch -D <name>  // 查看远程库的信息 git remote -v  // 推送分支, 把该分支上的所有本地提交推送到远程库 git push origin master git push origin dev  // 哪些分支需要推送 master分支是主分支，因此要时刻与远程同步；  dev分支是开发分支，团队所有成员都需要在上面工作，所以也需要与远程同步；  bug分支只用于在本地修复bug，就没必要推到远程了，除非老板要看看你每周到底修复了几个bug；  feature分支是否推到远程，取决于你是否和你的小伙伴合作在上面开发。  // 抓取分支 git clone git@github.com:michaelliao/learngit.git // 创建远程origin的dev分支到本地 git checkout -b dev origin/dev // 推送分支 git push origin dev // 冲突修复 git pull // git pull也失败了，git pull提示no tracking information，原因是没有指定本地dev分支与远程origin/dev分支的链接，根据提示，设置dev和origin/dev的链接： git branch --set-upstream-to=origin/dev dev // 再次拉取 git pull  // 合并有冲突，需要手动解决 git status 手动解决 git add readme.txt git commit -m "conflict fixed" // 解决后，提交，再push git push origin dev  ```  ## 代码提交流程  工作区 -> git status 查看状态 -> git add . 将所有修改加入暂存区-> git commit -m "提交描述" 将代码提交到 本地仓库 -> git push 将本地仓库代码更新到 远程仓库。  ### 应用场景 #### Git教程: [https://www.liaoxuefeng.com/wiki/896043488029600/896067074338496](https://www.liaoxuefeng.com/wiki/896043488029600/896067074338496) #### 1.git add 提交到暂存区，出错 1-1、改乱了工作区某个文件的内容，想直接丢弃工作区的修改  ```json // 丢弃工作区的修改 git checkout -- <fileName> ```  1-2、改乱了工作区某个文件的内容，还添加到了暂存时，想丢弃修改  ```json // 清空add命令向暂存区提交的关于file文件的修改 git reset HEAD -- file // 丢弃工作区的修改 git checkout -- <fileName> ```  #### 2.git commit 提交到本地仓库，出错 2-1、提交信息出错  ```json // 更改 commit 信息 git commit --amend -m"新提交消息" ```  2-2、遗漏提交部分更新  ```json // 方案一：再次 commit git commit -m"提交消息"  // 方案二：遗漏文件提交到之前 commit 上 // missed-file 为遗漏提交文件 git add missed-file  // --no-edit 表示提交消息不会更改，在 git 上仅为一次提交 git commit --amend --no-edit ``` 2-3、提交错误文件，回退到上一个 commit 版本，再 commit #####  ```json // git reset修改版本库，修改暂存区，修改工作区  git reset HEAD <文件名> // 把暂存区的修改撤销掉（unstage），重新放回工作区。 // git版本回退，回退到特定的commit_id版本，可以通过git log查看提交历史，以便确定要回退到哪个版本(commit 之后的即为ID); git reset --hard commit_id  //将版本库回退1个版本，不仅仅是将本地版本库的头指针全部重置到指定版本，也会重置暂存区，并且会将工作区代码也回退到这个版本 git reset --hard HEAD~1  // 修改版本库，保留暂存区，保留工作区 // 将版本库软回退1个版本，软回退表示将本地版本库的头指针全部重置到指定版本，且将这次提交之后的所有变更都移动到暂存区。 git reset --soft HEAD~1 ```  ```json // git revert撤销 某次操作，此次操作之前和之后的commit和history都会保留，并且把这次撤销作为一次最新的提交  // 撤销前一次 commit git revert HEAD // 撤销前前一次 commit git revert HEAD^ // (比如：fa042ce57ebbe5bb9c8db709f719cec2c58ee7ff）撤销指定的版本，撤销也会作为一次提交进行保存。 git revert commit ``` ##### `git revert` 和 `git reset` 的区别  - `git revert`是用一次新的commit来回滚之前的commit，`git reset`是直接删除指定的commit。  - 在回滚这一操作上看，效果差不多。但是在日后继续merge以前的老版本时有区别。因为`git revert`是用一次逆向的commit“中和”之前的提交，因此日后合并老的branch时，导致这部分改变不会再次出现，但是`git reset`是之间把某些commit在某个branch上删除，因而和老的branch再次merge时，这些被回滚的commit应该还会被引入。  - `git reset` 是把HEAD向后移动了一下，而`git revert`是HEAD继续前进，只是新的commit的内容和要revert的内容正好相反，能够抵消要被revert的内容。  #### 3.优化操作（rebase & merge --no-ff） 3-1.拉取代码 pull --rebase **git pull = git fetch + git merge** **git pull --rebase = git fetch + git rebase**  按照 Git 的默认策略，如果远程分支和本地分支之间的提交线图有分叉的话（即不是 fast-forwarded），Git 会执行一次 merge 操作，因此产生一次没意义的提交记录，从而造成了像上图那样的混乱。  在 pull 操作的时候，，使用 `git pull --rebase` 策略目的是修整提交线图。加上 `--rebase` 参数的作用是，提交线图有分叉的话，Git 会 rebase 策略来代替默认的 merge 策略。  大多数时候，使用 `git pull --rebase`是为了使提交线图更好看，从而方便 code review。不过，如果你对使用 git 还不是十分熟练的话，我的建议是 `git pull --rebase`多练习几次之后再使用。  另外，还需注意的是，使用 `git pull --rebase`比直接 pull 容易导致冲突的产生，如果预期冲突比较多的话，建议还是直接 pull。  3-2.合代码 merge --no-ff 要用到的 `git merge --no-ff <branch-name>` 策略偏偏是反行其道，刻意地弄出提交线图分叉出来。   请注意`--no-ff`参数，表示禁用`Fast forward` 设你在本地准备合并两个分支，而刚好这两个分支是 fast-forwarded 的，那么直接合并后你得到一个直线的提交线图，当然这样没什么坏处，但如果你想更清晰地告诉你同伴：**这一系列的提交都是为了实现同一个目的**，那么你可以刻意地将这次提交内容弄成一次提交线图分叉。  在合并分支之前（假设要在本地将 feature 分支合并到 dev 分支），会先检查 feature 分支是否『部分落后』于**远程 dev 分支**：  ```json git checkout dev git pull # 更新 dev 分支 git log feature..dev ```  如果没有输出任何提交信息的话，即表示 feature 对于 dev 分支是 up-to-date 的。如果有输出的话而马上执行了 `git merge --no-ff` 的话，提交线图会变成这样： ![image.png](https://cdn.nlark.com/yuque/0/2019/png/519325/1573269911517-b090b8b5-69e3-4add-a1ae-7756e8eea509.png#align=left&display=inline&height=388&name=image.png&originHeight=388&originWidth=127&search=&size=63853&status=done&width=127)  所以这时在合并前，通常我会先执行：  ```json git checkout feature git rebase dev ``` 这样就可以将 feature 重新拼接到更新了的 dev 之后，然后就可以合并了，最终得到一个干净舒服的提交线图。  #### 4.暂存 git stash(修改紧急的 bug) `git stash` 可用来暂存当前正在进行的工作，比如想 pull 最新代码又不想 commit ， 或者另为了修改一个紧急的 bug ，先 stash，使返回到自己上一个 commit, 改完 bug 之后再 stash pop , 继续原来的工作。   - 添加缓存栈：`git stash` ;  - 查看缓存栈：`git stash list` ;  - 推出缓存栈：`git stash pop` ;  - 取出特定缓存内容：`git stash apply stash@{1}` ;  提交当前修复bug到其他分支： `git cherry-pick <commit>`  把stash内容存在某个地方了，但是需要恢复一下，有两个办法：  一是用`git stash apply`恢复，但是恢复后，stash内容并不删除，你需要用`git stash drop`来删除； 另一种方式是用`git stash pop`，恢复的同时把stash内容也删了.  在master分支上修复的bug，想要合并到当前dev分支，可以用`git cherry-pick <commit>`命令，把bug提交的修改“复制”到当前分支，避免重复劳动。 git cherry-pick 4c805e2  #### 5.文件名过长错误 Filename too long warning: Clone succeeded, but checkout failed.  ```json git config --system core.longpaths true ``` #### 6.  .gitignore 更新后生效 ```json git rm -r --cached . git add . git commit -m ".gitignore is now working” ```  #### 7. 同步Github fork 出来的分支   ```json // 1、配置remote，指向原始仓库 git remote add upstream https://github.com/InterviewMap/InterviewMap.git  // 2、上游仓库获取到分支，及相关的提交信息，它们将被保存在本地的 upstream/master 分支 git fetch upstream # remote: Counting objects: 75, done. # remote: Compressing objects: 100% (53/53), done. # remote: Total 62 (delta 27), reused 44 (delta 9) # Unpacking objects: 100% (62/62), done. # From https://github.com/ORIGINAL_OWNER/ORIGINAL_REPOSITORY # * [new branch] master -> upstream/master  // 3、切换到本地的 master 分支 git checkout master # Switched to branch \'master\'  // 4、把 upstream/master 分支合并到本地的 master 分支， // 本地的 master 分支便跟上游仓库保持同步了，并且没有丢失本地的修改。 git merge upstream/master # Updating a422352..5fdff0f # Fast-forward # README | 9 ------- # README.md | 7 ++++++ # 2 files changed, 7 insertions(+), 9 deletions(-) # delete mode 100644 README # create mode 100644 README.md  // 5、上传到自己的远程仓库中 git push  ```  #### 8. 创建标签 标签总是和某个commit挂钩。如果这个commit既出现在master分支，又出现在dev分支，那么在这两个分支上都可以看到这个标签。 分支可以移动，标签不能移动。 ```json // 1、切换到需要打标签的分支上 git branch  // 2、打一个新标签, 默认标签是打在最新提交的commit上的 git tag v1.0  // 3、查看所有标签,标签按字母排序的 git tag  // 4、打标签到具体历史提交记录版本上，找到历史提交的commit id $ git log --pretty=oneline --abbrev-commit 12a631b (HEAD -> master, tag: v1.0, origin/master) merged bug fix 101 4c805e2 fix bug 101 e1e9c68 merge with no-ff f52c633 add merge cf810e4 conflict fixed 5dc6824 & simple 14096d0 AND simple b17d20e branch test d46f35e remove test.txt b84166e add test.txt 519219b git tracks changes e43a48b understand how stage works 1094adb append GPL e475afc add distributed eaadf4e wrote a readme file  // 比方说要对add merge这次提交打标签，它对应的commit id是f52c633 $ git tag v0.9 f52c633  // 5、查看标签信息 git show v0.9  // 6、创建带有说明的标签，用-a指定标签名，-m指定说明文字 $ git tag -a v0.1 -m "version 0.1 released" 1094adb ```  #### 9. 操作标签  ```json // 1、删除标签--创建的标签都只存储在本地，不会自动推送到远程。所以，打错的标签可以在本地安全删除。 git tag -d v0.1  // 2、推送某个标签到远程 git push origin v1.0 // 一次性推送全部尚未推送到远程的本地标签 git push origin --tags  // 3、删除远程标签 git tag -d v0.9 // 命令git push origin :refs/tags/<tagname>可以删除一个远程标签 git push origin :refs/tags/v0.9  ```  #### 10. 自定义Git配置  ```json // 1、Git显示颜色，会让命令输出看起来更醒目 git config --global color.ui true  // 2、忽略特殊文件 // 在Git工作区的根目录下创建一个特殊的.gitignore文件， // 要忽略的文件名填进去，Git就会自动忽略这些文件。 // 想添加该文件，可以用-f强制添加到Git： git add -f App.class // 想添加一个文件到Git，但发现添加不了。要找出来到底哪个规则过滤了 git check-ignore -v App.class  /* 忽略文件的原则是： \t忽略操作系统自动生成的文件，比如缩略图等； \t忽略编译生成的中间文件、可执行文件等，也就是如果一个文件是通过另一个文件自动生成的，那自动生成的文件就没必要放进版本库，比如Java编译产生的.class文件； \t忽略你自己的带有敏感信息的配置文件，比如存放口令的配置文件。 */ 示范文件： # Windows: Thumbs.db ehthumbs.db Desktop.ini  # Python: *.py[cod] *.so *.egg *.egg-info dist build  # My configurations: db.ini deploy_key_rsa   // 3、删除远程标签 git tag -d v0.9 // 命令git push origin :refs/tags/<tagname>可以删除一个远程标签 git push origin :refs/tags/v0.9  // 4、配置别名 // 缩写命令 git config --global alias.st status git status 对应命令 git st // 把暂存区的修改撤销掉 git config --global alias.unstage \'reset HEAD\' git unstage test.py // 等价  git reset HEAD test.py  // 配置文件 // 配置Git的时候，加上--global是针对当前用户起作用的，如果不加，那只针对当前的仓库起作用。 .git/config文件中:  $ cat .git/config  [core]     repositoryformatversion = 0     filemode = true     bare = false     logallrefupdates = true     ignorecase = true     precomposeunicode = true [remote "origin"]     url = git@github.com:michaelliao/learngit.git     fetch = +refs/heads/*:refs/remotes/origin/* [branch "master"]     remote = origin     merge = refs/heads/master [alias]     last = log -1      当前用户的Git配置文件放在用户主目录下的一个隐藏文件.gitconfig中: $ cat .gitconfig [alias]     co = checkout     ci = commit     br = branch     st = status [user]     name = Your Name     email = your@email.com       ```   ## 基础概念 #### 仓库  1. **Remote:** 远程主仓库；  1. **Repository/History：** 本地仓库；  1. **Stage/Index：** Git追踪树,暂存区；  1. **workspace：** 本地工作区（即你编辑器的代码）  ![image.png](https://cdn.nlark.com/yuque/0/2019/png/519325/1573264297070-40c5b2d0-5052-4f12-bcb4-ee20e4dbeb61.png#align=left&display=inline&height=163&name=image.png&originHeight=282&originWidth=892&search=&size=133312&status=done&width=517)  ![image.png](https://cdn.nlark.com/yuque/0/2019/png/519325/1573264398217-bfe72d2e-7807-46b3-a13e-58256bbf77d3.png#align=left&display=inline&height=241&name=image.png&originHeight=397&originWidth=851&search=&size=110968&status=done&width=516)  #### git fetch 将某个远程主机的更新，全部/分支 取回本地（此时之更新了Repository）它取回的代码对你本地的开发代码没有影响，如需彻底更新需合并或使用`git pull`  #### git pull 拉取远程主机某分支的更新，再与本地的指定分支合并（相当与fetch加上了合并分支功能的操作）  #### git push 将本地分支的更新，推送到远程主机，其命令格式与git pull相似  #### 分支操作  - 使用 Git 下载指定分支命令为：`git clone -b 分支名仓库地址`  - 拉取远程新分支 `git checkout -b serverfix origin/serverfix`  - 合并本地分支 `git merge hotfix`：(将 hotfix 分支合并到当前分支)  - 合并远程分支 `git merge origin/serverfix`  - 删除本地分支 `git branch -d hotfix`：(删除本地 hotfix 分支)  - 删除远程分支 `git push origin --delete serverfix`  - 上传新命名的本地分支：`git push origin newName`;  - 创建新分支：`git branch branchName`：(创建名为 branchName 的本地分支)  - 切换到新分支：`git checkout branchName`：(切换到 branchName 分支)  - 创建并切换分支：`git checkout -b branchName`：(相当于以上两条命令的合并)  - 查看本地分支：`git branch`  - 查看远程仓库所有分支：`git branch -a`  - 本地分支重命名：`git branch -m oldName newName`  - 重命名远程分支对应的本地分支：`git branch -m oldName newName`  - 把修改后的本地分支与远程分支关联：`git branch --set-upstream-to origin/newName`    '}]}}]);