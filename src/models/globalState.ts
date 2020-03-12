import { types, Instance, SnapshotOut} from "mobx-state-tree";

const userModel = types.model({
  userID: types.number,
  userName: types.string
})

interface UserData extends SnapshotOut<typeof userModel> {}


export const globalStore = types
  .model({
    user: userModel
  })
  .actions(self => ({
    add(userData: UserData) {
      self.user = userData
    }
  }))

export interface NumbersType extends Instance<typeof globalStore> {}
