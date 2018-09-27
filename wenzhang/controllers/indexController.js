// 管理员的控制器
var indexController={};

 // 引入item数据库模型
var itemModel=require('../models/itemModel.js');

// 引入 item 数据库模型
var articleModel = require('../models/articleModel.js');

// 引入lianjie数据模型
var lianjieModel=require('../models/lianjieModel.js')

// 客户端首页
indexController.Index=function(req,res,next){
	// 查询数据
    itemModel.find().sort({order:1}).exec(function(err,data){
        if (err) {
            console.log('数据添加数据失败');
        } else {
        	// console.log(data)
        	getItemArticles(0)
        	function getItemArticles(i){
        		// 根据 栏目 id 去查询 =这个栏目下的文章
        		articleModel.find({itemId:data[i]._id}).limit(5).exec(function(error,articles){
        			// 把查到的文章放 data 数组
        			data[i].articleList = articles;
        			if(i < data.length - 1){
        				getItemArticles(++i);
        			}else{	
						// res.render('index', { items: data });
						// 插入友情链接数据
						lianjieModel.find().sort({order:1}).exec(function(err,lianjiedata){
							if(err){
								console.log('友情链接插入失败');
							}else{
								// 响应模版
								// console.log(lianjiedata)
								res.render('index',{items: data,lianjies:lianjiedata});
							}
						})
        			}
        		})
        	}
        }
    })
}

// 列表页
indexController.List=function(req,res){


   // 当前页面 (用户如果没有 传 page 参数 就 让 page 默认 1)
	var page = req.query.page?req.query.page:1;

	// 每页显示多少条数据
	var pageSize = 2;

	// 一共有多少页
	articleModel.find({itemId:req.params._id}).count(function(err,total){
		// 最大页码
		var maxPageNumber =  Math.ceil(total/pageSize);

		// 判断上一页 和下一页的边界
		if(page < 1) page = 1;
		if(page > maxPageNumber) page = maxPageNumber;

		// 查询数据的偏移量
		var offsetPage = pageSize * (page-1);	

			    // 查询数据
			    itemModel.find().sort({order:1}).exec(function(err,data){
			        if (err) {
			            console.log('数据添加数据失败');
			        } else {
							lianjieModel.find().sort({order:1}).exec(function(err,lianjiedata){
							if(err){
							console.log('友情链接插入失败');
							}else{
				              // 响应列表页
							articleModel.find({itemId:req.params._id}).limit(pageSize).skip(offsetPage).exec(function(err,listdata){
							if(err){
								res.send('查询数据失败');
							}else{
								// console.log(listdata);
								// 响应模版
								res.render('List',{items: data,lianjies:lianjiedata,lists:listdata,maxPageNumber:maxPageNumber,page:page});		
							}
				        })
					}
				})
	        }
	    })

   })
}

// 详情页
indexController.Edit=function(req,res){
  // 查询数据
    itemModel.find().sort({order:1}).exec(function(err,data){
        if (err) {
            console.log('数据添加数据失败');
        } else {
               	// 插入友情链接数据
				lianjieModel.find().sort({order:1}).exec(function(err,lianjiedata){
					if(err){
						console.log('友情链接插入失败');
					}else{
                          // 响应详情页
                          articleModel.find({_id:req.params._id},function(err,Editdata){
                          	    if(err){
                          	    	console.log('文章数据查询失败');
                          	    }else{
                                    res.render('Edit',{items: data,lianjies:lianjiedata,Edits:Editdata});
                          	    }
                         })
					}
				})
        	}
     })
}

// 暴露控制器
module.exports=indexController;