{
    // appDir: './',
    baseUrl: '../',
    // optimize: 'none',

    paths: {
        'echarts': 'lib/echarts-original',
        'echarts/chart/line': 'lib/echarts-original',
        'echarts/chart/bar': 'lib/echarts-original',
        'echarts/chart/scatter': 'lib/echarts-original',
        'echarts/chart/k': 'lib/echarts-original',
        'echarts/chart/pie': 'lib/echarts-original',
        'echarts/chart/radar': 'lib/echarts-original',
        'echarts/chart/chord': 'lib/echarts-original',
        'echarts/chart/gauge': 'lib/echarts-original',
        'echarts/chart/funnel': 'lib/echarts-original',
        'zrender': 'lib/echarts-original',
        'zrender/shape/Base': 'lib/echarts-original',
        'zrender/shape/Line': 'lib/echarts-original',
        'zrender/shape/Text': 'lib/echarts-original',

        'qtek': 'lib/qtek.amd',
        'qtek/math/Matrix4': 'lib/qtek.amd',
        'qtek/math/Vector3': 'lib/qtek.amd',
        'qtek/math/Vector4': 'lib/qtek.amd',
        'qtek/Node': 'lib/qtek.amd',
        'qtek/camera/Perspective': 'lib/qtek.amd',
        'qtek/core/mixin/notifier': 'lib/qtek.amd',
        'qtek/core/util': 'lib/qtek.amd',
        'glmatrix': 'lib/qtek.amd'
    },

    include: ['js/index'],

    out: '../release.js'
}