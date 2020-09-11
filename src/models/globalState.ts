import { observable, action, intercept } from "mobx";

interface UserData {
  userID?: number;
  userName?: string;
}

interface GlobalState {
  userData: UserData;
  setUserData(userData: UserData): void;
}

class globalState implements GlobalState {
  @observable userData: UserData = {};

  @action
  setUserData(userData: UserData) {
    this.userData = userData;
  }
}

// eslint-disable-next-line import/prefer-default-export
export { globalState };
