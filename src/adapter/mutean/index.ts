import { runtime } from '../../runtime'
import { iframePlayer, runInTop, parser } from './play'
import './index.scss'

runtime.register({
  domains: ['.mutedm.', '.mutean.', '.mute01.'],
  opts: [
    { test: '/vodplay', run: runInTop },
    { test: '/vodplay', run: iframePlayer.runInIframe, runInIframe: true },
    {
      test: ['/addons/dp/player/dp.php'],
      run: parser,
      runInIframe: true,
    },
  ],
  search: {
    name: 'MuteFun',
    search: (cn) => `https://www.mutean.com/vodsearch/${cn}-------------.html`,
    getSearchName: () => {
      return new Promise((resolve) => {
        const fn = (e: MessageEvent<any>) => {
          if (e.data.key === 'getSearchName') {
            resolve(e.data.name)
            window.removeEventListener('message', fn)
          }
        }
        window.addEventListener('message', fn)
        parent.postMessage({ key: 'getSearchName' }, '*')
      })
    },
    getEpisode: () => {
      return new Promise((resolve) => {
        const fn = (e: MessageEvent<any>) => {
          if (e.data.key === 'getEpisode') {
            resolve(e.data.name)
            window.removeEventListener('message', fn)
          }
        }
        window.addEventListener('message', fn)
        parent.postMessage({ key: 'getEpisode' }, '*')
      })
    },
    getAnimeScope: () =>
      window.location.href.match(/\/vodplay\/(\d+)-/)?.[1] || '',
  },
})
