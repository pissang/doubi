# 知识图谱关系数据规范
+ <a href="#path">path</a>
+ <a href="#graph">graph</a>
    + <a href="#graph.path">path</a>
    + <a href="#graph.viewport">viewport</a>
    + <a href="#graph.mainNode">mainNode</a>
    + <a href="#graph.node">node</a>
        + <a href="#graph.node.name">name<a/>
        + <a href="#graph.node.title">title<a/>
        + <a href="#graph.node.radius">radius<a/>
        + <a href="#graph.node.image">image</a>
        + <a href="#graph.node.action">action</a>
        + <a href="#graph.node.position">position</a>
        + <a href="#graph.node.fixed">fixed</a>
    + <a href="#graph.edge">edge</a>
        + <a href="#graph.edge.source">source</a>
        + <a href="#graph.edge.target">target</a>
        + <a href="#graph.edge.title">title</a>

<a name="path"></a>
##path

`path`是用来定位页面中所有关系数据的URI，在单个页面中，每一份关系数据都有一个唯一的`path`值。

**示例**
根路径为`/`, 如果第一层级的中心节点是`foo`, 第一层级的`path`就是路径`/foo`, 如果该层级的节点`bar`能够点击进入下一层级，则下一层级的`path`就是`/foo/bar`。

**nb:** 关系数据的请求以及点击日志的发送可以使用这个`path`

<a name="graph"></a>
## graph
一个`graph`数据文件描述了关系图的一个层级中的节点，节点之间的关系边，以及每个节点和边绘制的属性。每个`graph`都可以有一个<a href="#graph.mainNode">mainNode</a>属性，一个保存所有节点<a href="#graph.node">`node`</a>的`nodes`数组，以及一个保存所有关系边<a href="#graph.edge">`edge`</a>的`edges`数组

**示例**
```json
{
    "mainNode": "人物1",
    "path": "/人物1",
    "viewport": {
        "width": 1000,
        "height": 1000
    },
    "nodes": [{
        "name": "人物1",
        "radius": 50,
        "position": [500, 500],
        "fixed": true,
        "image": "http://tupu.baidu.com/static/images/人物1.jpg"
    }, {
        "name": "人物2",
        "radius": 30,
        "image": "http://tupu.baidu.com/static/images/人物1.jpg",
        "action": "/人物1/人物2"
    }],
    "edges": [{
        "source": "人物1",
        "target": "人物2",
        "label": "机油"
    }]
}
```

<a name="graph.path"></a>
### path
`string` `必须`

详见<a href="#path">path</a>

<a name="graph.viewport"></a>
### viewport
`array` `可选`

`viewport` 只有在有节点具有`position`的时候才会生效，有`width`, `height`两个属性

如果节点有`position`属性，节点的最终位置会替换为

```javascript
var width; // 绘制的视口宽度
var height; // 绘制的视口高度
position[0] = position[0] / viewport.width * width;
position[1] = position[1] / viewport.height * height;
```

**nb:** 这个属性主要是为了能够在预计算布局的时候保证每个节点在最终显示的时候不受屏幕分辨率的影响，始终保持在相对的位置。

<a name="graph.mainNode"></a>
### mainNode
`string` `必须`

布局的中心节点的<a href="graph.node.name">`name`</a>，一个布局的中心节点会在第一次展现的时候默认高亮该节点和其关系节点，并且在进入下一层级后会将该节点插入到下一层级的图中作为回退的节点（类似面包屑）

<a name="graph.node"></a>
### node
每个节点具有如下属性

<a name="graph.node.name"></a>
#### name
`string` `必须`
节点的名称，在 graph 中是唯一的，展现中如果节点没有 <a href="graph.node.title">`title`</a> 属性则默认显示`name`作为节点标签。

<a name="graph.node.title"></a>
#### title
`string` `可选` `展现`
节点标签的文字，如果没有该属性则取 <a href="graph.node.name"> `name` </a> 属性作为节点标签的文字，如果该属性为空字符串 `''` 则不显示标签

<a name="graph.node.radius"></a>
#### radius
`number` `必须` `展现`

绘制时节点的半径

<a name="graph.node.image"></a>
####  image
`string` `可选` `展现`
节点的图片url，展现时会被裁剪成圆形，如果没有该属性或者图片无法加载，会加载一个默认的背景图片，标签也会放大到节点中间显示。

<a name="graph.node.action"></a>
#### action
`string` `可选` `交互`

用户在点击节点后的行为，可以是一个进入下一层级的路径, 详见<a href="#action">`path`</a>

<a name="graph.node.position"></a>
#### position
`array` `可选` `展现`

节点的初始位置数组`[x, y]`，但是如果节点的<a href="#graph.node.fixed">`fixed`</a>属性为`false`, 在一段时间的布局计算之后，节点还是有可能会移动到其它位置，如果不设置则默认节点的位置是在一个方形区域内随机。

<a name="graph.node.fixed"></a>
#### fixed
`boolean` `可选` `展现`

是否在布局中固定该节点为初始位置（不受布局计算的影响），默认为`false`，如果设置为`true`，必须使用`position`确定节点的初始位置。一些重要的节点比如中心节点会固定位置。


<a name="graph.edge"></a>
### edge
每个关系边具有如下属性

<a name="graph.edge.source"></a>
#### source
`string` `必须`

边的源节点的<a href="graph.node.name">`name`</a>,  但是这里关系图是一个无向图所以哪个是源并没有什么意义。

<a name="graph.edge.target"></a>
#### target
`string` `必须`

边的目标节点的<a href="graph.node.name">`name`</a>。

<a name="graph.edge.label"></a>
#### label
`string` `可选` `展现`

描述节点之间的关系，会在边高亮的时候显示。

