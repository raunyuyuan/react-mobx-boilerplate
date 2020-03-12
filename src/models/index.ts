import React from 'react'
import { MobXProviderContext } from 'mobx-react'
import {globalState} from './globalState'

export const Store = {
  globalState: new globalState()
} 

export function useStores() {
  return React.useContext(MobXProviderContext) as typeof Store
}