import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
// import styleImport from 'vite-plugin-style-import'
import compressPlugin from 'vite-plugin-compression'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import WindiCSS from 'vite-plugin-windicss'

// 配置别名函数
function pathResolve(dir) {
  return resolve(__dirname, '.', dir)
}

function configCompressPlugin(
  compress: 'gzip' | 'brotli' | 'none',
  deleteOriginFile = false,
): Plugin | Plugin[] {
  const compressList = compress.split(',');

  const plugins: Plugin[] = [];

  if (compressList.includes('gzip')) {
    plugins.push(
      compressPlugin({
        ext: '.gz',
        deleteOriginFile,
      }),
    );
  }

  if (compressList.includes('brotli')) {
    plugins.push(
      compressPlugin({
        ext: '.br',
        algorithm: 'brotliCompress',
        deleteOriginFile,
      }),
    );
  }
  return plugins;
}

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  // 配置需要使用的插件列表，这里将vue添加进去
  plugins: [
    vue(),
    WindiCSS(),
    configCompressPlugin('gzip'),
    Components({
      resolvers: [
        AntDesignVueResolver(),
      ],
    })
    // styleImport({
    //   libs: [{
    //     libraryName: 'ant-design-vue',
    //     esModule: true,
    //     resolveStyle: (name) => {
    //       return `ant-design-vue/es/${name}/style/css`;
    //     },
    //   }]
    // })
  ],
  // 配置文件别名 vite1.0是/@/  2.0改为/@
  // 这里是将src目录配置别名为 /@ 方便在项目中导入src目录下的文件
  resolve: {
    alias: {
      '@': pathResolve('src')
    }
  },
  // 强制预构建插件包
  // optimizeDeps: {
  //     include: ['axios'],
  // },
  // 打包配置
  build: {
    target: 'modules',
    outDir: 'dist', //指定输出路径
    assetsDir: 'assets', // 指定生成静态资源的存放路径
    minify: 'terser', // 混淆器，terser构建后文件体积更小
    chunkSizeWarningLimit:1000,
    // rollupOptions: {
    //   output: {
    //     manualChunks(id) {
    //       if (id.includes('node_modules')) {
    //         return id.toString().split('node_modules/')[1].split('/')[0].toString()
    //       }
    //     }
    //   }
    // }
  },
  // 本地运行配置，及反向代理配置
  server: {
    host: '0.0.0.0',
    // hmr: { overlay: false },
    cors: true, // 默认启用并允许任何源
    open: true, // 在服务器启动时自动在浏览器中打开应用程序
    //反向代理配置，注意rewrite写法，开始没看文档在这里踩了坑
    proxy: {
      '/ctis': {
        // target:'http://ctisv2.zhiguxingtu.com/',
        // target: 'http://ctisv2-test.zhiguxingtu.com', //代理接口
        target: 'http://ctisv2-dev.zhiguxingtu.com',
        // target: 'http://172.16.10.62:8804',//本地开发服务器
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
