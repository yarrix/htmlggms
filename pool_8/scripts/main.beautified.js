"use strict";

function fetchLocal(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            resolve(new Response(xhr.response, {
                status: xhr.status
            }));
        };
        xhr.onerror = function() {
            reject(new TypeError("Local request failed"));
        };
        xhr.open("GET", url);
        xhr.responseType = "arraybuffer";
        xhr.send(null);
    });
}

function u(f, a, b, d) {
    f.v.rc(f.bb, a, b, d, void 0);
}

function F(f, a, b, d) {
    f.v.ca ? u(f, a, b, d) : f.v.hf()._OnMessageFromDOM({
        type: "event",
        component: f.bb,
        handler: a,
        dispatchOpts: d || null,
        data: b,
        responseId: null
    });
}

function H(f, a, b) {
    f.v.C(f.bb, a, b);
}

function I(f, a) {
    for (const [ b, d ] of a) H(f, b, d);
}

function K(f) {
    f.Sb || (f.v.Te(f.de), f.Sb = !0);
}

window.Ba = class {
    constructor(f, a) {
        this.v = f;
        this.bb = a;
        this.Sb = !1;
        this.de = () => this.Ea();
    }
    jd() {}
    Ea() {}
};

function L(f) {
    -1 !== f.Ra && (self.clearTimeout(f.Ra), f.Ra = -1);
}

window.Ke = class {
    constructor(f, a) {
        this.Qc = f;
        this.vg = a;
        this.Ra = -1;
        this.Tb = -Infinity;
        this.ee = () => {
            this.Ra = -1;
            this.Tb = Date.now();
            this.hb = !0;
            this.Qc();
            this.hb = !1;
        };
        this.Nd = this.hb = !1;
    }
    c() {
        L(this);
        this.ee = this.Qc = null;
    }
};

"use strict";

function N(f, a) {
    H(f, "get-element", b => {
        const d = f.ba.get(b.elementId);
        return a(d, b);
    });
}

window.Qg = class extends self.Ba {
    constructor(f, a) {
        super(f, a);
        this.ba = new Map();
        this.Pc = !0;
        I(this, [ [ "create", () => {
            throw Error("required override");
        } ], [ "destroy", b => {
            {
                b = b.elementId;
                const d = this.ba.get(b);
                this.Pc && d.parentElement.removeChild(d);
                this.ba.delete(b);
            }
        } ], [ "set-visible", b => {
            this.Pc && (this.ba.get(b.elementId).style.display = b.isVisible ? "" : "none");
        } ], [ "update-position", b => {
            if (this.Pc) {
                var d = this.ba.get(b.elementId);
                d.style.left = b.left + "px";
                d.style.top = b.top + "px";
                d.style.width = b.width + "px";
                d.style.height = b.height + "px";
                b = b.fontSize;
                null !== b && (d.style.fontSize = b + "em");
            }
        } ], [ "update-state", b => {
            this.ba.get(b.elementId);
            throw Error("required override");
        } ], [ "focus", b => this.Jc(b) ], [ "set-css-style", b => {
            this.ba.get(b.elementId).style[b.prop] = b.val;
        } ], [ "set-attribute", b => {
            this.ba.get(b.elementId).setAttribute(b.name, b.val);
        } ], [ "remove-attribute", b => {
            this.ba.get(b.elementId).removeAttribute(b.name);
        } ] ]);
        N(this, b => b);
    }
    Jc(f) {
        var a = this.ba.get(f.elementId);
        f.focus ? a.focus() : a.blur();
    }
};

"use strict";

{
    const f = /(iphone|ipod|ipad|macos|macintosh|mac os x)/i.test(navigator.userAgent);
    let a = 0;
    function b(g) {
        const c = document.createElement("script");
        c.async = !1;
        c.type = "module";
        return g.Gg ? new Promise(k => {
            const l = "c3_resolve_" + a;
            ++a;
            self[l] = k;
            c.textContent = g.Kg + `\n\nself["${l}"]();`;
            document.head.appendChild(c);
        }) : new Promise((k, l) => {
            c.onload = k;
            c.onerror = l;
            c.src = g;
            document.head.appendChild(c);
        });
    }
    let d = !1, h = !1;
    function m() {
        if (!d) {
            try {
                new Worker("blob://", {
                    get type() {
                        h = !0;
                    }
                });
            } catch (g) {}
            d = !0;
        }
        return h;
    }
    let p = new Audio();
    const x = {
        "audio/webm; codecs=opus": !!p.canPlayType("audio/webm; codecs=opus"),
        "audio/ogg; codecs=opus": !!p.canPlayType("audio/ogg; codecs=opus"),
        "audio/webm; codecs=vorbis": !!p.canPlayType("audio/webm; codecs=vorbis"),
        "audio/ogg; codecs=vorbis": !!p.canPlayType("audio/ogg; codecs=vorbis"),
        "audio/mp4": !!p.canPlayType("audio/mp4"),
        "audio/mpeg": !!p.canPlayType("audio/mpeg")
    };
    p = null;
    async function A(g) {
        g = await B(g);
        return new TextDecoder("utf-8").decode(g);
    }
    function B(g) {
        return new Promise((c, k) => {
            const l = new FileReader();
            l.onload = n => c(n.target.result);
            l.onerror = n => k(n);
            l.readAsArrayBuffer(g);
        });
    }
    const v = [];
    let w = 0;
    window.RealFile = window.File;
    const C = [], G = new Map(), z = new Map();
    let J = 0;
    const D = [];
    self.runOnStartup = function(g) {
        if ("function" !== typeof g) throw Error("runOnStartup called without a function");
        D.push(g);
    };
    const M = new Set([ "cordova", "playable-ad", "instant-games" ]);
    let e = !1;
    window.ma = class g {
        constructor(c) {
            this.ca = c.Mg;
            this.pa = null;
            this.F = "";
            this.ec = c.Jg;
            this.wb = {};
            this.Ka = this.vb = null;
            this.Qb = [];
            this.kb = this.G = this.Pa = null;
            this.Oa = -1;
            this.Ag = () => this.Gf();
            this.Na = [];
            this.s = c.fe;
            this.ib = "file" === location.protocol.substr(0, 4);
            !this.ca || "undefined" !== typeof OffscreenCanvas && navigator.userActivation && m() || (this.ca = !1);
            if ("playable-ad" === this.s || "instant-games" === this.s) this.ca = !1;
            if ("cordova" === this.s && this.ca) if (/android/i.test(navigator.userAgent)) {
                const k = /Chrome\/(\d+)/i.exec(navigator.userAgent);
                k && 90 <= parseInt(k[1], 10) || (this.ca = !1);
            } else this.ca = !1;
            this.Vb = this.ha = null;
            "html5" !== this.s && "playable-ad" !== this.s || !this.ib;
            "html5" !== this.s || window.isSecureContext || console.warn("[Construct 3] Warning: the browser indicates this is not a secure context. Some features may be unavailable. Use secure (HTTPS) hosting to ensure all features are available.");
            this.C("runtime", "cordova-fetch-local-file", k => this.qf(k));
            this.C("runtime", "create-job-worker", () => this.rf());
            "cordova" === this.s ? document.addEventListener("deviceready", () => this.Ad(c)) : this.Ad(c);
        }
        c() {
            this.xc();
            this.pa && (this.pa = this.pa.onmessage = null);
            this.vb && (this.vb.terminate(), this.vb = null);
            this.Ka && (this.Ka.c(), this.Ka = null);
            this.G && (this.G.parentElement.removeChild(this.G), this.G = null);
        }
        Fe() {
            return f && "cordova" === this.s;
        }
        qc() {
            const c = navigator.userAgent;
            return f && M.has(this.s) || navigator.standalone || /crios\/|fxios\/|edgios\//i.test(c);
        }
        async Ad(c) {
            "macos-wkwebview" === this.s && this.Nc({
                type: "ready"
            });
            if ("playable-ad" === this.s) {
                this.ha = self.c3_base64files;
                this.Vb = {};
                await this.Ye();
                for (let l = 0, n = c.Sa.length; l < n; ++l) {
                    var k = c.Sa[l].toLowerCase();
                    this.Vb.hasOwnProperty(k) ? c.Sa[l] = {
                        Gg: !0,
                        Kg: this.Vb[k]
                    } : this.ha.hasOwnProperty(k) && (c.Sa[l] = URL.createObjectURL(this.ha[k]));
                }
            }
            c.Bg ? this.F = c.Bg : (k = location.origin, this.F = ("null" === k ? "file:///" : k) + location.pathname, 
            k = this.F.lastIndexOf("/"), -1 !== k && (this.F = this.F.substr(0, k + 1)));
            c.Og && (this.wb = c.Og);
            k = new MessageChannel();
            this.pa = k.port1;
            this.pa.onmessage = l => this._OnMessageFromRuntime(l.data);
            window.c3_addPortMessageHandler && window.c3_addPortMessageHandler(l => this.Cf(l));
            this.kb = new self.Ge(this);
            await O(this.kb);
            "object" === typeof window.StatusBar && window.StatusBar.hide();
            "object" === typeof window.AndroidFullScreen && window.AndroidFullScreen.immersiveMode();
            this.ca ? await this.kf(c, k.port2) : await this.jf(c, k.port2);
        }
        Ac(c) {
            c = this.wb.hasOwnProperty(c) ? this.wb[c] : c.endsWith("/workermain.js") && this.wb.hasOwnProperty("workermain.js") ? this.wb["workermain.js"] : "playable-ad" === this.s && this.ha.hasOwnProperty(c.toLowerCase()) ? this.ha[c.toLowerCase()] : c;
            c instanceof Blob && (c = URL.createObjectURL(c));
            return c;
        }
        async kc(c, k, l) {
            if (c.startsWith("blob:")) return new Worker(c, l);
            if ("cordova" === this.s && this.ib) return c = await this.xb(l.Fg ? c : this.ec + c), 
            new Worker(URL.createObjectURL(new Blob([ c ], {
                type: "application/javascript"
            })), l);
            c = new URL(c, k);
            if (location.origin !== c.origin) {
                c = await fetchLocal(c);
                if (!c.ok) throw Error("failed to fetch worker script");
                c = await c.blob();
                return new Worker(URL.createObjectURL(c), l);
            }
            return new Worker(c, l);
        }
        wa() {
            return Math.max(window.innerWidth, 1);
        }
        va() {
            return Math.max(window.innerHeight, 1);
        }
        zd(c) {
            var k = this.kb;
            return {
                baseUrl: this.F,
                windowInnerWidth: this.wa(),
                windowInnerHeight: this.va(),
                devicePixelRatio: window.devicePixelRatio,
                isFullscreen: g.Wa(),
                projectData: c.Vg,
                previewImageBlobs: window.cr_previewImageBlobs || this.ha,
                previewProjectFileBlobs: window.cr_previewProjectFileBlobs,
                previewProjectFileSWUrls: window.cr_previewProjectFiles,
                swClientId: window.Tg || "",
                exportType: c.fe,
                isDebug: -1 < self.location.search.indexOf("debug"),
                ife: !!self.Ug,
                jobScheduler: {
                    inputPort: k.Wc,
                    outputPort: k.bd,
                    maxNumWorkers: k.xg
                },
                supportedAudioFormats: x,
                opusWasmScriptUrl: window.cr_opusWasmScriptUrl || this.ec + "opus.wasm.js",
                opusWasmBinaryUrl: window.cr_opusWasmBinaryUrl || this.ec + "opus.wasm.wasm",
                isFileProtocol: this.ib,
                isiOSCordova: this.Fe(),
                isiOSWebView: this.qc(),
                isFBInstantAvailable: "undefined" !== typeof self.FBInstant
            };
        }
        async kf(c, k) {
            var l = this.Ac(c.Ng);
            this.vb = await this.kc(l, this.F, {
                type: "module",
                name: "Runtime",
                Fg: !0
            });
            this.G = document.createElement("canvas");
            this.G.style.display = "none";
            l = this.G.transferControlToOffscreen();
            document.body.appendChild(this.G);
            window.c3canvas = this.G;
            let n = c.hd || [], t = c.Sa;
            n = await Promise.all(n.map(q => this.Fa(q)));
            t = await Promise.all(t.map(q => this.Fa(q)));
            if ("cordova" === this.s) for (let q = 0, r = c.ic.length; q < r; ++q) {
                const y = c.ic[q], E = y[0];
                if (E === c.fd || "scriptsInEvents.js" === E || E.endsWith("/scriptsInEvents.js")) y[1] = await this.Fa(E);
            }
            this.vb.postMessage(Object.assign(this.zd(c), {
                type: "init-runtime",
                isInWorker: !0,
                messagePort: k,
                canvas: l,
                workerDependencyScripts: n,
                engineScripts: t,
                projectScripts: c.ic,
                mainProjectScript: c.fd,
                projectScriptsStatus: self.C3_ProjectScriptsStatus
            }), [ k, l, ...P(this.kb) ]);
            this.Qb = C.map(q => new q(this));
            this.yd();
            self.c3_callFunction = (q, r) => this.Pa.lf(q, r);
            "preview" === this.s && (self.goToLastErrorScript = () => this.rc("runtime", "go-to-last-error-script"));
        }
        async jf(c, k) {
            this.G = document.createElement("canvas");
            this.G.style.display = "none";
            document.body.appendChild(this.G);
            window.c3canvas = this.G;
            this.Qb = C.map(q => new q(this));
            this.yd();
            var l = c.Sa.map(q => "string" === typeof q ? new URL(q, this.F).toString() : q);
            Array.isArray(c.hd) && l.unshift(...c.hd);
            l = await Promise.all(l.map(q => this.Fa(q)));
            await Promise.all(l.map(q => b(q)));
            l = self.C3_ProjectScriptsStatus;
            const n = c.fd, t = c.ic;
            for (let [ q, r ] of t) if (r || (r = q), q === n) try {
                r = await this.Fa(r), await b(r), "preview" !== this.s || l[q] || this.Id(q, "main script did not run to completion");
            } catch (y) {
                this.Id(q, y);
            } else if ("scriptsInEvents.js" === q || q.endsWith("/scriptsInEvents.js")) r = await this.Fa(r), 
            await b(r);
            "preview" === this.s && "object" !== typeof self.Pg.Rg ? (this.Jb(), console.error("[C3 runtime] Failed to load JavaScript code used in events. Check all your JavaScript code has valid syntax."), 
            alert("Failed to load JavaScript code used in events. Check all your JavaScript code has valid syntax.")) : (c = Object.assign(this.zd(c), {
                isInWorker: !1,
                messagePort: k,
                canvas: this.G,
                runOnStartupFunctions: D
            }), this.Cd(), this.Ka = self.C3_CreateRuntime(c), await self.C3_InitRuntime(this.Ka, c));
        }
        Id(c, k) {
            this.Jb();
            console.error(`[Preview] Failed to load project main script (${c}): `, k);
            alert(`Failed to load project main script (${c}). Check all your JavaScript code has valid syntax. Press F12 and check the console for error details.`);
        }
        Cd() {
            this.Jb();
        }
        Jb() {
            const c = window.Cg;
            c && (c.parentElement.removeChild(c), window.Cg = null);
        }
        async rf() {
            const c = await Q(this.kb);
            return {
                outputPort: c,
                transferables: [ c ]
            };
        }
        hf() {
            if (this.ca) throw Error("not available in worker mode");
            return this.Ka;
        }
        rc(c, k, l, n, t) {
            this.pa.postMessage({
                type: "event",
                component: c,
                handler: k,
                dispatchOpts: n || null,
                data: l,
                responseId: null
            }, t);
        }
        rd(c, k, l, n, t) {
            const q = J++, r = new Promise((y, E) => {
                z.set(q, {
                    resolve: y,
                    reject: E
                });
            });
            this.pa.postMessage({
                type: "event",
                component: c,
                handler: k,
                dispatchOpts: n || null,
                data: l,
                responseId: q
            }, t);
            return r;
        }
        ["_OnMessageFromRuntime"](c) {
            const k = c.type;
            if ("event" === k) return this.wf(c);
            if ("result" === k) this.Jf(c); else if ("runtime-ready" === k) this.Kf(); else if ("alert-error" === k) this.Jb(), 
            alert(c.message); else if ("creating-runtime" === k) this.Cd(); else throw Error(`unknown message '${k}'`);
        }
        wf(c) {
            const k = c.component, l = c.handler, n = c.data, t = c.responseId;
            if (c = G.get(k)) if (c = c.get(l)) {
                var q = null;
                try {
                    q = c(n);
                } catch (r) {
                    console.error(`Exception in '${k}' handler '${l}':`, r);
                    null !== t && this.Ib(t, !1, "" + r);
                    return;
                }
                if (null === t) return q;
                q && q.then ? q.then(r => this.Ib(t, !0, r)).catch(r => {
                    console.error(`Rejection from '${k}' handler '${l}':`, r);
                    this.Ib(t, !1, "" + r);
                }) : this.Ib(t, !0, q);
            } else console.warn(`[DOM] No handler '${l}' for component '${k}'`); else console.warn(`[DOM] No event handlers for component '${k}'`);
        }
        Ib(c, k, l) {
            let n;
            l && l.transferables && (n = l.transferables);
            this.pa.postMessage({
                type: "result",
                responseId: c,
                isOk: k,
                result: l
            }, n);
        }
        Jf(c) {
            const k = c.responseId, l = c.isOk;
            c = c.result;
            const n = z.get(k);
            l ? n.resolve(c) : n.reject(c);
            z.delete(k);
        }
        C(c, k, l) {
            let n = G.get(c);
            n || (n = new Map(), G.set(c, n));
            if (n.has(k)) throw Error(`[DOM] Component '${c}' already has handler '${k}'`);
            n.set(k, l);
        }
        static Ta(c) {
            if (C.includes(c)) throw Error("DOM handler already added");
            C.push(c);
        }
        yd() {
            for (const c of this.Qb) if ("runtime" === c.bb) {
                this.Pa = c;
                return;
            }
            throw Error("cannot find runtime DOM handler");
        }
        Cf(c) {
            this.rc("debugger", "message", c);
        }
        Kf() {
            for (const c of this.Qb) c.jd();
        }
        static Wa() {
            return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || e);
        }
        static Kb(c) {
            e = !!c;
        }
        Te(c) {
            this.Na.push(c);
            this.Mc();
        }
        Wf(c) {
            c = this.Na.indexOf(c);
            if (-1 === c) throw Error("invalid callback");
            this.Na.splice(c, 1);
            this.Na.length || this.xc();
        }
        Mc() {
            -1 === this.Oa && this.Na.length && (this.Oa = requestAnimationFrame(this.Ag));
        }
        xc() {
            -1 !== this.Oa && (cancelAnimationFrame(this.Oa), this.Oa = -1);
        }
        Gf() {
            this.Oa = -1;
            for (const c of this.Na) c();
            this.Mc();
        }
        ua(c) {
            this.Pa.ua(c);
        }
        Da(c) {
            this.Pa.Da(c);
        }
        Lc() {
            this.Pa.Lc();
        }
        Db(c) {
            this.Pa.Db(c);
        }
        Ee() {
            return !!x["audio/webm; codecs=opus"];
        }
        async tg(c) {
            c = await this.rd("runtime", "opus-decode", {
                arrayBuffer: c
            }, null, [ c ]);
            return new Float32Array(c);
        }
        De(c) {
            return /^(?:[a-z\-]+:)?\/\//.test(c) || "data:" === c.substr(0, 5) || "blob:" === c.substr(0, 5);
        }
        qd(c) {
            return !this.De(c);
        }
        async Fa(c) {
            return "cordova" === this.s && (c.startsWith("file:") || this.ib && this.qd(c)) ? (c.startsWith(this.F) && (c = c.substr(this.F.length)), 
            c = await this.xb(c), URL.createObjectURL(new Blob([ c ], {
                type: "application/javascript"
            }))) : c;
        }
        async qf(c) {
            const k = c.filename;
            switch (c.as) {
              case "text":
                return await this.we(k);

              case "buffer":
                return await this.xb(k);

              default:
                throw Error("unsupported type");
            }
        }
        md(c) {
            const k = window.cordova.file.applicationDirectory + "www/" + c.toLowerCase();
            return new Promise((l, n) => {
                window.resolveLocalFileSystemURL(k, t => {
                    t.file(l, n);
                }, n);
            });
        }
        async we(c) {
            c = await this.md(c);
            return await A(c);
        }
        yc() {
            if (v.length && !(8 <= w)) {
                w++;
                var c = v.shift();
                this.Ze(c.filename, c.Lg, c.Eg);
            }
        }
        xb(c) {
            return new Promise((k, l) => {
                v.push({
                    filename: c,
                    Lg: n => {
                        w--;
                        this.yc();
                        k(n);
                    },
                    Eg: n => {
                        w--;
                        this.yc();
                        l(n);
                    }
                });
                this.yc();
            });
        }
        async Ze(c, k, l) {
            try {
                const n = await this.md(c), t = await B(n);
                k(t);
            } catch (n) {
                l(n);
            }
        }
        Nc(c) {
            if ("windows-webview2" === this.s) window.chrome.webview.postMessage(JSON.stringify(c)); else if ("macos-wkwebview" === this.s) window.webkit.messageHandlers.C3Wrapper.postMessage(JSON.stringify(c)); else throw Error("cannot send wrapper message");
        }
        async Ye() {
            const c = [];
            for (const [ k, l ] of Object.entries(this.ha)) c.push(this.Xe(k, l));
            await Promise.all(c);
        }
        async Xe(c, k) {
            if ("object" === typeof k) this.ha[c] = new Blob([ k.str ], {
                type: k.type
            }), this.Vb[c] = k.str; else {
                let l = await this.ff(k);
                l || (l = this.af(k));
                this.ha[c] = l;
            }
        }
        async ff(c) {
            try {
                return await (await fetchLocal(c)).blob();
            } catch (k) {
                return console.warn("Failed to fetch a data: URI. Falling back to a slower workaround. This is probably because the Content Security Policy unnecessarily blocked it. Allow data: URIs in your CSP to avoid this.", k), 
                null;
            }
        }
        af(c) {
            c = this.Qf(c);
            return this.We(c.data, c.Hg);
        }
        Qf(c) {
            var k = c.indexOf(",");
            if (0 > k) throw new URIError("expected comma in data: uri");
            var l = c.substring(k + 1);
            k = c.substring(5, k).split(";");
            c = k[0] || "";
            const n = k[2];
            l = "base64" === k[1] || "base64" === n ? atob(l) : decodeURIComponent(l);
            return {
                Hg: c,
                data: l
            };
        }
        We(c, k) {
            var l = c.length;
            let n = l >> 2, t = new Uint8Array(l), q = new Uint32Array(t.buffer, 0, n), r, y;
            for (y = r = 0; r < n; ++r) q[r] = c.charCodeAt(y++) | c.charCodeAt(y++) << 8 | c.charCodeAt(y++) << 16 | c.charCodeAt(y++) << 24;
            for (l &= 3; l--; ) t[y] = c.charCodeAt(y), ++y;
            return new Blob([ t ], {
                type: k
            });
        }
    };
}

"use strict";

{
    const f = self.ma;
    function a(e) {
        return e.sourceCapabilities && e.sourceCapabilities.firesTouchEvents || e.originalEvent && e.originalEvent.sourceCapabilities && e.originalEvent.sourceCapabilities.firesTouchEvents;
    }
    const b = new Map([ [ "OSLeft", "MetaLeft" ], [ "OSRight", "MetaRight" ] ]), d = {
        dispatchRuntimeEvent: !0,
        dispatchUserScriptEvent: !0
    }, h = {
        dispatchUserScriptEvent: !0
    }, m = {
        dispatchRuntimeEvent: !0
    };
    function p(e) {
        return new Promise((g, c) => {
            const k = document.createElement("link");
            k.onload = () => g(k);
            k.onerror = l => c(l);
            k.rel = "stylesheet";
            k.href = e;
            document.head.appendChild(k);
        });
    }
    function x(e) {
        return new Promise((g, c) => {
            const k = new Image();
            k.onload = () => g(k);
            k.onerror = l => c(l);
            k.src = e;
        });
    }
    async function A(e) {
        e = URL.createObjectURL(e);
        try {
            return await x(e);
        } finally {
            URL.revokeObjectURL(e);
        }
    }
    function B(e) {
        return new Promise((g, c) => {
            let k = new FileReader();
            k.onload = l => g(l.target.result);
            k.onerror = l => c(l);
            k.readAsText(e);
        });
    }
    async function v(e, g, c) {
        if (!/firefox/i.test(navigator.userAgent)) return await A(e);
        var k = await B(e);
        k = new DOMParser().parseFromString(k, "image/svg+xml");
        const l = k.documentElement;
        if (l.hasAttribute("width") && l.hasAttribute("height")) {
            const n = l.getAttribute("width"), t = l.getAttribute("height");
            if (!n.includes("%") && !t.includes("%")) return await A(e);
        }
        l.setAttribute("width", g + "px");
        l.setAttribute("height", c + "px");
        k = new XMLSerializer().serializeToString(k);
        e = new Blob([ k ], {
            type: "image/svg+xml"
        });
        return await A(e);
    }
    function w(e) {
        do {
            if (e.parentNode && e.hasAttribute("contenteditable")) return !0;
            e = e.parentNode;
        } while (e);
        return !1;
    }
    const C = new Set([ "input", "textarea", "datalist", "select" ]), G = new Set([ "canvas", "body", "html" ]);
    function z(e) {
        G.has(e.target.tagName.toLowerCase()) && e.preventDefault();
    }
    function J(e) {
        (e.metaKey || e.ctrlKey) && e.preventDefault();
    }
    self.C3_GetSvgImageSize = async function(e) {
        e = await A(e);
        if (0 < e.width && 0 < e.height) return [ e.width, e.height ];
        {
            e.style.position = "absolute";
            e.style.left = "0px";
            e.style.top = "0px";
            e.style.visibility = "hidden";
            document.body.appendChild(e);
            const g = e.getBoundingClientRect();
            document.body.removeChild(e);
            return [ g.width, g.height ];
        }
    };
    self.C3_RasterSvgImageBlob = async function(e, g, c, k, l) {
        e = await v(e, g, c);
        const n = document.createElement("canvas");
        n.width = k;
        n.height = l;
        n.getContext("2d").drawImage(e, 0, 0, g, c);
        return n;
    };
    let D = !1;
    document.addEventListener("pause", () => D = !0);
    document.addEventListener("resume", () => D = !1);
    function M() {
        try {
            return window.parent && window.parent.document.hasFocus();
        } catch (e) {
            return !1;
        }
    }
    f.Ta(class extends self.Ba {
        constructor(e) {
            super(e, "runtime");
            this.Sd = !0;
            this.Qa = -1;
            this.dd = "any";
            this.Jd = this.Kd = !1;
            this.Ja = this.sb = this.ya = null;
            this.ac = this.$b = 0;
            e.C("canvas", "update-size", k => this.Nf(k));
            e.C("runtime", "invoke-download", k => this.Af(k));
            e.C("runtime", "raster-svg-image", k => this.Hf(k));
            e.C("runtime", "get-svg-image-size", k => this.yf(k));
            e.C("runtime", "set-target-orientation", k => this.Lf(k));
            e.C("runtime", "register-sw", () => this.If());
            e.C("runtime", "post-to-debugger", k => this.Ed(k));
            e.C("runtime", "go-to-script", k => this.Ed(k));
            e.C("runtime", "before-start-ticking", () => this.pf());
            e.C("runtime", "debug-highlight", k => this.sf(k));
            e.C("runtime", "enable-device-orientation", () => this.Ve());
            e.C("runtime", "enable-device-motion", () => this.Ue());
            e.C("runtime", "add-stylesheet", k => this.nf(k));
            e.C("runtime", "alert", k => this.Ec(k));
            e.C("runtime", "hide-cordova-splash", () => this.zf());
            const g = new Set([ "input", "textarea", "datalist" ]);
            window.addEventListener("contextmenu", k => {
                const l = k.target;
                g.has(l.tagName.toLowerCase()) || w(l) || k.preventDefault();
            });
            const c = e.G;
            window.addEventListener("selectstart", z);
            window.addEventListener("gesturehold", z);
            c.addEventListener("selectstart", z);
            c.addEventListener("gesturehold", z);
            window.addEventListener("touchstart", z, {
                passive: !1
            });
            "undefined" !== typeof PointerEvent ? (window.addEventListener("pointerdown", z, {
                passive: !1
            }), c.addEventListener("pointerdown", z)) : c.addEventListener("touchstart", z);
            this.pb = 0;
            window.addEventListener("mousedown", k => {
                1 === k.button && k.preventDefault();
            });
            window.addEventListener("mousewheel", J, {
                passive: !1
            });
            window.addEventListener("wheel", J, {
                passive: !1
            });
            window.addEventListener("resize", () => this.Of());
            window.addEventListener("fullscreenchange", () => this.Ya());
            window.addEventListener("webkitfullscreenchange", () => this.Ya());
            window.addEventListener("mozfullscreenchange", () => this.Ya());
            window.addEventListener("fullscreenerror", k => this.Gc(k));
            window.addEventListener("webkitfullscreenerror", k => this.Gc(k));
            window.addEventListener("mozfullscreenerror", k => this.Gc(k));
            e.qc() && window.addEventListener("focusout", () => {
                {
                    const n = document.activeElement;
                    if (n) {
                        var k = n.tagName.toLowerCase();
                        var l = new Set("email number password search tel text url".split(" "));
                        k = "textarea" === k ? !0 : "input" === k ? l.has(n.type.toLowerCase() || "text") : w(n);
                    } else k = !1;
                }
                k || (document.scrollingElement.scrollTop = 0);
            });
            self.C3WrapperOnMessage = k => this.Pf(k);
            this.La = new Set();
            this.Wb = new WeakSet();
            this.oa = !1;
        }
        pf() {
            "cordova" === this.v.s ? (document.addEventListener("pause", () => this.Kc(!0)), 
            document.addEventListener("resume", () => this.Kc(!1))) : document.addEventListener("visibilitychange", () => this.Kc(document.hidden));
            return {
                isSuspended: !(!document.hidden && !D)
            };
        }
        jd() {
            window.addEventListener("focus", () => this.$a("window-focus"));
            window.addEventListener("blur", () => {
                this.$a("window-blur", {
                    parentHasFocus: M()
                });
                this.pb = 0;
            });
            window.addEventListener("focusin", g => {
                g = g.target;
                (C.has(g.tagName.toLowerCase()) || w(g)) && this.$a("keyboard-blur");
            });
            window.addEventListener("keydown", g => this.Dd("keydown", g));
            window.addEventListener("keyup", g => this.Dd("keyup", g));
            window.addEventListener("dblclick", g => this.Hc("dblclick", g, d));
            window.addEventListener("wheel", g => this.Ef(g));
            "undefined" !== typeof PointerEvent ? (window.addEventListener("pointerdown", g => {
                this.Bc(g);
                this.Za("pointerdown", g);
            }), this.v.ca && "undefined" !== typeof window.onpointerrawupdate && self === self.top ? (this.sb = new self.Ke(() => this.df(), 5), 
            this.sb.Nd = !0, window.addEventListener("pointerrawupdate", g => this.Ff(g))) : window.addEventListener("pointermove", g => this.Za("pointermove", g)), 
            window.addEventListener("pointerup", g => this.Za("pointerup", g)), window.addEventListener("pointercancel", g => this.Za("pointercancel", g))) : (window.addEventListener("mousedown", g => {
                this.Bc(g);
                this.Ic("pointerdown", g);
            }), window.addEventListener("mousemove", g => this.Ic("pointermove", g)), window.addEventListener("mouseup", g => this.Ic("pointerup", g)), 
            window.addEventListener("touchstart", g => {
                this.Bc(g);
                this.Hb("pointerdown", g);
            }), window.addEventListener("touchmove", g => this.Hb("pointermove", g)), window.addEventListener("touchend", g => this.Hb("pointerup", g)), 
            window.addEventListener("touchcancel", g => this.Hb("pointercancel", g)));
            const e = () => this.Lc();
            window.addEventListener("pointerup", e, !0);
            window.addEventListener("touchend", e, !0);
            window.addEventListener("click", e, !0);
            window.addEventListener("keydown", e, !0);
            window.addEventListener("gamepadconnected", e, !0);
        }
        $a(e, g) {
            u(this, e, g || null, m);
        }
        wa() {
            return this.v.wa();
        }
        va() {
            return this.v.va();
        }
        Of() {
            const e = this.wa(), g = this.va();
            this.$a("window-resize", {
                innerWidth: e,
                innerHeight: g,
                devicePixelRatio: window.devicePixelRatio,
                isFullscreen: f.Wa()
            });
            this.v.qc() && (-1 !== this.Qa && clearTimeout(this.Qa), this.Fd(e, g, 0));
        }
        Xf(e, g, c) {
            -1 !== this.Qa && clearTimeout(this.Qa);
            this.Qa = setTimeout(() => this.Fd(e, g, c), 48);
        }
        Fd(e, g, c) {
            const k = this.wa(), l = this.va();
            this.Qa = -1;
            k != e || l != g ? this.$a("window-resize", {
                innerWidth: k,
                innerHeight: l,
                devicePixelRatio: window.devicePixelRatio,
                isFullscreen: f.Wa()
            }) : 10 > c && this.Xf(k, l, c + 1);
        }
        Lf(e) {
            this.dd = e.targetOrientation;
        }
        pg() {
            const e = this.dd;
            if (screen.orientation && screen.orientation.lock) screen.orientation.lock(e).catch(g => console.warn("[Construct 3] Failed to lock orientation: ", g)); else try {
                let g = !1;
                screen.lockOrientation ? g = screen.lockOrientation(e) : screen.webkitLockOrientation ? g = screen.webkitLockOrientation(e) : screen.mozLockOrientation ? g = screen.mozLockOrientation(e) : screen.msLockOrientation && (g = screen.msLockOrientation(e));
                g || console.warn("[Construct 3] Failed to lock orientation");
            } catch (g) {
                console.warn("[Construct 3] Failed to lock orientation: ", g);
            }
        }
        Ya() {
            const e = f.Wa();
            e && "any" !== this.dd && this.pg();
            u(this, "fullscreenchange", {
                isFullscreen: e,
                innerWidth: this.wa(),
                innerHeight: this.va()
            });
        }
        Gc(e) {
            console.warn("[Construct 3] Fullscreen request failed: ", e);
            u(this, "fullscreenerror", {
                isFullscreen: f.Wa(),
                innerWidth: this.wa(),
                innerHeight: this.va()
            });
        }
        Kc(e) {
            e ? this.v.xc() : this.v.Mc();
            u(this, "visibilitychange", {
                hidden: e
            });
        }
        Dd(e, g) {
            "Backspace" === g.key && z(g);
            const c = b.get(g.code) || g.code;
            F(this, e, {
                code: c,
                key: g.key,
                which: g.which,
                repeat: g.repeat,
                altKey: g.altKey,
                ctrlKey: g.ctrlKey,
                metaKey: g.metaKey,
                shiftKey: g.shiftKey,
                timeStamp: g.timeStamp
            }, d);
        }
        Ef(e) {
            u(this, "wheel", {
                clientX: e.clientX,
                clientY: e.clientY,
                pageX: e.pageX,
                pageY: e.pageY,
                deltaX: e.deltaX,
                deltaY: e.deltaY,
                deltaZ: e.deltaZ,
                deltaMode: e.deltaMode,
                timeStamp: e.timeStamp
            }, d);
        }
        Hc(e, g, c) {
            a(g) || F(this, e, {
                button: g.button,
                buttons: g.buttons,
                clientX: g.clientX,
                clientY: g.clientY,
                pageX: g.pageX,
                pageY: g.pageY,
                movementX: g.movementX || 0,
                movementY: g.movementY || 0,
                timeStamp: g.timeStamp
            }, c);
        }
        Ic(e, g) {
            if (!a(g)) {
                var c = this.pb;
                "pointerdown" === e && 0 !== c ? e = "pointermove" : "pointerup" === e && 0 !== g.buttons && (e = "pointermove");
                F(this, e, {
                    pointerId: 1,
                    pointerType: "mouse",
                    button: g.button,
                    buttons: g.buttons,
                    lastButtons: c,
                    clientX: g.clientX,
                    clientY: g.clientY,
                    pageX: g.pageX,
                    pageY: g.pageY,
                    movementX: g.movementX || 0,
                    movementY: g.movementY || 0,
                    width: 0,
                    height: 0,
                    pressure: 0,
                    tangentialPressure: 0,
                    tiltX: 0,
                    tiltY: 0,
                    twist: 0,
                    timeStamp: g.timeStamp
                }, d);
                this.pb = g.buttons;
                this.Hc(g.type, g, h);
            }
        }
        Za(e, g) {
            if (this.sb && "pointermove" !== e) {
                var c = this.sb;
                c.hb || (L(c), c.Tb = Date.now());
            }
            c = 0;
            "mouse" === g.pointerType && (c = this.pb);
            F(this, e, {
                pointerId: g.pointerId,
                pointerType: g.pointerType,
                button: g.button,
                buttons: g.buttons,
                lastButtons: c,
                clientX: g.clientX,
                clientY: g.clientY,
                pageX: g.pageX,
                pageY: g.pageY,
                movementX: (g.movementX || 0) + this.$b,
                movementY: (g.movementY || 0) + this.ac,
                width: g.width || 0,
                height: g.height || 0,
                pressure: g.pressure || 0,
                tangentialPressure: g.tangentialPressure || 0,
                tiltX: g.tiltX || 0,
                tiltY: g.tiltY || 0,
                twist: g.twist || 0,
                timeStamp: g.timeStamp
            }, d);
            this.ac = this.$b = 0;
            "mouse" === g.pointerType && (c = "mousemove", "pointerdown" === e ? c = "mousedown" : "pointerup" === e && (c = "mouseup"), 
            this.Hc(c, g, h), this.pb = g.buttons);
        }
        Ff(e) {
            this.Ja && (this.$b += this.Ja.movementX || 0, this.ac += this.Ja.movementY || 0);
            this.Ja = e;
            e = this.sb;
            if (-1 === e.Ra) {
                var g = Date.now(), c = g - e.Tb, k = e.vg;
                c >= k && e.Nd ? (e.Tb = g, e.hb = !0, e.Qc(), e.hb = !1) : e.Ra = self.setTimeout(e.ee, Math.max(k - c, 4));
            }
        }
        df() {
            this.Za("pointermove", this.Ja);
            this.Ja = null;
        }
        Hb(e, g) {
            for (let c = 0, k = g.changedTouches.length; c < k; ++c) {
                const l = g.changedTouches[c];
                F(this, e, {
                    pointerId: l.identifier,
                    pointerType: "touch",
                    button: 0,
                    buttons: 0,
                    lastButtons: 0,
                    clientX: l.clientX,
                    clientY: l.clientY,
                    pageX: l.pageX,
                    pageY: l.pageY,
                    movementX: g.movementX || 0,
                    movementY: g.movementY || 0,
                    width: 2 * (l.radiusX || l.webkitRadiusX || 0),
                    height: 2 * (l.radiusY || l.webkitRadiusY || 0),
                    pressure: l.force || l.webkitForce || 0,
                    tangentialPressure: 0,
                    tiltX: 0,
                    tiltY: 0,
                    twist: l.rotationAngle || 0,
                    timeStamp: g.timeStamp
                }, d);
            }
        }
        Bc(e) {
            window !== window.top && window.focus();
            this.Bd(e.target) && document.activeElement && !this.Bd(document.activeElement) && document.activeElement.blur();
        }
        Bd(e) {
            return !e || e === document || e === window || e === document.body || "canvas" === e.tagName.toLowerCase();
        }
        Ve() {
            this.Kd || (this.Kd = !0, window.addEventListener("deviceorientation", e => this.uf(e)), 
            window.addEventListener("deviceorientationabsolute", e => this.vf(e)));
        }
        Ue() {
            this.Jd || (this.Jd = !0, window.addEventListener("devicemotion", e => this.tf(e)));
        }
        uf(e) {
            u(this, "deviceorientation", {
                absolute: !!e.absolute,
                alpha: e.alpha || 0,
                beta: e.beta || 0,
                gamma: e.gamma || 0,
                timeStamp: e.timeStamp,
                webkitCompassHeading: e.webkitCompassHeading,
                webkitCompassAccuracy: e.webkitCompassAccuracy
            }, d);
        }
        vf(e) {
            u(this, "deviceorientationabsolute", {
                absolute: !!e.absolute,
                alpha: e.alpha || 0,
                beta: e.beta || 0,
                gamma: e.gamma || 0,
                timeStamp: e.timeStamp
            }, d);
        }
        tf(e) {
            let g = null;
            var c = e.acceleration;
            c && (g = {
                x: c.x || 0,
                y: c.y || 0,
                z: c.z || 0
            });
            c = null;
            var k = e.accelerationIncludingGravity;
            k && (c = {
                x: k.x || 0,
                y: k.y || 0,
                z: k.z || 0
            });
            k = null;
            const l = e.rotationRate;
            l && (k = {
                alpha: l.alpha || 0,
                beta: l.beta || 0,
                gamma: l.gamma || 0
            });
            u(this, "devicemotion", {
                acceleration: g,
                accelerationIncludingGravity: c,
                rotationRate: k,
                interval: e.interval,
                timeStamp: e.timeStamp
            }, d);
        }
        Nf(e) {
            const g = this.v.G;
            g.style.width = e.styleWidth + "px";
            g.style.height = e.styleHeight + "px";
            g.style.marginLeft = e.marginLeft + "px";
            g.style.marginTop = e.marginTop + "px";
            this.Sd && (g.style.display = "", this.Sd = !1);
        }
        Af(e) {
            const g = e.url;
            e = e.filename;
            const c = document.createElement("a"), k = document.body;
            c.textContent = e;
            c.href = g;
            c.download = e;
            k.appendChild(c);
            c.click();
            k.removeChild(c);
        }
        async Hf(e) {
            var g = e.imageBitmapOpts;
            e = await self.C3_RasterSvgImageBlob(e.blob, e.imageWidth, e.imageHeight, e.surfaceWidth, e.surfaceHeight);
            g = g ? await createImageBitmap(e, g) : await createImageBitmap(e);
            return {
                imageBitmap: g,
                transferables: [ g ]
            };
        }
        async yf(e) {
            return await self.C3_GetSvgImageSize(e.blob);
        }
        async nf(e) {
            await p(e.url);
        }
        Lc() {
            var e = [ ...this.La ];
            this.La.clear();
            if (!this.oa) for (const g of e) (e = g.play()) && e.catch(() => {
                this.Wb.has(g) || this.La.add(g);
            });
        }
        ua(e) {
            if ("function" !== typeof e.play) throw Error("missing play function");
            this.Wb.delete(e);
            let g;
            try {
                g = e.play();
            } catch (c) {
                this.La.add(e);
                return;
            }
            g && g.catch(() => {
                this.Wb.has(e) || this.La.add(e);
            });
        }
        Da(e) {
            this.La.delete(e);
            this.Wb.add(e);
        }
        Db(e) {
            this.oa = !!e;
        }
        zf() {
            navigator.splashscreen && navigator.splashscreen.hide && navigator.splashscreen.hide();
        }
        sf(e) {
            if (e.show) {
                this.ya || (this.ya = document.createElement("div"), this.ya.id = "inspectOutline", 
                document.body.appendChild(this.ya));
                var g = this.ya;
                g.style.display = "";
                g.style.left = e.left - 1 + "px";
                g.style.top = e.top - 1 + "px";
                g.style.width = e.width + 2 + "px";
                g.style.height = e.height + 2 + "px";
                g.textContent = e.name;
            } else this.ya && (this.ya.style.display = "none");
        }
        If() {
            window.C3_RegisterSW && window.C3_RegisterSW();
        }
        Ed(e) {
            window.c3_postToMessagePort && (e.from = "runtime", window.c3_postToMessagePort(e));
        }
        lf(e, g) {
            return this.v.rd(this.bb, "js-invoke-function", {
                name: e,
                params: g
            }, void 0, void 0);
        }
        Ec(e) {
            alert(e.message);
        }
        Pf(e) {
            "entered-fullscreen" === e ? (f.Kb(!0), this.Ya()) : "exited-fullscreen" === e ? (f.Kb(!1), 
            this.Ya()) : console.warn("Unknown wrapper message: ", e);
        }
    });
}

"use strict";

async function O(f) {
    if (f.ug) throw Error("already initialised");
    f.ug = !0;
    var a = f.dc.Ac("dispatchworker.js");
    f.Sc = await f.dc.kc(a, f.F, {
        name: "DispatchWorker"
    });
    a = new MessageChannel();
    f.Wc = a.port1;
    f.Sc.postMessage({
        type: "_init",
        "in-port": a.port2
    }, [ a.port2 ]);
    f.bd = await Q(f);
}

function P(f) {
    return [ f.Wc, f.bd ];
}

async function Q(f) {
    const a = f.Td.length;
    var b = f.dc.Ac("jobworker.js");
    b = await f.dc.kc(b, f.F, {
        name: "JobWorker" + a
    });
    const d = new MessageChannel(), h = new MessageChannel();
    f.Sc.postMessage({
        type: "_addJobWorker",
        port: d.port1
    }, [ d.port1 ]);
    b.postMessage({
        type: "init",
        number: a,
        "dispatch-port": d.port2,
        "output-port": h.port2
    }, [ d.port2, h.port2 ]);
    f.Td.push(b);
    return h.port1;
}

self.Ge = class {
    constructor(f) {
        this.dc = f;
        this.F = f.F;
        this.F = "preview" === f.s ? this.F + "workers/" : this.F + f.ec;
        this.xg = Math.min(navigator.hardwareConcurrency || 2, 16);
        this.Sc = null;
        this.Td = [];
        this.bd = this.Wc = null;
    }
};

"use strict";

console.log('TEST');
window.C3_IsSupported && (window.c3_runtimeInterface = new self.ma({
    Mg: !1,
    Ng: "workermain.js",
    Sa: [ "scripts/c3runtime.js" ],
    ic: [],
    fd: "",
    Jg: "scripts/",
    hd: [],
    fe: "html5"
}));

"use strict";

{
    const f = 180 / Math.PI;
    self.da = class extends self.Ba {
        constructor(a) {
            super(a, "audio");
            this.Pb = this.f = null;
            this.Rb = this.Vc = !1;
            this.ra = () => this.qg();
            this.$ = [];
            this.D = [];
            this.ga = null;
            this.Ud = "";
            this.Vd = -1;
            this.rb = new Map();
            this.Zc = 1;
            this.oa = !1;
            this.ed = 0;
            this.fc = 1;
            this.Tc = 0;
            this.Xd = "HRTF";
            this.Od = "inverse";
            this.Yd = 600;
            this.Wd = 1e4;
            this.$d = 1;
            this.Qd = this.cd = !1;
            this.ce = this.v.Ee();
            this.aa = new Map();
            this.Ha = new Set();
            this.Xc = !1;
            this.$c = "";
            this.za = null;
            self.C3Audio_OnMicrophoneStream = (b, d) => this.Df(b, d);
            this.Ob = null;
            self.C3Audio_GetOutputStream = () => this.xf();
            self.C3Audio_DOMInterface = this;
            I(this, [ [ "create-audio-context", b => this.$e(b) ], [ "play", b => this.Rf(b) ], [ "stop", b => this.ng(b) ], [ "stop-all", () => this.og() ], [ "set-paused", b => this.gg(b) ], [ "set-volume", b => this.lg(b) ], [ "fade-volume", b => this.ef(b) ], [ "set-master-volume", b => this.eg(b) ], [ "set-muted", b => this.fg(b) ], [ "set-silent", b => this.ig(b) ], [ "set-looping", b => this.dg(b) ], [ "set-playback-rate", b => this.hg(b) ], [ "seek", b => this.Yf(b) ], [ "preload", b => this.Sf(b) ], [ "unload", b => this.rg(b) ], [ "unload-all", () => this.sg() ], [ "set-suspended", b => this.jg(b) ], [ "add-effect", b => this.wd(b) ], [ "set-effect-param", b => this.ag(b) ], [ "remove-effects", b => this.Uf(b) ], [ "tick", b => this.Mf(b) ], [ "load-state", b => this.Bf(b) ] ]);
        }
        async $e(a) {
            a.isiOSCordova && (this.cd = !0);
            this.ed = a.timeScaleMode;
            this.Xd = [ "equalpower", "HRTF", "soundfield" ][a.panningModel];
            this.Od = [ "linear", "inverse", "exponential" ][a.distanceModel];
            this.Yd = a.refDistance;
            this.Wd = a.maxDistance;
            this.$d = a.rolloffFactor;
            var b = {
                latencyHint: a.latencyHint
            };
            this.ce || (b.sampleRate = 48e3);
            if ("undefined" !== typeof AudioContext) this.f = new AudioContext(b); else if ("undefined" !== typeof webkitAudioContext) this.f = new webkitAudioContext(b); else throw Error("Web Audio API not supported");
            this.xd();
            this.f.onstatechange = () => {
                "running" !== this.f.state && this.xd();
            };
            this.Pb = this.f.createGain();
            this.Pb.connect(this.f.destination);
            b = a.listenerPos;
            this.f.listener.setPosition(b[0], b[1], b[2]);
            this.f.listener.setOrientation(0, 0, 1, 0, -1, 0);
            self.C3_GetAudioContextCurrentTime = () => this.lc();
            try {
                await Promise.all(a.preloadList.map(d => this.Fb(d.originalUrl, d.url, d.type, !1)));
            } catch (d) {
                console.error("[Construct 3] Preloading sounds failed: ", d);
            }
            return {
                sampleRate: this.f.sampleRate
            };
        }
        xd() {
            this.Rb || (this.Vc = !1, window.addEventListener("pointerup", this.ra, !0), window.addEventListener("touchend", this.ra, !0), 
            window.addEventListener("click", this.ra, !0), window.addEventListener("keydown", this.ra, !0), 
            this.Rb = !0);
        }
        bf() {
            this.Rb && (this.Vc = !0, window.removeEventListener("pointerup", this.ra, !0), 
            window.removeEventListener("touchend", this.ra, !0), window.removeEventListener("click", this.ra, !0), 
            window.removeEventListener("keydown", this.ra, !0), this.Rb = !1);
        }
        qg() {
            if (!this.Vc) {
                var a = this.f;
                "suspended" === a.state && a.resume && a.resume();
                var b = a.createBuffer(1, 220, 22050), d = a.createBufferSource();
                d.buffer = b;
                d.connect(a.destination);
                d.start(0);
                "running" === a.state && this.bf();
            }
        }
        W() {
            return this.f;
        }
        lc() {
            return this.f.currentTime;
        }
        sa() {
            return this.Pb;
        }
        od(a) {
            return (a = this.aa.get(a.toLowerCase())) ? a[0].P() : this.sa();
        }
        ge(a, b) {
            a = a.toLowerCase();
            let d = this.aa.get(a);
            d || (d = [], this.aa.set(a, d));
            b.cg(d.length);
            b.kg(a);
            d.push(b);
            this.Hd(a);
        }
        Hd(a) {
            let b = this.sa();
            const d = this.aa.get(a);
            if (d && d.length) {
                b = d[0].P();
                for (let h = 0, m = d.length; h < m; ++h) {
                    const p = d[h];
                    h + 1 === m ? p.S(this.sa()) : p.S(d[h + 1].P());
                }
            }
            for (const h of this.la(a)) h.Le(b);
            this.za && this.$c === a && (this.za.disconnect(), this.za.connect(b));
        }
        zb() {
            return this.Zc;
        }
        Ab() {
            return this.oa;
        }
        bg() {
            this.Qd = !0;
        }
        ye(a, b) {
            return b ? this.v.tg(a).then(d => {
                const h = this.f.createBuffer(1, d.length, 48e3);
                h.getChannelData(0).set(d);
                return h;
            }) : new Promise((d, h) => {
                this.f.decodeAudioData(a, d, h);
            });
        }
        ua(a) {
            this.v.ua(a);
        }
        Da(a) {
            this.v.Da(a);
        }
        sd(a) {
            let b = 0;
            for (let d = 0, h = this.D.length; d < h; ++d) {
                const m = this.D[d];
                this.D[b] = m;
                m.L === a ? m.c() : ++b;
            }
            this.D.length = b;
        }
        Me() {
            let a = 0;
            for (let b = 0, d = this.$.length; b < d; ++b) {
                const h = this.$[b];
                this.$[a] = h;
                h.ta() ? h.c() : ++a;
            }
            this.$.length = a;
        }
        *la(a) {
            if (a) for (const b of this.D) self.da.ze(b.Y, a) && (yield b); else this.ga && !this.ga.T() && (yield this.ga);
        }
        async Fb(a, b, d, h, m) {
            for (const p of this.$) if (p.Va() === b) return await R(p), p;
            if (m) return null;
            h && (this.cd || this.Qd) && this.Me();
            m = "audio/webm; codecs=opus" === d && !this.ce;
            h && m && this.bg();
            a = !h || this.cd || m ? new self.ue(this, a, b, d, h, m) : new self.se(this, a, b, d, h);
            this.$.push(a);
            await R(a);
            return a;
        }
        async zc(a, b, d, h, m) {
            for (const p of this.D) if (p.Va() === b && (p.jc() || m)) return p.Oe(h), p;
            a = await this.Fb(a, b, d, m);
            h = "html5" === a.Oc ? new self.te(a.i, a, h) : new self.ve(a.i, a, h);
            this.D.push(h);
            return h;
        }
        Se(a) {
            let b = this.rb.get(a);
            if (!b) {
                let d = null;
                b = {
                    gd: 0,
                    Ig: new Promise(h => d = h),
                    resolve: d
                };
                this.rb.set(a, b);
            }
            b.gd++;
        }
        Vf(a) {
            const b = this.rb.get(a);
            if (!b) throw Error("expected pending tag");
            b.gd--;
            0 === b.gd && (b.resolve(), this.rb.delete(a));
        }
        wc(a) {
            a || (a = this.Ud);
            return (a = this.rb.get(a)) ? a.Ig : Promise.resolve();
        }
        Gb() {
            if (0 < this.Ha.size) K(this); else for (const a of this.D) if (a.pd()) {
                K(this);
                break;
            }
        }
        Ea() {
            for (var a of this.Ha) a.Ea();
            a = this.lc();
            for (var b of this.D) b.Ea(a);
            b = this.D.filter(d => d.pd()).map(d => d.Ua());
            u(this, "state", {
                tickCount: this.Vd,
                audioInstances: b,
                analysers: [ ...this.Ha ].map(d => d.Be())
            });
            0 === b.length && 0 === this.Ha.size && this.Sb && (this.v.Wf(this.de), this.Sb = !1);
        }
        sc(a, b, d) {
            u(this, "trigger", {
                type: a,
                tag: b,
                aiid: d
            });
        }
        async Rf(a) {
            const b = a.originalUrl, d = a.url, h = a.type, m = a.isMusic, p = a.tag, x = a.isLooping, A = a.vol, B = a.pos, v = a.panning;
            let w = a.off;
            0 < w && !a.trueClock && (this.f.getOutputTimestamp ? (a = this.f.getOutputTimestamp(), 
            w = w - a.performanceTime / 1e3 + a.contextTime) : w = w - performance.now() / 1e3 + this.f.currentTime);
            this.Ud = p;
            this.Se(p);
            try {
                this.ga = await this.zc(b, d, h, p, m), v ? (this.ga.Cb(!0), this.ga.Ne(v.x, v.y, v.angle, v.innerAngle, v.outerAngle, v.outerGain), 
                v.hasOwnProperty("uid") && this.ga.Pe(v.uid)) : this.ga.Cb(!1), this.ga.Play(x, A, B, w);
            } catch (C) {
                console.error("[Construct 3] Audio: error starting playback: ", C);
                return;
            } finally {
                this.Vf(p);
            }
            K(this);
        }
        ng(a) {
            a = a.tag;
            for (const b of this.la(a)) b.na();
        }
        og() {
            for (const a of this.D) a.na();
        }
        gg(a) {
            const b = a.tag;
            a = a.paused;
            for (const d of this.la(b)) a ? d.Xa() : d.Bb();
            this.Gb();
        }
        lg(a) {
            const b = a.tag;
            a = a.vol;
            for (const d of this.la(b)) d.Eb(a);
        }
        async ef(a) {
            const b = a.tag, d = a.vol, h = a.duration;
            a = a.stopOnEnd;
            await this.wc(b);
            for (const m of this.la(b)) m.Ae(d, h, a);
            this.Gb();
        }
        eg(a) {
            this.Zc = a.vol;
            for (const b of this.D) b.Mb();
        }
        fg(a) {
            const b = a.tag;
            a = a.isMuted;
            for (const d of this.la(b)) d.td(a);
        }
        ig(a) {
            this.oa = a.isSilent;
            this.v.Db(this.oa);
            for (const b of this.D) b.Lb();
        }
        dg(a) {
            const b = a.tag;
            a = a.isLooping;
            for (const d of this.la(b)) d.uc(a);
        }
        async hg(a) {
            const b = a.tag;
            a = a.rate;
            await this.wc(b);
            for (const d of this.la(b)) d.vd(a);
        }
        async Yf(a) {
            const b = a.tag;
            a = a.pos;
            await this.wc(b);
            for (const d of this.la(b)) d.tc(a);
        }
        async Sf(a) {
            const b = a.originalUrl, d = a.url, h = a.type;
            a = a.isMusic;
            try {
                await this.zc(b, d, h, "", a);
            } catch (m) {
                console.error("[Construct 3] Audio: error preloading: ", m);
            }
        }
        async rg(a) {
            if (a = await this.Fb("", a.url, a.type, a.isMusic, !0)) a.c(), a = this.$.indexOf(a), 
            -1 !== a && this.$.splice(a, 1);
        }
        sg() {
            for (const a of this.$) a.c();
            this.$.length = 0;
        }
        jg(a) {
            a = a.isSuspended;
            !a && this.f.resume && this.f.resume();
            for (const b of this.D) b.vc(a);
            a && this.f.suspend && this.f.suspend();
        }
        Mf(a) {
            this.fc = a.timeScale;
            this.Tc = a.gameTime;
            this.Vd = a.tickCount;
            if (0 !== this.ed) for (var b of this.D) b.Ga();
            (b = a.listenerPos) && this.f.listener.setPosition(b[0], b[1], b[2]);
            for (const d of a.instPans) {
                a = d.uid;
                for (const h of this.D) h.fa === a && h.ud(d.x, d.y, d.angle);
            }
        }
        async wd(a) {
            var b = a.type;
            const d = a.tag;
            var h = a.params;
            if ("filter" === b) h = new self.me(this, ...h); else if ("delay" === b) h = new self.ke(this, ...h); else if ("convolution" === b) {
                b = null;
                try {
                    b = await this.Fb(a.bufferOriginalUrl, a.bufferUrl, a.bufferType, !1);
                } catch (m) {
                    console.log("[Construct 3] Audio: error loading convolution: ", m);
                    return;
                }
                h = new self.je(this, b.Z, ...h);
                h.Zf(a.bufferOriginalUrl, a.bufferType);
            } else if ("flanger" === b) h = new self.ne(this, ...h); else if ("phaser" === b) h = new self.pe(this, ...h); else if ("gain" === b) h = new self.oe(this, ...h); else if ("tremolo" === b) h = new self.re(this, ...h); else if ("ringmod" === b) h = new self.qe(this, ...h); else if ("distortion" === b) h = new self.le(this, ...h); else if ("compressor" === b) h = new self.ie(this, ...h); else if ("analyser" === b) h = new self.he(this, ...h); else throw Error("invalid effect type");
            this.ge(d, h);
            this.Gd();
        }
        ag(a) {
            const b = a.index, d = a.param, h = a.value, m = a.ramp, p = a.time;
            a = this.aa.get(a.tag);
            !a || 0 > b || b >= a.length || (a[b].X(d, h, m, p), this.Gd());
        }
        Uf(a) {
            a = a.tag.toLowerCase();
            const b = this.aa.get(a);
            if (b && b.length) {
                for (const d of b) d.c();
                this.aa.delete(a);
                this.Hd(a);
            }
        }
        Re(a) {
            this.Ha.add(a);
            this.Gb();
        }
        Tf(a) {
            this.Ha.delete(a);
        }
        Gd() {
            this.Xc || (this.Xc = !0, Promise.resolve().then(() => this.cf()));
        }
        cf() {
            const a = {};
            for (const [ b, d ] of this.aa) a[b] = d.map(h => h.Ua());
            u(this, "fxstate", {
                fxstate: a
            });
            this.Xc = !1;
        }
        async Bf(a) {
            const b = a.saveLoadMode;
            if (3 !== b) for (var d of this.D) d.ta() && 1 === b || (d.ta() || 2 !== b) && d.na();
            for (const h of this.aa.values()) for (const m of h) m.c();
            this.aa.clear();
            this.fc = a.timeScale;
            this.Tc = a.gameTime;
            d = a.listenerPos;
            this.f.listener.setPosition(d[0], d[1], d[2]);
            this.oa = a.isSilent;
            this.v.Db(this.oa);
            this.Zc = a.masterVolume;
            d = [];
            for (const h of Object.values(a.effects)) d.push(Promise.all(h.map(m => this.wd(m))));
            await Promise.all(d);
            await Promise.all(a.playing.map(h => this.mf(h, b)));
            this.Gb();
        }
        async mf(a, b) {
            if (3 !== b) {
                var d = a.bufferOriginalUrl, h = a.bufferUrl, m = a.bufferType, p = a.isMusic, x = a.tag, A = a.isLooping, B = a.volume, v = a.playbackTime;
                if (!p || 1 !== b) if (p || 2 !== b) {
                    b = null;
                    try {
                        b = await this.zc(d, h, m, x, p);
                    } catch (w) {
                        console.error("[Construct 3] Audio: error loading audio state: ", w);
                        return;
                    }
                    b.Je(a.pan);
                    b.Play(A, B, v, 0);
                    a.isPlaying || b.Xa();
                    b.Dc(a);
                }
            }
        }
        Df(a, b) {
            this.za && this.za.disconnect();
            this.$c = b.toLowerCase();
            this.za = this.f.createMediaStreamSource(a);
            this.za.connect(this.od(this.$c));
        }
        xf() {
            this.Ob || (this.Ob = this.f.createMediaStreamDestination(), this.Pb.connect(this.Ob));
            return this.Ob.stream;
        }
        static ze(a, b) {
            return a.length !== b.length ? !1 : a === b ? !0 : a.toLowerCase() === b.toLowerCase();
        }
        static Qe(a) {
            return a * f;
        }
        static xe(a) {
            return Math.pow(10, a / 20);
        }
        static nd(a) {
            return Math.max(Math.min(self.da.xe(a), 1), 0);
        }
        static Ie(a) {
            return Math.log(a) / Math.log(10) * 20;
        }
        static He(a) {
            return self.da.Ie(Math.max(Math.min(a, 1), 0));
        }
        static Dg(a, b) {
            return 1 - Math.exp(-b * a);
        }
    };
    self.ma.Ta(self.da);
}

"use strict";

function R(f) {
    f.Ub || (f.Ub = f.Cc());
    return f.Ub;
}

self.kd = class {
    constructor(f, a, b, d, h) {
        this.i = f;
        this.zg = a;
        this.Aa = b;
        this.R = d;
        this.wg = h;
        this.Oc = "";
        this.Ub = null;
    }
    c() {
        this.Ub = this.i = null;
    }
    Cc() {}
    W() {
        return this.i.W();
    }
    nc() {
        return this.zg;
    }
    Va() {
        return this.Aa;
    }
    mc() {
        return this.R;
    }
    ta() {
        return this.wg;
    }
    ea() {}
};

"use strict";

self.se = class extends self.kd {
    constructor(f, a, b, d, h) {
        super(f, a, b, d, h);
        this.Oc = "html5";
        this.K = new Audio();
        this.K.crossOrigin = "anonymous";
        this.K.autoplay = !1;
        this.K.preload = "auto";
        this.lb = this.mb = null;
        this.K.addEventListener("canplaythrough", () => !0);
        this.qb = this.W().createGain();
        this.ob = null;
        this.K.addEventListener("canplay", () => {
            this.mb && (this.mb(), this.lb = this.mb = null);
            !this.ob && this.K && (this.ob = this.W().createMediaElementSource(this.K), this.ob.connect(this.qb));
        });
        this.onended = null;
        this.K.addEventListener("ended", () => {
            if (this.onended) this.onended();
        });
        this.K.addEventListener("error", m => {
            console.error(`[Construct 3] Audio '${this.Aa}' error: `, m);
            this.lb && (this.lb(m), this.lb = this.mb = null);
        });
    }
    c() {
        this.i.sd(this);
        this.qb.disconnect();
        this.qb = null;
        this.ob.disconnect();
        this.ob = null;
        this.K && !this.K.paused && this.K.pause();
        this.K = this.onended = null;
        super.c();
    }
    Cc() {
        return new Promise((f, a) => {
            this.mb = f;
            this.lb = a;
            this.K.src = this.Aa;
        });
    }
    O() {
        return this.K;
    }
    ea() {
        return this.K.duration;
    }
};

"use strict";

async function S(f) {
    if (f.xa) return f.xa;
    var a = f.i.v;
    if ("cordova" === a.s && a.qd(f.Aa) && a.ib) f.xa = await a.xb(f.Aa); else {
        a = await fetchLocal(f.Aa);
        if (!a.ok) throw Error(`error fetching audio data: ${a.status} ${a.statusText}`);
        f.xa = await a.arrayBuffer();
    }
}

async function T(f) {
    if (f.Z) return f.Z;
    f.Z = await f.i.ye(f.xa, f.yg);
    f.xa = null;
}

self.ue = class extends self.kd {
    constructor(f, a, b, d, h, m) {
        super(f, a, b, d, h);
        this.Oc = "webaudio";
        this.Z = this.xa = null;
        this.yg = !!m;
    }
    c() {
        this.i.sd(this);
        this.Z = this.xa = null;
        super.c();
    }
    async Cc() {
        try {
            await S(this), await T(this);
        } catch (f) {
            console.error(`[Construct 3] Failed to load audio '${this.Aa}': `, f);
        }
    }
    ea() {
        return this.Z ? this.Z.duration : 0;
    }
};

"use strict";

{
    let f = 0;
    self.ld = class {
        constructor(a, b, d) {
            this.i = a;
            this.L = b;
            this.Y = d;
            this.Nb = f++;
            this.M = this.W().createGain();
            this.M.connect(this.sa());
            this.B = null;
            this.jb = !1;
            this.ja = [ 0, 0, 0 ];
            this.ia = [ 0, 0, 0 ];
            this.I = !0;
            this.V = this.ka = this.H = !1;
            this.ub = 1;
            this.Ia = !1;
            this.qa = 1;
            a = this.i.ed;
            this.Yc = 1 === a && !this.ta() || 2 === a;
            this.fb = this.fa = -1;
            this.be = !1;
        }
        c() {
            this.L = this.i = null;
            this.B && (this.B.disconnect(), this.B = null);
            this.M.disconnect();
            this.M = null;
        }
        W() {
            return this.i.W();
        }
        sa() {
            return this.i.od(this.Y);
        }
        zb() {
            return this.i.zb();
        }
        yb() {
            return this.Yc ? this.i.Tc : performance.now() / 1e3;
        }
        nc() {
            return this.L.nc();
        }
        Va() {
            return this.L.Va();
        }
        mc() {
            return this.L.mc();
        }
        ta() {
            return this.L.ta();
        }
        Oe(a) {
            this.Y = a;
        }
        T() {}
        jc() {}
        IsPlaying() {
            return !this.I && !this.H && !this.T();
        }
        pd() {
            return !this.I && !this.T();
        }
        Ca() {}
        ea() {
            return this.L.ea();
        }
        Play() {}
        na() {}
        Xa() {}
        Bb() {}
        Eb(a) {
            this.ub = a;
            this.M.gain.cancelScheduledValues(0);
            this.fb = -1;
            this.M.gain.value = this.oc();
        }
        Ae(a, b, d) {
            if (!this.Ia) {
                a *= this.zb();
                var h = this.M.gain;
                h.cancelScheduledValues(0);
                var m = this.i.lc();
                b = m + b;
                h.setValueAtTime(h.value, m);
                h.linearRampToValueAtTime(a, b);
                this.ub = a;
                this.fb = b;
                this.be = d;
            }
        }
        Mb() {
            this.Eb(this.ub);
        }
        Ea(a) {
            -1 !== this.fb && a >= this.fb && (this.fb = -1, this.be && this.na(), this.i.sc("fade-ended", this.Y, this.Nb));
        }
        oc() {
            const a = this.ub * this.zb();
            return isFinite(a) ? a : 0;
        }
        td(a) {
            a = !!a;
            this.Ia !== a && (this.Ia = a, this.Lb());
        }
        Ab() {
            return this.i.Ab();
        }
        Lb() {}
        uc() {}
        vd(a) {
            this.qa !== a && (this.qa = a, this.Ga());
        }
        Ga() {}
        tc() {}
        vc() {}
        Cb(a) {
            a = !!a;
            this.jb !== a && ((this.jb = a) ? (this.B || (this.B = this.W().createPanner(), 
            this.B.panningModel = this.i.Xd, this.B.distanceModel = this.i.Od, this.B.refDistance = this.i.Yd, 
            this.B.maxDistance = this.i.Wd, this.B.rolloffFactor = this.i.$d), this.M.disconnect(), 
            this.M.connect(this.B), this.B.connect(this.sa())) : (this.B.disconnect(), this.M.disconnect(), 
            this.M.connect(this.sa())));
        }
        Ne(a, b, d, h, m, p) {
            this.jb && (this.ud(a, b, d), a = self.da.Qe, this.B.coneInnerAngle = a(h), this.B.coneOuterAngle = a(m), 
            this.B.coneOuterGain = p);
        }
        ud(a, b, d) {
            this.jb && (this.ja[0] = a, this.ja[1] = b, this.ja[2] = 0, this.ia[0] = Math.cos(d), 
            this.ia[1] = Math.sin(d), this.ia[2] = 0, this.B.setPosition(...this.ja), this.B.setOrientation(...this.ia));
        }
        Pe(a) {
            this.fa = a;
        }
        pc() {}
        Le(a) {
            const b = this.B || this.M;
            b.disconnect();
            b.connect(a);
        }
        Ua() {
            return {
                aiid: this.Nb,
                tag: this.Y,
                duration: this.ea(),
                volume: this.ub,
                isPlaying: this.IsPlaying(),
                playbackTime: this.Ca(),
                playbackRate: this.qa,
                uid: this.fa,
                bufferOriginalUrl: this.nc(),
                bufferUrl: "",
                bufferType: this.mc(),
                isMusic: this.ta(),
                isLooping: this.V,
                isMuted: this.Ia,
                resumePosition: this.pc(),
                pan: this.Ce()
            };
        }
        Dc(a) {
            this.vd(a.playbackRate);
            this.td(a.isMuted);
        }
        Ce() {
            if (!this.B) return null;
            const a = this.B;
            return {
                pos: this.ja,
                orient: this.ia,
                cia: a.coneInnerAngle,
                coa: a.coneOuterAngle,
                cog: a.coneOuterGain,
                uid: this.fa
            };
        }
        Je(a) {
            if (a) {
                this.Cb(!0);
                a = this.B;
                var b = a.pos;
                this.ja[0] = b[0];
                this.ja[1] = b[1];
                this.ja[2] = b[2];
                b = a.orient;
                this.ia[0] = b[0];
                this.ia[1] = b[1];
                this.ia[2] = b[2];
                a.setPosition(...this.ja);
                a.setOrientation(...this.ia);
                a.coneInnerAngle = a.cia;
                a.coneOuterAngle = a.coa;
                a.coneOuterGain = a.cog;
                this.fa = a.uid;
            } else this.Cb(!1);
        }
    };
}

"use strict";

self.te = class extends self.ld {
    constructor(f, a, b) {
        super(f, a, b);
        this.L.qb.connect(this.M);
        this.L.onended = () => this.Fc();
    }
    c() {
        this.na();
        this.L.qb.disconnect();
        super.c();
    }
    O() {
        return this.L.O();
    }
    Fc() {
        this.I = !0;
        this.fa = -1;
        this.i.sc("ended", this.Y, this.Nb);
    }
    T() {
        return this.O().ended;
    }
    jc() {
        return this.I ? !0 : this.T();
    }
    Ca() {
        let f = this.O().currentTime;
        this.V || (f = Math.min(f, this.ea()));
        return f;
    }
    Play(f, a, b) {
        const d = this.O();
        1 !== d.playbackRate && (d.playbackRate = 1);
        d.loop !== f && (d.loop = f);
        this.Eb(a);
        d.muted && (d.muted = !1);
        if (d.currentTime !== b) try {
            d.currentTime = b;
        } catch (h) {
            console.warn(`[Construct 3] Exception seeking audio '${this.L.Va()}' to position '${b}': `, h);
        }
        this.i.ua(d);
        this.H = this.I = !1;
        this.V = f;
        this.qa = 1;
    }
    na() {
        const f = this.O();
        f.paused || f.pause();
        this.i.Da(f);
        this.I = !0;
        this.H = !1;
        this.fa = -1;
    }
    Xa() {
        if (!(this.H || this.I || this.T())) {
            var f = this.O();
            f.paused || f.pause();
            this.i.Da(f);
            this.H = !0;
        }
    }
    Bb() {
        !this.H || this.I || this.T() || (this.i.ua(this.O()), this.H = !1);
    }
    Lb() {
        this.O().muted = this.Ia || this.Ab();
    }
    uc(f) {
        f = !!f;
        this.V !== f && (this.V = f, this.O().loop = f);
    }
    Ga() {
        let f = this.qa;
        this.Yc && (f *= this.i.fc);
        try {
            this.O().playbackRate = f;
        } catch (a) {
            console.warn(`[Construct 3] Unable to set playback rate '${f}':`, a);
        }
    }
    tc(f) {
        if (!this.I && !this.T()) try {
            this.O().currentTime = f;
        } catch (a) {
            console.warn(`[Construct 3] Error seeking audio to '${f}': `, a);
        }
    }
    pc() {
        return this.Ca();
    }
    vc(f) {
        f ? this.IsPlaying() ? (this.O().pause(), this.ka = !0) : this.ka = !1 : this.ka && (this.i.ua(this.O()), 
        this.ka = !1);
    }
};

"use strict";

function U(f) {
    f.j && f.j.disconnect();
    f.j = null;
    f.ab = null;
}

self.ve = class extends self.ld {
    constructor(f, a, b) {
        super(f, a, b);
        this.j = null;
        this.Xb = d => this.Fc(d);
        this.Uc = !0;
        this.ab = null;
        this.N = this.Yb = this.Zb = 0;
        this.ad = 1;
    }
    c() {
        this.na();
        U(this);
        this.Xb = null;
        super.c();
    }
    Fc(f) {
        this.H || this.ka || f.target !== this.ab || (this.I = this.Uc = !0, this.fa = -1, 
        U(this), this.i.sc("ended", this.Y, this.Nb));
    }
    T() {
        return !this.I && this.j && this.j.loop || this.H ? !1 : this.Uc;
    }
    jc() {
        return !this.j || this.I ? !0 : this.T();
    }
    Ca() {
        let f;
        f = this.H ? this.N : this.Yb + (this.yb() - this.Zb) * this.qa;
        this.V || (f = Math.min(f, this.ea()));
        return f;
    }
    Play(f, a, b, d) {
        this.ad = 1;
        this.Eb(a);
        U(this);
        this.j = this.W().createBufferSource();
        this.j.buffer = this.L.Z;
        this.j.connect(this.M);
        this.ab = this.j;
        this.j.onended = this.Xb;
        this.j.loop = f;
        this.j.start(d, b);
        this.H = this.I = this.Uc = !1;
        this.V = f;
        this.qa = 1;
        this.Zb = this.yb();
        this.Yb = b;
    }
    na() {
        if (this.j) try {
            this.j.stop(0);
        } catch (f) {}
        this.I = !0;
        this.H = !1;
        this.fa = -1;
    }
    Xa() {
        this.H || this.I || this.T() || (this.N = this.Ca(), this.V && (this.N %= this.ea()), 
        this.H = !0, this.j.stop(0));
    }
    Bb() {
        !this.H || this.I || this.T() || (U(this), this.j = this.W().createBufferSource(), 
        this.j.buffer = this.L.Z, this.j.connect(this.M), this.ab = this.j, this.j.onended = this.Xb, 
        this.j.loop = this.V, this.Mb(), this.Ga(), this.j.start(0, this.N), this.Zb = this.yb(), 
        this.Yb = this.N, this.H = !1);
    }
    oc() {
        return super.oc() * this.ad;
    }
    Lb() {
        this.ad = this.Ia || this.Ab() ? 0 : 1;
        this.Mb();
    }
    uc(f) {
        f = !!f;
        this.V !== f && (this.V = f, this.j && (this.j.loop = f));
    }
    Ga() {
        let f = this.qa;
        this.Yc && (f *= this.i.fc);
        this.j && (this.j.playbackRate.value = f);
    }
    tc(f) {
        this.I || this.T() || (this.H ? this.N = f : (this.Xa(), this.N = f, this.Bb()));
    }
    pc() {
        return this.N;
    }
    vc(f) {
        f ? this.IsPlaying() ? (this.ka = !0, this.N = this.Ca(), this.V && (this.N %= this.ea()), 
        this.j.stop(0)) : this.ka = !1 : this.ka && (U(this), this.j = this.W().createBufferSource(), 
        this.j.buffer = this.L.Z, this.j.connect(this.M), this.ab = this.j, this.j.onended = this.Xb, 
        this.j.loop = this.V, this.Mb(), this.Ga(), this.j.start(0, this.N), this.Zb = this.yb(), 
        this.Yb = this.N, this.ka = !1);
    }
    Dc(f) {
        super.Dc(f);
        this.N = f.resumePosition;
    }
};

"use strict";

{
    class f {
        constructor(a) {
            this.i = a;
            this.f = a.W();
            this.Rd = -1;
            this.R = this.Y = "";
            this.g = null;
        }
        c() {
            this.f = null;
        }
        cg(a) {
            this.Rd = a;
        }
        kg(a) {
            this.Y = a;
        }
        o() {
            return this.f.createGain();
        }
        P() {}
        S() {}
        m(a, b, d, h) {
            a.cancelScheduledValues(0);
            if (0 === h) a.value = b; else {
                var m = this.f.currentTime;
                h += m;
                switch (d) {
                  case 0:
                    a.setValueAtTime(b, h);
                    break;

                  case 1:
                    a.setValueAtTime(a.value, m);
                    a.linearRampToValueAtTime(b, h);
                    break;

                  case 2:
                    a.setValueAtTime(a.value, m), a.exponentialRampToValueAtTime(b, h);
                }
            }
        }
        Ua() {
            return {
                type: this.R,
                tag: this.Y,
                params: this.g
            };
        }
    }
    self.me = class extends f {
        constructor(a, b, d, h, m, p, x) {
            super(a);
            this.R = "filter";
            this.g = [ b, d, h, m, p, x ];
            this.l = this.o();
            this.b = this.o();
            this.b.gain.value = x;
            this.a = this.o();
            this.a.gain.value = 1 - x;
            this.A = this.f.createBiquadFilter();
            this.A.type = b;
            this.A.frequency.value = d;
            this.A.detune.value = h;
            this.A.Q.value = m;
            this.A.gain.vlaue = p;
            this.l.connect(this.A);
            this.l.connect(this.a);
            this.A.connect(this.b);
        }
        c() {
            this.l.disconnect();
            this.A.disconnect();
            this.b.disconnect();
            this.a.disconnect();
            super.c();
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a);
        }
        P() {
            return this.l;
        }
        X(a, b, d, h) {
            switch (a) {
              case 0:
                b = Math.max(Math.min(b / 100, 1), 0);
                this.g[5] = b;
                this.m(this.b.gain, b, d, h);
                this.m(this.a.gain, 1 - b, d, h);
                break;

              case 1:
                this.g[1] = b;
                this.m(this.A.frequency, b, d, h);
                break;

              case 2:
                this.g[2] = b;
                this.m(this.A.detune, b, d, h);
                break;

              case 3:
                this.g[3] = b;
                this.m(this.A.Q, b, d, h);
                break;

              case 4:
                this.g[4] = b, this.m(this.A.gain, b, d, h);
            }
        }
    };
    self.ke = class extends f {
        constructor(a, b, d, h) {
            super(a);
            this.R = "delay";
            this.g = [ b, d, h ];
            this.l = this.o();
            this.b = this.o();
            this.b.gain.value = h;
            this.a = this.o();
            this.a.gain.value = 1 - h;
            this.nb = this.o();
            this.U = this.f.createDelay(b);
            this.U.delayTime.value = b;
            this.eb = this.o();
            this.eb.gain.value = d;
            this.l.connect(this.nb);
            this.l.connect(this.a);
            this.nb.connect(this.b);
            this.nb.connect(this.U);
            this.U.connect(this.eb);
            this.eb.connect(this.nb);
        }
        c() {
            this.l.disconnect();
            this.b.disconnect();
            this.a.disconnect();
            this.nb.disconnect();
            this.U.disconnect();
            this.eb.disconnect();
            super.c();
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a);
        }
        P() {
            return this.l;
        }
        X(a, b, d, h) {
            const m = self.da.nd;
            switch (a) {
              case 0:
                b = Math.max(Math.min(b / 100, 1), 0);
                this.g[2] = b;
                this.m(this.b.gain, b, d, h);
                this.m(this.a.gain, 1 - b, d, h);
                break;

              case 4:
                this.g[1] = m(b);
                this.m(this.eb.gain, m(b), d, h);
                break;

              case 5:
                this.g[0] = b, this.m(this.U.delayTime, b, d, h);
            }
        }
    };
    self.je = class extends f {
        constructor(a, b, d, h) {
            super(a);
            this.R = "convolution";
            this.g = [ d, h ];
            this.Md = this.Ld = "";
            this.l = this.o();
            this.b = this.o();
            this.b.gain.value = h;
            this.a = this.o();
            this.a.gain.value = 1 - h;
            this.cb = this.f.createConvolver();
            this.cb.normalize = d;
            this.cb.buffer = b;
            this.l.connect(this.cb);
            this.l.connect(this.a);
            this.cb.connect(this.b);
        }
        c() {
            this.l.disconnect();
            this.cb.disconnect();
            this.b.disconnect();
            this.a.disconnect();
            super.c();
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a);
        }
        P() {
            return this.l;
        }
        X(a, b, d, h) {
            switch (a) {
              case 0:
                b = Math.max(Math.min(b / 100, 1), 0), this.g[1] = b, this.m(this.b.gain, b, d, h), 
                this.m(this.a.gain, 1 - b, d, h);
            }
        }
        Zf(a, b) {
            this.Ld = a;
            this.Md = b;
        }
        Ua() {
            const a = super.Ua();
            a.bufferOriginalUrl = this.Ld;
            a.bufferUrl = "";
            a.bufferType = this.Md;
            return a;
        }
    };
    self.ne = class extends f {
        constructor(a, b, d, h, m, p) {
            super(a);
            this.R = "flanger";
            this.g = [ b, d, h, m, p ];
            this.l = this.o();
            this.a = this.o();
            this.a.gain.value = 1 - p / 2;
            this.b = this.o();
            this.b.gain.value = p / 2;
            this.gb = this.o();
            this.gb.gain.value = m;
            this.U = this.f.createDelay(b + d);
            this.U.delayTime.value = b;
            this.u = this.f.createOscillator();
            this.u.frequency.value = h;
            this.J = this.o();
            this.J.gain.value = d;
            this.l.connect(this.U);
            this.l.connect(this.a);
            this.U.connect(this.b);
            this.U.connect(this.gb);
            this.gb.connect(this.U);
            this.u.connect(this.J);
            this.J.connect(this.U.delayTime);
            this.u.start(0);
        }
        c() {
            this.u.stop(0);
            this.l.disconnect();
            this.U.disconnect();
            this.u.disconnect();
            this.J.disconnect();
            this.a.disconnect();
            this.b.disconnect();
            this.gb.disconnect();
            super.c();
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a);
        }
        P() {
            return this.l;
        }
        X(a, b, d, h) {
            switch (a) {
              case 0:
                b = Math.max(Math.min(b / 100, 1), 0);
                this.g[4] = b;
                this.m(this.b.gain, b / 2, d, h);
                this.m(this.a.gain, 1 - b / 2, d, h);
                break;

              case 6:
                this.g[1] = b / 1e3;
                this.m(this.J.gain, b / 1e3, d, h);
                break;

              case 7:
                this.g[2] = b;
                this.m(this.u.frequency, b, d, h);
                break;

              case 8:
                this.g[3] = b / 100, this.m(this.gb.gain, b / 100, d, h);
            }
        }
    };
    self.pe = class extends f {
        constructor(a, b, d, h, m, p, x) {
            super(a);
            this.R = "phaser";
            this.g = [ b, d, h, m, p, x ];
            this.l = this.o();
            this.a = this.o();
            this.a.gain.value = 1 - x / 2;
            this.b = this.o();
            this.b.gain.value = x / 2;
            this.A = this.f.createBiquadFilter();
            this.A.type = "allpass";
            this.A.frequency.value = b;
            this.A.detune.value = d;
            this.A.Q.value = h;
            this.u = this.f.createOscillator();
            this.u.frequency.value = p;
            this.J = this.o();
            this.J.gain.value = m;
            this.l.connect(this.A);
            this.l.connect(this.a);
            this.A.connect(this.b);
            this.u.connect(this.J);
            this.J.connect(this.A.frequency);
            this.u.start(0);
        }
        c() {
            this.u.stop(0);
            this.l.disconnect();
            this.A.disconnect();
            this.u.disconnect();
            this.J.disconnect();
            this.a.disconnect();
            this.b.disconnect();
            super.c();
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a);
        }
        P() {
            return this.l;
        }
        X(a, b, d, h) {
            switch (a) {
              case 0:
                b = Math.max(Math.min(b / 100, 1), 0);
                this.g[5] = b;
                this.m(this.b.gain, b / 2, d, h);
                this.m(this.a.gain, 1 - b / 2, d, h);
                break;

              case 1:
                this.g[0] = b;
                this.m(this.A.frequency, b, d, h);
                break;

              case 2:
                this.g[1] = b;
                this.m(this.A.detune, b, d, h);
                break;

              case 3:
                this.g[2] = b;
                this.m(this.A.Q, b, d, h);
                break;

              case 6:
                this.g[3] = b;
                this.m(this.J.gain, b, d, h);
                break;

              case 7:
                this.g[4] = b, this.m(this.u.frequency, b, d, h);
            }
        }
    };
    self.oe = class extends f {
        constructor(a, b) {
            super(a);
            this.R = "gain";
            this.g = [ b ];
            this.h = this.o();
            this.h.gain.value = b;
        }
        c() {
            this.h.disconnect();
            super.c();
        }
        S(a) {
            this.h.disconnect();
            this.h.connect(a);
        }
        P() {
            return this.h;
        }
        X(a, b, d, h) {
            const m = self.da.nd;
            switch (a) {
              case 4:
                this.g[0] = m(b), this.m(this.h.gain, m(b), d, h);
            }
        }
    };
    self.re = class extends f {
        constructor(a, b, d) {
            super(a);
            this.R = "tremolo";
            this.g = [ b, d ];
            this.h = this.o();
            this.h.gain.value = 1 - d / 2;
            this.u = this.f.createOscillator();
            this.u.frequency.value = b;
            this.J = this.o();
            this.J.gain.value = d / 2;
            this.u.connect(this.J);
            this.J.connect(this.h.gain);
            this.u.start(0);
        }
        c() {
            this.u.stop(0);
            this.u.disconnect();
            this.J.disconnect();
            this.h.disconnect();
            super.c();
        }
        S(a) {
            this.h.disconnect();
            this.h.connect(a);
        }
        P() {
            return this.h;
        }
        X(a, b, d, h) {
            switch (a) {
              case 0:
                b = Math.max(Math.min(b / 100, 1), 0);
                this.g[1] = b;
                this.m(this.h.gain, 1 - b / 2, d, h);
                this.m(this.J.gain, b / 2, d, h);
                break;

              case 7:
                this.g[0] = b, this.m(this.u.frequency, b, d, h);
            }
        }
    };
    self.qe = class extends f {
        constructor(a, b, d) {
            super(a);
            this.R = "ringmod";
            this.g = [ b, d ];
            this.l = this.o();
            this.b = this.o();
            this.b.gain.value = d;
            this.a = this.o();
            this.a.gain.value = 1 - d;
            this.tb = this.o();
            this.tb.gain.value = 0;
            this.u = this.f.createOscillator();
            this.u.frequency.value = b;
            this.u.connect(this.tb.gain);
            this.u.start(0);
            this.l.connect(this.tb);
            this.l.connect(this.a);
            this.tb.connect(this.b);
        }
        c() {
            this.u.stop(0);
            this.u.disconnect();
            this.tb.disconnect();
            this.l.disconnect();
            this.b.disconnect();
            this.a.disconnect();
            super.c();
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a);
        }
        P() {
            return this.l;
        }
        X(a, b, d, h) {
            switch (a) {
              case 0:
                b = Math.max(Math.min(b / 100, 1), 0);
                this.g[1] = b;
                this.m(this.b.gain, b, d, h);
                this.m(this.a.gain, 1 - b, d, h);
                break;

              case 7:
                this.g[0] = b, this.m(this.u.frequency, b, d, h);
            }
        }
    };
    self.le = class extends f {
        constructor(a, b, d, h, m, p) {
            super(a);
            this.R = "distortion";
            this.g = [ b, d, h, m, p ];
            this.l = this.o();
            this.cc = this.o();
            this.bc = this.o();
            this.$f(h, m);
            this.b = this.o();
            this.b.gain.value = p;
            this.a = this.o();
            this.a.gain.value = 1 - p;
            this.hc = this.f.createWaveShaper();
            this.Rc = new Float32Array(65536);
            this.gf(b, d);
            this.hc.curve = this.Rc;
            this.l.connect(this.cc);
            this.l.connect(this.a);
            this.cc.connect(this.hc);
            this.hc.connect(this.bc);
            this.bc.connect(this.b);
        }
        c() {
            this.l.disconnect();
            this.cc.disconnect();
            this.hc.disconnect();
            this.bc.disconnect();
            this.b.disconnect();
            this.a.disconnect();
            super.c();
        }
        $f(a, b) {
            .01 > a && (a = .01);
            this.cc.gain.value = a;
            this.bc.gain.value = Math.pow(1 / a, .6) * b;
        }
        gf(a, b) {
            for (let d = 0; 32768 > d; ++d) {
                let h = d / 32768;
                h = this.mg(h, a, b);
                this.Rc[32768 + d] = h;
                this.Rc[32768 - d - 1] = -h;
            }
        }
        mg(a, b, d) {
            d = 1.05 * d * b - b;
            const h = 0 > a ? -a : a;
            return (h < b ? h : b + d * self.da.Dg(h - b, 1 / d)) * (0 > a ? -1 : 1);
        }
        S(a) {
            this.b.disconnect();
            this.b.connect(a);
            this.a.disconnect();
            this.a.connect(a);
        }
        P() {
            return this.l;
        }
        X(a, b, d, h) {
            switch (a) {
              case 0:
                b = Math.max(Math.min(b / 100, 1), 0), this.g[4] = b, this.m(this.b.gain, b, d, h), 
                this.m(this.a.gain, 1 - b, d, h);
            }
        }
    };
    self.ie = class extends f {
        constructor(a, b, d, h, m, p) {
            super(a);
            this.R = "compressor";
            this.g = [ b, d, h, m, p ];
            this.h = this.f.createDynamicsCompressor();
            this.h.threshold.value = b;
            this.h.knee.value = d;
            this.h.ratio.value = h;
            this.h.attack.value = m;
            this.h.release.value = p;
        }
        c() {
            this.h.disconnect();
            super.c();
        }
        S(a) {
            this.h.disconnect();
            this.h.connect(a);
        }
        P() {
            return this.h;
        }
        X() {}
    };
    self.he = class extends f {
        constructor(a, b, d) {
            super(a);
            this.R = "analyser";
            this.g = [ b, d ];
            this.h = this.f.createAnalyser();
            this.h.fftSize = b;
            this.h.smoothingTimeConstant = d;
            this.Pd = new Float32Array(this.h.frequencyBinCount);
            this.ae = new Uint8Array(b);
            this.Zd = this.Ma = 0;
            this.i.Re(this);
        }
        c() {
            this.i.Tf(this);
            this.h.disconnect();
            super.c();
        }
        Ea() {
            this.h.getFloatFrequencyData(this.Pd);
            this.h.getByteTimeDomainData(this.ae);
            const a = this.h.fftSize;
            let b = this.Ma = 0;
            for (var d = 0; d < a; ++d) {
                let h = (this.ae[d] - 128) / 128;
                0 > h && (h = -h);
                this.Ma < h && (this.Ma = h);
                b += h * h;
            }
            d = self.da.He;
            this.Ma = d(this.Ma);
            this.Zd = d(Math.sqrt(b / a));
        }
        S(a) {
            this.h.disconnect();
            this.h.connect(a);
        }
        P() {
            return this.h;
        }
        X() {}
        Be() {
            return {
                tag: this.Y,
                index: this.Rd,
                peak: this.Ma,
                rms: this.Zd,
                binCount: this.h.frequencyBinCount,
                freqBins: this.Pd
            };
        }
    };
}

"use strict";

function V(f) {
    window.C3_RegisterSW && window.OfflineClientInfo && window.OfflineClientInfo.SetMessageCallback(a => u(f, "sw-message", a.data));
}

function W(f) {
    f = f.orientation;
    if (screen.orientation && screen.orientation.lock) screen.orientation.lock(f).catch(a => console.warn("[Construct 3] Failed to lock orientation: ", a)); else try {
        let a = !1;
        screen.lockOrientation ? a = screen.lockOrientation(f) : screen.webkitLockOrientation ? a = screen.webkitLockOrientation(f) : screen.mozLockOrientation ? a = screen.mozLockOrientation(f) : screen.msLockOrientation && (a = screen.msLockOrientation(f));
        a || console.warn("[Construct 3] Failed to lock orientation");
    } catch (a) {
        console.warn("[Construct 3] Failed to lock orientation: ", a);
    }
}

self.ma.Ta(class extends self.Ba {
    constructor(f) {
        super(f, "browser");
        this.s = "";
        I(this, [ [ "get-initial-state", a => {
            this.s = a.exportType;
            return {
                location: location.toString(),
                isOnline: !!navigator.onLine,
                referrer: document.referrer,
                title: document.title,
                isCookieEnabled: !!navigator.cookieEnabled,
                screenWidth: screen.width,
                screenHeight: screen.height,
                windowOuterWidth: window.outerWidth,
                windowOuterHeight: window.outerHeight,
                isScirraArcade: "undefined" !== typeof window.is_scirra_arcade
            };
        } ], [ "ready-for-sw-messages", () => V(this) ], [ "alert", a => this.Ec(a) ], [ "close", () => {
            navigator.app && navigator.app.exitApp ? navigator.app.exitApp() : navigator.device && navigator.device.exitApp ? navigator.device.exitApp() : window.close();
        } ], [ "set-focus", a => this.Jc(a) ], [ "vibrate", a => {
            navigator.vibrate && navigator.vibrate(a.pattern);
        } ], [ "lock-orientation", a => W(a) ], [ "unlock-orientation", () => {
            try {
                screen.orientation && screen.orientation.unlock ? screen.orientation.unlock() : screen.unlockOrientation ? screen.unlockOrientation() : screen.webkitUnlockOrientation ? screen.webkitUnlockOrientation() : screen.mozUnlockOrientation ? screen.mozUnlockOrientation() : screen.msUnlockOrientation && screen.msUnlockOrientation();
            } catch (a) {}
        } ], [ "navigate", a => {
            var b = a.type;
            if ("back" === b) navigator.app && navigator.app.backHistory ? navigator.app.backHistory() : window.history.back(); else if ("forward" === b) window.history.forward(); else if ("reload" === b) location.reload(); else if ("url" === b) {
                b = a.url;
                const d = a.target;
                a = a.exportType;
                self.cordova && self.cordova.InAppBrowser ? self.cordova.InAppBrowser.open(b, "_system") : "preview" === a || "windows-webview2" === a ? window.open(b, "_blank") : this.Sg || (2 === d ? window.top.location = b : 1 === d ? window.parent.location = b : window.location = b);
            } else "new-window" === b && (b = a.url, a = a.tag, self.cordova && self.cordova.InAppBrowser ? self.cordova.InAppBrowser.open(b, "_system") : window.open(b, a));
        } ], [ "request-fullscreen", a => {
            if ("windows-webview2" === this.s || "macos-wkwebview" === this.s) self.ma.Kb(!0), 
            this.v.Nc({
                type: "set-fullscreen",
                fullscreen: !0
            }); else {
                const b = {
                    navigationUI: "auto"
                };
                a = a.navUI;
                1 === a ? b.navigationUI = "hide" : 2 === a && (b.navigationUI = "show");
                a = document.documentElement;
                a.requestFullscreen ? a.requestFullscreen(b) : a.mozRequestFullScreen ? a.mozRequestFullScreen(b) : a.msRequestFullscreen ? a.msRequestFullscreen(b) : a.webkitRequestFullScreen && ("undefined" !== typeof Element.ALLOW_KEYBOARD_INPUT ? a.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT) : a.webkitRequestFullScreen());
            }
        } ], [ "exit-fullscreen", () => {
            "windows-webview2" === this.s || "macos-wkwebview" === this.s ? (self.ma.Kb(!1), 
            this.v.Nc({
                type: "set-fullscreen",
                fullscreen: !1
            })) : document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen ? document.msExitFullscreen() : document.webkitCancelFullScreen && document.webkitCancelFullScreen();
        } ], [ "set-hash", a => {
            location.hash = a.hash;
        } ] ]);
        window.addEventListener("online", () => {
            u(this, "online-state", {
                isOnline: !0
            });
        });
        window.addEventListener("offline", () => {
            u(this, "online-state", {
                isOnline: !1
            });
        });
        window.addEventListener("hashchange", () => {
            u(this, "hashchange", {
                location: location.toString()
            });
        });
        document.addEventListener("backbutton", () => {
            u(this, "backbutton");
        });
    }
    Ec(f) {
        alert(f.message);
    }
    Jc(f) {
        f = f.isFocus;
        if ("nwjs" === this.s) {
            const a = "nwjs" === this.s ? nw.Window.get() : null;
            f ? a.focus() : a.blur();
        } else f ? window.focus() : window.blur();
    }
});

"use strict";

self.ma.Ta(class extends self.Ba {
    constructor(f) {
        super(f, "mouse");
        I(this, [ [ "cursor", a => {
            document.documentElement.style.cursor = a;
        } ], [ "request-pointer-lock", () => {
            this.v.G.requestPointerLock();
        } ], [ "release-pointer-lock", () => {
            document.exitPointerLock();
        } ] ]);
        document.addEventListener("pointerlockchange", () => {
            u(this, "pointer-lock-change", {
                "has-pointer-lock": !!document.pointerLockElement
            });
        });
        document.addEventListener("pointerlockerror", () => {
            u(this, "pointer-lock-error", {
                "has-pointer-lock": !!document.pointerLockElement
            });
        });
    }
});

"use strict";

async function X(f, a) {
    a = a.type;
    let b = !0;
    0 === a ? b = await Y() : 1 === a && (b = await Z());
    u(f, "permission-result", {
        type: a,
        result: b
    });
}

async function Y() {
    if (!self.DeviceOrientationEvent || !self.DeviceOrientationEvent.requestPermission) return !0;
    try {
        return "granted" === await self.DeviceOrientationEvent.requestPermission();
    } catch (f) {
        return console.warn("[Touch] Failed to request orientation permission: ", f), !1;
    }
}

async function Z() {
    if (!self.DeviceMotionEvent || !self.DeviceMotionEvent.requestPermission) return !0;
    try {
        return "granted" === await self.DeviceMotionEvent.requestPermission();
    } catch (f) {
        return console.warn("[Touch] Failed to request motion permission: ", f), !1;
    }
}

self.ma.Ta(class extends self.Ba {
    constructor(f) {
        super(f, "touch");
        H(this, "request-permission", a => X(this, a));
    }
});