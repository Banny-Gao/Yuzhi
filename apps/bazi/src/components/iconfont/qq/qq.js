Component({
  properties: {
    // icon-shezhi | icon-record | icon-bagua | icon-wode
    name: {
      type: String,
    },
    // string | string[]
    color: {
      type: null,
      observer: function (color) {
        this.setData({
          isStr: typeof color === 'string',
        })
      },
    },
    size: {
      type: Number,
      value: 20,
      observer: function (size) {
        this.setData({
          svgSize: (size / 750) * qq.getWindowInfo().windowWidth,
        })
      },
    },
  },
  data: {
    svgSize: (20 / 750) * qq.getWindowInfo().windowWidth,
    quot: '"',
    isStr: true,
  },
})
