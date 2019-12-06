# absotool
如果你是做前端的，并且在工作中需要用大量绝对定位display: absolute; 那么我建议花两分钟来了解一下这个小东西。

[试下这个demo](https://wenzhenhao.github.io/absotool/absotool/index.html)

### 如果你觉得这个小东西还不错的话，可以接着往下看。

用这个小东西的时候，还是有几点要注意的：

* 引入jQuery
* 你可以把它放在本地，然后写个动态加载，只在开发过程中引入它。

### 一点点功能介绍
大原则：方便，单手操作


| 方法名称 | 快捷键 | 简述 |
| :----:| :----: | :----: |
| init | Z + 1 | 初始化后可以拖动单个元素。|
| stop | Z + \` | 停止 |
| adjustWidthHeight | Z + 2 | 调整宽高 |
| adjustTopLeft | Z + 3 | 调整offset().top和offset().left |
| adjustZindex | Z + 4 | 调整z-index |
| switchStep | Z + Q | 切换[WASD]时的步长 |
| drawPanel | Z + E | show出一個面板，真正意義的單手操作 |
| showTips | Z + T | 现实或隐藏关于位置，宽高，z-index的提示 |
| printKeyCode | Z + H | keyup时打印出keycode |
| showDisplayNone | X + 1 | show实例化时原本是display:none;的元素 |
| hideDisplayNone | X + 2 | hide[X + 1] |
| addBackgroundColor | X + 3 | 为实例化时原本无backgroud-color的元素加底色 |
| removeBackgroundColor | X + 4 | remove[X + 3] |
| getCss | C + 1 | 复制css到剪贴板，暂时不带id |
| setCssRule | V + 1 | 复位到上一次[C + 1] |

* adjust前缀的功能需用到[WASD]四个键，可配合[SHIFT]和[CTRL + 左键]使用。

* \_public前缀的配置几乎都是可以修改的。

* 想了解更多的话可以查看源码，应该都能看得懂。

### MIT开源


