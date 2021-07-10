;(function($){
   $.fn.dropload=function(options){
      return new Dropload(this,options);
   }

   var Dropload=function(element,options){
       this.ele=$(element);
       this.pageNo=1;
       this.loading=false;
       this.insertDom=false;
       this.init(options);
   }

   Dropload.prototype.init=function(options){
       var me=this;
       var $ele=me.ele;
       var defaults={
             domUp:{
                domClass:"dropload-up",
                domRefresh:'<div class="dropload-refresh">↓下拉刷新</div>',
                domUpdate:'<div class="dropload-update">↑释放更新</div>',
                domLoad:'<div class="dropload-load"><span class="loading"></span>加载中...</div>'
             },
             domDown:{
                domClass:"dropload-down",
                domRefresh:'<div class="dropload-refresh">↑上拉加载更多</div>',
                domUpdate:'<div class="dropload-update">↓释放加载</div>',
                domNoDate:'<div class="dropload-nodata">没有数据了</div>',
                domLoad:'<div class="dropload-load"><span class="loading"></span>加载中...</div>'
             },
             loadUpFn:null,
             loadDownFn:null,
             pageCount:1,
             distance:50
        }
       me.opts=$.extend({},defaults,options);
       
       $ele.on('touchstart',function(e){
           if(!me.loading){
              fnTouch(e);
              fnTouchStart(e,me);
           }
       })

       $ele.on('touchmove',function(e){
           if(!me.loading){
              fnTouch(e);
              fnTouchMove(e,me);
           }
       })

       $ele.on('touchend',function(e){
           if(!me.loading){
              fnTouchEnd(me);
           }
       })
   }

   function fnTouch(e){
       e.touches=e.touches || e.originalEvent.touches;  // 原始事件
   }

   // 按下时
   function fnTouchStart(e,me){
       me._startY=e.touches[0].pageY;
       me._loadHeight=me.ele.height();
       me._pageHeight=me.ele.children(".lists").height();
       me._scrollTop=me.ele.scrollTop();
   }

   // 移动时
   function fnTouchMove(e,me){
      me._curY=e.touches[0].pageY;
      me._moveY=me._curY-me._startY;

      if(me._moveY>0){
         me.direction='down';
      }else{
         me.direction='up';
      }

      var _absMoveY=Math.abs(me._moveY);
      var dis=me.opts.distance;
      
      // 下拉刷新
      if(me.opts.loadUpFn && me.direction=='down' && me._scrollTop<=0){
         e.preventDefault();
         if(!me.insertDom){
            $('<div class="'+me.opts.domUp.domClass+'"></div>').prependTo(me.ele);
            me.insertDom=true;
         }
         
         me.$domUp=$('.'+me.opts.domUp.domClass);
         fnTransition(me.$domUp,0);

         if(_absMoveY<=dis){
            me._offsetY=_absMoveY;
            me.$domUp.html(me.opts.domUp.domRefresh);
         }else if(_absMoveY>dis && _absMoveY<=dis*2){
            me._offsetY=dis+(_absMoveY-dis)*0.5;
            me.$domUp.html(me.opts.domUp.domUpdate);
         }else{
            me._offsetY=dis+dis*0.5+(_absMoveY-dis*2)*0.2;
         }

         me.$domUp.height(me._offsetY);
      }

      // 上拉加载
      if(me.opts.loadDownFn && me.direction=="up" && (me._loadHeight+me._scrollTop)>=me._pageHeight){
         
         e.preventDefault();
         if(!me.insertDom){
            $('<div class="'+me.opts.domDown.domClass+'"></div>').appendTo(me.ele);
            me.insertDom=true;
         }
         
         me.$domDown=$('.'+me.opts.domDown.domClass);
         fnTransition(me.$domDown,0);

         if(_absMoveY<=dis){
            me._offsetY=_absMoveY;
            me.$domDown.html(me.opts.domDown.domRefresh);
         }else if(_absMoveY>dis && _absMoveY<=dis*2){
            me._offsetY=dis+(_absMoveY-dis)*0.5;
            me.$domDown.html(me.opts.domDown.domUpdate);
         }else{
            me._offsetY=dis+dis*0.5+(_absMoveY-dis*2)*0.2;
         }

         me.$domDown.height(me._offsetY);
         me.ele.scrollTop(me._scrollTop+me._offsetY);
      }
   }

   // toucheEnd Fn
   function fnTouchEnd(me){
      var moveY=Math.abs(me._moveY);
      if(me.insertDom){
          if(me.direction=="down"){
             me.domResult=me.$domUp;              // div.dropload-up
             me.loadHtml=me.opts.domUp.domLoad;
          }else{
             me.domResult=me.$domDown;            // div.dropload-down
             me.loadHtml=me.opts.domDown.domLoad;
          }
          
          fnTransition(me.domResult,1000);
          
          if(moveY>me.opts.distance){
              me.domResult.height(me.domResult.children().height());
              me.domResult.html(me.loadHtml);
              fnCallback(me);
          }else{
              me.domResult.height(0).on('webkitTransitionEnd',function(){
                  me.insertDom=false;
                  $(this).remove();
              })
          }
      }
   }

   // 回调函数
   function fnCallback(me){
      me.loading=true;
      if(me.opts.loadUpFn && me.direction=="down"){
          me.opts.loadUpFn(me);
      }else if(me.opts.loadDownFn && me.direction=="up"){
          me.opts.loadDownFn(me);
      }
   }

   // 过渡动画
   function fnTransition(dom,num){
      dom.css({
        '-webkit-transition':"all "+num+'ms'
      })
   }
   
   // 恢复默认设置
   Dropload.prototype.resetSettings=function(){
       var me=this;
       if(!!this.domResult){
          this.domResult.css('height','0').on('webkitTransitionEnd',function(){
              $(this).remove();
              me.loading=false;
              me.insertDom=false;
          })
       }
   }

})(Zepto)