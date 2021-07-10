$(document).ready(function(){
   var c=$('.inner').dropload({
        domUp:{
            domClass:"dropload-up",
            domRefresh:'<div class="dropload-refresh">↓下拉刷新</div>',
            domUpdate:'<div class="dropload-update">↑释放更新</div>',
            domNoDate:'<div class="dropload-null">没有数据了</div>',
            domLoad:'<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        domDown:{
            domClass:"dropload-down",
            domRefresh:'<div class="dropload-refresh">↑上拉加载更多</div>',
            domUpdate:'<div class="dropload-update">↓释放加载</div>',
            domNoDate:'<div class="dropload-null">没有数据了</div>',
            domLoad:'<div class="dropload-load"><span class="loading"></span>加载中...</div>'
        },
        pageCount:5,
        loadUpFn:function(me){
           $.ajax({
              url:"json/update.json",
              type:"get",
              dataType:"json",
              success:function(datas){
                 var data=datas.lists,str="",$list=me.ele.children(".lists");
                 $.each(data,function(i,obj){
                     str+='<a href="'+obj.link+'" class="item opacity">'
                              +'<img src="'+obj.pic+'">'
                              +'<h3>'+obj.title+'</h3>'
                              +'<span class="date">'+obj.date+'</span>'
                          +'</a>';
                 })
                 setTimeout(function(){
                    $list.html(str);
                    me.resetSettings();
                 },1000)
              }
           })
        },
        loadDownFn:function(me){
          $.ajax({
             url:"json/more.json",
             type:"get",
             dataType:"json",
             success:function(datas){
                var data=datas.lists,str="",$list=me.ele.children(".lists");
                $.each(data,function(i,obj){
                    str+='<a href="'+obj.link+'" class="item opacity">'
                             +'<img src="'+obj.pic+'">'
                             +'<h3>'+obj.title+'</h3>'
                             +'<span class="date">'+obj.date+'</span>'
                         +'</a>';
                })
                setTimeout(function(){
                   $list.append(str);
                   me.resetSettings();
                },1000)
             }
          })
       }
    });
})