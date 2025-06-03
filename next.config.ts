// next.config.mjs
import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',    // your TypeScript worker (optional)
  swDest: 'public/sw.js',
})

export default withSerwist({
  // the rest of your Next config
  turbopack: {
    resolveAlias: {
      '@components': './src/components',
    },
    resolveExtensions: ['.ts', '.tsx', '.js', '.jsx'],
    moduleIds: process.env.NODE_ENV === 'production' ? 'deterministic' : 'named',
  },
})