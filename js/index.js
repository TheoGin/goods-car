// // 要添加某一件商品的数量choose，但不要动原数据
// function UIGoods(index) {
//     return {
//         data: goods[index],
//         choose: 0
//     }
// }

// // 调用函数返回新对象————>构造函数
// // 通过原型实现类
// function UIGoods(index) {
//     this.data = goods[index];
//     this.choose = 0;
// }

// // 某一件商品的选择数量+1
// UIGoods.prototype.increase = function() {
//     this.choose++;
// }

// // 某一件商品的选择数量-1
// UIGoods.prototype.decrease = function() {
//     // 考虑边界情况
//     if(this.choose === 0) return;
//     this.choose--;
// }

// // 获取某一件商品的价格
// UIGoods.prototype.getTotalPrice = function() {
//     return this.choose * this.data.price;
// }

// 将上面改为class形式
// 单件商品的数据
class UIGoods {
  /**
   * @param {object} g 某一件商品对象
   */
  constructor(g) {
    this.data = g;
    this.choose = 0;
  }

  // 某一件商品的选择数量+1
  increase() {
    this.choose++;
  }

  // 某一件商品的选择数量-1
  decrease() {
    // 考虑边界情况
    if (this.choose === 0) return;
    this.choose--;
  }

  // 获取某一件商品的价格
  getTotalPrice() {
    return this.choose * this.data.price;
  }

  // 是否有选择的数量
  isChoose() {
    return this.choose > 0;
  }
}

// 界面数据类
class UIData {
  constructor() {
    var uiGoods = [];
    // 给每一件商品都加上choose属性
    for (var i = 0; i < goods.length; i++) {
      // 可通过map实现
      var ui = new UIGoods(goods[i]);
      uiGoods.push(ui);
    }
    this.uiGoods = uiGoods;
    // 配送费（一般通过网络请求获取）
    this.deliveryPrice = 5;
    // 最低多少元起送（一般通过网络请求获取）
    this.deliveryThreshold = 30;
  }

  // 某一件商品的选择数量+1
  increase(index) {
    this.uiGoods[index].increase();
  }

  // 某一件商品的选择数量-1
  decrease(index) {
    this.uiGoods[index].decrease();
  }

  // 获取总价格
  getTotalPrice() {
    var sum = 0;
    for (var i = 0; i < this.uiGoods.length; i++) {
      // 可通过reduce实现
      sum += this.uiGoods[i].getTotalPrice();
    }
    return sum;
  }

  // 获取总选择的数量
  getTotalChooseNumber() {
    var sum = 0;
    for (var i = 0; i < this.uiGoods.length; i++) {
      // 可通过reduce实现
      sum += this.uiGoods[i].choose;
    }
    return sum;
  }

  // 是否有商品在购物车
  hasGoodsInCar() {
    return this.getTotalChooseNumber() > 0;
  }

  // 是否跨过了配送标准
  isCrossDeliveryThreshold() {
    return this.getTotalPrice() >= this.deliveryThreshold;
  }

  // 是否有选择的数量
  isChoose(index) {
    return this.uiGoods[index].isChoose();
  }
}

// 界面
class UI {
  constructor() {
    this.uiData = new UIData();
    this.doms = {
      goodsContainer: document.querySelector(".goods-list"),
      footerPay: document.querySelector(".footer-pay"),
      carTotalPrice: document.querySelector(".footer-car-total"),
      carTip: document.querySelector(".footer-car-tip"),
      car: document.querySelector(".footer-car"),
    };
    this.createHTML();
    this.updateFooter();
    this.listenEvent();

    var rect = this.doms.car.getBoundingClientRect();
    var jumpTarget = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 5,
    };
    this.jumpTarget = jumpTarget;
  }

  // 监听各种事件
  listenEvent() {
    // 在动画结束之后需要去掉类名，不然下次动画就没效果了
    this.doms.car.addEventListener("animationend", function () {
      // 普通函数this：this.doms.car
      this.classList.remove("animate");
    });
  }

  // 根据UIData中UIGoods动态创建html
  createHTML() {
    // console.log(this.uiData.uiGoods);
    var str = "";
    // 1. 通过innerHTML创建元素
    for (var i = 0; i < this.uiData.uiGoods.length; i++) {
      str += `<div class="goods-item">
        <img src="${this.uiData.uiGoods[i].data.pic}" alt="" class="goods-pic" />
        <div class="goods-info">
          <h2 class="goods-title">${this.uiData.uiGoods[i].data.title}</h2>
          <p class="goods-desc">${this.uiData.uiGoods[i].data.desc}</p>
          <p class="goods-sell">
            <span>月售 ${this.uiData.uiGoods[i].data.sellNumber}</span>
            <span>好评率${this.uiData.uiGoods[i].data.favorRate}%</span>
          </p>
          <div class="goods-confirm">
            <p class="goods-price">
              <span class="goods-price-unit">￥</span>
              <span>${this.uiData.uiGoods[i].data.price}</span>
            </p>
            <div class="goods-btns">
              <i index=${i} class="iconfont i-jianhao"></i>
              <span>0</span>
              <i index=${i} class="iconfont i-jiajianzujianjiahao"></i>
            </div>
          </div>
        </div>
      </div>`;
    }

    this.doms.goodsContainer.innerHTML = str;

    // 2. 通过createElement创建元素
  }

  // 商品数量+1
  increase(index) {
    this.uiData.uiGoods[index].increase();
    this.showGoodsItemChooseNum(index);
    this.updateFooter();
    // 抛物线动画
    this.jump(index);
  }

  // 商品数量-1
  decrease(index) {
    this.uiData.uiGoods[index].decrease();
    this.showGoodsItemChooseNum(index);
    this.updateFooter();
  }

  // 展示某件商品的选择数量
  showGoodsItemChooseNum(index) {
    var goodsItem = this.doms.goodsContainer.children[index];
    var chooseNum = goodsItem.querySelector(".goods-btns span");
    chooseNum.textContent = this.uiData.uiGoods[index].choose;
    if (this.uiData.isChoose(index)) {
      goodsItem.classList.add("active");
    } else {
      goodsItem.classList.remove("active");
    }
  }

  // 更新页脚数据
  updateFooter() {
    var total = this.uiData.getTotalPrice();
    // 更新起送状态
    var span = this.doms.footerPay.querySelector("span");
    if (this.uiData.isCrossDeliveryThreshold()) {
      this.doms.footerPay.classList.add("active");
    } else {
      this.doms.footerPay.classList.remove("active");
      var dis = Math.round(this.uiData.deliveryThreshold - total);
      span.textContent = `还差￥${dis}元起送`;
    }

    // 更新价格
    this.doms.carTotalPrice.textContent = total.toFixed(2);

    // 更新配送费
    this.doms.carTip.textContent = `配送费${this.uiData.deliveryPrice}`;

    // 更新购物车状态
    var badge = this.doms.car.querySelector(".footer-car-badge");
    badge.textContent = this.uiData.getTotalChooseNumber();
    if (this.uiData.hasGoodsInCar()) {
      this.doms.car.classList.add("active");
    } else {
      this.doms.car.classList.remove("active");
    }
  }

  // 加入购物车动画
  carAnimate() {
    this.doms.car.classList.add("animate");
    // 动画结束的事件监听不放这，不然每次都加一个事件监听，其实只需监听一次即可！！
  }

  // 某件商品的加号“抛物线”到购物车
  jump(index) {
    // jumpTarget的位置是固定的，所以算一次即可————> 放到构造函数中！！

    // 获取每一件商品左上角的位置
    var plus = this.doms.goodsContainer.children[index].querySelector(
      ".i-jiajianzujianjiahao"
    );
    var rect = plus.getBoundingClientRect();
    // 动画起始位置
    var startPos = {
      x: rect.left,
      y: rect.top,
    };
    // 创建加入购物车元素
    /* <div class="add-to-car">
         <i class="iconfont i-jiajianzujianjiahao"></i>
       </div> */
    var div = document.createElement("div");
    div.className = "add-to-car";
    var i = document.createElement("i");
    i.className = "iconfont i-jiajianzujianjiahao";
    div.appendChild(i);
    document.body.appendChild(div);

    // 加号起始位置
    div.style.transform = `translateX(${startPos.x}px)`;
    // i元素 仅在重力作用下所做的运动
    i.style.transform = `translateY(${startPos.y}px)`;

    // 强行渲染
    div.clientWidth; // 或者用HTML5的window.requestAnimationFrame()

    // 加号最终位置
    // div.style.transform = `translate(${this.jumpTarget.x}px,${this.jumpTarget.y}px)`;

    // 要达到抛物线（曲线运动）效果：要求初速度和加速度方向不在同一直线
    // 1. div以匀速的初速度带着 i元素 沿水平方向抛出
    div.style.transform = `translateX(${this.jumpTarget.x}px)`;
    // 2. i元素 仅在重力作用下所做的运动
    i.style.transform = `translateY(${this.jumpTarget.y}px)`;

    var that = this;
    div.addEventListener(
      "transitionend",
      function () {
        div.remove();
        // 抛物线结束后开启第二个动画
        that.carAnimate(); // 注意普通函数this指向问题。也可用箭头函数解决
      },
      {
        // div加上i有两个过渡效果，会发生两次，所以得开启这个配置项---> 只监听 div 的 transitionend
        once: true,
      }
    );
  }
}

var ui = new UI();

// 事件：使用事件委托，只用在父元素上面绑定相应的事件，绑定的事件更少，页面的效率更高
ui.doms.goodsContainer.addEventListener('click', function(e) {
  // e.target：点击的目标元素
  
  if(e.target.classList.contains('i-jiajianzujianjiahao')) {
    // 加号
    var index = +e.target.getAttribute('index')
    ui.increase(index);
  } else if(e.target.classList.contains('i-jianhao')) {
    // 减号
    var index = +e.target.getAttribute('index')
    ui.decrease(index);
  }
})