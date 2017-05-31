const gulp = require("gulp");
const through = require("through2");
const qiniu = require("qiniu");
//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = "JWxWzs97EbiOAmJgQ-rNwCCDAjRXj1Oc-vPAJbcH";
qiniu.conf.SECRET_KEY = "O8jPqembu2DcBtPCfacZn980WWLSkXNdekIyfSVg";
//要上传的空间
bucket = "pandasjw";

const keyPathConfig = {
  "fmap/hangzhoudaduhuixiandaijiajuguan/0.3/": "./hangzhoudaduhuixiandaijiajuguan/10347.fmap"
  // "fmap/hangzhoudaduhuixiandaijiajuguan/0.3/": "./hangzhoudaduhuixiandaijiajuguan/2001/*",
  //   "fmap/hangzhoudaduhuifanersai/0.3/": "./hangzhoudaduhuifanersai/10347.fmap"
  // "fmap/hangzhoudaduhuifanersai/0.3/": "./hangzhoudaduhuifanersai/2001/*.fmi"
};

// 生成token
function uptoken(bucket) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket);
  return putPolicy.token();
}

//构造上传函数
function uploadFile(uptoken, key, localFile) {
  var extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
    if (!err) {
      // 上传成功， 处理返回值
      console.log(ret.hash, ret.key, ret.persistentId);
    } else {
      // 上传失败， 处理返回代码
      console.log(err);
    }
  });
}

gulp.task("uploadOne", function() {
  gulp.src("./hangzhoudaduhuixiandaijiajuguan/**/*.*").pipe(
    through.obj(function(file, enc, cb) {
      var token = uptoken(bucket);
      uploadFile(
        token,
        "./hangzhoudaduhuixiandaijiajuguan/0.3/" + file.relative,
        file.path
      );
      cb();
    })
  );
});

gulp.task("default", ["uploadOne"]);
