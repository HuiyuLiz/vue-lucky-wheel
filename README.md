# JavaScript 題目篇 - 新手 JS 地下城
 ![image]( https://github.com/HuiyuLiz/vue-lucky-wheel/blob/master/jpg/DEMO-START.jpg)  
 
 9F - 抽獎轉盤
 <a href="https://huiyuliz.github.io/vue-lucky-wheel/" target="_blank">Demo</a>。

 ## 特定技術 遊戲規則
 【特定技術】2017 遊戲輪盤規則，樣式請參考 <a href="https://xd.adobe.com/spec/e7136641-75fd-4359-5960-f092bdfaa633-9122/screen/f8b361e2-e81f-45a1-8465-e21963362b05/before/" target="_blank">Adobe XD 設計稿</a>

|禮物|Flight|Child|Anything|Wifi|Wish|
|:-:|:-:|:-:|:-:|:-:|:-:|
|份數| 1  | 4  | 5  |  5 |  5 |  

輪盤只能轉 20 次，人人有獎，已經被抽到的獎項，就不可再次出現。 

【特定技術】2018 遊戲輪盤規則

| 編號  | 20  | 19  |18  | 17  | 16~2  | 1  |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 份數  | 69  | 20  | 10  | 5  |1   | 1  |  

請移除獎品名稱與 icon，僅單純顯示編號，已經被抽到的獎項，就不可再次出現

【特定技術】以上兩個遊戲轉盤，不可直接寫死樣式在網頁上，請將品項以「JSON」格式來儲存，再藉由 JS 跑迴圈依序顯示獎項在輪盤上，此舉用意為若日後輪盤會新增獎項時，只要在 JSON 格式上新增即可。

【特定技術】點選中間的「PRESS」後，指針開始滾動，滾動到一定時間後，就會停止並指向到獎項上。

【特定技術】請考量中獎機率，以 2018 來說，總計有 120 份獎品，所以編號 1 的獎品第一次抽中機率是 1/120，而隨著品項變少也會跟著重新計算中獎率。  
 
 ## 預先練習 - 使用 CSS 畫出扇形 
  ![image]( https://github.com/HuiyuLiz/vue-lucky-wheel/blob/master/jpg/DEMO-CSS.jpg)  
 畫出扇形的方式有很多種，因為上個 Side Project 才剛用過 Canvas ，所以這次想先用 CSS 試排版面看看，再接著實作功能。找了一些圓餅圖之類的關鍵字，剛好搜尋到了這篇，<a href="https://blog.csdn.net/a5534789/article/details/80102048" target="_blank">【CSS】繪製一個任意角度的扇形</a>，
 切版時運用到了 CSS 中的 transform 屬性 : rotate(旋轉)、skewY(傾斜)、transform-origin(設定元素變化的原點)。  
 
 另外發現了用兩個顏色處理圓餅圖設計的話，如果資料顯示為奇數，第一個跟最後一個扇形會呈現相同顏色，因此設計稿多了Movie的選項(獎品變成 6 項)。
 ```html
   <div class="container" style="transform:rotate(-30deg)">
    <div class="item item-skew">
      <div class="item-content">
        <i class="material-icons">
          cake
        </i>
        <span>Wish </span>
      </div>
    </div>
  </div>
 ```  
 以下為SCSS，使用 Material Design Icons  
 
 ```scss
 .container {
  display: block;
  width: 520px;
  height: 520px;
  border-radius: 520px;
  overflow: hidden;
  position: relative;
  background-color: #f0beff;
}

.item {
  position: absolute;
  display: flex;
  width: 50%;
  height: 50%;
  border: 2px solid #1f1172;
  color: #f0beff;
  background-color: #343baa;
  top: 0;
  right: 0;
  transform-origin: 0% 100%;
  justify-content: center;
  align-items: center;
}

.item-skew:nth-child(1) {
  -webkit-transform: rotate(60deg) skewY(-30deg);
  transform: rotate(60deg) skewY(-30deg);
}

.item-content {
  display: flex;
  width: 100px;
  align-items: center;
  flex-direction: column;
  font-size: 2rem;
  font-weight: bold;
  transform-origin: center center;
  //skewY(90 - 60 deg) rotate(60 / 2deg) translate(-95px, 62px)
  transform: skewY(30deg) rotate(30deg) translate(-95px, 62px);
  position: absolute;
  right: 0;
  bottom: 0;

  i {
    font-size: 4rem;
  }
}
 ```
  ## 運用SCSS 中的 @for 算出各個角度
  
  用 CSS 只能一個一個計算角度，邊按計算機邊算到一半的時候，想到可以用 SCSS 的 for 迴圈處理。

```scss
//$n:輪盤數量；$deg每個項目角度
$n: 6;
@for $i from 1 through $n {
  $deg: 360deg / $n;
  .item-skew:nth-child(#{$i}) {
    transform: rotate($deg * $i) skewY($deg - 90);
  }
}
```
編譯出來的CSS:
```css
.item-skew:nth-child(1) {
  -webkit-transform: rotate(60deg) skewY(-30deg);
          transform: rotate(60deg) skewY(-30deg);
}

.item-skew:nth-child(2) {
  -webkit-transform: rotate(120deg) skewY(-30deg);
          transform: rotate(120deg) skewY(-30deg);
}

.item-skew:nth-child(3) {
  -webkit-transform: rotate(180deg) skewY(-30deg);
          transform: rotate(180deg) skewY(-30deg);
}

.item-skew:nth-child(4) {
  -webkit-transform: rotate(240deg) skewY(-30deg);
          transform: rotate(240deg) skewY(-30deg);
...          
```
本來得獎背景也考慮用 for 迴圈製作，但呈現出來的是不規律有時還黏在一起的 icon，於是重新照著設計圖一個一個算位置，for 迴圈改用在亂數產生微動畫，附上只有切版的 <a href="https://codepen.io/liscodecode/pen/qvzrzZ" target="_blank">CodePen</a>。  

  ## 如何抽獎呢?  
  
 ![image]( https://github.com/HuiyuLiz/vue-lucky-wheel/blob/master/jpg/DEMO-FINISH.jpg)  
 
  【獎品角度用資料綁定】切完版後看著畫面開始思考，如何讓指針旋轉到哪個獎品就會顯示中獎；像是 2017 年設計稿共有 6 種獎品，平分360°後每一份獎品佔60°，另外旋轉角度分別是60°、120°、180°、240°、300°、360°，將原本試排角度用的 SCSS 移除，把旋轉角度資料使用 Vue.js 新增到原本的獎品項目中，將資料綁訂至畫面和 CSS 屬性上。     
  
  原本的獎品格式 :
  ```json
  [{
    "name": "Wish",
    "icon": "cake",
    "count": 5
  }]
  ```
 
  更新後的獎品格式 :  
    
  ```json
  [{
    "name": "Wish",
    "icon": "cake",
    "count": 5,
    "rotate":60
  }]
  ```  
  【指針旋轉】以 2017 年的 6 項獎品為例，將索引數產生陣列編號 numbers : [0,1,2,3,4,5]，從 numbers 隨機取出數字進行角度運算，指針旋轉動畫用 CSS 的 transition 控制，畫面重設時移除 transition ，避免會產生指針倒轉的情形，角度計算方法如下。
  ```vue.js
      ...
      // 取出 0-6之間隨機整數
      vm.index = vm.numbers[Math.floor(Math.random() * vm.numbers.length)]
      console.log('1.剩餘牌號', vm.numbers)

      // 預先旋轉四圈
      let circle = 4
      let degree
      //degree=初始角度 + 旋轉4圈 + 獎品旋轉角度[隨機數] - 餘數
      degree = vm.start_deg + circle * 360 + vm.prize_rotate[vm.index] - vm.start_deg % 360

      // 將初始角度 start_deg:0度 = 旋轉後的角度 degree，下次執行從當下角度開始
      vm.start_deg = degree
      vm.current_year === 2017 ? vm.rotate_deg = `rotate(${degree}deg)` : vm.rotate_deg = `rotate(${degree - vm.each_deg / 2}deg)`

      vm.prize_transition = `all ${vm.duration / 1000}s cubic-bezier(0.42, 0, 0.2, 0.91)`
      ...
  ```  
   【抽獎方式】從 numbers 中隨機挑選的數字命名為 index ，指定為抽中獎品的索引數，如: vm.prizes[vm.index]，抽中的獎項會新增 active 的 class，獎品抽完的索引數將不再出現，直到全數抽完，重新 R。
  
  ```vue.js
      ...
      //等指針旋轉過後才顯示中獎
      setTimeout(() => {
        vm.$refs.item[vm.index].classList.value = "item active"
      }, vm.duration);
      ... 
      let prize = vm.prizes[vm.index]
      vm.prize_name = prize.name //背景得獎名稱
      vm.prize_icon = prize.icon //背景得獎icon
      ...
  ```        
      
           
 


  ## 參考資料 
  <a href="https://github.com/landluck/lucky_wheel" target="_blank">vue js 幸運大轉盤</a>。  
  <a href="https://www.bilibili.com/video/av18751303/?spm_id_from=333.788.videocard.6" target="_blank">商城必備技術之轉盤抽獎系統(程式90:00開始，使用jQuery)</a>。  
  <a href="https://pjchender.blogspot.com/2017/05/vue-vue-reactivity.html" target="_blank">[那些關於 Vue 的小細節 ] 為什麼畫面沒有隨資料更新 - Vue 響應式原理（Reactivity）
</a>。      
  
  



 
