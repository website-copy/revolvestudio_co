import * as React from "react";

export function getWrappedRef<T>(ref: React.RefObject<T>): T {
    return (ref.current as any).wrappedInstance
}
