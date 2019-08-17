import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";

export function observerWithRouter(target: React.ComponentType): any {
    return withRouter(observer(target as any));
}
