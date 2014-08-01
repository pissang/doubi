// author 会杰
define(function(require) {
    
    var log = require('./log');

    var zTip = function(data){
        return new zTip.fn.init(data);
    };
    
    //数据
    var allData = require('../data/detail');
    var isIE = !!window.ActiveXObject;
    
    /*3d幻灯片*/
    var huandengpian = function (){
        var oDiv=document.getElementById('tip-pow'),
            oUl=document.getElementById('tip-pow-ul'),
            aLi=oUl.getElementsByTagName('li'),
            i=0,
            iNow=0,
            aA=oDiv.getElementsByTagName('a'),
            ready=true,
            wait=0,
            ua = navigator.userAgent.toLowerCase();
        
        aA[0].onclick=function (){
            tab((iNow-1+aLi.length)%aLi.length);
        };
        
        aA[1].onclick=function (){
            tab((iNow+1)%aLi.length);
        };
        
        if(!/(msie) ([\w.]+)/.exec( ua )){
            var arr=[{b: 'webkit', e: 'webkitTransitionEnd'}, {b: 'firefox', e: 'transitionend'}];
            
            function tEnd(ev){
                var obj=ev.srcElement||ev.target;
                if(obj.tagName!='LI')return;
                wait--;
                if(wait<=0)ready=true;
            }
            
            for(var i=0;i<arr.length;i++){
                if(navigator.userAgent.toLowerCase().search(arr[i].b)!=-1){
                    document.addEventListener(arr[i].e, tEnd, false);
                    break;
                }
            }
        }
        
        function m(n){return (n+aLi.length)%aLi.length;}
        
        function tab(now){
            if(!/(msie) ([\w.]+)/.exec( ua )){
                if(!ready)return;
                ready=false;
            }
            
            iNow=now;
            wait=aLi.length;
            for(var i=0;i<aLi.length;i++){
                aLi[i].className='';
                aLi[i].onclick=null;
            }
            aLi[m(iNow-2)].className='left2';
            aLi[m(iNow-1)].className='left';
            aLi[iNow].className='cur';
            aLi[m(iNow+1)].className='right';
            aLi[m(iNow+2)].className='right2';
            
            setEv();
        }
        
        setEv();
        
        function setEv(){
            var scaled=false;
            aLi[m(iNow-1)].onclick=aA[0].onclick;
            aLi[iNow].onclick=function ()   
            {
                if(scaled){
                    this.className='active';
                }else{
                    this.className='cur';
                }
                scaled=!scaled;
            };
            aLi[m(iNow+1)].onclick=aA[1].onclick;
        }
        
        document.onkeydown=function (ev){
            var oEvent=ev||event;
            
            switch(oEvent.keyCode){
                case 37:    
                    aA[0].onclick();
                    break;
                case 39:    
                    aA[1].onclick();
                    break;
            }
        };
        
        var autoPlayTimer=null;
        
        setTimeout(function (){
            aA[1].onclick();
        }, 0);
        
    };
    var ieHuangdengpian = function(datanum){
        var ROW=2,
            COL=4,
            NUM=8,
            W=126,//小块宽高
            H=105,
            BW=0,//图片宽高
            BH=0,
            loaded=0,
            i=0,
            starimgnum = datanum.length;
        //加载图片
        for(i=0;i<starimgnum;i++){
            var oImg=new Image();
            oImg.onload=function (){
                BW=this.width;
                BH=this.height;
                if(++loaded==starimgnum){
                    loadedSucc();
                }
            };
            oImg.src=datanum[i];
        }
        
        function loadedSucc(){
            var oParent=document.getElementById('scrollcontent'),
                aDiv=oParent.getElementsByTagName('div'),
                iNow=0,k=1,
                tt=oParent.offsetHeight*0.05;
            
            for(var j=0;j<ROW;j++){
                for(var i=0;i<COL;i++,k++){
                
                    var oDiv=document.createElement('div');
                    var ll=(oParent.offsetWidth-BW)/2;
                    var tt=(oParent.offsetHeight-BH)/2;
                    
                    oDiv.className='active';
                    
                    oDiv.index=k;
                    
                    oDiv.zns_row=j;
                    oDiv.zns_col=i;
                    oDiv.zns_left=ll+oDiv.zns_col*(W+1);
                    oDiv.zns_top=tt+oDiv.zns_row*(H+1)+200;
                    oDiv.zns_bg='url('+datanum[0]+') '+-oDiv.zns_col*W+'px '+-oDiv.zns_row*H+'px';
                    
                    oDiv.style.left=oDiv.zns_left+'px';
                    oDiv.style.top=oDiv.zns_top+'px';
                    
                    oDiv.style.width=W+'px';
                    oDiv.style.height=H+'px';
                    
                    oDiv.style.background=oDiv.zns_bg;
                    
                    oParent.appendChild(oDiv);
                }
            }
            //左右按钮
            var btn=document.createElement('div');
            btn.className = 'btn';
            btn.style.top = '320px';
            btn.innerHTML = '<a class="prev" id="prev" href="javascript:;"></a><a class="next" id="next" href="javascript:;"></a>';
            oParent.appendChild(btn);
            var oPrev=document.getElementById('prev'),
                oNext=document.getElementById('next');
            
            
            oPrev.onclick=oNext.onclick=function (){
                if(this==oPrev){
                    iNow--;
                    if(iNow<0){
                        iNow=starimgnum-1;
                    }
                }
                else{
                    iNow++;
                    if(iNow>=starimgnum){
                        iNow=0;
                    }
                }
                var arr=[];
                for(i=0;i<NUM;i++)arr[i]=i;
                arr.sort(function (){return Math.random()-0.5;});
                var timer=setInterval(function (){
                    var item=arr.pop();
                    //console.log(item);
                    aDiv[item].style.background='url('+datanum[iNow]+') '+-aDiv[item].zns_col*W+'px '+-aDiv[item].zns_row*H+'px';
                    
                    if(!arr.length)clearInterval(timer);
                }, 20);
            };
        }

    };
    /*滚动条*/
    var enclose = function(frame,content,bar,block,bdistance,cdistance,minutop){

        var isMacWebkit=(navigator.userAgent.indexOf('Macintosh')!==-1&&
                         navigator.userAgent.indexOf('WebKit')!==-1);
        var isFirefox=(navigator.userAgent.indexOf('Gecko')!==-1);

        var contentX=content.offsetLeft,
            contentY=content.offsetTop,
            framewidth=frame.offsetWidth,
            frameheight=frame.offsetHeight;

        frame.onwheel=wheelHandler;   //未来浏览器
        frame.onmousewheel=wheelHandler;    //大多数当前浏览器

        if(isFirefox){   //仅firefox
            frame.addEventListener('DOMMouseScroll',wheelHandler,false);
        }

        function wheelHandler(event){
            var e=event||window.event;

            var deltaX=e.deltaX*-30||
                      e.wheelDeltaX/4||
                      0;
            var deltaY=e.deltaY*-1||
                   e.wheelDeltaY/4||
        (e.wheelDeltaY===undefined&&
                   e.wheelDelta/4)||
                      e.detail*-10||
                                  0;
                      
            if(isMacWebkit){
                deltaX/=30;
                deltaY/=30;
            }

            if(isFirefox&&e.type!=='DOMMouseScroll'){
                frame.removeEventListener('DOMMouseScroll',wheelHandler,false);
            }

            var contentbox=content.getBoundingClientRect(),
                contentwidth=contentbox.right-contentbox.left,
                contentheight=contentbox.bottom-contentbox.top;

            if(e.altKey){
                if(deltaX){
                    framewidth-=deltaX;
                    framewidth=Math.min(framewidth,contentwidth);
                    framewidth=Math.max(framewidth,50);
                    frame.style.width=framewidth+'px';
                }
                if(deltaY){
                    frameheight-=deltaY;
                    frameheight=Math.min(frameheight,contentheight);
                    frameheight=Math.max(frameheight,50);
                    frame.style.height=frameheight+'px';
                }
            }else{
                if(deltaX){
                    contentX=content.offsetLeft;
                    var minoffset=Math.min(framewidth-contentwidth,0);
                    contentX=Math.max(contentX+deltaX,minoffset);
                    contentX=Math.min(contentX,0);
                    content.style.left=contentX+'px';
                }
                if(deltaY){
                    contentY=content.offsetTop;
                    var minoffset=Math.min(frameheight-contentheight,0);
                    contentY=Math.max(contentY+deltaY,minoffset);
                    contentY=Math.min(contentY,0);
                    content.style.top=contentY+'px';
                    block.style.top=(-contentY/cdistance*bdistance+minutop)+'px';
                }

            }

            if(e.preventDefault){
                e.preventDefault();
            }
            if(e.stopPropagation){
                e.stopPropagation();
            }
            e.cancelBubble=true;
            e.returnValue=false;
            return false;
        }
    }
    
    var scroll=(function(){
        var scrollblock, //滚动块
            scrollcontent,  //被滚动的内容
            scrollbar,  //滚动条
            scrollpanel,    //滚动内容的滚动区域
            cdistance,  //滚动内容要滚动的距离
            bdistance,  //滚动块要滚动的距离
            minuTop, //滚动条头尾剩下的空白
            cTop,   //滚动内容的top
            startY=0,   //滚动动作开始初鼠标的位置
            bTop=0,  //滚动动作开始初滚动块的top
            hasTouch = 'ontouchstart' in window;    

        var eventfn = {
            START_EV: hasTouch ? 'ontouchstart' : 'onmousedown',
            MOVE_EV: hasTouch ? 'ontouchmove' : 'onmousemove',
            END_EV: hasTouch ? 'ontouchend' : 'onmouseup'
        };
        
        function mouseDown(event){
            event.preventDefault();
            event=event||window.event;
            startY=hasTouch?event.touches[0].pageY:event.clientY;
            bTop=scrollblock.offsetTop;
            cTop=scrollcontent.offsetTop;
            document.body[eventfn.MOVE_EV]=function(){
                doDrag();
            }
            document.body[eventfn.END_EV]=function(){
                stopDrag();
            }
            document.getElementsByTagName('body')[0].onselectstart=function(){
                return false;
            };
        }

        function doDrag(event){
            event = event || window.event;
                
            var newbTop=(hasTouch?event.touches[0].pageY:event.clientY)-startY+bTop,
                newcTop=cTop-((hasTouch?event.touches[0].pageY:event.clientY)-startY)/bdistance*cdistance;

            if(newbTop<minuTop){
                newbTop=minuTop;
                newcTop=0;
            }else if(newbTop>bdistance+minuTop){
                newcTop=-cdistance;
                newbTop=bdistance+minuTop;
            }
            scrollblock.style.top=newbTop+'px';
            scrollcontent.style.top=newcTop+'px';

        }

        function stopDrag(event){
            document.onmousemove=null;
            document.onmouseup=null;
            document.getElementsByTagName('body')[0].onselectstart=function(){
                return true;
            };
        }


        return{
            init:function(scrollpanel_id,scrollcontent_id,scrollbar_id,scrollblock_id){
                scrollblock=document.getElementById(scrollblock_id);
                scrollcontent=document.getElementById(scrollcontent_id);
                scrollbar=document.getElementById(scrollbar_id);
                scrollpanel=document.getElementById(scrollpanel_id);
                
                if(scrollcontent.offsetHeight<scrollpanel.offsetHeight){
                    scrollbar.style.display = 'none';
                }else{
                    scrollblock.style.height = scrollbar.offsetHeight/scrollcontent.offsetHeight*scrollbar.offsetHeight+'px';//初始化更改滚动条高度
                    
                    minuTop=scrollblock.offsetTop;
                    cdistance=scrollcontent.offsetHeight-scrollpanel.offsetHeight;
                    bdistance=scrollbar.offsetHeight-minuTop*2-scrollblock.offsetHeight;
                    
                    scrollblock[eventfn.START_EV]=mouseDown;
                    enclose(scrollpanel,scrollcontent,scrollbar,scrollblock,bdistance,cdistance,minuTop);
                }
            }
        }
    }());
    
    /*弹框*/
    var Tip = function(){
        var self = {};
        //内容片段
        function creatDataStr(type,typedata, person){
            //if(type instanceof Array) var type = type[0];
            switch(type){
                case '作品':
                case '人脉':
                case '角色':
                    var dataLi = '',amore = '';
					if((type=='作品' || type=='人脉' || type=='角色') && typedata.href){
						amore = '<a class="baike-more" href="'+typedata.href+'" target="_blank">查看更多>></a>';
					}
                    for(var attr in typedata){
                        if(attr!=='img' && attr!=='介绍' && attr!=='href'){
                            if (attr == '中文名') {
                                var val = typedata[attr];
                                dataLi += '<li><span>' + attr + '：</span><a target="_blank" href="http://www.baidu.com/s?wd=' + val + '">' + val + '</a></li>';
                            } else {
                                dataLi += '<li><span>' + attr + '：</span><span class="tip-juese-head-item">' + typedata[attr] + '</span></li>';
                            }
                        }
                    }
					
                    var str = '<div class="top-juese-head">'+
                        '<div class="top-juese-leftimg"><img src="'+typedata.img+'" style="width:100%;height:100%" /><span class="top-juese-leftimg-shadow"></span></div>'+
                        '<div class="top-juese-rightlist">'+
                            '<ul>'+
                                dataLi+
                            '</ul>'+
                        '</div>'+
                    '</div>'+
                    '<div class="top-juese-jianjie">'+(typedata['介绍'] || '')+amore+'</div>';
                break;
                case '微博热议':
                    var str = '';
                    typedata = typedata.sort(function(a, b) {
                        return b.time.localeCompare(a.time);
                    });
                    for(var i=0;i<typedata.length;i++){
                        var item = typedata[i];
                        str += '<div class="top-weibo-list">'+
                            '<div class="top-weibo-left"><img src="'+item.img+'" /></div>'+
                            '<div class="top-weibo-right">'+
                                '<span class="top-weibo-right-title">'+item.title+'</span>'+
                                '<div class="top-weibo-right-content">'+item.content+'</div>'+
                                '<div class="top-weibo-time">'+item.time+'</div>'+
                            '</div>'+
                        '</div>';
                    }
                    var url = 'http://s.weibo.com/wb/' + person + '&sort=time';
                    str += '<a class="baike-more" href="'+url+'" target="_blank">查看更多>></a>';
                break;
                case '剧照':
                    var typedataA = typedata.img.split(','),
                        str = '';
                    if(!isIE){
                        for(var i=0;i<typedataA.length;i++){
                            str += '<li class=""><img src="'+typedataA[i]+'"><span></span></li>';
                        }
                        var str = '<div class="top-juzhao" id="tip-pow">'+
                            '<ul id="tip-pow-ul">'+
                                str+
                            '</ul>'+
                            '<div class="btn">'+
                                '<a class="prev" href="javascript:;"></a>'+
                                '<a class="next" href="javascript:;"></a>'+
                            '</div>'+
                        '</div>';
                    }
                break;
                    
            }
            return str;
        };
        //创建弹框
        var creatElement = function(type,typedata, person){
            var clientH = document.body.clientHeight || document.documentElement.clientHeight;
            var tipbg = 'tipbg.png';

            //弹框外层
            var ele = document.createElement('div');
            ele.className = 'tip-container';
            // 标题
            var ele_title = document.createElement('div');
            ele_title.className = 'tip-title';
            if (type == '人脉') {
                var title = '人物简介';
            } else if (type == '作品') {
                var title = '作品简介';
            } else if (type == '角色') {
                var title = '角色概况';
            } else {
                var title = type;
            }
            ele_title.innerHTML = title;
            ele.appendChild(ele_title);
            //scrollpanel
            var ele_panel = document.createElement('div');
            ele_panel.className = "tip-scroll-panel";
            ele_panel.id = "scrollpanel";
            ele_panel.style.overflow = type=='剧照'?'':'hidden';
            ele.appendChild(ele_panel);//先插入内容区模块
            //内层展示区,利用定位使其在标题下面位置固定

            var ele_content = document.createElement('div');
            ele_content.id = 'scrollcontent';
            ele_content.style.top = '0px';
            ele_content.style.overflow = type=='剧照'?'':'hidden';
            ele_content.className = 'tip-content';
            
            ele_content.innerHTML = creatDataStr(type,typedata, person);
            ele_panel.appendChild(ele_content);
            //滚动条
            if(type!='剧照'){
                var ele_bar = document.createElement('div');
                ele_bar.className = "tip-scroll-scrollbar";
                ele_bar.id = 'scrollbar';
                //ele_bar.style.top = '0px';
                //ele_bar.style.left = '177px';
                ele_bar.innerHTML = '<div class="tip-scroll-scrollblock" id="scrollblock"></div>';
                ele.appendChild(ele_bar);//再插入弹层模块
            }
            /*关闭*/
            var ele_close = document.createElement('div');
            ele_close.className = 'tip-close';
            ele.appendChild(ele_close);//插入弹层模块
            self.tipclose = ele_close;//close模块
            document.body.appendChild(ele);//插入页面
            self.elements = ele;

            ele_panel.addEventListener('click', function(e) {
                //日志
                if (e.target.nodeName.toUpperCase() == 'A') {
                    log('zhishitupuclick', person || '', e.target.href);
                }
            });
            return ele;
        };
        //
        return self = {
            //添加弹框
            add: function(type,typedata, person){
                creatElement(type,typedata, person);
                if(type=='剧照'){//只有剧照才执行
                    isIE?ieHuangdengpian(typedata.img.split(',')):huandengpian();
                }else{
                    scroll.init('scrollpanel','scrollcontent','scrollbar','scrollblock');
                }
            },
            //删除弹框
            remove: function(){
                
            }
        }
    }();
    
    zTip.fn = {
        haveData: function() {
            return !!this.tipData;
        },
        //展现弹框
        show: function(){
            Tip.add(this.type, this.tipData, this.person);
            this.elements = Tip.elements;//更改（写入初始化 不使用show，不能得到弹框元素）
            this.tipclose = Tip.tipclose;
            return this;
        },
        //关闭弹框
        close: function(fn){
            var _this = this;
            this.tipclose;
            _this.tipclose.onclick = function(){
                _this.elements.style.display = 'none';
                document.body.removeChild(_this.elements);
                fn();
            };
        }
    };
    
    zTip.fn.init = function(obj){
        this.elements = Tip.elements;
        //数据层处理 begin
        var path = obj.path;
        this.person = path.name;
        
        this.type = path.type;//类别
        this.prodcname = path.extra ? path.extra : '';//作品名
        this.personimg = obj.image ? obj.image : '';
        //顾里层级->作品->作品名
        if (allData[this.person]) {
            var data = allData[this.person][this.type];
            if (this.type == '作品' || this.type == '人脉') {
                for (var i = 0; i < data.length; i++) {
                    if (data[i][this.prodcname]) {
                        this.tipData = data[i][this.prodcname];
                        if (this.personimg) {
                            this.tipData.img = this.personimg;
                        }
                    }
                }
            } else {
                this.tipData = data;//封装其他数据
                if (this.type !== '剧照') {
                    this.tipData['img'] = this.personimg;
                }
            }
        }
        //数据层处理 end
        return this;
    };
    
    zTip.fn.init.prototype = zTip.fn;

    return  zTip;
})