import { UIStore } from "./uiStore";
import { computed, reaction } from "mobx";
import { getDeviceInfos } from "../functions/sniffer";

export interface ISerializableStore {
    name: string;
}

export class AppStore implements ISerializableStore {
    name: string;
    uiStore: UIStore;

    constructor() {
        this.name = "AppStores"
        this.uiStore = new UIStore();

    }
}
