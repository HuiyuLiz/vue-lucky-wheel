let app = new Vue({
  el: '#app',
  data: {
    data: [],
    prizes: [],
    prizes_2017: [],
    prizes_2018: [],
    prize_name: '',
    prize_icon: '',
    prize_rotate: [],
    prize_transition: '',
    each_deg: 0,
    rotate_deg: 0,
    start_deg: 0,
    skewY: 0,
    container_deg: 0,
    current_deg: 0,
    index: 0,
    current_year: 2017,
    duration: 3000,
    time_remaining: 20,
    num: 0,
    numbers: [],//紀錄還有獎品的編號
    isToggle: false,//顯示隱藏按鈕
    isClicked: false,//轉動中禁止觸發  
    isShow: true,
  },
  mounted() {
    let vm = this
    vm.initPrize()
  },
  watch: {
    current_year: {
      handler: 'restart',
    }
  },
  methods: {
    prizeActive() {
      // 抽到獎品後變更 item 的 css
      let vm = this
      setTimeout(() => {
        vm.$refs.item[vm.index].classList.value = "item active"
      }, vm.duration);
      console.log('item active')
    },
    setCurrentYear(year) {
      let vm = this
      if (vm.isClicked) return
      vm.current_year = year
    },
    restart() {
      let vm = this
      vm.$refs.item[vm.index].classList.value = "item"
      if (vm.current_year === 2017) {
        vm.time_remaining = 20
        vm.reset()
        vm.initPrize()
      } else if (vm.current_year === 2018) {
        vm.time_remaining = 120
        vm.reset()
        vm.initPrize_2018()
      }
    },
    reset() {
      let vm = this
      vm.isShow = true
      vm.index = 0
      vm.prize_name = ''
      vm.prize_icon = ''
      vm.prize_rotate = []
      vm.numbers = []
      vm.start_deg = 0
      vm.rotate_deg = `rotate(0deg)`
      vm.current_deg = 0
      vm.isClicked = false
      vm.prize_transition = `none`;
      console.log('RESET')
    },
    initPrize() {
      let vm = this
      axios.get('./prize20.json')
        .then(function (response) {
          let data = JSON.parse(response.request.responseText)
          vm.data = data
          vm.num = vm.data.length
          vm.degree(vm.num)
          let prize_array = []
          vm.data.forEach((prize, i) => {
            let item = {}
            vm.prize_rotate.forEach((deg, j) => {
              if (i === j) {
                item.name = prize.name
                item.icon = prize.icon
                item.count = prize.count
                item.rotate = deg
                prize_array.push(item)
              }
            })
          })
          vm.container_deg = (vm.each_deg / 2) * -1
          vm.prizes_2017 = prize_array
          vm.prizes = vm.prizes_2017
          vm.numberArray()
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    initPrize_2018() {
      let vm = this
      let prizes = []
      for (let i = 1; i <= 120; i++) {
        let item = {}
        if (i === 1) {
          item.name = 1
          item.count = 1
          prizes.push(item)
        } else if (i > 1 && i <= 16) {
          item.name = i
          item.count = 1
          prizes.push(item)
        } else if (i === 17) {
          item.name = i
          item.count = 5
          prizes.push(item)
        } else if (i === 18) {
          item.name = i
          item.count = 10
          prizes.push(item)
        } else if (i === 19) {
          item.name = i
          item.count = 20
          prizes.push(item)
        } else if (i === 20) {
          item.name = i
          item.count = 69
          prizes.push(item)
        }
      }
      vm.data = prizes
      vm.num = vm.data.length
      vm.degree(vm.num)
      let prize_array = []
      vm.data.forEach((prize, i) => {
        let item = {}
        vm.prize_rotate.forEach((deg, j) => {
          if (i === j) {
            item.name = prize.name
            item.count = prize.count
            item.rotate = deg
            prize_array.push(item)
          }
        })
      })
      vm.container_deg = vm.each_deg * -1
      vm.prizes_2018 = prize_array
      vm.prizes = vm.prizes_2018
      vm.numberArray()
    },
    degree(num) {
      // 計算每個轉盤角度
      let vm = this
      for (let i = 1; i <= num; i++) {
        let deg = 360 / num
        vm.each_deg = deg
        vm.skewY = 90 - deg
        let eachDeg
        eachDeg = i * deg
        vm.prize_rotate.push(eachDeg)
      }
    },
    numberArray() {
      // 產生獎品 index 編號 => [0,1,2,3,4,5]
      let vm = this
      vm.numbers = vm.prizes.map((prize, index) => {
        return index
      })
    },
    rotateHandler(num) {
      let vm = this
      // 刪去沒有獎品的 index
      vm.prizes.filter((prize, index) => {
        let filterArray
        if (prize.count <= 0) {
          let filterArray = vm.numbers.filter((num) => {
            return num !== index
          })
          vm.numbers = filterArray
        }
      })
      // 執行旋轉
      if (vm.time_remaining > 0) {
        vm.$refs.item[vm.index].classList.value = "item"
        vm.prize_draw(num)
      } else if (vm.time_remaining <= 0) {
        vm.$refs.item[vm.index].classList.value = "item"
        vm.restart()
      }
    },
    prize_draw(num) {
      // 執行抽獎
      let vm = this
      if (vm.isClicked) return
      vm.isShow = vm.isClicked

      // 移除抽到獎品 active 狀態
      vm.$refs.item[vm.index].classList.value = 'item'

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
      vm.time_remaining--
      vm.isClicked = true

      // 取當下開始角度的餘數，與輪盤角度比對(除錯用)
      let remainder = vm.start_deg % 360
      if (remainder <= 0) {
        // 為了不產生負數或0，加360
        vm.current_year === 2017 ? vm.current_deg = remainder + 360 : remainder + 360 - vm.each_deg / 2
      } else if (remainder > 0) {
        vm.current_year === 2017 ? vm.current_deg = remainder : vm.current_deg = remainder - vm.each_deg / 2
      }
      console.log('2.執行旋轉', degree, 'index', vm.index)

      // 將vm.index設為抽中獎品索引數，獎品抽完的索引數將不再出現，直到獎品全數抽完，重新 RESET
      let prize = vm.prizes[vm.index]
      vm.prize_name = prize.name
      vm.prize_icon = prize.icon
      if (vm.current_year === 2018) {
        vm.prize_icon = "card_giftcard"
      }
      vm.prizeActive()
      setTimeout(() => {
        prize.count--
        console.log('3.旋轉角度:', vm.current_deg, '獎品:', prize.name, '獎品角度:', prize.rotate, '剩餘數量:', prize.count, ' index', vm.index)
      }, vm.duration);

      // 點選動畫結束後，將"已點選"改回"未點選"
      setTimeout(() => {
        if (vm.isClicked === true) {
          vm.isClicked = false
        }
      }, vm.duration);
    }
  },
})
