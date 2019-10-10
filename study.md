1.
bg-image($url) 
  background: url($url + '@2x.png')
  @media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3)
    background:url($url + '@3x.png')
2.textarea禁止拖动 
  resize:none
3.添加snippet 
shift+ctrl+p —————— 输入snippet —————— 点击open user snippet 选择所需要的语言 —————— 其中如果想要同时修改相同的内容，可以使用${1:label} ,添加到相同的内容区域。
4.lazyload
5.better-scroll

6.
// 不换行
no-wrap()
  text-overflow: ellipsis
  overflow: hidden
  white-space: nowrap
7. background-size cover
8. this.$router.back()
9. probeType: 1：滚动的时候会派发scroll事件，会截流。2：滚动的时候实时派发scroll事件，不会截流。 3：除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
10. 检测域名 ipconfig/all
11. host: '192.168.1.189',
    port: '8080'
12. // eslint-disable-next-line
13. v-html=""
14. align-items center
15. 随机数的一个产生的方式
Math.random()*(n-m+1)+m 取[m,n)之间的一个随机数
16.
var fruits = ["Banana", "Orange", "Lemon", "Apple", "Mango"];
var citrus = fruits.slice()
console.log(citrus)  // ["Banana", "Orange", "Lemon", "Apple", "Mango"]