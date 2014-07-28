{
    // appDir: './',
    baseUrl: '../',
    optimize: 'none',

    paths: {
        'glmatrix': '../qtek/thirdparty/gl-matrix'
    },
    packages: [
        {
            name: 'zrender',
            location: '../zrender/src',
            main: 'zrender'
        },
        {
            name: 'echarts',
            location: '../echarts/src',
            main: 'echarts'
        },
        {
            name: 'qtek',
            location: '../qtek/src',
            main: 'qtek'
        }
    ],
    include: ['zrender/tool/vector', 'js/index'],

    out: '../release.js'
}