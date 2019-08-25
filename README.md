# absotool
如果你是做前端的，并且在工作中需要用大量绝对定位display: absolute; 那么我建议花两分钟来了解一下这个小东西。

[试下这个demo](https://wenzhenhao.github.io/absotool/absotool/index.html)

### 如果你觉得这个小东西还不错的话，可以接着往下看。

用这个小东西的时候，还是有几点要注意的：

* 引入jQuery
* 因为它只是单纯的把信息打印出来，所以是得写一段js或jQ来做布局。或者你可以想办法把信息整合到css
* 你可以把它放在本地，然后写个动态加载，只在开发过程中引入它。

### 一点点功能介绍
大原则：方便，单手操作


| 方法名称 | 快捷键 | 简述 |
| :----:| :----: | :----: |
| init | Z + 1 | 初始化后可以拖动单个元素。|
| stop | Z + \` | 停止 |
| printKeyCode | Z + H | keyup时打印出keycode |
| adjustWidthHeight | Z + 2 | 调整宽高 |
| adjustTopLeft | Z + 3 | 调整offset().top和offset().left |
| adjustZindex | Z + 4 | 调整z-index |
| switchStep | Z + Q | 切换[WASD]时的步长 |

* adjust前缀的功能需用到[WASD]四个键，可配合[SHIFT]和[CTRL + 左键]使用。

* get前缀的功能和adjust前缀的对应。按[C + 对应数字]可打印相应信息。

* set前缀的功能和get前缀的对应。如果你不小心F5了，可按[V + 对应数字]可以还原布局，前提是你之前用了C功能。

* \_public前缀的配置几乎都是可以修改的。

* 想了解更多的话可以查看源码，应该都能看得懂。

### MIT开源