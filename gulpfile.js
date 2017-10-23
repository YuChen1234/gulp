var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
// var jade = require('gulp-jade');
// var sass = require('gulp-sass');
// var plumber = require('gulp-plumber');
// var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var mainBowerFiles=require('main-bower-files');
var browserSync = require('browser-sync').create();
var minimist=require('minimist');
var gulpSequence = require('gulp-sequence')
var envOptions={
    string:'env',
    default:{env:'develop'}
}
var options=minimist(process.argv.slice(2),envOptions)
var shell = require('gulp-shell')
//var watch = require('gulp-watch');
// var sourcemaps = require('gulp-sourcemaps');
// var babel = require('gulp-babel');
// var concat = require('gulp-concat');
console.log(options)

//var GitShell
//var GitShell= new ActiveXObject("WScript.Shell")
//var iReturnCode=GitShell.Run("cmd.exe /c md test",0,true)
//iReturnCode=GitShell.Run("cmd.exe /c cmdkey /generic:1 /user:HHH /pass:aaa",0,true)



function JsExecCmd(value) {
    var  cmd = new ActiveXObject("WScript.Shell");
    /*
    命令参数说明
    cmd.exe /c dir 是执行完dir命令后关闭命令窗口。
    cmd.exe /k dir 是执行完dir命令后不关闭命令窗口。
    cmd.exe /c start dir 会打开一个新窗口后执行dir指令，原窗口会关闭。
    cmd.exe /k start dir 会打开一个新窗口后执行dir指令，原窗口不会关闭。
    */
    //执行完cmd命令后不关闭命令窗口。 
    cmd.run("cmd.exe /k "+value);
    //执行完cmd命令后不关闭命令窗口。
    cmd.run("cmd.exe /k "+value);
    cmd = null;
    }
    //JsExecCmd("cmdkey /generic:1 /user:HHH /pass:aaa") 
    function run() {
        var command = 'cmdkey /generic:"git:https://github.com" /user:Yu1234 /pass:1234' //这里是执行的DOS命令
        JsExecCmd(command );      
        }
        // gulp.task('gulpcmd', shell.task([
        //     run()
        //   ]))

        // var a="git null"
        // gulp.task('gitget', () => {
        //     return gulp.src('.publish', {read: true})
        //     .pipe(shell([
        //         '<%= file.path %>'
        //     ]))
        //   })

        // gulp.task('gulpcmd', shell.task([
        //     'git init',
        //     'git add .',
        //     'git commit -m "first commit1"',
        //     'cmdkey /generic:"git:https://github.com" /user:YuChen1234 /pass:1234', 
        //     'git push -u origin master'
        //   ]))   
    
        gulp.task('gitpost',
        //$.if (options.env==='post' ,$.uglify(
        $.shell.task([
            'git init',
            'git add .',
            'git commit -m "first commit1"',
            /*'local userXXXX'
               'cmdkey /generic:"192.168.1.58" /user:YuChen1234 /pass:1234', 
            */
            'git remote add origin https://github.com/YuChen1234/gulp.git',
            'git push -u origin master'
          ]))
        //))
    

gulp.task('clean', function () {
    return gulp.src(['./.tmp','./public'], {read: false})
        .pipe($.clean());
});

gulp.task('copyHTML', function () {
    return gulp.src('./source/**/*.html')
        .pipe(gulp.dest('./public'))
});

gulp.task('jade', function () {
    //var YOUR_LOCALS={};
    gulp.src('./source/**/*.jade')
        .pipe($.plumber())
        .pipe($.jade({
            pretty: true
        }))
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.stream());
});

gulp.task('sass', function () {
    //postcss編輯
    var plugins = [
        autoprefixer({ browsers: ['last 3 version', 'ie 6'] })
    ];
    return gulp.src('./source//scss/**/*.scss')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.sass().on('error', $.sass.logError))
        //編輯完成CSS
        .pipe($.postcss(plugins))
        .pipe($.if(options.env==='production',$.minifyCss()))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream())
        
});

gulp.task('babel', () =>
    gulp.src('./source/js/**/*.js')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.concat('all.js'))
        .pipe($.if(options.env==='production',$.uglify({
            compress:{
                drop_console:true
            }
        })))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('./public/js'))
        .pipe(browserSync.stream())
);

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles({
        "overrides": {
            "vue": {                       // 套件名稱
                "main": "dist/vue.js"      // 取用的資料夾路徑
            }
        }
      }))
      .pipe(gulp.dest('./.tmp/vendors'))
      cb(err)
  });
  gulp.task('vendorJs', ['bower'], function(){
    return gulp.src(['./.tmp/vendors/**/**.js'])
    .pipe($.order([
      'jquery.js',
      'bootstrap.js'
    ]))
    
      .pipe($.concat('vendor.js'))
      .pipe($.if(options.env==='production',$.uglify()))
      .pipe(gulp.dest('./public/js'))
  });

  // Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        
        server: {
            baseDir: "./public/"
        }
    })
});

gulp.task('image-min', () =>
gulp.src('./source/images/*/*')
    .pipe($.if(options.env==='production',$.imagemin()))
    .pipe(gulp.dest('./public/images'))
);

//第一種 
// gulp.task('watchsass', function () {
//     return $.watch('./source/scss/**/*.scss', ['$.sass']);
// });
// gulp.task('watchjade', function () {
//     return $.watch('./source/**/*.jade', ['$.jade']);
// });
//第二種 
// gulp.task('watchsass', function () {
//     return gulp.watch('./source/scss/**/*.scss', ['sass']);
// });
// gulp.task('watchjade', function () {
//     return gulp.watch('./source/**/*.jade', ['jade']);
// });
////第三種 
gulp.task('watch', function () {
    gulp.watch('./source/scss/**/*.scss', ['sass']);
    gulp.watch('./source/**/*.jade', ['jade']);
    gulp.watch('./source/js/**/*.js', ['babel']);
});
// gulp.task('deploy',['gitpost'],function() {
//     return gulp.src('./public/**/*')
//       .pipe($.ghPages());
//   });
  gulp.task('deploy',function() {
    return gulp.src('./public/**/*')
      .pipe($.ghPages());
  });

gulp.task('bulid', gulpSequence('clean','jade','sass','babel','vendorJs'))


//gulp.task('default', ['jade', 'sass', 'watchsass','watchjade'])
gulp.task('default', ['jade', 'sass', 'babel' ,'vendorJs','browser-sync','image-min','watch'])



