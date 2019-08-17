
export interface DeviceInfo {
    isDroid: boolean
    isDroidPhone: boolean
    isDroidTablet: boolean
    isWindowsPhone: boolean
    isIos: boolean
    isIpad: boolean
    isDevice: boolean
    isEdge: boolean
    isIE: boolean
    isIE11: boolean
    isPhone: boolean
    isTablet: boolean
    isFirefox: boolean
    isSafari: boolean
    isOpera: boolean
    isChrome: boolean
    isDesktop: boolean
    connection: ConnectionSpeed
    perf: PerformanceSpeed
    useNative: boolean
}

export enum ConnectionSpeed {
    SPEED_BAD = 0,
    SPEED_GOOD = 1,
    SPEED_HIGH = 2
}

export enum PerformanceSpeed {
    PERF_BAD = 0,
    PERF_LOW = 1,
    PERF_GOOD = 2,
    PERF_HIGH = 3
}

export function getDeviceInfos() {
    var e = navigator.userAgent.toLowerCase(),
        t = navigator.appVersion.toLowerCase(),
        n = /windows phone|iemobile|wpdesktop/.test(e),
        i = !n && /android.*mobile/.test(e),
        r = !n && !i && /android/i.test(e),
        o = i || r,
        //@ts-ignore
        a = !n && /ip(hone|od|ad)/i.test(e) && !window.MSStream,
        s = !n && /ipad/i.test(e) && a,
        l = r || s,
        u = i || (a && !s) || n,
        c = u || l,
        h = e.indexOf("firefox") > -1,
        d = !!e.match(/version\/[\d\.]+.*safari/),
        f = e.indexOf("opr") > -1,
        //@ts-ignore
        p = !window.ActiveXObject && "ActiveXObject" in window,
        m = t.indexOf("msie") > -1 || p || t.indexOf("edge") > -1,
        v = e.indexOf("edge") > -1,
        g =
            //@ts-ignore
            null !== window.chrome &&
            //@ts-ignore
            void 0 !== window.chrome &&
            "google inc." == navigator.vendor.toLowerCase() &&
            !f &&
            !v;

    let info = {
        isDroid: o,
        isDroidPhone: i,
        isDroidTablet: r,
        isWindowsPhone: n,
        isIos: a,
        isIpad: s,
        isDevice: c,
        isEdge: v,
        isIE: m,
        isIE11: p,
        isPhone: u,
        isTablet: l,
        isFirefox: h,
        isSafari: d,
        isOpera: f,
        isChrome: g,
        isDesktop: !u && !l
    } as DeviceInfo;

    getConnectionSpeed(info);
    getPerformanceSpeed(info);

    return info;
}

export function getConnectionSpeed(P: DeviceInfo) {
    let e = P.isDesktop ? ConnectionSpeed.SPEED_GOOD : ConnectionSpeed.SPEED_BAD;
    //@ts-ignore
    let connection = navigator.connection;
    if (connection)
        switch (connection.effectiveType) {
            case "4g":
                e = ConnectionSpeed.SPEED_HIGH;
                break;
            case "3g":
                e = ConnectionSpeed.SPEED_GOOD;
                break;
            case "2g":
                e = ConnectionSpeed.SPEED_BAD
        }
    P.connection = e,
        console.log("App.connection", P.connection)
}

export function getPerformanceSpeed(P: DeviceInfo) {
    let e = 0;
    let t = PerformanceSpeed.PERF_BAD;
    let n = (window.performance || Date).now();
    for (let i = 0; 2e4 > i; i++) {
        e = Math.pow(Math.sin(Math.random()), 2);
    }
    let r = (window.performance || Date).now();
    let o = r - n;

    t = P.isTablet || P.isIE ? PerformanceSpeed.PERF_BAD : 7 > o ? PerformanceSpeed.PERF_HIGH : 14 > o ? PerformanceSpeed.PERF_GOOD : 22 > o ? PerformanceSpeed.PERF_LOW : PerformanceSpeed.PERF_BAD;
    P.perf = t;
    P.useNative = P.isDevice || P.perf < PerformanceSpeed.PERF_GOOD;
    console.log("App.perf", P.perf);
}
