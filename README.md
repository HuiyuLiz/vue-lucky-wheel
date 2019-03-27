# JavaScript 題目篇 - 新手 JS 地下城
 ![image]( https://github.com/HuiyuLiz/vue-lucky-wheel/blob/master/jpg/DEMO-START.jpg)  
 
 9F - 抽獎轉盤
 <a href="https://huiyuliz.github.io/vue-lucky-wheel/" target="_blank">Demo</a>。

 使用 Vue.js 進行破關。
 
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
 
 ## 練習用 CSS 畫出一個扇形
  ![image]( https://github.com/HuiyuLiz/vue-lucky-wheel/blob/master/jpg/DEMO-CSS.jpg)  
 畫出扇形的方式有很多種，因為上個 Side Project 才剛用過 Canvas ，所以這次想挑戰用 CSS 畫畫看，找了一些圓餅圖之類的關鍵字，剛好搜尋到了這篇，<a href="https://blog.csdn.net/a5534789/article/details/80102048" target="_blank">【CSS】繪製一個任意角度的扇形</a>，
 運用 CSS 中的 transform 屬性 : rotate(旋轉)、skewY(傾斜)、transform-origin(設定元素變化的原點)。
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
  
  當角度算到一半的時候，突然想到還有 SCSS 的 for 迴圈可以用。

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
本來得獎背景也考慮用 for 迴圈製作，但呈現出來的是一團凌亂到處飛的 icon，於是重新照著設計圖一個一個算位置，for 迴圈改用在亂數產生微動畫，附上只有切版的<a href="https://codepen.io/liscodecode/pen/qvzrzZ" target="_blank">CodePen</a>。  

  ## 如何抽獎?
  切完版之後看著畫面開始思考如何製作抽獎，是要用什麼比對得知中獎呢?2017 年共有 6 種獎品，改用 Vue.js 計算出的角度可以得知每一份獎品均分360度後佔60°，另外分別是旋轉60°、120°、180°、240°、300°、360°，把旋轉角度新增到獎品中進行畫面綁定。    
  
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
  
  



 
