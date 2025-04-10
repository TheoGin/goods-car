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
      carTotalPrice: document.querySelector('.footer-car-total'),
      carTip: document.querySelector('.footer-car-tip'),
      car: document.querySelector('.footer-car'),
    };
    this.createHTML();
    this.updateFooter();
  }
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
              <i class="iconfont i-jianhao"></i>
              <span>0</span>
              <i class="iconfont i-jiajianzujianjiahao"></i>
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
    this.addCarAnimate();
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
      var dis = Math.round(
        this.uiData.deliveryThreshold - total
      );
      span.textContent = `还差￥${dis}元起送`;
    }

    // 更新价格
    this.doms.carTotalPrice.textContent = total.toFixed(2);
    
    // 更新配送费
    this.doms.carTip.textContent = `配送费${this.uiData.deliveryPrice}`;

    // 更新购物车状态
    var badge = this.doms.car.querySelector('.footer-car-badge');
    badge.textContent = this.uiData.getTotalChooseNumber();
    if(this.uiData.hasGoodsInCar()) {
      this.doms.car.classList.add('active');
    } else {
      this.doms.car.classList.remove('active');
    }
  }

  // 加入购物车动画
  addCarAnimate() {
    
  }
}

var ui = new UI();
