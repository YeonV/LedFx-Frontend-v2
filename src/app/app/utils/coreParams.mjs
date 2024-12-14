import defaultCoreParams from './defaultCoreParams.mjs'
import store from './store.mjs'

const coreParams = store.get('coreParams', defaultCoreParams)

export default coreParams
