import { observable, action, intercept, } from 'mobx'


interface UserData {
  userID?: number;
  userName?: string;
}

interface GlobalState {
  userData: UserData;
  setUserData(userData: UserData): void
}

export class globalState implements GlobalState {
  @observable userData: UserData = {

  }

  @action
  setUserData(userData: UserData) {
    this.userData = userData
  }

}