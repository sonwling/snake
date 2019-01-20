// tools-------------------------------
;(function(w,undefined){
    var Tools = {
        getRandom: function (min, max) {
          return Math.floor(Math.random() * (max - min + 1)) +  min;
        }
      }
      w.Tools = Tools;
    //   传入window是为了可以让函数的参数进行压缩的
    // 可以让变量名被压缩 可写为w
    // 实参不可被压缩，老版本浏览器中undefined可被重新赋值，以防止在外不发生变化
    // 这样项目发布前就可以被压缩
})(window,undefined)
//   food -----------------------------
// 所有js文件中书写代码，都是全局作用域
// function fn(){
//     // 局部作用域
//     var n =1;
// }
// fn();

// 自调用函数  --  开启一个新的作用域，避免命名冲突
;(function (window,undefined) {
    // 局部作用域

    function Food(options) {
        options = options || {};
        // 此时 this指向构造函数
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.width = options.width || 20;
        this.height = options.height || 20;
        this.color = options.color || "green";

    }
    var position = "absolute";
    var elements = [];

    // 把食物渲染到地图上
    Food.prototype.render = function (map) {
        // 3.删除之前创建的食物
        remove();
        // 2.随机设置x,y的值
        this.x = Tools.getRandom(0, map.offsetWidth / this.width - 1) * this.width;
        this.y = Tools.getRandom(0, map.offsetHeight / this.height - 1) * this.height;

        //1 动态创建div
        var div = document.createElement("div");
        map.appendChild(div);
        // 将创建的div放在数组elements中
        elements.push(div);

        // 设置div样式

        div.style.position = position;
        // 设置为变量形式方便管理
        div.style.left = this.x + "px";
        div.style.top = this.y + "px";
        div.style.width = this.width + "px";
        div.style.height = this.height + "px";
        div.style.backgroundColor = this.color;
    }

    function remove() {
        // 为了防止数组重排，所以从后面删除
        for (var i = elements.length - 1; i >= 0; i--) {
            // 删除div  removeChild（）删除的是子元素  所以要先找到其父元素
            elements[i].parentNode.removeChild(elements[i]);
            // 删除数组中元素
            // 删除数组中的元素
            // 第一个参数，从哪个元素开始删除
            // 第二个参数，删除几个元素
            elements.splice(i, 1);
        }
    }

    // 把Food构造函数  让外部可以访问
    window.Food = Food;


})(window,undefined)



// // 测试
// var map = document.getElementById('map');
// var food = new Food();
// food.render(map);

// snake---------------------------
// 自调用函数，开启一个新的局部作用域，防止命名冲突

;(function (window,undefined) {

    // 属性写在构造函数中，方法写在原型对象中
    function Snake(options) {
        options = options || {};
        // 蛇节大小
        this.width = options.width || 20;
        this.height = options.height || 20;
        // 蛇移动的方向
        this.direction = options.direction || "right";
        // 蛇的身体（蛇节） 第一个元素是蛇头
        this.body = [{
                x: 3,
                y: 2,
                color: "red"
            },
            {
                x: 2,
                y: 2,
                color: "blue"
            },
            {
                x: 1,
                y: 2,
                color: "blue"
            }
        ];
    }
    // 子绝父相
    var position = "absolute";
    var elements = [];
    // 方法有渲染蛇在地图上
    Snake.prototype.render = function (map) {
        remove();
        // 把每个蛇节渲染到地图上
        for (var i = 0, len = this.body.length; i < len; i++) {
            // 遍历出每个蛇节
            var object = this.body[i];
            // 创建蛇body的div
            var div = document.createElement("div");
            map.appendChild(div);

            // 记录当前蛇
            elements.push(div);

            // 设置样式
            div.style.position = position;
            // 使用变量方便代码的管理
            div.style.width = this.width + "px";
            div.style.height = this.height + "px";
            // 注意：div的left,top,color 都要用到object对象的属性
            div.style.left = object.x * this.width + "px";
            div.style.top = object.y * this.height + "px";
            div.style.backgroundColor = object.color;
        }
    }

    // 私有的成员  删除
    function remove() {
        for (var i = elements.length - 1; i >= 0; i--) {
            // 删除div
            elements[i].parentNode.removeChild(elements[i]);
            // 删除数组中的元素
            elements.splice(i, 1);
        }
    }
    // 控制蛇移动的方法
    Snake.prototype.move = function (food,map) {
        // 控制蛇的身体移动（当前蛇节到上一个蛇节的位置）
        for (var i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;

        }
        // 控制蛇头的移动
        // 判断蛇移动的方向
        // body[0]代替的是蛇头
        var head = this.body[0];
        switch (this.direction) {
            case 'right':
                head.x += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'top':
                head.y -= 1;
                break;
            case 'bottom':
                head.y += 1;
                break;
        }

        // 2.4判断蛇头位置与食物坐标是否重合
        var headX = head.x * this.width;
        var headY = head.y * this.height;
        if (headX === food.x && headY === food.y) {
            // 让蛇增加一节
            // 获取蛇的最后一节
            var last = this.body[this.body.length - 1];
            this.body.push({
                x: last.x,
                y: last.y,
                color: last.color,
            })
            // 随机在地图上重新生成食物
            food.render(map);
        }

    }


    // 暴漏构造函数给外部
    window.Snake = Snake;
})(window,undefined);

// 测试
// 获取元素
// var map = document.getElementById("map");
// // 创建对象
// var snake = new Snake();
// // 调用函数
// snake.render(map)


// game---------------
// 使用自调用函数，创建一个新的局部作用域，防止命名冲突
;(function (window,undefined) {
    var that; //声明全局变量，记录游戏对象
    function Game(map) {
        // this    ？？？
        this.food = new Food();
        this.snake = new Snake();
        this.map = map;
        that = this;
    }
    Game.prototype.start = function () {
        // 1.把蛇和食物对象，渲染到地图上
        // this.food.render(this.map);
        // this.snake.render(this.map);
        this.food.render(this.map);
        this.snake.render(this.map);

        // 2.开始游戏的逻辑
        // 2.1  让蛇移动起来
        // 2.2  当蛇遇到边界游戏结束
        runSnake();
        // 2.3  通过键盘控制蛇移动的方向
        bindKey();
        // 2.4  当蛇遇到食物 

    }
    // 通过键盘控制蛇移动的方向
    function bindKey() {
        // document.onkeydown = function(){}
        document.addEventListener("keydown", function (e) {
            // console.log(e.keyCode);
            // 37 - left
            // 38 - top
            // 39 - right
            // 40 - bottom
            switch (e.keyCode) {
                case 37:
                    this.snake.direction = "left";
                    break;
                case 38:
                    this.snake.direction = "top";
                    break;
                case 39:
                    this.snake.direction = "right";
                    break;
                case 40:
                    this.snake.direction = "bottom";
                    break;
            }
            // 冒泡
        }.bind(that), false);
    }

    // 私有的函数  让蛇移动
    function runSnake() {
        var timerId = setInterval(function () {
            // 让蛇走一格
            // 在定时器的函数中this指向window对象的
            // this.snake
            // 要获取游戏对象中蛇的属性  that = this;
            // 我们若想用this,可以用bind()改变this指向
            this.snake.move(this.food, this.map);
            this.snake.render(this.map);
            // 2.2  当蛇遇到边界游戏结束
            // 获取蛇头的坐标
            var maxX = this.map.offsetWidth / this.snake.width;
            var maxY = this.map.offsetHeight / this.snake.height;
            var headX = this.snake.body[0].x;
            var headY = this.snake.body[0].y;
            if (headX < 0 || headX >= maxX) {
                alert('GAME OVER');
                clearInterval(timerId);
            }
            if (headY < 0 || headY >= maxY) {
                alert('GAME OVER');
                clearInterval(timerId);
            }
            // 用bind()
        }.bind(that), 150);
    }





    // 暴漏构造函数给外部
    window.Game = Game;
})(window,undefined);
// 测试
// var map = document.getElementById("map");
// var game = new Game(map);
// game.start();

// main-----------------------------
;(function (window,undefined) {
    var map = document.getElementById('map');
    var game = new Game(map);
    game.start();
  })(window,undefined)
  