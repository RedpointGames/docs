(function () {
  "use strict";

  void 0 === window.blueprintUE && (window.blueprintUE = {}),
    void 0 === window.blueprintUE.render && (window.blueprintUE.render = {});
  function rgba(t, e, n, r) {
    function sanitizeRGB(t) {
      t = parseInt(t, 10);
      return isNaN(t) ? 255 : Math.min(Math.max(t, 0), 255);
    }
    return {
      red: sanitizeRGB(t),
      green: sanitizeRGB(e),
      blue: sanitizeRGB(n),
      alpha:
        ((t = r),
        (t = parseFloat(t)),
        isNaN(t) ? 1 : Math.min(Math.max(t, 0), 1)),
      log: function () {},
      generateBlueprintText: function () {
        return (
          "(R=" +
          this.decimalToFloat(this.red) +
          ",G=" +
          this.decimalToFloat(this.green) +
          ",B=" +
          this.decimalToFloat(this.blue) +
          ",A=" +
          this.fixAlphaForBlueprintText(this.alpha) +
          ")"
        );
      },
      decodeBlueprintText: function (t) {
        t = String(t).split(",");
        return rgba(
          this.floatToDecimal(t[0].substr(3)),
          this.floatToDecimal(t[1].substr(2)),
          this.floatToDecimal(t[2].substr(2)),
          parseFloat(t[3].substr(2, t[3].length - 3))
        );
      },
      setValuesFromBlueprintText: function (t) {
        t = this.decodeBlueprintText(t);
        (this.red = t.red),
          (this.green = t.green),
          (this.blue = t.blue),
          (this.alpha = t.alpha);
      },
      setValuesFromProps: function (t) {
        for (var e, n = 0, r = t.length; n < r; ++n)
          (e = this.floatToDecimal(t[n].value)),
            "R" === t[n].name && (this.red = e),
            "G" === t[n].name && (this.green = e),
            "B" === t[n].name && (this.blue = e),
            "A" === t[n].name && (this.alpha = e);
      },
      generateCss: function () {
        return (
          "rgba(" +
          this.red +
          ", " +
          this.green +
          ", " +
          this.blue +
          ", " +
          this.alpha +
          ")"
        );
      },
      floatToDecimal: function (t) {
        t = Math.round(255 * t);
        return isNaN(t) ? 255 : Math.min(Math.max(t, 0), 255);
      },
      decimalToFloat: function (t) {
        var e = 0;
        return 255 <= t
          ? "1.000000"
          : t <= 0
          ? "0.000000"
          : ((e = t / 255),
            isNaN(e) ? "1.000000" : (e.toFixed(6) + "000000").substr(0, 8));
      },
      fixAlphaForBlueprintText: function (t) {
        return (parseFloat(t).toFixed(6) + "000000").substr(0, 8);
      },
    };
  }
  function randomInterval(t, e) {
    return Math.floor(Math.random() * (e - t + 1)) + t;
  }
  function generateGUID() {
    for (var t = "", e = 0; e < 32; ++e)
      1 === randomInterval(0, 1)
        ? (t += String.fromCharCode(randomInterval(65, 90)))
        : (t += String.fromCharCode(randomInterval(48, 57)));
    return t;
  }
  function clamp(t, e, n) {
    return n < e
      ? new Error("Argument min is superior to max")
      : Math.min(Math.max(t, e), n);
  }
  function removeQuotes(t) {
    var e = "";
    return null == t
      ? t
      : '"' ===
        (e = '"' === (e = String(t)).charAt(0) ? e.substring(1) : e).charAt(
          e.length - 1
        )
      ? e.substring(0, e.length - 1)
      : e;
  }
  function nl2br(t) {
    var e = "",
      n = "";
    return null == t
      ? t
      : ("\\r\\n" === (n = String(t)).substring(n.length - 4) && (e = "<br>"),
        n.replace(/\\r\\n/g, "<br>") + e);
  }
  function n2br(t) {
    var e = "",
      n = "";
    return null == t
      ? t
      : ("\\n" === (n = String(t)).substring(n.length - 2) && (e = "<br>"),
        n.replace(/\\n/g, "<br>") + e);
  }
  function transformInternalName(t) {
    var e = "";
    return null == t
      ? t
      : (e =
          0 ===
          (e = (e = (e = String(t)).replace(/_/g, " ")).replace(
            /([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g,
            "$1$4 $2$3$5"
          )).indexOf("K2")
            ? e.replace(/ /g, "").substring(2)
            : e).trim();
  }
  function getSvgPath(t, e, n, r) {
    return t.left <= e.left
      ? t.top <= e.top
        ? "M 0 0 C" +
          ((n / 2) >> 0) +
          ",0 " +
          ((n / 2) >> 0) +
          "," +
          r +
          " " +
          n +
          "," +
          r
        : "M 0 " +
          r +
          " C" +
          ((n / 2) >> 0) +
          "," +
          r +
          " " +
          ((n / 2) >> 0) +
          ",0 " +
          n +
          ",0"
      : t.top <= e.top
      ? "M " + n + " 0 C" + (n + n) + ",0 " + -n + "," + r + " 0," + r
      : "M " + n + " " + r + " C" + (n + n) + "," + r + " " + -n + ",0 0,0";
  }
  function correctSvgPathForKnot(t, e, n, r, a, i, u) {
    var o =
        e.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains(
          "knot"
        ),
      l =
        n.parentElement.parentElement.parentElement.parentElement.parentElement.classList.contains(
          "knot"
        );
    if (!o && l) {
      if (
        !e.parentElement.parentElement.parentElement.classList.contains(
          "left-col"
        ) &&
        r.left > a.left
      )
        return r.top > a.top
          ? "M " + i + " " + u + " C" + (i + 150) + "," + u + " " + i + ",0 0,0"
          : "M " + i + " 0 C" + (i + 150) + ",0 " + i + "," + u + " 0," + u;
    } else if (
      o &&
      !l &&
      n.parentElement.parentElement.parentElement.classList.contains(
        "left-col"
      ) &&
      r.left > a.left
    )
      return a.top > r.top
        ? "M 0 " + u + " C-75," + u + " -75,0 " + i + ",0"
        : "M 0 0 C-75,0 -75," + u + " " + i + "," + u;
    return t;
  }
  function ucfirst(t) {
    t = t.trim();
    return t.charAt(0).toUpperCase() + t.substring(1);
  }
  function floatFixed(t, e) {
    t = t.toFixed(e);
    return parseFloat(t);
  }
  function getCoefficentOffsetForScale(t, e) {
    return {
      1.56: { in: 0.6756661991584852, out: 0 },
      1.48: { in: 0.7142327650111193, out: 0.6410658307210031 },
      1.4: { in: 0.7574685534591195, out: 0.6754098360655738 },
      1.32: { in: 0.806276150627615, out: 0.7144970414201184 },
      1.24: { in: 0.8622540250447227, out: 0.7571157495256167 },
      1.16: { in: 0.9260326609029779, out: 0.8064024390243902 },
      1.08: { in: 1, out: 0.8620689655172413 },
      1: { in: 1.086873508353222, out: 0.92616226071103 },
      0.92: { in: 1.1905717151454362, out: 1 },
      0.84: { in: 1.3155934007450771, out: 1.0877659574468086 },
      0.76: { in: 1.4703557312252964, out: 1.191860465116279 },
      0.68: { in: 1.666871921182266, out: 1.3173076923076923 },
      0.6: { in: 1.9227967953386744, out: 1.4714285714285715 },
      0.52: { in: 2.272340425531915, out: 1.6653225806451613 },
      0.44: { in: 2.7781954887218046, out: 1.9209302325581394 },
      0.36: { in: 3.5708661417322833, out: 2.273224043715847 },
      0.28: { in: 5, out: 2.78 },
      0.2: { in: 8.33266129032258, out: 3.572649572649573 },
      0.12: { in: 25, out: 5 },
      0.04: { in: 0, out: 8.333333333333334 },
    }[t][e];
  }
  function getCoefficentOffsetForScaleWhenZoomIn(t) {
    return getCoefficentOffsetForScale(t, "in");
  }
  function getCoefficentOffsetForScaleWhenZoomOut(t) {
    return getCoefficentOffsetForScale(t, "out");
  }
  function getKismetMathText(t) {
    var e = t.indexOf("_");
    return -1 !== e
      ? "GreaterEqual" === (e = t.substring(0, e))
        ? ">="
        : "Greater" === e
        ? ">"
        : "Subtract" === e
        ? "-"
        : "LessEqual" === e
        ? "<="
        : "Less" === e
        ? "<"
        : "EqualEqual" === e
        ? "=="
        : "NotEqual" === e
        ? "!="
        : "Not" === e
        ? "NOT"
        : "Percent" === e
        ? "%"
        : "Multiply" === e
        ? "×"
        : "Divide" === e
        ? "÷"
        : "Add" === e && "+"
      : -1 !== t.indexOf("NAND")
      ? "NAND"
      : -1 !== t.indexOf("AND")
      ? "AND"
      : -1 !== t.indexOf("XOR")
      ? "XOR"
      : -1 !== t.indexOf("NOR")
      ? "NOR"
      : -1 !== t.indexOf("OR")
      ? "OR"
      : -1 !== t.indexOf("Max")
      ? "MAX"
      : -1 !== t.indexOf("Min")
      ? "MIN"
      : -1 !== t.indexOf("Abs")
      ? "ABS"
      : -1 !== t.indexOf("DegSin")
      ? "SINd"
      : -1 !== t.indexOf("DegAcos")
      ? "ACOSd"
      : -1 !== t.indexOf("Sqrt") && "SQRT";
  }
  function getArrayText(t) {
    return t.replace("Array_", "");
  }
  function formatAxisValueForDisplay(t) {
    var e = "";
    return void 0 === t || "0" === (e = t.trim()) || "0.000000" === e
      ? "0.0"
      : ("." === (e = e.replace(/0+$/, "")).charAt(e.length - 1) && (e += "0"),
        e);
  }
  function getLastPartAsset(t) {
    var e = "";
    return null == t
      ? t
      : "'" ===
        (e = (t = (t = t.split("/"))[t.length - 1].split("."))[
          t.length - 1
        ]).charAt(e.length - 1)
      ? e.substring(0, e.length - 1)
      : e;
  }
  function float2hex(t) {
    return ("0" + ((255 * clamp(t, 0, 1)) >> 0).toString(16)).slice(-2);
  }
  function float2dec(t) {
    return (255 * clamp(t, 0, 1)) >> 0;
  }
  function createElem(t, e, n) {
    for (var r = document.createElement(t), a = 0, i = e.length; a < i; ++a)
      "" !== e[a] && r.classList.add(e[a]);
    for (a = 0, i = n.length; a < i; ++a) r.setAttribute(n[a].name, n[a].value);
    return r;
  }
  function createElems(t) {
    for (var e, n, r = [], a = 0, i = t.length, u = 0, o = null; a < i; ++a)
      if ((o = null) !== t[a]) {
        if (
          void 0 !== t[a].tag &&
          ((o = createElem(t[a].tag, t[a].classes || [], t[a].attrs || [])),
          void 0 !== t[a].childs)
        )
          for (u = 0, n = (e = createElems(t[a].childs)).length; u < n; ++u)
            o.appendChild(e[u]);
        void 0 !== t[a].text &&
          "" !== t[a].text &&
          (null === o
            ? (o = document.createTextNode(t[a].text))
            : (o.textContent = t[a].text)),
          null !== o && r.push(o);
      }
    return r;
  }
  function getIndentFormat(t) {
    return Array(3 * (t || 1) + 1).join(" ");
  }
  function convertTextToProps(t) {
    var o,
      e,
      l = 0,
      s = "",
      n = {},
      r = "";
    function extractItemsInParenthesis() {
      var t,
        e = [],
        n = [],
        r = 0,
        a = "",
        i = !1,
        u = 1;
      for (
        l += 1;
        l < o &&
        ((i = '"' === s[l] && "\\" !== s[l - 1] ? !i : i) ||
          "(" !== s[l] ||
          (u += 1),
        i || ")" !== s[l] || 0 != --u);

      )
        !i && "," === s[l] && u <= 1 ? (n.push(a), (a = "")) : (a += s[l]),
          (l += 1);
      for (l += 1, "" !== a && n.push(a), t = n.length; r < t; ++r)
        e.push(convertTextToProps(n[r]));
      return e;
    }
    if (
      ((s = t.trim()),
      (o = s.length),
      "(" === s.charAt(0) && ")" === s.charAt(o - 1))
    )
      return extractItemsInParenthesis();
    for (; l < o; )
      if ('"' === s[l] && 0 === r.length)
        (n.value = (function () {
          var t = "";
          for (l += 1; l < o && ('"' !== s[l] || "\\" === s[l - 1]); )
            (t += s[l]), (l += 1);
          return (l += 1), t;
        })()),
          (n.useDelimiter = !0);
      else if ("=" === s[l]) {
        if (n.name && "" !== n.name)
          return (
            (n.value = s.substring(n.name.length + 1)), (n.isDirty = !0), n
          );
        (n.name = r), (r = ""), (l += 1);
      } else if ("(" === s[l])
        if (
          null !==
          (e = (function () {
            var t = l,
              e = "";
            for (l += 1; l < o && ")" !== s[l]; ) (e += s[l]), (l += 1);
            return "=" === s[(l += 1)]
              ? ((l += 1), "(" + e + ")")
              : ((l = t), null);
          })())
        )
          (n.name = r + e), (r = "");
        else {
          if (void 0 !== n.value)
            return (
              n.name
                ? (n.value = s.substring(n.name.length + 1))
                : (n.value = s),
              (n.isDirty = !0),
              n
            );
          (n.value = extractItemsInParenthesis()), (l += 1);
        }
      else (r += s[l]), (l += 1);
    return (
      "" !== r &&
        (-1 === ["NSLOCTEXT", "LOCGEN_FORMAT_NAMED", "INVTEXT"].indexOf(r)
          ? (n.value = r)
          : (n.prefix = r)),
      n
    );
  }
  function convertPropsToText(t) {
    var e = "",
      n = 0,
      r = [],
      a = null,
      i = "",
      u = "";
    if (Array.isArray(t)) {
      for (; n < t.length; ++n) r.push(convertPropsToText(t[n]));
      e += "(" + r.join(",") + ")";
    } else if ("object" == typeof t)
      return (
        (a = t.value),
        (i = ""),
        t.useDelimiter && (i = '"'),
        "object" == typeof a && (a = convertPropsToText(t.value)),
        (u = ""),
        void 0 !== t.name && (u = t.name + "="),
        void 0 !== t.prefix && (u += t.prefix),
        u + i + a + i
      );
    return e;
  }
  function extractObjectDefinition(t) {
    var e,
      n = 6,
      r = "",
      a = [],
      i = "",
      u = "";
    if (((r = t.trim()), (e = r.length), "Begin " !== r.substring(0, 6)))
      return null;
    for (; n < e; )
      '"' === r[n] && 0 === i.length
        ? (a.push({
            name: u,
            value: (function () {
              var t = "";
              for (n += 1; n < e && ('"' !== r[n] || "\\" === r[n - 1]); )
                (t += r[n]), (n += 1);
              return (n += 1), t;
            })(),
            useDelimiter: !0,
          }),
          (u = ""))
        : ("=" === r[n]
            ? ((u = i), (i = ""))
            : " " === r[n]
            ? ("" !== i &&
                ("" === u
                  ? a.push({ value: i })
                  : a.push({ name: u, value: i })),
              (u = i = ""))
            : (i += r[n]),
          (n += 1));
    return (
      "" !== i &&
        ("" === u ? a.push({ value: i }) : a.push({ name: u, value: i })),
      a
    );
  }
  function searchPropWithName(t, e) {
    for (var n = 0, r = t.length; n < r; ++n) if (t[n].name === e) return t[n];
    return null;
  }
  function formatTextL11nFromProp(t) {
    var e,
      n = 1,
      r = "";
    if ("string" == typeof t.value) return t.value;
    if (void 0 === t.prefix) return String(t.value);
    if ("NSLOCTEXT" === t.prefix)
      return void 0 !== t.value[2] && "string" == typeof t.value[2].value
        ? t.value[2].value
        : "";
    if ("LOCGEN_FORMAT_NAMED" !== t.prefix)
      return "INVTEXT" === t.prefix &&
        0 < t.value.length &&
        void 0 !== t.value[0] &&
        "string" == typeof t.value[0].value
        ? t.value[0].value
        : "";
    for (
      e = t.value.length, r = formatTextL11nFromProp(t.value[0]);
      n < e;
      n += 2
    )
      r = r.replace(
        "{" + t.value[n].value + "}",
        formatTextL11nFromProp(t.value[n + 1])
      );
    return r;
  }
  function castInt(t, e, n) {
    null === n ? (this[e] = parseInt(t, 10)) : (this[e][n] = parseInt(t, 10));
  }
  function castStr(t, e) {
    this[e] = t;
  }
  function Bus() {
    this.data = {};
  }
  (Bus.prototype.listen = function (t, e) {
    return "string" != typeof t
      ? new TypeError(
          "Argument 'eventName' is incorrect, expect string, get " + typeof t
        )
      : "function" != typeof e
      ? new TypeError(
          "Argument 'callback' is incorrect, expect function, get " + typeof e
        )
      : (void 0 === this.data[t] && (this.data[t] = []),
        void this.data[t].push(e));
  }),
    (Bus.prototype.emit = function (t, e) {
      var r,
        n = 0;
      if ("string" != typeof t)
        return new TypeError(
          "Argument 'eventName' is incorrect, expect string, get " + typeof t
        );
      if (void 0 === this.data[t]) return !1;
      if (void 0 !== e && !Array.isArray(e))
        return new TypeError(
          "Argument 'args' is incorrect, expect array or undefined, get " +
            typeof e
        );
      for (r = this.data[t].length, n = 0; n < r; ++n)
        if (!1 === this.data[t][n].apply(null, e)) return !1;
      return !0;
    });
  function flattenHierarchy(e, n) {
    for (var i, t = [], s = 0, o = e.length, d = [], r = 0; s < o; ++s) {
      if (!0 === e[s].containsVisualNodes && void 0 !== e[s].nodes)
        for (
          d = [],
            r = 0,
            i = (d =
              null !== searchPropWithName(e[s].nodes[0].props, "GraphGuid") &&
              0 < e[s].nodes[0].nodes.length
                ? flattenHierarchy(e[s].nodes[0].nodes, e[s].guid)
                : flattenHierarchy(e[s].nodes, e[s].guid)).length;
          r < i;
          ++r
        )
          t.push(d[r]);
      t.push({ node: e[s], parentGUID: n });
    }
    return t;
  }
  function eventExpandNode(e) {
    this.bus.emit("interactor__expand_node", [e]);
  }
  function eventInitEnvironment() {
    this.initBusEnvironment(), this.initEnvironment();
  }
  function eventInitInteractor() {
    this.initBusInteractor(), this.initInteractor();
  }
  function eventInitUpdater() {
    this.initBusUpdater(), this.initUpdater();
  }
  function eventPasteTextFromClipboard(e) {
    var n,
      i,
      t,
      s = new Interpreter(),
      e = s.parseText(e),
      o = 0,
      d = [],
      r = 0,
      a = [],
      l = 0;
    if (0 === e.length) this.bus.emit("end_paste");
    else if (s.isBelow413Version !== this.blueprint.isBelow413Version)
      this.bus.emit("end_paste");
    else {
      for (
        i = flattenHierarchy(e, null),
          r = this.blueprint.nodesParsed.length,
          o = 0,
          n = i.length;
        o < n;
        ++o
      )
        d.push(i[o].node.guid),
          this.blueprint.nodesParsed.push(i[o]),
          this.blueprint.nodesDisplayed.nodes.push({
            idx: r,
            guid: i[o].node.guid,
          }),
          (r += 1);
      this.listIDs(),
        setTimeout(
          function () {
            for (
              this.instances.environment.updateLoading("DISPLAY NODES..."),
                this.instances.environment.showLoading(),
                a = [],
                t = this.blueprint.nodesDisplayed.nodes.length;
              l < t;
              ++l
            )
              -1 !==
                d.indexOf(
                  this.blueprint.nodesParsed[
                    this.blueprint.nodesDisplayed.nodes[l].idx
                  ].node.guid
                ) &&
                a.push(
                  this.blueprint.nodesParsed[
                    this.blueprint.nodesDisplayed.nodes[l].idx
                  ].node
                );
            this.instances.environment.displayNodesInViewport(a),
              setTimeout(
                function () {
                  this.instances.environment.updateLoading("DRAW LINKS..."),
                    this.instances.environment.drawLinks(
                      this.blueprint.nodesDisplayed.links
                    ),
                    setTimeout(
                      function () {
                        this.instances.environment.removeLoading(),
                          this.bus.emit("end_paste");
                      }.bind(this),
                      0
                    );
                }.bind(this),
                0
              );
          }.bind(this),
          0
        );
    }
  }
  function eventReDrawLinks(e, n) {
    for (
      var i = this.findNodeIdxWithId(e),
        t = [],
        s = 0,
        o = this.blueprint.nodesParsed[i].node.pins.length,
        d = 0,
        r = this.blueprint.nodesDisplayed.links.length;
      s < o;
      ++s
    )
      if (this.blueprint.nodesParsed[i].node.pins[s].isLinkedTo())
        for (d = 0; d < r; ++d)
          -1 !==
            this.blueprint.nodesDisplayed.links[d].indexOf(
              this.blueprint.nodesParsed[i].node.pins[s].id
            ) && t.push(this.blueprint.nodesDisplayed.links[d]);
    this.instances.environment.reDrawLinks(t, n);
  }
  function eventReduceNode(e) {
    for (
      var n = [],
        i = 0,
        t = this.findNodeIdxWithId(e),
        s = searchPropWithName(
          this.blueprint.nodesParsed[t].node.objectDefinition,
          "Name"
        ),
        o = this.blueprint.nodesParsed[t].node.pins.length;
      i < o;
      ++i
    )
      !1 === this.blueprint.nodesParsed[t].node.pins[i].hasToHidePin(!1) &&
        n.push(s.value + " " + this.blueprint.nodesParsed[t].node.pins[i].id);
    this.bus.emit("interactor__reduce_node", [e, n]);
  }
  function fixPositionByCheckingNodesInViewport(e, n, i) {
    for (
      var t,
        s = [],
        o = [
          [n[0], n[0] + i[0]],
          [n[1], n[1] + i[1]],
        ],
        d = 0,
        r = e.length,
        a = [],
        l = 0;
      d < r;
      ++d
    )
      e[d][0] >= o[0][0] &&
        e[d][0] <= o[0][1] &&
        e[d][1] >= o[1][0] &&
        e[d][1] <= o[1][1] &&
        s.push(e[d]);
    if (0 === s.length) return null;
    if (1 === s.length) return s[0];
    for (a = s[0], l = 1, t = s.length; l < t; ++l)
      (a[0] = Math.min(a[0], s[l][0])), (a[1] = Math.min(a[1], s[l][1]));
    return a;
  }
  function findMinPosNode() {
    var e,
      n,
      i,
      t,
      s = -20,
      o = -60,
      d = 0,
      r = 0,
      a = [],
      l = [],
      p = 1,
      h = [];
    if (0 === this.blueprint.nodesDisplayed.nodes.length) return { x: 0, y: 0 };
    for (
      a = [
        [
          (d =
            this.blueprint.nodesParsed[
              this.blueprint.nodesDisplayed.nodes[0].idx
            ].node.position[0]),
          (r =
            this.blueprint.nodesParsed[
              this.blueprint.nodesDisplayed.nodes[0].idx
            ].node.position[1]),
        ],
      ],
        l = [d, r],
        e = this.blueprint.nodesDisplayed.nodes.length;
      p < e;
      ++p
    )
      (n =
        this.blueprint.nodesParsed[this.blueprint.nodesDisplayed.nodes[p].idx]
          .node.position[0]),
        (i =
          this.blueprint.nodesParsed[this.blueprint.nodesDisplayed.nodes[p].idx]
            .node.position[1]),
        a.push([n, i]),
        (l[0] > n || (l[0] === n && l[1] > i)) && (l = [n, i]),
        (d = Math.min(n, d)),
        (r = Math.min(i, r));
    return d === l[0] && r === l[1]
      ? { x: -(d + s), y: -(r + o) }
      : (null ===
        (h = fixPositionByCheckingNodesInViewport(
          a,
          [d, r],
          [
            (t = this.data.htmlElement
              .querySelector(".frame")
              .getBoundingClientRect()).width,
            t.height,
          ]
        ))
          ? (h = [-(l[0] + s), -(l[1] + o)])
          : ((h[0] = -(h[0] + s)), (h[1] = -(h[1] + o))),
        { x: h[0], y: h[1] });
  }
  function extractBreadcrumb(e, n) {
    for (var i = 0, t = this.blueprint.nodesParsed.length; i < t; ++i)
      if (e === this.blueprint.nodesParsed[i].node.guid) {
        if (
          (n.push({
            id: e,
            text: this.blueprint.nodesParsed[i].node.findHeaderName(),
          }),
          this.blueprint.nodesParsed[i].parentGUID)
        )
          return extractBreadcrumb.call(
            this,
            this.blueprint.nodesParsed[i].parentGUID,
            n
          );
        break;
      }
    return n;
  }
  function eventCopyNodesToClipboard(e, n) {
    for (
      var i = [], t = 0, s = this.blueprint.nodesDisplayed.nodes.length;
      t < s;
      ++t
    )
      -1 !== n.indexOf(this.blueprint.nodesDisplayed.nodes[t].guid) &&
        i.push(
          this.blueprint.nodesParsed[
            this.blueprint.nodesDisplayed.nodes[t].idx
          ].node.generateTextForUnreal(1)
        );
    e.clipboardData.setData("text/plain", i.join("\n"));
  }
  function eventDblclick(e) {
    var n,
      i,
      t,
      s,
      o = [],
      d = !1,
      r = 0,
      a = this.blueprint.nodesParsed.length,
      l = 0,
      p = null,
      h = 0,
      u = null,
      c = 0;
    if ("string" == typeof e) {
      for (; r < a; ++r)
        if (this.blueprint.nodesParsed[r].parentGUID === e) {
          d = !0;
          break;
        }
      if (!d) return;
      this.setDisplayedNodes(this.blueprint.nodesParsed, e);
    } else this.setDisplayedNodes(this.blueprint.nodesParsed, null);
    for (n = this.blueprint.nodesDisplayed.nodes.length; l < n; ++l)
      o.push(
        this.blueprint.nodesParsed[this.blueprint.nodesDisplayed.nodes[l].idx]
          .node
      );
    this.listIDs(),
      this.instances.environment.cleanViewport(),
      setTimeout(
        function () {
          this.instances.environment.displayNodesInViewport(o),
            this.instances.interactor.resetCanvas(),
            this.instances.interactor.moveCanvasTo({ x: 0, y: 0 }),
            this.instances.environment.drawLinks(
              this.blueprint.nodesDisplayed.links
            ),
            setTimeout(
              function () {
                for (
                  this.instances.interactor.moveCanvasTo(
                    findMinPosNode.call(this)
                  ),
                    p = this.data.htmlElement.querySelector(
                      ".frame-header__breadcrumb"
                    ).children,
                    h = p.length - 1;
                  0 < h;
                  --h
                )
                  p[h].remove();
                if (null !== e) {
                  for (
                    i = extractBreadcrumb.call(this, e, []),
                      u = document.createDocumentFragment(),
                      c = i.length - 1;
                    0 <= c;
                    --c
                  )
                    (t = createElems([
                      {
                        tag: "span",
                        classes: ["frame-header__breadcrumb-separator"],
                      },
                    ])),
                      (s = createElems([
                        {
                          tag: "span",
                          classes: ["frame-header__breadcrumb-item"],
                          attrs: [{ name: "data-node-id", value: i[c].id }],
                          text: i[c].text,
                        },
                      ])),
                      u.appendChild(t[0]),
                      u.appendChild(s[0]);
                  this.data.htmlElement
                    .querySelector(".frame-header__breadcrumb")
                    .appendChild(u);
                }
              }.bind(this),
              0
            );
        }.bind(this),
        0
      );
  }
  function Editor(e, n, i, t) {
    return "string" != typeof e
      ? new TypeError(
          "Argument 'text' is incorrect, expect string, get " + typeof e
        )
      : n instanceof HTMLElement
      ? "object" != typeof i
        ? new TypeError(
            "Argument 'options' is incorrect, expect object, get " + typeof i
          )
        : t instanceof Bus
        ? ((this.data = { htmlElement: n, options: i, text: e }),
          (this.bus = t),
          (this.elapsedTime = {
            parseBlueprint: 0,
            createPlayground: 0,
            displayNodesInViewport: 0,
            drawLinks: 0,
            startAllBinding: 0,
          }),
          (this.blueprint = {
            nodesParsed: [],
            nodesDisplayed: {
              nodes: [],
              ids: { nodes: [], pins: [] },
              links: [],
            },
            history: [],
            isBelow413Version: !1,
          }),
          (this.eventsBinding = {
            copyNodesToClipboard: eventCopyNodesToClipboard.bind(this),
            dblclick: eventDblclick.bind(this),
            expandNode: eventExpandNode.bind(this),
            initEnvironment: eventInitEnvironment.bind(this),
            initInteractor: eventInitInteractor.bind(this),
            initUpdater: eventInitUpdater.bind(this),
            pasteTextFromClipboard: eventPasteTextFromClipboard.bind(this),
            reDrawLinks: eventReDrawLinks.bind(this),
            reduceNode: eventReduceNode.bind(this),
          }),
          (this.instances = {
            environment: new Environment(
              this.data.htmlElement,
              this.data.options,
              this.bus
            ),
            interactor: new Interactor(
              this.data.htmlElement,
              this.data.options,
              this.bus
            ),
            updater: new Updater(this.data.options, this.bus),
          }),
          this.bus.listen(
            "init_environment",
            this.eventsBinding.initEnvironment
          ),
          this.bus.listen("init_interactor", this.eventsBinding.initInteractor),
          this.bus.listen("init_updater", this.eventsBinding.initUpdater),
          this.bus.listen(
            "copy_nodes_to_clipboard",
            this.eventsBinding.copyNodesToClipboard
          ),
          this.bus.listen(
            "paste_text_from_clipboard",
            this.eventsBinding.pasteTextFromClipboard
          ),
          this.bus.listen("dblclick", this.eventsBinding.dblclick),
          (this.callbackInitialization = null),
          void (this.error = null))
        : new TypeError(
            "Argument 'bus' is incorrect, expect Bus, get " + typeof t
          )
      : new TypeError(
          "Argument 'htmlElement' is incorrect, expect HTMLElement, get " +
            typeof n
        );
  }
  (Editor.prototype.start = function (e) {
    var n = performance.now();
    "function" == typeof e && (this.callbackInitialization = e);
    try {
      this.parseBlueprint();
    } catch (e) {
      (this.error = {
        type: "PARSE_BLUEPRINT",
        message: e.message,
        displayedMessage: "FAILED DISPLAY BLUEPRINT: Parsing Error",
      }),
        (this.blueprint.nodesParsed = []);
    }
    this.setDisplayedNodes(this.blueprint.nodesParsed, null),
      this.listIDs(),
      (this.elapsedTime.parseBlueprint = performance.now() - n),
      this.bus.emit("init_environment");
  }),
    (Editor.prototype.parseBlueprint = function () {
      var e = new Interpreter(),
        n = e.parseText(this.data.text);
      (this.blueprint.isBelow413Version = e.isBelow413Version),
        void 0 === this.data.options.type && (this.data.options.type = e.type),
        (this.blueprint.nodesParsed = flattenHierarchy(n, null));
    }),
    (Editor.prototype.setDisplayedNodes = function (e, n) {
      var i = 0,
        t = e.length;
      for (this.blueprint.nodesDisplayed.nodes = []; i < t; ++i)
        e[i].parentGUID === n &&
          this.blueprint.nodesDisplayed.nodes.push({
            idx: i,
            guid: e[i].node.guid,
          });
    }),
    (Editor.prototype.listIDs = function () {
      this.addNodesID(),
        this.addPinsID(),
        this.blueprint.isBelow413Version
          ? this.addLinksForBelow413()
          : this.addLinks();
    }),
    (Editor.prototype.addNodesID = function () {
      for (
        var e = 0, n = this.blueprint.nodesDisplayed.nodes.length;
        e < n;
        ++e
      )
        void 0 !== this.blueprint.nodesDisplayed.nodes[e].guid &&
          -1 ===
            this.blueprint.nodesDisplayed.ids.nodes.indexOf(
              this.blueprint.nodesDisplayed.nodes[e].guid
            ) &&
          this.blueprint.nodesDisplayed.ids.nodes.push(
            this.blueprint.nodesDisplayed.nodes[e].guid
          );
    }),
    (Editor.prototype.addPinsID = function () {
      for (
        var e, n, i = 0, t = this.blueprint.nodesDisplayed.nodes.length, s = 0;
        i < t;
        ++i
      )
        for (
          s = 0,
            e =
              this.blueprint.nodesParsed[
                this.blueprint.nodesDisplayed.nodes[i].idx
              ].node.pins.length;
          s < e;
          ++s
        )
          void 0 !==
            this.blueprint.nodesParsed[
              this.blueprint.nodesDisplayed.nodes[i].idx
            ].node.pins[s].id &&
            null !==
              (n = searchPropWithName(
                this.blueprint.nodesParsed[
                  this.blueprint.nodesDisplayed.nodes[i].idx
                ].node.objectDefinition,
                "Name"
              )) &&
            ((n =
              n.value +
              " " +
              this.blueprint.nodesParsed[
                this.blueprint.nodesDisplayed.nodes[i].idx
              ].node.pins[s].id),
            -1 === this.blueprint.nodesDisplayed.ids.pins.indexOf(n) &&
              this.blueprint.nodesDisplayed.ids.pins.push(n));
    }),
    (Editor.prototype.addLinksForBelow413 = function () {
      for (
        var e,
          n,
          i,
          t = 0,
          s = this.blueprint.nodesDisplayed.nodes.length,
          o = 0,
          d = [],
          r = "",
          a = [],
          l = [],
          p = 0,
          h = 0,
          u = "",
          c = "",
          b = [],
          m = null,
          y = [],
          f = null;
        t < s;
        ++t
      )
        for (
          o = 0,
            e =
              this.blueprint.nodesParsed[
                this.blueprint.nodesDisplayed.nodes[t].idx
              ].node.pins.length;
          o < e;
          ++o
        )
          if (
            !1 !==
              this.blueprint.nodesParsed[
                this.blueprint.nodesDisplayed.nodes[t].idx
              ].node.pins[o].isLinkedTo() &&
            !this.blueprint.nodesParsed[
              this.blueprint.nodesDisplayed.nodes[t].idx
            ].node.pins[o].isInput() &&
            null !==
              (n = searchPropWithName(
                this.blueprint.nodesParsed[
                  this.blueprint.nodesDisplayed.nodes[t].idx
                ].node.objectDefinition,
                "Name"
              ))
          ) {
            for (
              m =
                n.value +
                " " +
                this.blueprint.nodesParsed[
                  this.blueprint.nodesDisplayed.nodes[t].idx
                ].node.pins[o].id,
                d = [],
                r = "",
                p = 0,
                h = (l =
                  this.blueprint.nodesParsed[
                    this.blueprint.nodesDisplayed.nodes[t].idx
                  ].node.pins[o].getLinks()).length;
              p < h;
              ++p
            )
              (r =
                2 ===
                (a = (r = (r = l[p].substring(11)).substring(
                  0,
                  r.length - 1
                )).split(".")).length
                  ? a.join(" ")
                  : a[a.length - 2] + " " + a[a.length - 1]),
                d.push(removeQuotes(r));
            for (p = 0, h = d.length; p < h; ++p)
              (u = m + "," + d[p]),
                (c = d[p] + "," + m),
                -1 === b.indexOf(u) &&
                  -1 === b.indexOf(c) &&
                  (b.push(m + "," + d[p]),
                  0 === u.indexOf("AnimStateTransitionNode")
                    ? (y[(i = m.split(" ")[0])] || (y[i] = []), y[i].push(d[p]))
                    : 0 === c.indexOf("AnimStateTransitionNode") &&
                      (y[(i = d[p].split(" ")[0])] || (y[i] = []),
                      y[i].push(m)));
          }
      for (f in y) 2 === y[f].length && b.push(y[f][0] + "," + y[f][1]);
      this.blueprint.nodesDisplayed.links = b;
    }),
    (Editor.prototype.addLinks = function () {
      for (
        var e,
          n,
          i,
          t,
          s = 0,
          o = this.blueprint.nodesDisplayed.nodes.length,
          d = 0,
          r = [],
          a = 0,
          l = "",
          p = "",
          h = [],
          u = null,
          c = [],
          b = null;
        s < o;
        ++s
      )
        for (
          d = 0,
            e =
              this.blueprint.nodesParsed[
                this.blueprint.nodesDisplayed.nodes[s].idx
              ].node.pins.length;
          d < e;
          ++d
        )
          if (
            !1 !==
              this.blueprint.nodesParsed[
                this.blueprint.nodesDisplayed.nodes[s].idx
              ].node.pins[d].isLinkedTo() &&
            !this.blueprint.nodesParsed[
              this.blueprint.nodesDisplayed.nodes[s].idx
            ].node.pins[d].isInput() &&
            null !==
              (n = searchPropWithName(
                this.blueprint.nodesParsed[
                  this.blueprint.nodesDisplayed.nodes[s].idx
                ].node.objectDefinition,
                "Name"
              ))
          )
            for (
              u =
                n.value +
                " " +
                this.blueprint.nodesParsed[
                  this.blueprint.nodesDisplayed.nodes[s].idx
                ].node.pins[d].id,
                a = 0,
                i = (r =
                  this.blueprint.nodesParsed[
                    this.blueprint.nodesDisplayed.nodes[s].idx
                  ].node.pins[d].getLinks()).length;
              a < i;
              ++a
            )
              (l = u + "," + r[a]),
                (p = r[a] + "," + u),
                -1 === h.indexOf(l) &&
                  -1 === h.indexOf(p) &&
                  (h.push(u + "," + r[a]),
                  0 === l.indexOf("AnimStateTransitionNode")
                    ? (c[(t = u.split(" ")[0])] || (c[t] = []), c[t].push(r[a]))
                    : 0 === p.indexOf("AnimStateTransitionNode") &&
                      (c[(t = r[a].split(" ")[0])] || (c[t] = []),
                      c[t].push(u)));
      for (b in c) 2 === c[b].length && h.push(c[b][0] + "," + c[b][1]);
      this.blueprint.nodesDisplayed.links = h;
    }),
    (Editor.prototype.initBusEnvironment = function () {}),
    (Editor.prototype.initEnvironment = function () {
      var e,
        n,
        i = performance.now(),
        t = [],
        s = 0;
      this.instances.environment.createPlayground(this.data.options.type) &&
        ((this.elapsedTime.createPlayground = performance.now() - i),
        (n = findMinPosNode.call(this)),
        (this.data.htmlElement.querySelector(".canvas").style.transform =
          getStyleTransformCSS(n.x, n.y, 1)),
        (this.data.htmlElement.querySelector(".reference").style.transform =
          getStyleTransformCSS(n.x, n.y, 1)),
        setTimeout(
          function () {
            for (
              i = performance.now(),
                this.instances.environment.updateLoading("DISPLAY NODES..."),
                t = [],
                e = this.blueprint.nodesDisplayed.nodes.length;
              s < e;
              ++s
            )
              t.push(
                this.blueprint.nodesParsed[
                  this.blueprint.nodesDisplayed.nodes[s].idx
                ].node
              );
            try {
              this.instances.environment.displayNodesInViewport(t);
            } catch (e) {
              (this.error = {
                type: "DISPLAY_NODES",
                message: e.message,
                displayedMessage: "",
              }),
                e.NodeGUID
                  ? (this.error.displayedMessage =
                      "FAILED DISPLAY BLUEPRINT: Error on NodeGUID " +
                      e.NodeGUID)
                  : (this.error.displayedMessage =
                      "FAILED DISPLAY BLUEPRINT: Error on Node #" + e.NodeIdx),
                (this.blueprint.nodesParsed = []),
                (this.blueprint.nodesDisplayed.nodes = []),
                (this.blueprint.nodesDisplayed.links = []),
                (this.blueprint.nodesDisplayed.ids.nodes = []),
                (this.blueprint.nodesDisplayed.ids.pins = []);
            }
            (this.elapsedTime.displayNodesInViewport = performance.now() - i),
              setTimeout(
                function () {
                  (i = performance.now()),
                    this.instances.environment.updateLoading("DRAW LINKS..."),
                    this.instances.environment.drawLinks(
                      this.blueprint.nodesDisplayed.links
                    ),
                    (this.elapsedTime.drawLinks = performance.now() - i),
                    setTimeout(
                      function () {
                        this.bus.emit("init_interactor");
                      }.bind(this),
                      0
                    );
                }.bind(this),
                0
              );
          }.bind(this),
          0
        ));
    }),
    (Editor.prototype.initBusInteractor = function () {
      this.bus.listen("editor__expand_node", this.eventsBinding.expandNode),
        this.bus.listen("editor__reduce_node", this.eventsBinding.reduceNode),
        this.bus.listen("re_draw_links", this.eventsBinding.reDrawLinks);
    }),
    (Editor.prototype.initInteractor = function () {
      var e = performance.now();
      this.instances.environment.updateLoading("INIT INTERACTIONS..."),
        this.instances.interactor.startAllBinding(),
        (this.elapsedTime.startAllBinding = performance.now() - e),
        this.instances.environment.addDataTimerInPlayground(this.elapsedTime),
        this.instances.environment.removeLoading(),
        (e = findMinPosNode.call(this)),
        this.instances.interactor.moveCanvasTo(e),
        this.bus.emit("init_updater");
    }),
    (Editor.prototype.findNodeIdxWithId = function (e) {
      for (
        var n = 0, i = this.blueprint.nodesDisplayed.nodes.length;
        n < i;
        ++n
      )
        if (this.blueprint.nodesDisplayed.nodes[n].guid === e)
          return this.blueprint.nodesDisplayed.nodes[n].idx;
      return null;
    }),
    (Editor.prototype.initBusUpdater = function () {}),
    (Editor.prototype.initUpdater = function () {
      var e = !0;
      null !== this.error &&
        ((e = !1),
        this.instances.environment.updateLoading(this.error.displayedMessage),
        this.instances.environment.showLoading()),
        null !== this.callbackInitialization &&
          (this.callbackInitialization(e, this.error),
          (this.callbackInitialization = null));
    }),
    (Editor.prototype.updateBlueprintText = function (e, n) {
      var i,
        t = performance.now(),
        s = [],
        o = 0;
      if ("string" != typeof e)
        return new TypeError(
          "Argument 'newBlueprintText' is incorrect, expect string, get " +
            typeof e
        );
      "function" == typeof n && (this.callbackInitialization = n),
        (this.error = null),
        this.instances.environment.cleanViewport(),
        (this.data.text = e),
        (this.elapsedTime.startAllBinding = 0),
        (this.elapsedTime.createPlayground = 0);
      try {
        this.parseBlueprint();
      } catch (e) {
        (this.error = {
          type: "PARSE_BLUEPRINT",
          message: e.message,
          displayedMessage: "FAILED DISPLAY BLUEPRINT: Parsing Error",
        }),
          (this.blueprint.nodesParsed = []);
      }
      this.setDisplayedNodes(this.blueprint.nodesParsed, null),
        this.listIDs(),
        (this.elapsedTime.parseBlueprint = performance.now() - t),
        setTimeout(
          function () {
            for (
              t = performance.now(),
                this.instances.environment.updateLoading("DISPLAY NODES..."),
                this.instances.environment.showLoading(),
                s = [],
                i = this.blueprint.nodesDisplayed.nodes.length;
              o < i;
              ++o
            )
              s.push(
                this.blueprint.nodesParsed[
                  this.blueprint.nodesDisplayed.nodes[o].idx
                ].node
              );
            try {
              this.instances.environment.displayNodesInViewport(s);
            } catch (e) {
              (this.error = {
                type: "DISPLAY_NODES",
                message: e.message,
                displayedMessage: "",
              }),
                e.NodeGUID
                  ? (this.error.displayedMessage =
                      "FAILED DISPLAY BLUEPRINT: Error on NodeGUID " +
                      e.NodeGUID)
                  : (this.error.displayedMessage =
                      "FAILED DISPLAY BLUEPRINT: Error on Node #" + e.NodeIdx),
                (this.blueprint.nodesParsed = []),
                (this.blueprint.nodesDisplayed.nodes = []),
                (this.blueprint.nodesDisplayed.links = []),
                (this.blueprint.nodesDisplayed.ids.nodes = []),
                (this.blueprint.nodesDisplayed.ids.pins = []);
            }
            (this.elapsedTime.displayNodesInViewport = performance.now() - t),
              setTimeout(
                function () {
                  (t = performance.now()),
                    this.instances.environment.updateLoading("DRAW LINKS..."),
                    this.instances.environment.drawLinks(
                      this.blueprint.nodesDisplayed.links
                    ),
                    (this.elapsedTime.drawLinks = performance.now() - t),
                    setTimeout(
                      function () {
                        var e;
                        this.instances.environment.addDataTimerInPlayground(
                          this.elapsedTime
                        ),
                          this.instances.environment.removeLoading(),
                          (e = findMinPosNode.call(this)),
                          this.instances.interactor.moveCanvasTo(e),
                          setTimeout(
                            function () {
                              var e = !0;
                              null !== this.error &&
                                ((e = !1),
                                this.instances.environment.updateLoading(
                                  this.error.displayedMessage
                                ),
                                this.instances.environment.showLoading()),
                                null !== this.callbackInitialization &&
                                  (this.callbackInitialization(e, this.error),
                                  (this.callbackInitialization = null));
                            }.bind(this),
                            0
                          );
                      }.bind(this),
                      0
                    );
                }.bind(this),
                0
              );
          }.bind(this),
          0
        );
    }),
    (Editor.prototype.stop = function () {
      this.instances.interactor.stop(),
        (this.instances.interactor = null),
        this.instances.environment.stop(),
        (this.instances.environment = null),
        (this.instances.updater = null),
        (this.bus = null);
    }),
    (Editor.prototype.getBlueprintData = function () {
      return this.blueprint;
    }),
    (Editor.prototype.moveTo = function (e, n, i) {
      this.instances.interactor.setScale(i),
        this.instances.interactor.moveCanvasTo({ x: e, y: n });
    });
  var LEFT_MOUSE = 0,
    RIGHT_MOUSE = 2,
    STEP = 16,
    ZOOM_STEP = 0.08,
    LIMIT_ZOOM_IN = 7,
    LIMIT_ZOOM_OUT = -12,
    MODE_READ = "READ",
    MODE_WRITE = "WRITE",
    PLATFORM_WIN = "WIN",
    PLATFORM_MAC = "MAC",
    INIT_FRAME_SIZE = "250px",
    STATE_DOWN = "DOWN",
    STATE_MOVE = "MOVE",
    STATE_UP = "UP";
  function getPlatform() {
    return 0 === window.navigator.platform.toUpperCase().indexOf("MAC")
      ? PLATFORM_MAC
      : PLATFORM_WIN;
  }
  function bestMultiple(t) {
    return (t = t / STEP) - (t = t >> 0) <= 0.5 ? t * STEP : (1 + t) * STEP;
  }
  function getPositions(t) {
    var t = t.getBoundingClientRect(),
      e = t.top,
      s = t.left;
    return [
      [s, s + t.width],
      [e, e + t.height],
    ];
  }
  function comparePositions(t, e) {
    var s = 0,
      n = 0,
      s = t[0] < e[0] ? t : e,
      n = t[0] < e[0] ? e : t;
    return s[1] > n[0] || s[0] === n[0];
  }
  function isOverlapping(t, e) {
    (t = getPositions(t)), (e = getPositions(e));
    return comparePositions(t[0], e[0]) && comparePositions(t[1], e[1]);
  }
  function parents(t, e, s) {
    var n,
      i = t.parentNode,
      o = 0,
      a = 0;
    if (null === i || void 0 === i.classList) return null;
    for (n = e.length; a < n; ++a) i.classList.contains(e[a]) && (o += 1);
    return o === n ? i : 0 < s ? parents(i, e, s - 1) : null;
  }
  function getStyleTransformCSS(t, e, s) {
    return "translate(" + t + "px," + e + "px) scale(" + s + ")";
  }
  function extractTranslateScale(t) {
    var e = { x: 0, y: 0, scale: 1 },
      s = -1,
      n = [],
      i = t.indexOf("translate("),
      o = t.indexOf("scale(");
    return (
      -1 !== i &&
        -1 !== (s = t.indexOf(")", i + 10)) &&
        ((n = t.substring(i + 10, s).split(",")),
        (e.x = n[0].replace("px", "") >> 0),
        1 < n.length && (e.y = n[1].replace("px", "") >> 0)),
      -1 !== o &&
        -1 !== (s = t.indexOf(")", o + 6)) &&
        ((e.scale = parseFloat(t.substring(o + 6, s))),
        isNaN(e.scale) && (e.scale = 1)),
      e
    );
  }
  function Interactor(t, e, s) {
    (this.dom = {
      breadcrumb: null,
      btns: null,
      canvas: null,
      debugInfos: null,
      frame: null,
      layer: null,
      multiSelect: null,
      nodeMoving: null,
      nodesMoving: [],
      overlay: null,
      panel: null,
      panelBtns: [],
      reference: null,
      root: t,
      zoom: null,
    }),
      (this.bus = s),
      (this.events = { pointerDown: null, pointerMove: null, pointerUp: null }),
      (this.states = {
        current: null,
        previous: null,
        mode: MODE_READ,
        platform: getPlatform(),
        isTouch: !1,
        isLongpress: !1,
        isLeftClick: !1,
        isRightClick: !1,
        isPanelOpen: !1,
        inPlayground: !1,
        isMovingNode: !1,
        inFullscreen: !1,
        isTreatingPaste: !1,
        enableDebug: !1,
        enableMultiUsers: !1,
        enableMaterialViz: !1,
        enableAnnotations: !1,
        timeoutLongpress: null,
        timeoutOverlay: null,
        nodeIDsAlreadySelected: [],
        multiSelectHasCtrlKey: !1,
        multiSelectHasShiftKey: !1,
        wheelAccumulator: 0,
      }),
      (this.eventsBinding = {
        breadcrumb: this.eventBreadcrumb.bind(this),
        contextMenu: this.eventContextMenu.bind(this),
        copyNodes: this.eventCopyNodes.bind(this),
        exitFullscreenHandlerForResizing:
          this.eventExitFullscreenHandlerForResizing.bind(this),
        focusPlayground: this.eventFocusPlayground.bind(this),
        headerButtons: this.eventHeaderButtons.bind(this),
        hideOverlayForZoom: this.eventHideOverlayForZoom.bind(this),
        panelButtons: this.eventPanelButtons.bind(this),
        pasteNodes: this.eventPasteNodes.bind(this),
        pointerDoubleClick: this.eventPointerDoubleClick.bind(this),
        pointerDown: this.eventPointerDown.bind(this),
        pointerLongpress: this.eventPointerLongpress.bind(this),
        pointerMove: this.eventPointerMove.bind(this),
        pointerPinch: this.eventPointerPinch.bind(this),
        pointerUp: this.eventPointerUp.bind(this),
        pointerWheel: this.eventPointerWheel.bind(this),
        doMoveCanvas: this.eventDoMoveCanvas.bind(this),
      }),
      (this.pinchDistance = null),
      (this.canvas = { x: 0, y: 0 }),
      (this.resetPosition = { x: 0, y: 0 }),
      (this.scale = 1),
      (this.startPinLink = null),
      (this.currentZoom = 0),
      (this.lastUpdateCalled = null),
      (this.frameSize = e.height || INIT_FRAME_SIZE),
      e.scale !== undefined ? this.setScale(e.scale) : 0;
  }
  (Interactor.prototype.startAllBinding = function () {
    var t,
      e = 0;
    for (
      this.dom.frame = this.dom.root.querySelector(".frame"),
        this.dom.layer = this.dom.root.querySelector(".layer"),
        this.dom.reference = this.dom.root.querySelector(".reference"),
        this.dom.canvas = this.dom.root.querySelector(".canvas"),
        this.dom.btns = this.dom.root.querySelector(".frame-header__buttons"),
        this.dom.panel = this.dom.root.querySelector(".panel"),
        this.dom.panelBtns = this.dom.root.querySelectorAll(
          ".panel input[data-feature-panel-checkbox]"
        ),
        this.dom.zoom = this.dom.root.querySelector(
          ".frame-header__current-zoom"
        ),
        this.dom.overlay = this.dom.root.querySelector(".overlay"),
        this.dom.breadcrumb = this.dom.root.querySelector(
          ".frame-header__breadcrumb"
        ),
        window.addEventListener(
          "mousedown",
          this.eventsBinding.focusPlayground
        ),
        window.addEventListener(
          "touchstart",
          this.eventsBinding.focusPlayground
        ),
        this.dom.layer.addEventListener(
          "mousedown",
          this.eventsBinding.pointerDown
        ),
        this.dom.layer.addEventListener(
          "touchstart",
          this.eventsBinding.pointerDown,
          { passive: !1 }
        ),
        window.addEventListener("mousemove", this.eventsBinding.pointerMove),
        window.addEventListener("touchmove", this.eventsBinding.pointerMove, {
          passive: !1,
        }),
        window.addEventListener("mouseup", this.eventsBinding.pointerUp),
        window.addEventListener("touchend", this.eventsBinding.pointerUp, {
          passive: !1,
        }),
        this.dom.layer.addEventListener(
          "wheel",
          this.eventsBinding.pointerWheel
        ),
        this.dom.layer.addEventListener(
          "dblclick",
          this.eventsBinding.pointerDoubleClick
        ),
        document.addEventListener("copy", this.eventsBinding.copyNodes),
        document.addEventListener("paste", this.eventsBinding.pasteNodes),
        this.dom.btns.addEventListener(
          "click",
          this.eventsBinding.headerButtons
        ),
        document.addEventListener(
          "webkitfullscreenchange",
          this.eventsBinding.exitFullscreenHandlerForResizing
        ),
        document.addEventListener(
          "fullscreenchange",
          this.eventsBinding.exitFullscreenHandlerForResizing
        ),
        this.dom.breadcrumb.addEventListener(
          "click",
          this.eventsBinding.breadcrumb
        ),
        t = this.dom.panelBtns.length;
      e < t;
      ++e
    )
      this.dom.panelBtns[e].addEventListener(
        "click",
        this.eventsBinding.panelButtons
      );
    this.dom.layer.addEventListener(
      "contextmenu",
      this.eventsBinding.contextMenu
    ),
      this.bus.listen("interactor__expand_node", this.expandNode.bind(this)),
      this.bus.listen("interactor__reduce_node", this.reduceNode.bind(this));
  }),
    (Interactor.prototype.eventDoMoveCanvas = function () {
      this.moveCanvas(this.events.pointerMove), (this.lastUpdateCalled = null);
    }),
    (Interactor.prototype.eventFocusPlayground = function (t) {
      for (var e = 0, s = t.composedPath(), n = s.length; e < n; ++e)
        if (s[e] === this.dom.root) return void (this.states.inPlayground = !0);
      this.states.inPlayground = !1;
    }),
    (Interactor.prototype.eventPointerDown = function (t) {
      var e;
      return (
        null === this.states.current &&
        ((this.states.current = STATE_DOWN),
        window.TouchEvent && t instanceof TouchEvent
          ? (this.states.inFullscreen
              ? ((this.states.isTouch = !0),
                (this.events.pointerDown = t.touches[0]),
                this.startMovingCanvas(this.events.pointerDown))
              : 1 === t.touches.length &&
                ((this.states.isTouch = !0),
                (this.events.pointerDown = t.touches[0]),
                (this.states.timeoutLongpress = window.setTimeout(
                  this.eventsBinding.pointerLongpress,
                  150
                )),
                this.startMovingCanvas(this.events.pointerDown)),
            !0)
          : ((this.events.pointerDown = t).button === LEFT_MOUSE
              ? (this.states.isLeftClick = !0)
              : t.button === RIGHT_MOUSE && (this.states.isRightClick = !0),
            this.states.platform === PLATFORM_MAC &&
              !0 === t.ctrlKey &&
              (this.states.isRightClick = !0),
            this.states.isRightClick || this.states.isTouch
              ? void this.startMovingCanvas(this.events.pointerDown)
              : this.states.mode === MODE_WRITE &&
                null !== (e = parents(t.target, ["pin"], 5))
              ? !0 === t.ctrlKey || !0 === t.altKey
                ? void 0
                : void this.drawNewLink(e, this.events.pointerDown)
              : null !== (e = parents(t.target, ["node"], 5))
              ? !1 ===
                  this.events.pointerDown.target.classList.contains("less") &&
                !1 ===
                  this.events.pointerDown.target.classList.contains("more") &&
                null === parents(this.events.pointerDown.target, ["less"], 0) &&
                null === parents(this.events.pointerDown.target, ["more"], 0) &&
                !1 === t.target.classList.contains("fake-input") &&
                !1 === t.target.classList.contains("checkbox") &&
                "SELECT" !== t.target.tagName
                ? ((this.states.isMovingNode = !0),
                  void this.startMovingNode(this.events.pointerDown, e))
                : void 0
              : void this.beginDrawMultiSelect(t)))
      );
    }),
    (Interactor.prototype.eventPointerMove = function (t) {
      if (
        this.states.current !== STATE_MOVE &&
        this.states.current !== STATE_DOWN
      )
        return !1;
      if (
        ((this.states.previous = this.states.current),
        (this.states.current = STATE_MOVE),
        window.TouchEvent && t instanceof TouchEvent)
      ) {
        if (
          ((this.events.pointerMove = t.touches[0]), !this.states.inFullscreen)
        ) {
          if (!this.states.isRightClick) return;
          if (!t.cancelable) return;
          t.preventDefault(), t.stopImmediatePropagation();
        }
        if (2 === t.touches.length) return void this.eventPointerPinch(t);
      } else this.events.pointerMove = t;
      if (this.states.isRightClick || this.states.isTouch)
        return (
          this.lastUpdateCalled && cancelAnimationFrame(this.lastUpdateCalled),
          void (this.lastUpdateCalled = requestAnimationFrame(
            this.eventsBinding.doMoveCanvas
          ))
        );
      null !== this.startPinLink
        ? this.moveLink(this.events.pointerMove)
        : !0 === this.states.isMovingNode
        ? this.moveNode(this.events.pointerMove)
        : !1 ===
            this.events.pointerDown.target.classList.contains("fake-input") &&
          !1 ===
            this.events.pointerDown.target.classList.contains("checkbox") &&
          !1 === this.events.pointerDown.target.classList.contains("less") &&
          !1 === this.events.pointerDown.target.classList.contains("more") &&
          null === parents(this.events.pointerDown.target, ["less"], 0) &&
          null === parents(this.events.pointerDown.target, ["more"], 0) &&
          this.drawMultiSelect(this.events.pointerMove);
    }),
    (Interactor.prototype.eventPointerUp = function (t) {
      var e,
        s,
        n,
        i = [],
        o = 0;
      if (
        this.states.current !== STATE_MOVE &&
        this.states.current !== STATE_DOWN
      )
        return !1;
      if (
        ((e = this.states.previous),
        (s = this.states.current),
        (this.states.previous = this.states.current),
        (this.states.current = STATE_UP),
        window.TouchEvent && t instanceof TouchEvent)
      )
        return 0 < t.touches.length
          ? ((this.states.previous = e), void (this.states.current = s))
          : ((this.events.pointerUp = t.touches[0]),
            (this.states.isTouch = !1),
            (this.states.isLongpress = !1),
            this.states.timeoutLongpress &&
              clearTimeout(this.states.timeoutLongpress),
            (this.states.previous = STATE_UP),
            (this.states.current = null),
            void (this.states.isRightClick = !1));
      if (
        ((this.events.pointerUp = t),
        this.events.pointerDown.target === this.dom.canvas &&
          this.states.previous === STATE_DOWN &&
          this.unselectAllNodes(),
        null !== this.dom.nodeMoving && this.states.previous === STATE_DOWN)
      )
        if (this.events.pointerDown.shiftKey)
          this.dom.nodeMoving.classList.add("selected");
        else if (this.events.pointerDown.ctrlKey)
          this.dom.nodeMoving.classList.contains("selected")
            ? this.dom.nodeMoving.classList.remove("selected")
            : this.dom.nodeMoving.classList.add("selected");
        else {
          for (
            n = (i = this.dom.canvas.querySelectorAll(".node.selected")).length;
            o < n;
            ++o
          )
            i[o].classList.remove("selected");
          this.dom.nodeMoving.classList.add("selected");
        }
      !0 === this.events.pointerDown.target.classList.contains("less") ||
      null !== parents(this.events.pointerDown.target, ["less"], 0)
        ? this.sendReduceNode(
            parents(this.events.pointerDown.target, ["node"], 5)
          )
        : (!0 !== this.events.pointerDown.target.classList.contains("more") &&
            null === parents(this.events.pointerDown.target, ["more"], 0)) ||
          this.sendExpandNode(
            parents(this.events.pointerDown.target, ["node"], 5)
          ),
        null !== this.startPinLink && this.endLink(this.events.pointerUp),
        this.removeMultiSelect(),
        (this.states.isLeftClick = !1),
        (this.states.isRightClick = !1),
        (this.states.isTouch = !1),
        (this.states.isLongpress = !1),
        this.states.timeoutLongpress &&
          clearTimeout(this.states.timeoutLongpress),
        (this.states.previous = STATE_UP),
        (this.states.current = null),
        (this.startPinLink = null),
        (this.states.isMovingNode = !1),
        (this.dom.nodeMoving = null),
        (this.dom.nodesMoving = []),
        (this.dom.canvas.style.cursor = "default");
    }),
    (Interactor.prototype.eventPointerLongpress = function (t) {
      (this.states.isLongpress = !0), (this.states.isRightClick = !0);
    }),
    (Interactor.prototype.eventPointerWheel = function (t) {
      if (!1 === this.states.inFullscreen && !1 === t.ctrlKey)
        this.showOverlayForZoom("Use ctrl + scroll to zoom");
      else {
        if (
          (this.eventsBinding.hideOverlayForZoom(),
          t.preventDefault(),
          this.states.isRightClick || this.states.isLeftClick)
        )
          return !1;
        if (t.deltaY < 100) {
          if (
            ((this.states.wheelAccumulator += t.deltaY),
            Math.abs(this.states.wheelAccumulator) < 25)
          )
            return !1;
          this.states.wheelAccumulator = 0;
        }
        t.deltaY < 0 ? this.zoomIn(t, !1) : this.zoomOut(t);
      }
    }),
    (Interactor.prototype.eventPointerPinch = function (t) {
      var e =
          (t.touches[0].pageX - t.touches[1].pageX) *
          (t.touches[0].pageX - t.touches[1].pageX),
        s =
          (t.touches[0].pageY - t.touches[1].pageY) *
          (t.touches[0].pageY - t.touches[1].pageY),
        e = Math.sqrt(e + s);
      null === this.pinchDistance
        ? (this.pinchDistance = e)
        : ((t.pageX = t.touches[0].pageX),
          (t.pageY = t.touches[0].pageY),
          50 < (s = this.pinchDistance - e)
            ? (this.zoomOut(t),
              (this.pinchDistance = e),
              (this.diffX = t.touches[0].clientX - this.canvas.x),
              (this.diffY = t.touches[0].clientY - this.canvas.y))
            : s < -50 &&
              (this.zoomIn(t, !0),
              (this.pinchDistance = e),
              (this.diffX = t.touches[0].clientX - this.canvas.x),
              (this.diffY = t.touches[0].clientY - this.canvas.y)));
    }),
    (Interactor.prototype.eventPointerDoubleClick = function (t) {
      t = parents(t.target, ["node"], 5);
      null !== t && this.bus.emit("dblclick", [t.getAttribute("data-id")]);
    }),
    (Interactor.prototype.eventExitFullscreenHandlerForResizing = function () {
      (null !== document.fullscreenElement &&
        null !== document.webkitFullscreenElement) ||
        ((this.dom.frame.style.height = this.frameSize),
        this.dom.btns
          .querySelector(".frame-header__buttons-fullscreen")
          .classList.remove("frame-header__buttons-fullscreen--exit"),
        (this.states.inFullscreen = !1));
    }),
    (Interactor.prototype.eventContextMenu = function (t) {
      (window.TouchEvent && this.events.pointerDown instanceof Touch) ||
        t.preventDefault();
    }),
    (Interactor.prototype.eventCopyNodes = function (t) {
      var e;
      !1 === this.states.inPlayground ||
        t.target.classList.contains("fake-input") ||
        (0 < (e = this.dom.root.querySelectorAll(".selected")).length &&
          (this.copyNodesSelectedInClipboard(t, e), t.preventDefault()));
    }),
    (Interactor.prototype.eventPasteNodes = function (t) {
      var e,
        s = null,
        n = null;
      if (!1 !== this.states.inPlayground) {
        if (t.target.classList.contains("fake-input"))
          return (
            t.preventDefault(),
            void (
              (s = window.getSelection()).getRangeAt &&
              s.rangeCount &&
              ((n = s.getRangeAt(0)).deleteContents(),
              (e = document.createTextNode(
                t.clipboardData.getData("text/plain")
              )),
              n.insertNode(e),
              n.setStartAfter(e),
              n.setEndAfter(e),
              s.removeAllRanges(),
              s.addRange(n))
            )
          );
        if (this.states.mode !== MODE_READ) {
          if (
            ((this.states.isTreatingPaste = !0),
            "" === (e = t.clipboardData.getData("text/plain")))
          )
            return (this.states.isTreatingPaste = !1);
          setTimeout(
            function () {
              this.states.isTreatingPaste = !1;
            }.bind(this),
            1e3
          ),
            this.bus.emit("paste_text_from_clipboard", [e]);
        }
      }
    }),
    (Interactor.prototype.eventHeaderButtons = function (t) {
      t.target.classList.contains("frame-header__buttons-fullscreen")
        ? this.fullscreenToggle()
        : t.target.classList.contains("frame-header__buttons-reset")
        ? (this.resetCanvas(),
          this.resetScale(),
          this.moveCanvasTo(this.resetPosition))
        : t.target.classList.contains("frame-header__buttons-panel") &&
          this.panelToggle();
    }),
    (Interactor.prototype.eventPanelButtons = function (t) {
      var e = null;
      switch (t.target.getAttribute("data-feature-panel-name")) {
        case "debug-infos":
          (this.states.enableDebug = !this.states.enableDebug),
            (this.dom.debugInfos = t.target.parentElement.nextSibling),
            this.updateDebugInfos(),
            (e = this.states.enableDebug);
          break;
        case "read-write":
          this.states.mode === MODE_WRITE
            ? (this.states.mode = MODE_READ)
            : this.states.mode === MODE_READ && (this.states.mode = MODE_WRITE);
          break;
        case "multi-users":
          (this.states.enableMultiUsers = !this.states.enableMultiUsers),
            (e = this.states.enableMultiUsers);
          break;
        case "material-viz":
          (this.states.enableMaterialViz = !this.states.enableMaterialViz),
            (e = this.states.enableMaterialViz);
          break;
        case "annotations":
          (this.states.enableAnnotations = !this.states.enableAnnotations),
            (e = this.states.enableAnnotations);
      }
      !0 === e
        ? (t.target.parentElement.nextElementSibling.style.display = "block")
        : !1 === e &&
          (t.target.parentElement.nextElementSibling.style.display = "none");
    }),
    (Interactor.prototype.eventBreadcrumb = function (t) {
      t.target.classList.contains("frame-header__breadcrumb-item") &&
        (null !== (t = t.target.getAttribute("data-node-id")) && "" !== t
          ? this.bus.emit("dblclick", [t])
          : this.bus.emit("dblclick", [null]));
    }),
    (Interactor.prototype.sendReduceNode = function (t) {
      t = t.getAttribute("data-id");
      this.bus.emit("editor__reduce_node", [t]);
    }),
    (Interactor.prototype.sendExpandNode = function (t) {
      t = t.getAttribute("data-id");
      this.bus.emit("editor__expand_node", [t]);
    }),
    (Interactor.prototype.expandNode = function (t) {
      for (
        var e = this.dom.root.querySelector('.node[data-id="' + t + '"]'),
          s = e.querySelectorAll(".body .pin"),
          n = 0,
          i = s.length,
          o = null;
        n < i;
        ++n
      )
        s[n].classList.remove("hidden");
      (o = e.querySelector(".more")).classList.remove("more"),
        o.classList.add("less"),
        (this.dom.canvas.style.transform = getStyleTransformCSS(0, 0, 1)),
        this.bus.emit("re_draw_links", [
          t,
          function () {
            this.dom.canvas.style.transform = getStyleTransformCSS(
              this.canvas.x,
              this.canvas.y,
              this.scale
            );
          }.bind(this),
        ]);
    }),
    (Interactor.prototype.reduceNode = function (t, e) {
      for (
        var s = this.dom.root.querySelector('.node[data-id="' + t + '"]'),
          n = s.querySelectorAll(".body .pin"),
          i = 0,
          o = n.length,
          a = null;
        i < o;
        ++i
      )
        -1 === e.indexOf(n[i].getAttribute("data-id")) &&
          n[i].classList.add("hidden");
      (a = s.querySelector(".less")).classList.remove("less"),
        a.classList.add("more"),
        (this.dom.canvas.style.transform = getStyleTransformCSS(0, 0, 1)),
        this.bus.emit("re_draw_links", [
          t,
          function () {
            this.dom.canvas.style.transform = getStyleTransformCSS(
              this.canvas.x,
              this.canvas.y,
              this.scale
            );
          }.bind(this),
        ]);
    }),
    (Interactor.prototype.startMovingCanvas = function (t) {
      (this.eWi = parseInt(this.dom.canvas.style.width, 10)),
        (this.eHe = parseInt(this.dom.canvas.style.height, 10)),
        (this.diffX = t.clientX - this.canvas.x),
        (this.diffY = t.clientY - this.canvas.y),
        (this.dom.canvas.style.cursor = "grabbing");
    }),
    (Interactor.prototype.moveCanvas = function (t) {
      var e = (t.clientX - this.diffX) >> 0,
        t = (t.clientY - this.diffY) >> 0;
      (this.canvas.x === e && this.canvas.y === t) ||
        ((this.dom.canvas.style.transform = getStyleTransformCSS(
          e,
          t,
          this.scale
        )),
        (this.dom.reference.style.transform = getStyleTransformCSS(
          e,
          t,
          this.scale
        )),
        (this.canvas.x = e),
        (this.canvas.y = t));
    }),
    (Interactor.prototype.startMovingNode = function (t, e) {
      var s = t.clientX / this.scale,
        t = t.clientY / this.scale,
        n = (e.getBoundingClientRect().width / this.scale) >> 0,
        i = (e.getBoundingClientRect().height / this.scale) >> 0,
        o = extractTranslateScale(e.style.transform);
      (this.eWi = n),
        (this.eHe = i),
        (this.diffX = o.x + n - s),
        (this.diffY = o.y + i - t),
        (this.dom.nodeMoving = e),
        window.getSelection().removeAllRanges();
    }),
    (Interactor.prototype.moveNode = function (t) {
      var e,
        s,
        n,
        i,
        o = 0,
        a = 0,
        r = t.clientX / this.scale,
        t = t.clientY / this.scale,
        r = r + this.diffX - this.eWi + 2 * this.scale,
        t = t + this.diffY - this.eHe + 2 * this.scale,
        l = [],
        h = null,
        r = bestMultiple(r),
        t = bestMultiple(t);
      if (this.dom.nodeMoving.classList.contains("selected"))
        0 === this.dom.nodesMoving.length &&
          (this.dom.nodesMoving =
            this.dom.canvas.querySelectorAll(".node.selected"));
      else {
        for (
          o = 0,
            a = (l = this.dom.canvas.querySelectorAll(".node.selected")).length;
          o < a;
          ++o
        )
          l[o].classList.remove("selected");
        this.dom.nodeMoving.classList.add("selected"),
          (this.dom.nodesMoving = []);
      }
      if (
        (h = extractTranslateScale(this.dom.nodeMoving.style.transform)).x !==
          r ||
        h.y !== t
      )
        if (
          ((this.dom.nodeMoving.style.transform =
            "translate(" + r + "px," + t + "px)"),
          1 < this.dom.nodesMoving.length)
        ) {
          for (
            e = r - h.x, s = t - h.y, o = 0, a = this.dom.nodesMoving.length;
            o < a;
            ++o
          )
            this.dom.nodesMoving[o] !== this.dom.nodeMoving &&
              ((n =
                (h = extractTranslateScale(
                  this.dom.nodesMoving[o].style.transform
                )).x + e),
              (i = h.y + s),
              (this.dom.nodesMoving[o].style.transform =
                "translate(" + n + "px," + i + "px)"));
          for (
            this.dom.canvas.style.transform = getStyleTransformCSS(
              (o = 0),
              0,
              1
            );
            o < a;
            ++o
          )
            this.drawLinks(this.dom.nodesMoving[o]);
          this.dom.canvas.style.transform = getStyleTransformCSS(
            this.canvas.x,
            this.canvas.y,
            this.scale
          );
        } else
          (this.dom.canvas.style.transform = getStyleTransformCSS(0, 0, 1)),
            this.drawLinks(this.dom.nodeMoving),
            (this.dom.canvas.style.transform = getStyleTransformCSS(
              this.canvas.x,
              this.canvas.y,
              this.scale
            ));
    }),
    (Interactor.prototype.drawLinks = function (t) {
      t = t.getAttribute("data-id");
      this.bus.emit("re_draw_links", [t]);
    }),
    (Interactor.prototype.moveLink = function (t) {
      this.bus.emit("move_link", [this.startPinLink, t, this.scale]);
    }),
    (Interactor.prototype.drawNewLink = function (t, e) {
      (this.startPinLink = t),
        this.bus.emit("draw_new_link", [t, e, this.scale]);
    }),
    (Interactor.prototype.zoomIn = function (t, e) {
      var s,
        n,
        i = this.scale;
      this.currentZoom >= LIMIT_ZOOM_IN ||
        (0 === this.currentZoom && !1 === t.ctrlKey && !1 === e) ||
        ((this.currentZoom += 1),
        (this.scale = floatFixed(this.scale + ZOOM_STEP, 2)),
        (e = getCoefficentOffsetForScaleWhenZoomIn(this.scale)),
        (n = this.dom.frame.getBoundingClientRect()),
        (s = ((t.pageX - (n.left + window.scrollX) - this.canvas.x) * e) >> 0),
        (t = ((t.pageY - (n.top + window.scrollY) - this.canvas.y) * e) >> 0),
        (n = this.scale - i),
        (this.canvas.x = (this.canvas.x - s * n) >> 0),
        (this.canvas.y = (this.canvas.y - t * n) >> 0),
        (this.dom.canvas.style.transform = getStyleTransformCSS(
          this.canvas.x,
          this.canvas.y,
          this.scale
        )),
        (this.dom.reference.style.transform = getStyleTransformCSS(
          this.canvas.x,
          this.canvas.y,
          this.scale
        )),
        this.updateZoomText());
    }),
    (Interactor.prototype.zoomOut = function (t) {
      var e,
        s,
        n,
        i = this.scale;
      this.currentZoom <= LIMIT_ZOOM_OUT ||
        (0 < this.scale - ZOOM_STEP &&
          ((this.scale = floatFixed(this.scale - ZOOM_STEP, 2)),
          --this.currentZoom),
        (e = getCoefficentOffsetForScaleWhenZoomOut(this.scale)),
        (n = this.dom.frame.getBoundingClientRect()),
        (s = ((t.pageX - (n.left + window.scrollX) - this.canvas.x) * e) >> 0),
        (t = ((t.pageY - (n.top + window.scrollY) - this.canvas.y) * e) >> 0),
        (n = this.scale - i),
        (this.canvas.x = (this.canvas.x - s * n) >> 0),
        (this.canvas.y = (this.canvas.y - t * n) >> 0),
        (this.dom.canvas.style.transform = getStyleTransformCSS(
          this.canvas.x,
          this.canvas.y,
          this.scale
        )),
        (this.dom.reference.style.transform = getStyleTransformCSS(
          this.canvas.x,
          this.canvas.y,
          this.scale
        )),
        this.updateZoomText());
    }),
    (Interactor.prototype.updateZoomText = function () {
      var t = this.currentZoom;
      0 === this.currentZoom
        ? (t = "1:1")
        : 0 < this.currentZoom && (t = "+" + this.currentZoom),
        this.dom.zoom.classList.add("update"),
        (this.dom.zoom.textContent = "Zoom " + t),
        setTimeout(
          function () {
            this.dom.zoom.classList.remove("update");
          }.bind(this),
          40
        );
    }),
    (Interactor.prototype.endLink = function (t) {
      t.target.classList.contains("clink")
        ? this.bus.emit("new_link", [this.startPinLink, t.target, this.scale])
        : this.dom.root.querySelector("svg.moving").remove();
    }),
    (Interactor.prototype.unselectAllNodes = function () {
      for (
        var t = this.dom.canvas.querySelectorAll(".node.selected"),
          e = 0,
          s = t.length;
        e < s;
        ++e
      )
        t[e].classList.remove("selected");
      window.getSelection().removeAllRanges();
    }),
    (Interactor.prototype.beginDrawMultiSelect = function (t) {
      for (
        var e = this.dom.canvas.querySelectorAll(".node.selected"),
          s = 0,
          n = e.length;
        s < n;
        ++s
      )
        this.states.nodeIDsAlreadySelected.push(e[s].getAttribute("data-id"));
      (this.states.multiSelectHasCtrlKey = t.ctrlKey || t.metaKey),
        (this.states.multiSelectHasShiftKey = t.shiftKey);
    }),
    (Interactor.prototype.drawMultiSelect = function (t) {
      var e,
        s,
        n = {},
        i = {},
        o = 0,
        a = 0,
        r = [],
        l = 0,
        h = !1;
      for (
        this.dom.canvas.style.transform = getStyleTransformCSS(
          this.canvas.x,
          this.canvas.y,
          1
        ),
          e = {
            top:
              (e = this.dom.canvas.getBoundingClientRect()).top +
              window.scrollY,
            left: e.left + window.scrollX,
          },
          n = {
            left: this.events.pointerDown.pageX / this.scale,
            top: this.events.pointerDown.pageY / this.scale,
          },
          i = { left: t.pageX / this.scale, top: t.pageY / this.scale },
          n.top -= e.top / this.scale,
          n.left -= e.left / this.scale,
          i.top -= e.top / this.scale,
          i.left -= e.left / this.scale,
          t = Math.min(n.left, i.left),
          e = Math.min(n.top, i.top),
          0 === (o = Math.max(n.left, i.left) - Math.min(n.left, i.left)) &&
            (o = 2),
          0 === (a = Math.max(n.top, i.top) - Math.min(n.top, i.top)) &&
            (a = 2),
          null === this.dom.multiSelect &&
            (this.dom.canvas.appendChild(
              createElem("div", ["multi-select"], [])
            ),
            (this.dom.multiSelect =
              this.dom.canvas.querySelector(".multi-select"))),
          this.dom.multiSelect.style.left = t + "px",
          this.dom.multiSelect.style.top = e + "px",
          this.dom.multiSelect.style.width = o + "px",
          this.dom.multiSelect.style.height = a + "px",
          this.dom.multiSelect.style.borderImageWidth =
            ((6 / this.scale) >> 0) + "px",
          s = (r = this.dom.canvas.querySelectorAll(".node")).length;
        l < s;
        ++l
      )
        (this.states.multiSelectHasShiftKey &&
          -1 !==
            this.states.nodeIDsAlreadySelected.indexOf(
              r[l].getAttribute("data-id")
            )) ||
          ((h = isOverlapping(this.dom.multiSelect, r[l])),
          (h =
            this.states.multiSelectHasCtrlKey &&
            -1 !==
              this.states.nodeIDsAlreadySelected.indexOf(
                r[l].getAttribute("data-id")
              )
              ? !h
              : h)
            ? r[l].classList.add("selected")
            : r[l].classList.remove("selected"));
      this.dom.canvas.style.transform = getStyleTransformCSS(
        this.canvas.x,
        this.canvas.y,
        this.scale
      );
    }),
    (Interactor.prototype.removeMultiSelect = function () {
      null !== this.dom.multiSelect && this.dom.multiSelect.remove(),
        (this.dom.multiSelect = null),
        (this.states.nodeIDsAlreadySelected = []),
        (this.states.multiSelectHasCtrlKey = !1),
        (this.states.multiSelectHasShiftKey = !1);
    }),
    (Interactor.prototype.copyNodesSelectedInClipboard = function (t, e) {
      for (var s = [], n = 0, i = e.length; n < i; ++n)
        s.push(e[n].getAttribute("data-id"));
      this.bus.emit("copy_nodes_to_clipboard", [t, s]);
    }),
    (Interactor.prototype.moveCanvasTo = function (t) {
      (this.canvas.x = t.x),
        (this.canvas.y = t.y),
        (this.resetPosition.x = this.canvas.x),
        (this.resetPosition.y = this.canvas.y),
        (this.dom.canvas.style.transform = getStyleTransformCSS(
          t.x,
          t.y,
          this.scale
        )),
        (this.dom.reference.style.transform = getStyleTransformCSS(
          t.x,
          t.y,
          this.scale
        ));
    }),
    (Interactor.prototype.setScale = function (t) {
      var e = 0,
        s = 0.04;
      for (
        this.scale = t, this.currentZoom = 0, e = LIMIT_ZOOM_OUT;
        e <= LIMIT_ZOOM_IN;
        ++e
      ) {
        if (s === t) {
          this.currentZoom = e;
          break;
        }
        s = floatFixed(s + ZOOM_STEP, 2);
      }
      this.updateZoomText();
    }),
    (Interactor.prototype.panelToggle = function () {
      this.states.isPanelOpen
        ? (this.dom.root.querySelector(".panel").style.display = "none")
        : (this.dom.root.querySelector(".panel").style.display = "block"),
        (this.states.isPanelOpen = !this.states.isPanelOpen);
    }),
    (Interactor.prototype.fullscreenToggle = function () {
      var t = this.dom.root.querySelector(".bue-render");
      document.fullscreenElement || document.webkitFullscreenElement
        ? ((this.dom.frame.style.height = this.frameSize),
          this.dom.btns
            .querySelector(".frame-header__buttons-fullscreen")
            .classList.remove("frame-header__buttons-fullscreen--exit"),
          (this.states.inFullscreen = !1),
          document.exitFullscreen
            ? document.exitFullscreen()
            : document.webkitCancelFullScreen &&
              document.webkitCancelFullScreen())
        : t.requestFullscreen
        ? (t.requestFullscreen(),
          (this.dom.frame.style.height = window.screen.height + "px"),
          this.dom.btns
            .querySelector(".frame-header__buttons-fullscreen")
            .classList.add("frame-header__buttons-fullscreen--exit"),
          (this.states.inFullscreen = !0))
        : t.webkitRequestFullscreen &&
          (t.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT),
          (this.dom.frame.style.height = window.screen.height + "px"),
          this.dom.btns
            .querySelector(".frame-header__buttons-fullscreen")
            .classList.add("iframe-header__buttons-fullscreen--exit"),
          (this.states.inFullscreen = !0));
    }),
    (Interactor.prototype.resetCanvas = function () {
      (this.scale = 1),
        (this.dom.canvas.style.transform = getStyleTransformCSS(
          this.resetPosition.x,
          this.resetPosition.y,
          1
        )),
        (this.dom.reference.style.transform = getStyleTransformCSS(
          this.resetPosition.x,
          this.resetPosition.y,
          1
        )),
        (this.currentZoom = 0),
        this.updateZoomText();
    }),
    (Interactor.prototype.resetScale = function () {
      (this.scale = 1),
        (this.dom.canvas.style.transform = getStyleTransformCSS(
          this.canvas.x,
          this.canvas.y,
          this.scale
        )),
        (this.dom.reference.style.transform = getStyleTransformCSS(
          this.canvas.x,
          this.canvas.y,
          this.scale
        )),
        (this.currentZoom = 0),
        this.updateZoomText();
    }),
    (Interactor.prototype.showOverlayForZoom = function (t) {
      (this.dom.overlay.style.display = "flex"),
        (this.dom.overlay.textContent = t),
        null !== this.states.timeoutOverlay &&
          clearTimeout(this.states.timeoutOverlay),
        (this.states.timeoutOverlay = window.setTimeout(
          this.eventsBinding.hideOverlayForZoom,
          1500
        ));
    }),
    (Interactor.prototype.eventHideOverlayForZoom = function () {
      this.dom.overlay.style.display = "none";
    }),
    (Interactor.prototype.updateDebugInfos = function () {
      !1 !== this.states.enableDebug &&
        (this.dom.debugInfos.textContent = this.states.toString());
    }),
    (Interactor.prototype.stop = function () {
      var t,
        e = 0;
      if (
        (window.removeEventListener(
          "mousedown",
          this.eventsBinding.focusPlayground
        ),
        window.removeEventListener(
          "touchstart",
          this.eventsBinding.focusPlayground
        ),
        this.dom.canvas &&
          (this.dom.canvas.removeEventListener(
            "mousedown",
            this.eventsBinding.pointerDown
          ),
          this.dom.canvas.removeEventListener(
            "touchstart",
            this.eventsBinding.pointerDown,
            { passive: !1 }
          )),
        window.removeEventListener("mousemove", this.eventsBinding.pointerMove),
        window.removeEventListener(
          "touchmove",
          this.eventsBinding.pointerMove,
          { passive: !1 }
        ),
        window.removeEventListener("mouseup", this.eventsBinding.pointerUp),
        window.removeEventListener("touchend", this.eventsBinding.pointerUp, {
          passive: !1,
        }),
        this.dom.canvas &&
          (this.dom.canvas.removeEventListener(
            "wheel",
            this.eventsBinding.pointerWheel
          ),
          this.dom.canvas.removeEventListener(
            "dblclick",
            this.eventsBinding.pointerDoubleClick
          )),
        document.removeEventListener("copy", this.eventsBinding.copyNodes),
        document.removeEventListener("paste", this.eventsBinding.pasteNodes),
        this.dom.btns &&
          this.dom.btns.removeEventListener(
            "click",
            this.eventsBinding.headerButtons
          ),
        document.removeEventListener(
          "webkitfullscreenchange",
          this.eventsBinding.exitFullscreenHandlerForResizing
        ),
        document.removeEventListener(
          "fullscreenchange",
          this.eventsBinding.exitFullscreenHandlerForResizing
        ),
        this.dom.breadcrumb &&
          this.dom.breadcrumb.removeEventListener(
            "click",
            this.eventsBinding.breadcrumb
          ),
        this.dom.panelBtns)
      )
        for (t = this.dom.panelBtns.length; e < t; ++e)
          this.dom.panelBtns[e].removeEventListener(
            "click",
            this.eventsBinding.panelButtons
          );
      this.dom.canvas &&
        this.dom.canvas.removeEventListener(
          "contextmenu",
          this.eventsBinding.contextMenu
        ),
        (this.dom.breadcrumb = null),
        (this.dom.btns = null),
        (this.dom.canvas = null),
        (this.dom.debugInfos = null),
        (this.dom.frame = null),
        (this.dom.multiSelect = null),
        (this.dom.nodeMoving = null),
        (this.dom.nodesMoving = []),
        (this.dom.overlay = null),
        (this.dom.panel = null),
        (this.dom.panelBtns = []),
        (this.dom.root = null),
        (this.dom.zoom = null);
    });
  var EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_OBJECT = [
    { blueprintClass: "EdGraphNode_Comment", NodeConstructor: NComment },
    { blueprintClass: "K2Node_VariableGet", NodeConstructor: NVariableGet },
    { blueprintClass: "K2Node_Literal", NodeConstructor: NVariableGet },
    { blueprintClass: "K2Node_VariableSet", NodeConstructor: NVariableSet },
    { blueprintClass: "K2Node_CreateDelegate", NodeConstructor: NDelegate },
    { blueprintClass: "K2Node_Event", NodeConstructor: NEvent },
    { blueprintClass: "K2Node_ComponentBoundEvent", NodeConstructor: NEvent },
    { blueprintClass: "K2Node_InputAxisEvent", NodeConstructor: NEvent },
    { blueprintClass: "K2Node_ActorBoundEvent", NodeConstructor: NEvent },
    { blueprintClass: "K2Node_CustomEvent", NodeConstructor: NEventCustom },
    { blueprintClass: "K2Node_IfThenElse", NodeConstructor: NIfThenElse },
    { blueprintClass: "K2Node_InputAction", NodeConstructor: NInputAction },
    { blueprintClass: "K2Node_Self", NodeConstructor: NSelf },
    { blueprintClass: "K2Node_Knot", NodeConstructor: NKnot },
    { blueprintClass: "K2Node_InputKey", NodeConstructor: NInputKey },
    { blueprintClass: "K2Node_InputTouch", NodeConstructor: NInputKey },
    { blueprintClass: "K2Node_InputAxisKeyEvent", NodeConstructor: NInputKey },
    {
      blueprintClass: "MaterialGraphNode_Root",
      NodeConstructor: NMaterialGraphNodeRoot,
    },
    {
      blueprintClass: "MaterialGraphNode_Comment",
      NodeConstructor: NMaterialGraphNodeComment,
    },
    {
      blueprintClass: "MaterialGraphNode",
      NodeConstructor: NMaterialGraphNode,
    },
    { blueprintClass: "K2Node_EnumEquality", NodeConstructor: NKismetMath },
    { blueprintClass: "K2Node_EnumInequality", NodeConstructor: NKismetMath },
    {
      blueprintClass: "K2Node_GetEnumeratorNameAsString",
      NodeConstructor: NConv,
    },
    { blueprintClass: "K2Node_CastByteToEnum", NodeConstructor: NConv },
    { blueprintClass: "K2Node_ConvertAsset", NodeConstructor: NConv },
    { blueprintClass: "K2Node_Composite", NodeConstructor: NComposite },
    { blueprintClass: "AnimStateNode", NodeConstructor: NAnimState },
    { blueprintClass: "AnimStateEntryNode", NodeConstructor: NAnimStateEntry },
    {
      blueprintClass: "AnimStateTransitionNode",
      NodeConstructor: NAnimStateTransition,
    },
    { blueprintClass: "MetasoundEditor", NodeConstructor: NMetasound },
    {
      blueprintClass: "K2Node_EnhancedInputAction",
      NodeConstructor: NEnhancedInputAction,
    },
    { blueprintClass: "K2Node_InputDebugKey", NodeConstructor: NInputKey },
    {
      blueprintClass: "NiagaraClipboardContent",
      NodeConstructor: NNiagaraClipboardContent,
    },
    { blueprintClass: "NiagaraNodeReroute", NodeConstructor: NKnot },
    { blueprintClass: "NiagaraEditor", NodeConstructor: NNiagara },
    { blueprintClass: "PCGEditorGraphNode", NodeConstructor: NPCG },
    {
      blueprintClass: "K2Node_GetEngineSubsystem",
      NodeConstructor: NSubsystem,
    },
    { blueprintClass: "K2Node_GetSubsystem", NodeConstructor: NSubsystem },
  ];
  function Interpreter() {
    (this.text = ""),
      (this.lines = []),
      (this.countLines = 0),
      (this.nodes = []),
      (this.currentNode = null),
      (this.previousNodes = []),
      (this.type = "blueprint"),
      (this.isBelow413Version = !1),
      (this.isBelow52Version = !1),
      (this.graphPins = {}),
      (this.inGraphPinDeclaration = !1),
      (this.inGraphPinDefinition = !1),
      (this.currentGraphPinName = null);
  }
  (Interpreter.prototype.parseText = function (e) {
    return (
      (this.text = e),
      this.detectUnrealVersion(),
      this.cleanText(),
      this.detectType(),
      this.splitTextInCleanLines(),
      this.parseLines(),
      this.inspectNodes(),
      this.nodes
    );
  }),
    (Interpreter.prototype.detectUnrealVersion = function () {
      -1 === this.text.indexOf("CustomProperties Pin") &&
        -1 === this.text.indexOf("ExportedNodes") &&
        (this.isBelow413Version = !0),
        -1 === this.text.indexOf('"NodeGuid"') && (this.isBelow52Version = !0);
    }),
    (Interpreter.prototype.cleanText = function () {
      this.text = this.text.trim();
    }),
    (Interpreter.prototype.detectType = function () {
      -1 !== this.text.indexOf("BehaviorTreeGraphNode_") ||
      -1 !== this.text.indexOf("BehaviorTreeDecoratorGraphNode_")
        ? (this.type = "Behavior Tree")
        : -1 !== this.text.indexOf("MaterialGraphNode")
        ? (this.type = "Material")
        : -1 !== this.text.indexOf("AnimGraphNode_")
        ? (this.type = "Animation")
        : -1 !== this.text.indexOf("/Script/MetasoundEditor")
        ? (this.type = "Metasound")
        : -1 !== this.text.indexOf("/Script/NiagaraEditor")
        ? (this.type = "Niagara")
        : -1 !== this.text.indexOf("PCGEditorGraphNode") && (this.type = "PCG");
    }),
    (Interpreter.prototype.splitTextInCleanLines = function () {
      var e = 0;
      for (
        this.lines = this.text.split(/\n/g),
          this.countLines = this.lines.length;
        e < this.countLines;
        ++e
      )
        this.lines[e] = this.lines[e].trim();
    }),
    (Interpreter.prototype.parseLines = function () {
      for (var e, t = 0; t < this.countLines; ++t) {
        if (this.isBelow413Version) {
          if (this.isNewGraphPinDeclaration(this.lines[t])) {
            this.addGraphPinDeclaration(this.lines[t]),
              (this.inGraphPinDeclaration = !0),
              (this.inGraphPinDefinition = !1);
            continue;
          }
          if (this.isEndGraphPinDeclaration(this.lines[t])) {
            (this.inGraphPinDeclaration = !1), (this.inGraphPinDefinition = !1);
            continue;
          }
          if (this.isGraphPinDefinition(this.lines[t])) {
            (this.inGraphPinDeclaration = !1), (this.inGraphPinDefinition = !0);
            continue;
          }
          if (this.isEndGraphPinDefinition(this.lines[t])) {
            (this.inGraphPinDeclaration = !1), (this.inGraphPinDefinition = !1);
            continue;
          }
          if (!0 === this.inGraphPinDefinition) {
            (e = convertTextToProps(this.lines[t])),
              this.graphPins[this.currentGraphPinName].addProp(e);
            continue;
          }
        }
        this.isNewNode(this.lines[t])
          ? this.createNode(this.lines[t])
          : this.isEndNode(this.lines[t])
          ? (this.isBelow413Version &&
              (this.currentNode.pins = this.reorderGraphPins()),
            this.changeNodeIfNecessary(),
            this.closeNode())
          : this.treatLine(this.lines[t]);
      }
    }),
    (Interpreter.prototype.isNewGraphPinDeclaration = function (e) {
      return !0 === /^Begin Object Class=EdGraphPin/i.test(e);
    }),
    (Interpreter.prototype.addGraphPinDeclaration = function (e) {
      var e = extractObjectDefinition(e),
        e = searchPropWithName(e, "Name"),
        t = new Pin();
      (t.isBelow413Version = !0), (t.id = e.value), (this.graphPins[t.id] = t);
    }),
    (Interpreter.prototype.extractGraphPinName = function (e) {
      var t = e.indexOf('Name="');
      return e.substring(t + 6).replace('"', "");
    }),
    (Interpreter.prototype.isEndGraphPinDeclaration = function (e) {
      return !0 === /^End Object/i.test(e) && !0 === this.inGraphPinDeclaration;
    }),
    (Interpreter.prototype.isGraphPinDefinition = function (e) {
      if (!0 === /^Begin Object/i.test(e)) {
        if (-1 === e.indexOf("EdGraphPin")) return !1;
        if (((e = this.extractGraphPinName(e)), void 0 !== this.graphPins[e]))
          return (this.currentGraphPinName = e), !0;
      }
      return !1;
    }),
    (Interpreter.prototype.isEndGraphPinDefinition = function (e) {
      return !0 === /^End Object/i.test(e) && !0 === this.inGraphPinDefinition;
    }),
    (Interpreter.prototype.isNewNode = function (e) {
      return !0 === /^Begin Object/i.test(e);
    }),
    (Interpreter.prototype.createNode = function (e) {
      null !== this.currentNode && this.previousNodes.push(this.currentNode),
        (this.currentNode = this.nodeFactory(e)),
        this.currentNode.treat(e),
        (this.currentNode.isBelow413Version = this.isBelow413Version),
        (this.currentNode.isBelow52Version = this.isBelow52Version);
    }),
    (Interpreter.prototype.reorderGraphPins = function () {
      for (
        var e = 0, t = this.currentNode.props.length, r = [], n = 0, i = [];
        e < t;
        ++e
      )
        "Pins(" === this.currentNode.props[e].name.substring(0, 5) &&
          (i[
            (n = parseInt(
              this.currentNode.props[e].name.substring(
                5,
                this.currentNode.props[e].name.length - 1
              ),
              10
            ))
          ] = this.currentNode.props[e].value.substring(
            11,
            this.currentNode.props[e].value.length - 1
          ));
      for (n = 0; n < i.length; ++n)
        void 0 !== i[n] &&
          void 0 !== this.graphPins[i[n]] &&
          r.push(this.graphPins[i[n]]);
      return r;
    }),
    (Interpreter.prototype.isEndNode = function (e) {
      return !0 === /^End Object/i.test(e);
    }),
    (Interpreter.prototype.changeNodeIfNecessary = function () {
      var e = null;
      if (this.isCustomNode()) return !1;
      this.isConvNode()
        ? ((e = new NConv()), this.replaceNode(e))
        : this.isKismetMathNode()
        ? ((e = new NKismetMath()), this.replaceNode(e))
        : this.isDotNode()
        ? ((e = new NDot()), this.replaceNode(e))
        : this.isArrayNode() && ((e = new NArray()), this.replaceNode(e));
    }),
    (Interpreter.prototype.closeNode = function () {
      var e,
        t,
        r = null,
        n = 0;
      if (0 < this.previousNodes.length)
        (r = this.previousNodes.pop()).nodes.push(this.currentNode),
          (this.currentNode = r);
      else {
        if ("NNiagaraClipboardContent" === this.currentNode.constructor.name)
          for (
            t = (e = new Interpreter().parseText(
              this.currentNode.getExportedNodes()
            )).length;
            n < t;
            ++n
          )
            this.nodes.push(e[n]);
        else this.nodes.push(this.currentNode);
        this.currentNode = null;
      }
    }),
    (Interpreter.prototype.treatLine = function (e) {
      null !== this.currentNode && this.currentNode.treat(e);
    }),
    (Interpreter.prototype.nodeFactory = function (e) {
      for (
        var t = 0,
          r = EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_OBJECT.length,
          n = null;
        t < r;
        ++t
      )
        if (
          -1 !==
          e.indexOf(EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_OBJECT[t].blueprintClass)
        ) {
          if (
            !this.isBelow52Version &&
            "MaterialGraphNode" ===
              EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_OBJECT[t].blueprintClass &&
            null !== this.currentNode &&
            -1 !==
              ["NMaterialGraphNode"].indexOf(this.currentNode.constructor.name)
          )
            return new BasicObject();
          if (
            "K2Node_Composite" !==
              EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_OBJECT[t].blueprintClass ||
            ((n = new EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_OBJECT[
              t
            ].NodeConstructor()).treat(e),
            n.isRealCompositeNode())
          )
            return new EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_OBJECT[
              t
            ].NodeConstructor();
        }
      return new (
        null !== this.currentNode &&
        -1 !== ["NMaterialGraphNode"].indexOf(this.currentNode.constructor.name)
          ? BasicObject
          : UNode
      )();
    }),
    (Interpreter.prototype.isCustomNode = function () {
      return !(this.currentNode instanceof UNode);
    }),
    (Interpreter.prototype.isConvNode = function () {
      var e = null,
        t = searchPropWithName(this.currentNode.props, "FunctionReference");
      return (
        null !== t &&
        (null !== (e = searchPropWithName(t.value, "MemberParent")) ||
          null !== (e = searchPropWithName(t.value, "MemberParentClass"))) &&
        -1 !==
          searchPropWithName(t.value, "MemberName").value.indexOf("Conv_") &&
        (-1 !== e.value.indexOf("KismetMathLibrary") ||
          -1 !== e.value.indexOf("KismetStringLibrary") ||
          -1 !== e.value.indexOf("KismetTextLibrary") ||
          -1 !== e.value.indexOf("KismetSystemLibrary"))
      );
    }),
    (Interpreter.prototype.isKismetMathNode = function () {
      var e = null,
        t = null,
        r = searchPropWithName(this.currentNode.props, "MacroGraphReference");
      return (
        (null !== r &&
          (-1 !==
            (t = searchPropWithName(r.value, "MacroGraph")).value.indexOf(
              "StandardMacros:Increment"
            ) ||
            -1 !== t.value.indexOf("StandardMacros:Decrement"))) ||
        (null !==
          (r = searchPropWithName(
            this.currentNode.props,
            "FunctionReference"
          )) &&
          (null === (e = searchPropWithName(r.value, "MemberParent")) &&
            (e = searchPropWithName(r.value, "MemberParentClass")),
          (t = searchPropWithName(r.value, "MemberName")),
          null !== e &&
            null !== t &&
            -1 !== e.value.indexOf("KismetMathLibrary") &&
            !1 !== getKismetMathText(t.value)))
      );
    }),
    (Interpreter.prototype.isDotNode = function () {
      var e = null,
        t = null,
        r = searchPropWithName(this.currentNode.props, "FunctionReference");
      return (
        null !== r &&
        ((e = searchPropWithName(r.value, "MemberParent")),
        (t = searchPropWithName(r.value, "MemberName")),
        null !== e &&
          null !== t &&
          !(
            (-1 === t.value.indexOf("Dot_VectorVector") &&
              -1 === t.value.indexOf("DotProduct2D")) ||
            (-1 === e.value.indexOf("KismetMathLibrary") &&
              -1 === e.value.indexOf("KismetStringLibrary"))
          ))
      );
    }),
    (Interpreter.prototype.isArrayNode = function () {
      var e = searchPropWithName(this.currentNode.objectDefinition, "Class");
      if (null !== e) {
        if (-1 !== e.value.indexOf("K2Node_GetArrayItem")) return !0;
        if (-1 !== e.value.indexOf("K2Node_CallArrayFunction"))
          return (
            null !==
              (e = searchPropWithName(
                this.currentNode.props,
                "FunctionReference"
              )) &&
            !(
              -1 !==
              searchPropWithName(e.value, "MemberName").value.indexOf(
                "Array_Set"
              )
            )
          );
      }
      return !1;
    }),
    (Interpreter.prototype.replaceNode = function (e) {
      var t = null;
      for (t in this.currentNode)
        Object.prototype.hasOwnProperty.call(this.currentNode, t) &&
          (e[t] = this.currentNode[t]);
      this.currentNode = e;
    }),
    (Interpreter.prototype.inspectNodes = function () {
      for (var e = 0, t = this.nodes.length; e < t; ++e)
        this.nodes[e].callbackInspectNode(null, null);
    });
  function HiveMP() {
    return (
      (this.title = {
        "Class'/Script/HiveMPSDK.admin_session_AdministrationSession_sessionDELETE'":
          "Explicitly delete an administrative session",
        "Class'/Script/HiveMPSDK.admin_session_AdministrationSession_sessionGET'":
          "Retrieves details about an existing administrative session",
        "Class'/Script/HiveMPSDK.admin_session_AdministrationSession_sessionPOST'":
          "Extend the expiry of your current administrative session",
        "Class'/Script/HiveMPSDK.admin_session_AdministrationSession_sessionPUT'":
          "Creates a new administrative session",
        "Class'/Script/HiveMPSDK.admin_session_AdministrationSession_switchPUT'":
          "Creates a new administrative session that targets the specified project",
        "Class'/Script/HiveMPSDK.admin_session_AdministrationUser_userGET'":
          "Retrieves details about an administration user account",
        "Class'/Script/HiveMPSDK.admin_session_AdministrationUser_userPUT'":
          "Requests the creation of a new administration user account",
        "Class'/Script/HiveMPSDK.admin_session_AdministrationUser_verifyPOST'":
          "Verifies an account using a code that the system provided in the email",
        "Class'/Script/HiveMPSDK.admin_session_News_newsRecentGET'":
          "Retrieve recent news articles about HiveMP",
        "Class'/Script/HiveMPSDK.admin_session_ProjectInfo_accessGET'":
          "Retrieves a list of users that have access to the project",
        "Class'/Script/HiveMPSDK.admin_session_ProjectInfo_accessProjectDELETE'":
          "Revokes project access from a specific project",
        "Class'/Script/HiveMPSDK.admin_session_ProjectInfo_accessProjectPUT'":
          "Grant all users of another project access to a specific project",
        "Class'/Script/HiveMPSDK.admin_session_ProjectInfo_accessUserDELETE'":
          "Revokes user access from a specific project",
        "Class'/Script/HiveMPSDK.admin_session_ProjectInfo_accessUserPUT'":
          "Grant a user access to a specific project",
        "Class'/Script/HiveMPSDK.admin_session_ProjectInfo_projectBillingAccountPUT'":
          "Set the billing account for a project",
        "Class'/Script/HiveMPSDK.admin_session_ProjectInfo_projectGET'":
          "Retrieves information about a specific project",
        "Class'/Script/HiveMPSDK.admin_session_ProjectInfo_projectPOST'":
          "Renames a project, or toggles whether it is active or not",
        "Class'/Script/HiveMPSDK.admin_session_ProjectInfo_projectPUT'":
          "Creates a new project",
        "Class'/Script/HiveMPSDK.admin_session_ProjectInfo_projectsGET'":
          "Retrieves a list of projects that the user has access to",
        "Class'/Script/HiveMPSDK.api_key_Key_keyDELETE'":
          "Deletes the API key immediately, preventing it from being used by future incoming requests.\r\nThis DOES NOT delete the associated session, which you will still be charged for. Therefore where\r\nappropriate you should use the relevant APIs to delete the session instead (which will cause the\r\nAPI key to be deleted)",
        "Class'/Script/HiveMPSDK.api_key_Key_keyGET'":
          "Retrieves public information about a public API key. This does not reveal the key itself",
        "Class'/Script/HiveMPSDK.api_key_Key_keyPOST'":
          "Updates the comment on an API key, if permitted for this API key type. The only API key\r\ntypes you can set a comment on are: 'public'",
        "Class'/Script/HiveMPSDK.api_key_Key_keyPublicPUT'":
          "Creates a new public API key with the specified comment",
        "Class'/Script/HiveMPSDK.api_key_Key_keysAccountGET'":
          "Retrieves a list of current API keys owned by a given user account",
        "Class'/Script/HiveMPSDK.api_key_Key_keysAdminUserGET'":
          "Retrieves a list of current API keys owned by a given administration user",
        "Class'/Script/HiveMPSDK.api_key_Key_keysGET'":
          "Retrieves a list of public API keys",
        "Class'/Script/HiveMPSDK.api_key_Key_revealPUT'":
          "Reveals the actual API key based on the hash, if permitted for this API key type. The only API key\r\ntypes you can reveal the API key for are: 'public'",
        "Class'/Script/HiveMPSDK.attribute_Attribute_attributeDELETE'":
          "Deletes an attribute from an object",
        "Class'/Script/HiveMPSDK.attribute_Attribute_attributeGET'":
          "Retrieves an attribute and it's value from an object",
        "Class'/Script/HiveMPSDK.attribute_Attribute_attributePUT'":
          "Sets or updates an attribute on an object",
        "Class'/Script/HiveMPSDK.attribute_Attribute_attributesGET'":
          "Retrieves a list of attribute keys on an object",
        "Class'/Script/HiveMPSDK.event_EventTypes_typeDELETE'":
          "Schedules deletion of an event type version",
        "Class'/Script/HiveMPSDK.event_EventTypes_typeGET'":
          "Gets the status of all of the versions of a specific event type",
        "Class'/Script/HiveMPSDK.event_EventTypes_typePOST'":
          "Creates a new version of an event type, with a new schema",
        "Class'/Script/HiveMPSDK.event_EventTypes_typePUT'":
          "Creates a new event type with the specified schema",
        "Class'/Script/HiveMPSDK.event_EventTypes_typesGET'":
          "Gets a list of defined event types and their current status",
        "Class'/Script/HiveMPSDK.event_Event_eventBatchInsertPUT'":
          "Batch inserts multiple events with the same event type and version",
        "Class'/Script/HiveMPSDK.event_Event_eventInsertPUT'":
          "Inserts a single event with the specified event type and version",
        "Class'/Script/HiveMPSDK.game_server_GameServerTemplate_templateDELETE'":
          "Deletes a game server template",
        "Class'/Script/HiveMPSDK.game_server_GameServerTemplate_templateGET'":
          "Gets information about an existing game server template",
        "Class'/Script/HiveMPSDK.game_server_GameServerTemplate_templatePOST'":
          "Updates an existing game server template",
        "Class'/Script/HiveMPSDK.game_server_GameServerTemplate_templatePUT'":
          "Creates a new game server template",
        "Class'/Script/HiveMPSDK.game_server_GameServerTemplate_templatesGET'":
          "Retrieve a list of game server templates in the system",
        "Class'/Script/HiveMPSDK.game_server_GameServer_provisionPUT'":
          "Requests the provisioning of a game server",
        "Class'/Script/HiveMPSDK.game_server_GameServer_serverCleanupPOST'":
          "Delete and bill an expired game server instance in HiveMP",
        "Class'/Script/HiveMPSDK.game_server_GameServer_serverGET'":
          "Retrieve details about an existing game server",
        "Class'/Script/HiveMPSDK.game_server_GameServer_serverStatusPOST'":
          "Updates the internal status of a game server instance",
        "Class'/Script/HiveMPSDK.game_server_GameServer_serversGET'":
          "Retrieve details about game servers",
        "Class'/Script/HiveMPSDK.game_server_GameServer_terminateDELETE'":
          "Request termination of an existing game server",
        "Class'/Script/HiveMPSDK.integration_SteamState_steamStateCuratorGET'":
          "Gets the hash of the last recorded Curator Connect data",
        "Class'/Script/HiveMPSDK.integration_SteamState_steamStateCuratorPOST'":
          "Sets the hash of the last recorded Curator Connect data",
        "Class'/Script/HiveMPSDK.integration_SteamState_steamStatePackageGET'":
          "Gets the package information for the last recorded package data",
        "Class'/Script/HiveMPSDK.integration_SteamState_steamStatePackagePOST'":
          "Sets the hash of the last recorded package data",
        "Class'/Script/HiveMPSDK.integration_SteamState_steamStateSalesGET'":
          "Gets the UNIX timestamp and index of the last recorded sales data",
        "Class'/Script/HiveMPSDK.integration_SteamState_steamStateSalesPOST'":
          "Sets the UNIX timestamp and index of the last recorded sales data",
        "Class'/Script/HiveMPSDK.integration_SteamState_steamStateTrafficGET'":
          "Gets the UNIX timestamp of the last recorded traffic data",
        "Class'/Script/HiveMPSDK.integration_SteamState_steamStateTrafficPOST'":
          "Sets the UNIX timestamp of the last recorded traffic data",
        "Class'/Script/HiveMPSDK.integration_SteamState_steamStateWishlistGET'":
          "Gets the UNIX timestamp of the last recorded wishlist data",
        "Class'/Script/HiveMPSDK.integration_SteamState_steamStateWishlistPOST'":
          "Sets the UNIX timestamp of the last recorded wishlist data",
        "Class'/Script/HiveMPSDK.integration_Steam_steamConfiguredGET'":
          "Returns if the project is configured for Steam integration.  If this is true, processing will occur\r\nevery hour to perform data capture.  This API is only accessible from within the cluster",
        "Class'/Script/HiveMPSDK.integration_Steam_steamCredentialsGET'":
          "Returns the credentials required to authenticate with Steam.  This API is accessible\r\nonly by Hive's internal infrastructure",
        "Class'/Script/HiveMPSDK.integration_Steam_steamCredentialsGamesPUT'":
          "Sets the cookies used to connect to partner.steamgames.com.  This API is only\r\naccessible from within the cluster",
        "Class'/Script/HiveMPSDK.integration_Steam_steamCredentialsGuardPUT'":
          "Sets the Steam Guard cookie.  This API is only accessible from within the cluster",
        "Class'/Script/HiveMPSDK.integration_Steam_steamCredentialsPoweredPUT'":
          "Sets the cookie used to connect to partner.steampowered.com.  This API is only\r\naccessible from within the cluster",
        "Class'/Script/HiveMPSDK.integration_Steam_steamEmailidGET'":
          "Gets the Steam account ID associated with the last Steam Guard request",
        "Class'/Script/HiveMPSDK.integration_Steam_steamEmailidPUT'":
          "Sets the Steam account ID associated with the last Steam Guard request",
        "Class'/Script/HiveMPSDK.integration_Steam_steamErrormsgGET'":
          "Gets the last Steam authentication error or message",
        "Class'/Script/HiveMPSDK.integration_Steam_steamErrormsgPUT'":
          "Sets the last Steam authentication error or message.  Only accessible inside the Hive cluster",
        "Class'/Script/HiveMPSDK.integration_Steam_steamGuardGET'":
          "Returns the status of Steam Guard for the project",
        "Class'/Script/HiveMPSDK.integration_Steam_steamGuardPUT'":
          "Allows you to provide a Steam Guard code if one is necessary",
        "Class'/Script/HiveMPSDK.integration_Steam_steamGuardStatusPUT'":
          "Sets the Steam Guard status.  This API is only accessible from within the cluster",
        "Class'/Script/HiveMPSDK.integration_Steam_steamPUT'":
          "Configures Steam integration for this project",
        "Class'/Script/HiveMPSDK.integration_Steam_steamReimportPUT'":
          "Scheduled a full reimport of all captured Steam data.  This will delete all Steam related \r\ndata from Hive before the import begins, so reports will be unavailable during the reimport",
        "Class'/Script/HiveMPSDK.integration_Steam_steamStatusGET'":
          "Get a summary of the Steam integration configuration in the project",
        "Class'/Script/HiveMPSDK.integration_Stripe_stripeDELETE'":
          "Removes Stripe integration from this project",
        "Class'/Script/HiveMPSDK.integration_Stripe_stripeGET'":
          "Returns the Stripe public and secret keys that were configured for integration.  This method\r\nis only accessible within the Hive cluster",
        "Class'/Script/HiveMPSDK.integration_Stripe_stripePUT'":
          "Configures Stripe integration for this project",
        "Class'/Script/HiveMPSDK.integration_Stripe_stripeStatusGET'":
          "Returns the status of Stripe integration for administration viewing",
        "Class'/Script/HiveMPSDK.integration_Stripe_stripeTogglePUT'":
          "Enables or disables Stripe integration",
        "Class'/Script/HiveMPSDK.lobby_Lobby_lobbiesGET'":
          "Retrieve a list of the first 50 game lobbies.  This method is deprecated, use /lobbies/paginated instead",
        "Class'/Script/HiveMPSDK.lobby_Lobby_lobbiesPaginatedGET'":
          "Retrieve a list of game lobbies",
        "Class'/Script/HiveMPSDK.lobby_Lobby_lobbyDELETE'":
          "Deletes a game lobby, if you are the owner of it",
        "Class'/Script/HiveMPSDK.lobby_Lobby_lobbyGET'":
          "Retrieves information about a game lobby",
        "Class'/Script/HiveMPSDK.lobby_Lobby_lobbyPOST'":
          "Updates an existing game lobby, if you are the owner of it",
        "Class'/Script/HiveMPSDK.lobby_Lobby_lobbyPUT'":
          "Creates a new game lobby",
        "Class'/Script/HiveMPSDK.lobby_Lobby_sessionDELETE'":
          "Leaves or kicks a session from a game lobby",
        "Class'/Script/HiveMPSDK.lobby_Lobby_sessionGET'":
          "Gets information about the state of a session connected to a game lobby",
        "Class'/Script/HiveMPSDK.lobby_Lobby_sessionPUT'":
          "Joins the specified session to a game lobby",
        "Class'/Script/HiveMPSDK.lobby_Lobby_sessionsGET'":
          "Get a list of sessions that are in a game lobby",
        "Class'/Script/HiveMPSDK.nat_punchthrough_Punchthrough_endpointsGET'":
          "Returns a list of known endpoints for a session",
        "Class'/Script/HiveMPSDK.nat_punchthrough_Punchthrough_pingPUT'":
          "Accepts information about a NAT punchthrough UDP request from a listener",
        "Class'/Script/HiveMPSDK.nat_punchthrough_Punchthrough_punchthroughGET'":
          "Returns information about an established NAT negotation, if it exists",
        "Class'/Script/HiveMPSDK.nat_punchthrough_Punchthrough_punchthroughPUT'":
          "Creates a NAT negotation, which you can use to send a message over UDP to punchthrough NAT",
        "Class'/Script/HiveMPSDK.pos_Event_eventGET'":
          "Returns information about an event",
        "Class'/Script/HiveMPSDK.pos_Event_eventPOST'":
          "Updates an existing event",
        "Class'/Script/HiveMPSDK.pos_Event_eventPUT'": "Creates a new event",
        "Class'/Script/HiveMPSDK.pos_Event_eventsGET'":
          "Retrieves a list of events",
        "Class'/Script/HiveMPSDK.pos_Event_eventsSearchGET'":
          "Searches for events based on text entry",
        "Class'/Script/HiveMPSDK.pos_LicenseKey_keysByIssuedEmailGET'":
          "Gets a list of keys that have been issued for a user email",
        "Class'/Script/HiveMPSDK.pos_LicenseKey_keysByReservedEmailGET'":
          "Gets a list of keys that have been reserved for a user email",
        "Class'/Script/HiveMPSDK.pos_LicenseKey_keysIssuePUT'":
          "keysIssuePUT (missing description)",
        "Class'/Script/HiveMPSDK.pos_LicenseKey_keysPUT'":
          "Adds a set of license keys to a pool",
        "Class'/Script/HiveMPSDK.pos_LicenseKey_keysReservePUT'":
          "Reserves a randomly selected, available license key from a license key pool to a specific user",
        "Class'/Script/HiveMPSDK.pos_LicenseKey_poolGET'":
          "Gets an existing license key pool",
        "Class'/Script/HiveMPSDK.pos_LicenseKey_poolPOST'":
          "Updates an existing license key pool",
        "Class'/Script/HiveMPSDK.pos_LicenseKey_poolPUT'":
          "Creates a new license key pool",
        "Class'/Script/HiveMPSDK.pos_LicenseKey_poolsGET'":
          "Retrieves a list of license key pools",
        "Class'/Script/HiveMPSDK.pos_LicenseKey_poolsSearchGET'":
          "Searches for license key pools based on text entry",
        "Class'/Script/HiveMPSDK.pos_Product_productGET'":
          "Returns point of sale information about a product, if that product exists",
        "Class'/Script/HiveMPSDK.pos_Product_productPOST'":
          "Updates the point of sale information associated with a product.  There is no create or\r\ndelete methods with the Point of Sale API; use the Revenue Share API to create products",
        "Class'/Script/HiveMPSDK.reporting_BigQueryAccess_bigqueryAccessDELETE'":
          "Revokes access to the private and public BigQuery datasets for this project",
        "Class'/Script/HiveMPSDK.reporting_BigQueryAccess_bigqueryAccessPUT'":
          "Grants access to the private and public BigQuery datasets for this project",
        "Class'/Script/HiveMPSDK.reporting_BigQueryAccess_bigqueryProjectAccessGET'":
          "View a list of Google accounts with access to BigQuery for this project",
        "Class'/Script/HiveMPSDK.reporting_BuiltinReports_builtinSalesUnitBreakdownRetailGET'":
          "Returns a report which provides a unit sales breakdown for retail (non-Steam) only",
        "Class'/Script/HiveMPSDK.reporting_BuiltinReports_builtinSalesUnitBreakdownSourceGET'":
          "Returns a report which provides a unit sales breakdown by activation source",
        "Class'/Script/HiveMPSDK.reporting_BuiltinReports_builtinSalesUnitBreakdownSteamGET'":
          "Returns a report which provides a unit sales breakdown for Steam Store only",
        "Class'/Script/HiveMPSDK.reporting_BuiltinReports_builtinSalesUsdBreakdownSourceGET'":
          "Returns a report which provides a USD sales breakdown by activation source",
        "Class'/Script/HiveMPSDK.reporting_BuiltinReports_builtinSalesUsdBreakdownSteamGET'":
          "Returns a report which provides a USD sales breakdown for Steam Store only",
        "Class'/Script/HiveMPSDK.reporting_BuiltinReports_builtinVisitsActionsConversionGET'":
          "Returns a report which shows the conversion rate between page visits and wishlists / sales in Steam",
        "Class'/Script/HiveMPSDK.reporting_BuiltinReports_builtinVisitsActionsGET'":
          "Returns a report which shows the number of page visits against wishlist add actions and sales in Steam",
        "Class'/Script/HiveMPSDK.reporting_BuiltinReports_builtinVisitsBreakdownDetailedGET'":
          "Returns a report which provides a detailed breakdown of visit sources to the store page in Steam",
        "Class'/Script/HiveMPSDK.reporting_BuiltinReports_builtinVisitsBreakdownPageGET'":
          "Returns a report which provides a page-grouped breakdown of visit sources to the store page in Steam",
        "Class'/Script/HiveMPSDK.reporting_BuiltinReports_builtinVisitsWishlistsGET'":
          "Returns a report which shows the number of page visits against wishlist add actions in Steam",
        "Class'/Script/HiveMPSDK.reporting_BuiltinReports_builtinWishlistActionsGET'":
          "Returns a report which breaks down wishlist actions (add, delete, purchases/activations, gifts) in Steam",
        "Class'/Script/HiveMPSDK.reporting_Report_reportGET'":
          "Return a paginated list of reports",
        "Class'/Script/HiveMPSDK.reporting_Report_reportsGET'":
          "Return a paginated list of reports",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoiceGET'":
          "Gets an existing invoice in the system",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoiceItemDELETE'":
          "Deletes a line item from an invoice",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoiceItemPOST'":
          "Updates an existing line item on an invoice",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoiceItemPUT'":
          "Creates a line item on an invoice",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePOST'":
          "Updates an invoice",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePUT'":
          "Creates a new invoice",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePaymentGET'":
          "Gets an existing payment",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePaymentPOST'":
          "Updates an existing draft payment for the invoice",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePaymentPUT'":
          "Creates a new draft payment for the invoice",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePaymentPostPUT'":
          "Posts a payment to the system, calculating the appropriate revenue share amounts",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePaymentProcessPUT'":
          "Incrementally processes a payment, creating or archiving recipient transactions as needed",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePaymentProgressGET'":
          "Gets the current operation on the payment",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePaymentRequeuePUT'":
          "Requeues the payment for processing",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePaymentTransactionsGET'":
          "Returns a list of transactions associated with a posted payment. If the payment is not posted, this API returns\r\nan empty array",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePaymentUnpostPUT'":
          "Unposts a payment from the system, rolling back any recipient transactions",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePaymentsGET'":
          "Retrieves a list of payments against a specified revenue share invoice",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicePostPUT'":
          "Posts an invoice to the permanent record.  Once an invoice is posted, it can't be edited until it is unposted",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoiceUnpostPUT'":
          "Unposts an invoice from the permanent record.  You can only unpost invoices that have no posted payments against them",
        "Class'/Script/HiveMPSDK.revenue_share_Invoice_invoicesGET'":
          "Retrieves a list of revenue share invoices in the system",
        "Class'/Script/HiveMPSDK.revenue_share_Product_productGET'":
          "Gets an existing product in the system",
        "Class'/Script/HiveMPSDK.revenue_share_Product_productPOST'":
          "Updates an existing product",
        "Class'/Script/HiveMPSDK.revenue_share_Product_productPUT'":
          "Creates a new product",
        "Class'/Script/HiveMPSDK.revenue_share_Product_productsGET'":
          "Retrieves a list of products in the system",
        "Class'/Script/HiveMPSDK.revenue_share_Product_productsSearchGET'":
          "Searches for products based on text entry",
        "Class'/Script/HiveMPSDK.revenue_share_Recipient_recipientGET'":
          "Gets an existing recipient in the system",
        "Class'/Script/HiveMPSDK.revenue_share_Recipient_recipientPOST'":
          "Updates an existing recipient",
        "Class'/Script/HiveMPSDK.revenue_share_Recipient_recipientPUT'":
          "Creates a new recipient",
        "Class'/Script/HiveMPSDK.revenue_share_Recipient_recipientTransactionDELETE'":
          "Archives a custom transaction on a recipient",
        "Class'/Script/HiveMPSDK.revenue_share_Recipient_recipientTransactionGET'":
          "Returns information about the specified transaction",
        "Class'/Script/HiveMPSDK.revenue_share_Recipient_recipientTransactionPUT'":
          "Creates a new custom transaction against a recipient",
        "Class'/Script/HiveMPSDK.revenue_share_Recipient_recipientTransactionsGET'":
          "Retrieves a list of transactions against a recipient",
        "Class'/Script/HiveMPSDK.revenue_share_Recipient_recipientsGET'":
          "Retrieves a list of recipients in the system",
        "Class'/Script/HiveMPSDK.revenue_share_Recipient_recipientsSearchGET'":
          "Searches for recipients based on text entry",
        "Class'/Script/HiveMPSDK.revenue_share_RevenueShareRuleset_rulesetGET'":
          "Gets an existing revenue share ruleset in the system",
        "Class'/Script/HiveMPSDK.revenue_share_RevenueShareRuleset_rulesetPOST'":
          "Updates an existing revenue share ruleset",
        "Class'/Script/HiveMPSDK.revenue_share_RevenueShareRuleset_rulesetPUT'":
          "Creates a new revenue share ruleset",
        "Class'/Script/HiveMPSDK.revenue_share_RevenueShareRuleset_rulesetSimulatePUT'":
          "Simulate a revenue share ruleset against a given product and an amount",
        "Class'/Script/HiveMPSDK.revenue_share_RevenueShareRuleset_rulesetsGET'":
          "Retrieves a list of revenue share rulesets in the system",
        "Class'/Script/HiveMPSDK.revenue_share_RevenueShareRuleset_rulesetsSearchGET'":
          "Searches for rulesets based on text entry",
        "Class'/Script/HiveMPSDK.revenue_share_Stripe_stripePaymentEnabledPOST'":
          "Enables or disables whether this payment can be posted by someone paying\r\nit via Stripe",
        "Class'/Script/HiveMPSDK.revenue_share_Stripe_stripePaymentGET'":
          "stripePaymentGET (missing description)",
        "Class'/Script/HiveMPSDK.revenue_share_Stripe_stripePaymentPUT'":
          "stripePaymentPUT (missing description)",
        "Class'/Script/HiveMPSDK.revenue_share_Stripe_stripePaymentStatusGET'":
          "Gets the Stripe information about a given payment",
        "Class'/Script/HiveMPSDK.search_Cluster_internalIndexDELETE'":
          "Deletes an object from the internal index. This is usually used when \r\nan object visibility is toggled off. This can only be called\r\nfrom within the Hive cluster",
        "Class'/Script/HiveMPSDK.search_Cluster_internalIndexPUT'":
          "Updates an object in the internal index. This can only be called\r\nfrom within the Hive cluster",
        "Class'/Script/HiveMPSDK.search_Cluster_internalSearchGET'":
          "Searches for internally indexed objects based on the input text. This can only be called\r\nfrom within the Hive cluster",
        "Class'/Script/HiveMPSDK.search_Search_indexDELETE'":
          "Deletes an object from the search index. This is usually used when \r\nan object visibility is toggled off or the object is deleted",
        "Class'/Script/HiveMPSDK.search_Search_indexPUT'":
          "Updates or adds an object to the search index",
        "Class'/Script/HiveMPSDK.search_Search_searchGET'":
          "Searches for indexed objects based on the input text",
        "Class'/Script/HiveMPSDK.temp_session_TemporarySessionAdmin_sessionsGET'":
          "Retrieves a list of temporary sessions in the system",
        "Class'/Script/HiveMPSDK.temp_session_TemporarySession_sessionDELETE'":
          "Explicitly delete a temporary session",
        "Class'/Script/HiveMPSDK.temp_session_TemporarySession_sessionGET'":
          "Retrieves details about an existing session",
        "Class'/Script/HiveMPSDK.temp_session_TemporarySession_sessionPOST'":
          "Reset the expiry of the temporary session",
        "Class'/Script/HiveMPSDK.temp_session_TemporarySession_sessionPUT'":
          "Creates a new temporary session",
        "Class'/Script/HiveMPSDK.ugc_cache_UGCCache_contentGET'":
          "Redirects to a public URL containing the file content",
        "Class'/Script/HiveMPSDK.ugc_cache_UGCCache_itemPUT'":
          "Stores a UGC cache item in Hive.  Only non-temporary session can use this API (i.e. your session must have persistent owner information attached)",
        "Class'/Script/HiveMPSDK.user_session_UserSession_sessionDELETE'":
          "Explicitly delete a user session",
        "Class'/Script/HiveMPSDK.user_session_UserSession_sessionGET'":
          "Retrieves details about an existing session",
        "Class'/Script/HiveMPSDK.user_session_UserSession_sessionPOST'":
          "Reset the expiry of the user session",
        "Class'/Script/HiveMPSDK.user_session_UserSession_sessionPUT'":
          "Creates a new user session, by authenticating against the specified account",
      }),
      this
    );
  }
  HiveMP.prototype.findHeaderNameForHiveMPSDK = function (e) {
    e = e.replace(/"/g, "");
    return void 0 !== this.title[e]
      ? this.title[e]
      : "Async Task: " +
          transformInternalName(
            e.replace("Class'/Script/HiveMPSDK.", "").replace("'", "")
          );
  };
  var SPECIAL_TREATMENTS = [
      { name: "NodePosX=", len: 9, fn: castInt, arg0: "position", arg1: 0 },
      { name: "NodePosY=", len: 9, fn: castInt, arg0: "position", arg1: 1 },
      { name: "NodeWidth=", len: 10, fn: castInt, arg0: "size", arg1: 0 },
      { name: "NodeHeight=", len: 11, fn: castInt, arg0: "size", arg1: 1 },
      { name: "NodeGuid=", len: 9, fn: castStr, arg0: "guid", arg1: null },
      {
        name: "NodeComment=",
        len: 12,
        fn: castStr,
        arg0: "comment",
        arg1: null,
      },
    ],
    EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_CSS_COLOR = [
      { blueprintClass: "K2Node_SetFieldsInStruct", cssColor: "break-struct" },
      { blueprintClass: "K2Node_DynamicCast", cssColor: "cast" },
      { blueprintClass: "K2Node_SwitchEnum", cssColor: "switch" },
      { blueprintClass: "K2Node_SwitchName", cssColor: "switch" },
      { blueprintClass: "K2Node_SwitchInteger", cssColor: "switch" },
      { blueprintClass: "K2Node_SwitchString", cssColor: "switch" },
      { blueprintClass: "K2Node_Timeline", cssColor: "timeline" },
      { blueprintClass: "K2Node_Select", cssColor: "pure-function-call" },
      { blueprintClass: "K2Node_Tunnel", cssColor: "function-call" },
      {
        blueprintClass: "K2Node_FunctionEntry",
        cssColor: "function-terminator",
      },
      {
        blueprintClass: "K2Node_FunctionResult",
        cssColor: "function-terminator",
      },
      { blueprintClass: "K2Node_ExecutionSequence", cssColor: "macro" },
      { blueprintClass: "K2Node_MakeArray", cssColor: "pure-function-call" },
      {
        blueprintClass: "K2Node_GetClassDefaults",
        cssColor: "pure-function-call",
      },
      { blueprintClass: "K2Node_BreakStruct", cssColor: "break-struct" },
      { blueprintClass: "K2Node_FormatText", cssColor: "pure-function-call" },
      { blueprintClass: "K2Node_MakeMap", cssColor: "pure-function-call" },
      {
        blueprintClass: "K2Node_CallParentFunction",
        cssColor: "parent-function-call",
      },
    ],
    EQUIVALENCE_MAP_MACRO_TO_CSS_ICON = [
      { macro: "StandardMacros:FlipFlop", cssIcon: "flipflop" },
      { macro: "StandardMacros:Gate", cssIcon: "gate" },
      { macro: "StandardMacros:IsValid", cssIcon: "isvalid" },
      { macro: "StandardMacros:ForEachLoop", cssIcon: "foreach" },
      { macro: "StandardMacros:ForEachLoopWithBreak", cssIcon: "foreach" },
      { macro: "StandardMacros:ForLoopWithBreak", cssIcon: "loop" },
      { macro: "StandardMacros:ForLoop", cssIcon: "loop" },
      { macro: "StandardMacros:WhileLoop", cssIcon: "loop" },
      { macro: "StandardMacros:Do N", cssIcon: "do_n" },
      { macro: "StandardMacros:DoOnce", cssIcon: "do_once" },
    ],
    EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_CSS_ICON = [
      { blueprintClass: "K2Node_Tunnel", cssIcon: "blueprint-node" },
      { blueprintClass: "K2Node_AddDelegate", cssIcon: "blueprint-node" },
      {
        blueprintClass: "K2Node_GenericCreateObject",
        cssIcon: "blueprint-node",
      },
      { blueprintClass: "K2Node_GetClassDefaults", cssIcon: "blueprint-node" },
      { blueprintClass: "K2Node_LatentOnlineCall", cssIcon: "blueprint-node" },
      { blueprintClass: "K2Node_SwitchEnum", cssIcon: "switch" },
      { blueprintClass: "K2Node_SwitchName", cssIcon: "switch" },
      { blueprintClass: "K2Node_SwitchInteger", cssIcon: "switch" },
      { blueprintClass: "K2Node_SwitchString", cssIcon: "switch" },
      { blueprintClass: "K2Node_Select", cssIcon: "select" },
      { blueprintClass: "K2Node_MakeStruct", cssIcon: "make-struct" },
      { blueprintClass: "K2Node_MakeArray", cssIcon: "make-array" },
      { blueprintClass: "K2Node_BreakStruct", cssIcon: "break-struct" },
      { blueprintClass: "K2Node_FunctionEntry", cssIcon: "blueprint-node" },
      { blueprintClass: "K2Node_FunctionResult", cssIcon: "blueprint-node" },
      { blueprintClass: "K2Node_SpawnActorFromClass", cssIcon: "spawn-actor" },
      { blueprintClass: "K2Node_DynamicCast", cssIcon: "cast" },
      { blueprintClass: "K2Node_ExecutionSequence", cssIcon: "sequence" },
      { blueprintClass: "K2Node_Select", cssIcon: "pure-function-call" },
      { blueprintClass: "K2Node_Timeline", cssIcon: "timeline" },
      { blueprintClass: "K2Node_CreateWidget", cssIcon: "blueprint-node" },
      { blueprintClass: "K2Node_SetFieldsInStruct", cssIcon: "pill" },
      { blueprintClass: "K2Node_MakeMap", cssIcon: "make-map" },
    ];
  function UNode() {
    (this.objectDefinition = []),
      (this.position = [0, 0]),
      (this.size = [0, 0]),
      (this.guid = ""),
      (this.comment = ""),
      (this.pins = []),
      (this.props = []),
      (this.userDefinedPins = []),
      (this.nodes = []),
      (this.isBelow413Version = !1),
      (this.isBelow52Version = !1),
      (this.containsVisualNodes = !1);
  }
  (UNode.prototype.treat = function (e) {
    var t,
      n,
      s = 0,
      i = SPECIAL_TREATMENTS.length,
      r = 0;
    for (
      this.isBelow52Version ||
      '"' !== e.substring(0, 1) ||
      (e = e.replace('"', "").replace('"', ""));
      s < i;
      ++s
    )
      if (
        SPECIAL_TREATMENTS[s].name === e.substring(0, SPECIAL_TREATMENTS[s].len)
      )
        return void SPECIAL_TREATMENTS[s].fn.call(
          this,
          e.substring(SPECIAL_TREATMENTS[s].len),
          SPECIAL_TREATMENTS[s].arg0,
          SPECIAL_TREATMENTS[s].arg1
        );
    if ("CustomProperties Pin" === e.substring(0, 20))
      this.treatCustomProperties(e.substring(20));
    else if ("Begin Object" === e.substring(0, 12))
      this.objectDefinition = extractObjectDefinition(e);
    else if ("CustomProperties UserDefinedPin" === e.substring(0, 31))
      this.userDefinedPins.push(e.substring(31));
    else if (((t = convertTextToProps(e)), Array.isArray(t)))
      for (n = t.length; r < n; ++r) this.props.push(t[r]);
    else this.props.push(t);
  }),
    (UNode.prototype.treatCustomProperties = function (e) {
      var t = new Pin(),
        n = convertTextToProps(e),
        s = 0,
        i = n.length;
      if (Array.isArray(n)) for (; s < i; ++s) t.addProp(n[s]);
      else t.addProp(n);
      this.pins.push(t);
    }),
    (UNode.prototype.generateTextForUnreal = function (e) {
      var t = "";
      return (
        (t += "Begin " + this.generateTextObjectDefinition()) +
        this.generateTextProps(e) +
        ("End " + this.objectDefinition[0].value)
      );
    }),
    (UNode.prototype.generateTextObjectDefinition = function () {
      for (
        var e, t = [], n = 0, s = this.objectDefinition.length, i = "", r = "";
        n < s;
        ++n
      )
        (e = this.objectDefinition[n].value),
          (i = ""),
          this.objectDefinition[n].useDelimiter && (i = '"'),
          (r = ""),
          this.objectDefinition[n].name &&
            (r = this.objectDefinition[n].name + "="),
          t.push(r + i + e + i);
      return t.join(" ") + "\n";
    }),
    (UNode.prototype.generateTextObjectDefinitionNameOnly = function () {
      var e = [],
        t = "",
        n = searchPropWithName(this.objectDefinition, "Name");
      return (
        null !== n &&
          ((t = ""),
          n.useDelimiter && (t = '"'),
          e.push("Name=" + t + n.value + t)),
        e.join(" ") + "\n"
      );
    }),
    (UNode.prototype.generateTextProps = function (e) {
      var t,
        n,
        s = [],
        i = 0,
        r = this.props.length,
        o = 0,
        a = this.pins.length,
        l = 0,
        u = this.userDefinedPins.length,
        c = getIndentFormat(e),
        d = "",
        p = "",
        h = "",
        f = -1;
      if (
        (0 !== this.position[0] &&
          ((p = '"NodePosX"='),
          this.isBelow52Version && (p = "NodePosX="),
          s.push(c + p + this.position[0])),
        0 !== this.position[1] &&
          ((p = '"NodePosY"='),
          this.isBelow52Version && (p = "NodePosY="),
          s.push(c + p + this.position[1])),
        (0 === this.size[0] && 0 === this.size[1]) ||
          ((p = '"NodeWidth"='),
          this.isBelow52Version && (p = "NodeWidth="),
          s.push(c + p + this.size[0]),
          (p = '"NodeHeight"='),
          this.isBelow52Version && (p = "NodeHeight="),
          s.push(c + p + this.size[1])),
        0 < this.guid.length &&
          ((p = '"NodeGuid"='),
          this.isBelow52Version && (p = "NodeGuid="),
          s.push(c + p + this.guid)),
        0 < this.comment.length &&
          ((p = '"NodeComment"='),
          this.isBelow52Version && (p = "NodeComment="),
          s.push(c + p + this.comment)),
        this.isBelow413Version)
      ) {
        for (; o < a; ++o)
          s.push(
            c + 'Begin Object Class=EdGraphPin Name="' + this.pins[o].id + '"'
          ),
            s.push(c + "End Object");
        for (; i < r; ++i) s.push(c + convertPropsToText(this.props[i]));
        for (; l < u; ++l)
          s.push(
            c + "CustomProperties UserDefinedPin" + this.userDefinedPins[l]
          );
      } else {
        for (; i < r; ++i)
          (h = convertPropsToText(this.props[i])),
            this.isBelow52Version ||
              ((t = h.indexOf("=")),
              -1 !== (n = h.indexOf("(")) && n < t
                ? (f = n)
                : -1 !== t && (f = t),
              (h = '"' + h.substring(0, f) + '"' + h.substring(f))),
            s.push(c + h);
        for (; l < u; ++l)
          s.push(
            c + "CustomProperties UserDefinedPin" + this.userDefinedPins[l]
          );
      }
      for (o = 0; o < a; ++o) s.push(this.pins[o].generateTextForUnreal(e));
      return 0 < (d = s.join("\n")).length && (d += "\n"), d;
    }),
    (UNode.prototype.generateHTML = function () {
      var e,
        t = {
          tag: "div",
          classes: ["node"],
          attrs: [
            { name: "style", value: this.generateCssNodeStyle().join(";") },
            { name: "data-id", value: this.guid },
          ],
          childs: [this.generateHTMLToolTip(), this.generateHTMLHeader()],
        },
        n = this.generateHTMLBody(),
        s = 0;
      if (Array.isArray(n)) for (e = n.length; s < e; ++s) t.childs.push(n[s]);
      else t.childs.push(n);
      return t;
    }),
    (UNode.prototype.generateCssNodeStyle = function () {
      var e = [];
      return (
        e.push("position:absolute"),
        e.push(
          "transform: translate(" +
            this.position[0] +
            "px, " +
            this.position[1] +
            "px)"
        ),
        0 !== this.size[0] && e.push("width:" + this.size[0] + "px"),
        0 !== this.size[1] && e.push("height:" + this.size[1] + "px"),
        e
      );
    }),
    (UNode.prototype.generateHTMLHeader = function () {
      for (
        var e = this.generateHTMLPinDelegate(),
          t = 0,
          n = e.length,
          s = {
            tag: "div",
            classes: [
              "header",
              "node-color",
              this.findCssClassNodeColor(),
              "gradient",
              this.findIconAfterNode(),
            ],
            childs: [
              { tag: "div", classes: ["icon", this.findCssClassNodeIcon()] },
              {
                tag: "span",
                classes: ["has-icon", "name"],
                text: this.findHeaderName(),
                childs: [
                  { tag: "br" },
                  {
                    tag: "span",
                    classes: ["subname"],
                    text: this.findHeaderSubname(),
                  },
                ],
              },
            ],
          };
        t < n;
        ++t
      )
        s.childs.push(e[t]);
      return s;
    }),
    (UNode.prototype.findCssClassNodeColor = function () {
      var e,
        t = 0,
        n = EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_CSS_COLOR.length,
        s = searchPropWithName(this.objectDefinition, "Class");
      if (null !== s) {
        for (; t < n; ++t)
          if (
            -1 !==
            s.value.indexOf(
              EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_CSS_COLOR[t].blueprintClass
            )
          )
            return EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_CSS_COLOR[t].cssColor;
        if (-1 !== s.value.indexOf("K2Node_CallFunction"))
          return null !== (e = searchPropWithName(this.props, "bIsPureFunc")) &&
            "True" === e.value
            ? "pure-function-call"
            : "function-call";
      }
      return null !== searchPropWithName(this.props, "DelegateReference")
        ? "function-call"
        : null !== searchPropWithName(this.props, "MacroGraphReference")
        ? "macro"
        : null !== (e = searchPropWithName(this.props, "FunctionReference")) &&
          "Concat_StrStr" === searchPropWithName(e.value, "MemberName").value
        ? "pure-function-call"
        : "function-call";
    }),
    (UNode.prototype.generateHTMLToolTip = function () {
      var e,
        t,
        n = "",
        s = { tag: "div", classes: ["tooltip"] },
        i = [],
        r = 0;
      if (0 === this.comment.length) return null;
      if (
        (
          (n = n2br(
            nl2br(
              removeQuotes(this.comment)
                .replaceAll("\\'", "'")
                .replace(/\\"/g, '"')
            )
          )).match(/<br>/g) || []
        ).length < 1
      )
        (s.text = n), (s.attrs = [{ name: "style", value: "top:-33px" }]);
      else {
        for (t = (e = n.split(/<br>/g)).length; r < t; ++r)
          i.push({ text: e[r] }), r + 1 < t && i.push({ tag: "br" });
        (s.childs = i),
          (s.attrs = [
            {
              name: "style",
              value: "top:-" + ((i.length / 2) * 15 + 28) + "px",
            },
          ]);
      }
      return s;
    }),
    (UNode.prototype.findCssClassNodeIcon = function () {
      var e = searchPropWithName(this.props, "MacroGraphReference"),
        t = null,
        n = null,
        s = null,
        i = null,
        r = 0,
        o = EQUIVALENCE_MAP_MACRO_TO_CSS_ICON.length;
      if (null !== e) {
        if (null === (t = searchPropWithName(e.value, "MacroGraph")))
          return "macro";
        for (; r < o; ++r)
          if (
            -1 !== t.value.indexOf(EQUIVALENCE_MAP_MACRO_TO_CSS_ICON[r].macro)
          )
            return EQUIVALENCE_MAP_MACRO_TO_CSS_ICON[r].cssIcon;
        return "macro";
      }
      if (null !== (n = searchPropWithName(this.objectDefinition, "Class")))
        for (
          r = 0, o = EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_CSS_ICON.length;
          r < o;
          ++r
        )
          if (
            -1 !==
            n.value.indexOf(
              EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_CSS_ICON[r].blueprintClass
            )
          )
            return EQUIVALENCE_MAP_BLUEPRINT_CLASS_TO_CSS_ICON[r].cssIcon;
      if (null !== (e = searchPropWithName(this.props, "FunctionReference"))) {
        if (
          ((s =
            null !== (s = searchPropWithName(e.value, "MemberParent")) &&
            -1 !== s.value.indexOf("KismetMathLibrary")),
          (i = searchPropWithName(e.value, "MemberName")),
          s && -1 !== i.value.indexOf("Make"))
        )
          return "make-struct";
        if (s && -1 !== i.value.indexOf("Break")) return "break-struct";
      }
      return null !== (e = searchPropWithName(this.props, "bIsPureFunc")) &&
        "True" === e.value
        ? ((s = this.findHeaderName()),
          -1 !== ["Break Hit Result"].indexOf(s)
            ? "break-struct"
            : "pure-function-call")
        : "function-call";
    }),
    (UNode.prototype.findIconAfterNode = function () {
      for (
        var e,
          t = searchPropWithName(this.objectDefinition, "Class"),
          n = [
            "K2Node_LatentOnlineCall",
            "K2Node_LatentGameplayTaskCall",
            "K2Node_AsyncAction",
            "K2Node_AIMoveTo",
            "K2Node_LatentOnlineCall",
            "K2Node_PlayMontage",
          ],
          s = 0,
          i = n.length;
        s < i;
        ++s
      )
        if (null !== t && -1 !== t.value.indexOf(n[s])) return "icon-async";
      return null !== t && -1 !== t.value.indexOf("K2Node_CallDelegate")
        ? "icon-message"
        : "Set Focus To Game Viewport" === (e = this.findHeaderName())
        ? "icon-client-event"
        : "Event AnyDamage" === e
        ? "icon-server-event"
        : "Create Sound2D" === e || "Play Sound2D" === e
        ? "icon-client-event"
        : "Delay" === e
        ? "icon-async"
        : "";
    }),
    (UNode.prototype.findHeaderName = function () {
      var e,
        t = -1,
        n = "",
        s = null,
        i = null,
        r = null,
        o = null,
        a = null,
        l = !1,
        u = !1,
        c = !1,
        d = !1,
        p = null,
        h = null,
        f = null,
        N = null,
        m = 0,
        C = this.pins.length,
        g = null,
        v = null,
        S = null,
        b = null,
        _ = "",
        O = "",
        P = searchPropWithName(this.objectDefinition, "Class");
      if (-1 !== P.value.indexOf("K2Node_ExecutionSequence")) return "Sequence";
      if (-1 !== P.value.indexOf("K2Node_Timeline"))
        return searchPropWithName(this.props, "TimelineName").value;
      if (-1 !== P.value.indexOf("/Script/AIGraph.K2Node_AIMoveTo"))
        return "AI MoveTo";
      if (-1 !== P.value.indexOf("/Script/AnimGraph.K2Node_PlayMontage"))
        return "Play Montage";
      if (-1 !== P.value.indexOf("/Script/BlueprintGraph.K2Node_FormatText"))
        return "Format Text";
      if (-1 !== P.value.indexOf("/Script/BlueprintGraph.K2Node_MakeMap"))
        return "Make Map";
      if (-1 !== P.value.indexOf("K2Node_FunctionResult")) return "Return Node";
      if (
        null !== (e = searchPropWithName(this.props, "DelegateReference")) &&
        null !== (e = searchPropWithName(e.value, "MemberName"))
      )
        return (
          -1 !== P.value.indexOf("K2Node_CallDelegate")
            ? (O = "Call ")
            : -1 !== P.value.indexOf("K2Node_AddDelegate")
            ? (O = "Bind Event to ")
            : -1 !== P.value.indexOf("K2Node_RemoveDelegate")
            ? (O = "Unbind Event from ")
            : -1 !== P.value.indexOf("K2Node_ClearDelegate") &&
              (O = "Unbind all Events from "),
          O + e.value
        );
      if (null !== (O = searchPropWithName(this.props, "MacroGraphReference")))
        return -1 !==
          (s = searchPropWithName(O.value, "MacroGraph")).value.indexOf(
            "StandardMacros:FlipFlop"
          )
          ? "FlipFlop"
          : -1 !== s.value.indexOf("StandardMacros:ReverseForEachLoop")
          ? "ReverseForEachLoop"
          : -1 !== s.value.indexOf("StandardMacros:Gate")
          ? "Gate"
          : -1 !== s.value.indexOf("StandardMacros:IsValid")
          ? "IsValid"
          : -1 !== s.value.indexOf("StandardMacros:ForEachLoopWithBreak")
          ? "ForEachLoopWithBreak"
          : -1 !== s.value.indexOf("StandardMacros:ForEachLoop")
          ? "ForEachLoop"
          : -1 !== s.value.indexOf("StandardMacros:ForLoopWithBreak")
          ? "ForLoopWithBreak"
          : -1 !== s.value.indexOf("StandardMacros:WhileLoop")
          ? "WhileLoop"
          : -1 !== s.value.indexOf("StandardMacros:ForLoopWithBreak")
          ? "ForLoopWithBreak"
          : -1 !== s.value.indexOf("StandardMacros:ForLoop")
          ? "ForLoop"
          : -1 !== s.value.indexOf("StandardMacros:WhileLoop")
          ? "WhileLoop"
          : -1 !== s.value.indexOf("StandardMacros:Do N")
          ? "Do N"
          : -1 !== s.value.indexOf("StandardMacros:DoOnce")
          ? "Do Once"
          : -1 !== s.value.indexOf("Switch Has Authority")
          ? "Switch Has Authority"
          : -1 !== s.value.indexOf("StandardMacros:")
          ? ((t = s.value.indexOf("StandardMacros:")),
            -1 !== (t = (n = s.value.substring(t + 15)).indexOf("'"))
              ? n.substring(0, t)
              : n)
          : 0 === s.value.indexOf("EdGraph'")
          ? '"' === (n = s.value.substring(8)).substring(0, 1)
            ? n.substring(1, n.length - 2)
            : n.substring(0, n.length - 1)
          : s.value;
      if (-1 !== P.value.indexOf("K2Node_Select")) return "Select";
      if (-1 !== P.value.indexOf("K2Node_GetClassDefaults"))
        return "Get Class Defaults";
      if (-1 !== P.value.indexOf("K2Node_LatentOnlineCall"))
        return null ===
          (i = searchPropWithName(this.props, "ProxyFactoryFunctionName"))
          ? "Async Task: Missing Function"
          : null !==
              (r = searchPropWithName(this.props, "ProxyFactoryClass")) &&
            -1 !== r.value.indexOf("/Script/HiveMPSDK.")
          ? new HiveMP().findHeaderNameForHiveMPSDK(r.value)
          : "Async Task: " + transformInternalName(i.value);
      if (-1 !== P.value.indexOf("K2Node_AddComponent"))
        return (
          (n = ""),
          (o = searchPropWithName(this.props, "TemplateType")),
          (a = searchPropWithName(this.props, "TemplateBlueprint")),
          null !== o
            ? ((n = o.value),
              -1 !== (t = o.value.lastIndexOf(".")) &&
                (n = n.substr(t + 1).replace("'", "")))
            : null !== a &&
              ((n = a.value),
              -1 !== (t = a.value.lastIndexOf(".")) &&
                (n = n.substr(t + 1).replace('"', ""))),
          "Add Component " +
            transformInternalName(n.replace("Component", "").replace('"', ""))
        );
      if (
        null !== (e = searchPropWithName(this.props, "FunctionReference")) &&
        null !== (O = searchPropWithName(e.value, "MemberName"))
      )
        return (
          "Nearly Equal Transform Transform" ===
          (n = transformInternalName(O.value))
            ? (n = "Nearly Equal (transform)")
            : "Nearly Equal Float Float" === n && (n = "Nearly Equal (float)"),
          -1 !== P.value.indexOf("K2Node_CallParentFunction")
            ? "Parent:" + n
            : (null !==
                (p =
                  null === (p = searchPropWithName(e.value, "MemberParent"))
                    ? searchPropWithName(e.value, "MemberParentClass")
                    : p) &&
                ((l = -1 !== p.value.indexOf("KismetMathLibrary")),
                (u = -1 !== p.value.indexOf("KismetStringLibrary")),
                (c = -1 !== p.value.indexOf("KismetSystemLibrary")),
                (d = -1 !== p.value.indexOf("SceneComponent"))),
              -1 !==
                (n =
                  -1 !==
                    (n =
                      -1 !==
                        (n =
                          -1 !==
                            (n =
                              -1 !==
                                (n =
                                  "In Range Float Float" ===
                                    (n =
                                      "F Clamp" ===
                                        (n =
                                          "Line Trace Multi" ===
                                            (n =
                                              "Line Trace Single For Objects" ===
                                                (n =
                                                  "Line Trace Single" ===
                                                    (n =
                                                      "Line Trace Single NEW" ===
                                                        (n =
                                                          "Normalized Delta Rotator" ===
                                                            (n =
                                                              "Greater Greater Vector Rotator" ===
                                                                (n =
                                                                  "Less Less Vector Rotator" ===
                                                                    (n =
                                                                      "V Lerp" ===
                                                                        (n =
                                                                          "T Lerp" ===
                                                                            (n =
                                                                              "R Lerp" ===
                                                                                (n =
                                                                                  "F Trunc" ===
                                                                                    (n =
                                                                                      "Multiply Multiply Float Float" ===
                                                                                        (n =
                                                                                          "Concat Str Str" ===
                                                                                            (n =
                                                                                              "V Size" ===
                                                                                                (n =
                                                                                                  "Normal" ===
                                                                                                    n &&
                                                                                                  l
                                                                                                    ? "Normalize"
                                                                                                    : n) &&
                                                                                              l
                                                                                                ? "VectorLength"
                                                                                                : n) &&
                                                                                          u
                                                                                            ? "Append"
                                                                                            : n) &&
                                                                                      l
                                                                                        ? "Power"
                                                                                        : n) &&
                                                                                  l
                                                                                    ? "Truncate"
                                                                                    : n) &&
                                                                              l
                                                                                ? "Lerp (Rotator)"
                                                                                : n) &&
                                                                          l
                                                                            ? "Lerp (Transform)"
                                                                            : n) &&
                                                                      l
                                                                        ? "Lerp (Vector)"
                                                                        : n) &&
                                                                  l
                                                                    ? "UnrotateVector"
                                                                    : n) && l
                                                                ? "RotateVector"
                                                                : n) && l
                                                            ? "Delta (Rotator)"
                                                            : n) && c
                                                        ? "LineTraceByChannel"
                                                        : n) && c
                                                    ? "LineTraceByChannel"
                                                    : n) && c
                                                ? "LineTraceForObjects"
                                                : n) && c
                                            ? "MultiLineTraceByChannel"
                                            : n) && l
                                        ? "Clamp (float)"
                                        : n) && l
                                    ? "InRange (float)"
                                    : n).indexOf("GetComponentLocation") && d
                                ? "GetWorldLocation"
                                : n).indexOf("GetComponentRotation") && d
                            ? "GetWorldRotation"
                            : n).indexOf("GetComponentToWorld") && d
                        ? "GetWorldTransform"
                        : n).indexOf("GetComponentScale") && d
                    ? "GetWorldScale"
                    : n).indexOf("SetTimerDelegate") && c
                ? "Set Timer by Event"
                : n)
        );
      if (-1 !== P.value.indexOf("K2Node_Tunnel"))
        return null !== searchPropWithName(this.props, "bCanHaveOutputs")
          ? "Inputs"
          : "Outputs";
      if (
        -1 !== P.value.indexOf("K2Node_FunctionEntry") &&
        null !== (s = searchPropWithName(this.props, "SignatureName"))
      )
        return transformInternalName(s.value);
      if (-1 !== P.value.indexOf("K2Node_FunctionResult")) return "Return Node";
      if (-1 !== P.value.indexOf("K2Node_DynamicCast"))
        return null !== (h = searchPropWithName(this.props, "TargetType"))
          ? ((n = h.value),
            "Cast To " +
              (n =
                -1 !== (t = h.value.lastIndexOf("."))
                  ? n.substr(t + 1).replace("'", "")
                  : n).replace('"', ""))
          : "Bad cast node";
      if (-1 !== P.value.indexOf("K2Node_SpawnActorFromClass")) {
        for (n = "NONE"; m < C; ++m)
          if (
            ((f = searchPropWithName(this.pins[m].props, "PinName")),
            (N = searchPropWithName(this.pins[m].props, "DefaultObject")),
            "Class" === f.value && null !== N)
          )
            return (
              "SpawnActor " +
              (n =
                -1 !== (t = (n = N.value).lastIndexOf("."))
                  ? n.substring(t + 1).replace('"', "")
                  : n)
            );
        return "SpawnActor " + n;
      }
      if (
        -1 !== P.value.indexOf("K2Node_SwitchEnum") &&
        -1 !==
          (t = (g = searchPropWithName(this.props, "Enum")).value.lastIndexOf(
            "."
          ))
      )
        return (
          "Switch on " +
          (_ =
            '"' ===
            (_ = g.value.substr(t + 1).replace("'", "")).charAt(_.length - 1)
              ? _.substr(0, _.length - 1)
              : _)
        );
      if (-1 !== P.value.indexOf("K2Node_SwitchName")) return "Switch on Name";
      if (-1 !== P.value.indexOf("K2Node_SwitchInteger"))
        return "Switch on Int";
      if (-1 !== P.value.indexOf("K2Node_SwitchString"))
        return "Switch on String";
      if (-1 !== P.value.indexOf("K2Node_CreateWidget")) {
        for (m = 0; m < C; ++m)
          if (
            ((f = searchPropWithName(this.pins[m].props, "PinName")),
            (N = searchPropWithName(this.pins[m].props, "DefaultObject")),
            "Class" === f.value)
          ) {
            if (null === N) return "Construct NONE";
            if (-1 !== (t = N.value.lastIndexOf(".")))
              return (
                (n = N.value.substring(t + 1).replace('"', "")),
                "Create " + transformInternalName(n) + " Widget"
              );
          }
        return "Create Widget";
      }
      if (-1 !== P.value.indexOf("K2Node_GenericCreateObject")) {
        for (m = 0; m < C; ++m)
          if (
            ((f = searchPropWithName(this.pins[m].props, "PinName")),
            (v = this.pins[m].getPropFromPinType("PinSubCategoryObject")),
            "ReturnValue" === f.value)
          ) {
            if (null === v) return "Construct NONE";
            if (-1 !== (t = v.value.lastIndexOf(".")))
              return (
                '"' ===
                  (n = v.value.substring(t + 1).replace("'", "")).charAt(
                    n.length - 1
                  ) && (n = n.substr(0, n.length - 1)),
                "Create " + transformInternalName(n)
              );
          }
        return "Create Widget";
      }
      if (-1 === P.value.indexOf("K2Node_BreakStruct"))
        return -1 !== P.value.indexOf("K2Node_SetFieldsInStruct")
          ? ((n = "NONE"),
            "Set members in " +
              (n =
                null !== (S = searchPropWithName(this.props, "StructType")) &&
                -1 !== (t = (n = S.value).lastIndexOf("."))
                  ? n.substr((t += 1)).replace("'", "")
                  : n))
          : -1 !== P.value.indexOf("K2Node_AsyncAction") &&
            null !==
              (i = searchPropWithName(this.props, "ProxyFactoryFunctionName"))
          ? "Async Task: " + i.value
          : -1 !==
            (b =
              "K2Node_" === (b = P.value).substr(0, 7)
                ? b.substr(7)
                : b).indexOf("K2Node_MakeArray")
          ? "Make Array"
          : -1 !== b.indexOf("K2Node_MakeStruct")
          ? ((n = "NONE"),
            "Make Struct " +
              (n =
                null !== (S = searchPropWithName(this.props, "StructType")) &&
                -1 !== (t = (n = S.value).lastIndexOf("."))
                  ? (n = n.substring(t + 1)).lastIndexOf("\"'") + 2 === n.length
                    ? n.substring(0, n.length - 2)
                    : n.substring(0, n.length - 1)
                  : n))
          : transformInternalName(b);
      for (m = 0; m < C; ++m)
        if (this.pins[m].isInput()) {
          if (
            void 0 === this.pins[m].getPropFromPinType("PinSubCategoryObject")
          )
            return "Break <unknown struct>";
          if (
            -1 !==
            (t = this.pins[m]
              .getPropFromPinType("PinSubCategoryObject")
              .value.lastIndexOf("."))
          )
            return (
              "Break " +
              (n = this.pins[m]
                .getPropFromPinType("PinSubCategoryObject")
                .value.substring(t + 1)
                .replace("'", ""))
            );
        }
      return "Create Widget";
    }),
    (UNode.prototype.findHeaderSubname = function () {
      return "";
    }),
    (UNode.prototype.generateHTMLBody = function () {
      var e = [
        {
          tag: "div",
          classes: ["body"],
          childs: [
            {
              tag: "div",
              classes: ["left-col"],
              childs: this.generateHTMLPinsInput(),
            },
            {
              tag: "div",
              classes: ["right-col"],
              childs: this.generateHTMLPinsOutput(),
            },
          ],
        },
      ];
      return (
        this.hasAdvancedPinDisplay() &&
          (this.isAdvancedPinDisplayExpanded()
            ? e.push({
                tag: "div",
                classes: ["less"],
                childs: [{ tag: "span" }],
              })
            : e.push({
                tag: "div",
                classes: ["more"],
                childs: [{ tag: "span" }],
              })),
        e
      );
    }),
    (UNode.prototype.generateHTMLPinDelegate = function () {
      for (var e = [], t = 0, n = this.pins.length; t < n; ++t)
        this.pins[t].isDelegateOutput() &&
          e.push(this.pins[t].generateHTML(!0, this));
      return e;
    }),
    (UNode.prototype.generateHTMLPinsInput = function () {
      for (
        var e = [],
          t = this.isAdvancedPinDisplayExpanded(),
          n = 0,
          s = this.pins.length;
        n < s;
        ++n
      )
        this.pins[n].isInput() && e.push(this.pins[n].generateHTML(t, this));
      return e;
    }),
    (UNode.prototype.generateHTMLPinsOutput = function () {
      for (
        var e = [],
          t = this.isAdvancedPinDisplayExpanded(),
          n = 0,
          s = this.pins.length;
        n < s;
        ++n
      )
        this.pins[n].isOutput() &&
          !1 === this.pins[n].isDelegateOutput() &&
          e.push(this.pins[n].generateHTML(t, this));
      return e;
    }),
    (UNode.prototype.hasAdvancedPinDisplay = function () {
      return null !== searchPropWithName(this.props, "AdvancedPinDisplay");
    }),
    (UNode.prototype.isAdvancedPinDisplayExpanded = function () {
      var e = searchPropWithName(this.props, "AdvancedPinDisplay");
      return e && "Shown" === e.value;
    }),
    (UNode.prototype.callbackInspectNode = function (e, t) {
      var n = 0,
        s = 0;
      if (!1 !== this.containsVisualNodes && 0 !== this.nodes.length)
        if (1 === this.nodes.length)
          for (
            this.nodes[0].containsVisualNodes = !0,
              this.nodes[0].objectDefinition = t,
              s = this.nodes[0].nodes.length;
            n < s;
            ++n
          )
            (this.nodes[0].nodes[n].objectDefinition =
              e.nodes[0].nodes[n].objectDefinition),
              this.nodes[0].nodes[n].containsVisualNodes &&
                this.nodes[0].nodes[n].callbackInspectNode(
                  e.nodes[0].nodes[n],
                  e.nodes[0].nodes[n].nodes[0].objectDefinition
                );
        else if (2 === this.nodes.length) {
          for (
            0 < (s = this.nodes[1].nodes.length) &&
            !1 === this.nodes[1].containsVisualNodes &&
            ((this.nodes[1].containsVisualNodes = !0),
            (this.nodes[1].objectDefinition = this.nodes[0].objectDefinition));
            n < s;
            ++n
          )
            (this.nodes[1].nodes[n].objectDefinition =
              this.nodes[0].nodes[n].objectDefinition),
              this.nodes[1].nodes[n].containsVisualNodes &&
                this.nodes[1].nodes[n].callbackInspectNode(
                  this.nodes[0].nodes[n],
                  this.nodes[0].nodes[n].nodes[0].objectDefinition
                );
          this.nodes = [this.nodes[1]];
        }
    });
  function BasicObject() {
    (this.objectDefinition = []),
      (this.props = []),
      (this.pins = []),
      (this.containsVisualNodes = !1),
      (this.isBelow52Version = !1);
  }
  (BasicObject.prototype.treat = function (t) {
    var e,
      i = 0;
    if ("Begin Object" === t.substring(0, 12))
      this.objectDefinition = extractObjectDefinition(t);
    else if (
      (this.isBelow52Version ||
        '"' !== t.substring(0, 1) ||
        (t = t.replace('"', "").replace('"', "")),
      (e = convertTextToProps(t)),
      Array.isArray(e))
    )
      for (i = 0; i < e.length; ++i) this.props.push(e[i]);
    else this.props.push(e);
  }),
    (BasicObject.prototype.generateText = function () {
      var t = "";
      return (
        (t += "Begin " + this.generateTextObjectDefinition()) +
        this.generateTextProps() +
        ("End " + this.objectDefinition[0].value)
      );
    }),
    (BasicObject.prototype.generateTextObjectDefinition = function () {
      for (
        var t, e = [], i = 0, n = this.objectDefinition.length, o = "", s = "";
        i < n;
        ++i
      )
        (t = this.objectDefinition[i].value),
          (o = ""),
          this.objectDefinition[i].useDelimiter && (o = '"'),
          (s = ""),
          this.objectDefinition[i].name &&
            (s = this.objectDefinition[i].name + "="),
          e.push(s + o + t + o);
      return e.join(" ") + "\n";
    }),
    (BasicObject.prototype.generateTextProps = function () {
      for (
        var t, e, i = [], n = 0, o = this.props.length, s = "", r = "", c = -1;
        n < o;
        ++n
      )
        (r = convertPropsToText(this.props[n])),
          this.isBelow52Version ||
            ((t = r.indexOf("=")),
            -1 !== (e = r.indexOf("(")) && e < t
              ? (c = e)
              : -1 !== t && (c = t),
            (r = '"' + r.substring(0, c) + '"' + r.substring(c))),
          i.push(r);
      return 0 < (s = i.join("\n")).length && (s += "\n"), s;
    }),
    (BasicObject.prototype.callbackInspectNode = function () {});
  function NAnimState() {
    UNode.call(this), (this.containsVisualNodes = !0);
  }
  (NAnimState.prototype = new UNode()),
    ((NAnimState.prototype.constructor = NAnimState).prototype.generateHTML =
      function () {
        return {
          tag: "div",
          classes: ["node", "n_anim_state", "n_anim_state_reset_body", "pad10"],
          attrs: [
            { name: "style", value: this.generateCssNodeStyle().join(";") },
            { name: "data-id", value: this.guid },
          ],
          childs: [
            {
              tag: "div",
              classes: ["body"],
              childs: [],
              text: this.findHeaderName(),
            },
            {
              tag: "div",
              classes: ["left-col"],
              childs: this.generateHTMLPinsInput(),
            },
            {
              tag: "div",
              classes: ["right-col"],
              childs: this.generateHTMLPinsOutput(),
            },
          ],
        };
      }),
    (NAnimState.prototype.findHeaderName = function () {
      var t = "",
        e = searchPropWithName(this.props, "BoundGraph");
      return null === e
        ? "undefined"
        : '"' === (t = e.value.substring(20)).substring(0, 1)
        ? t.substring(1, t.length - 2)
        : t.substring(0, t.length - 1);
    }),
    (NAnimState.prototype.generateTextForUnreal = function (t) {
      return "";
    });
  function NAnimStateEntry() {
    UNode.call(this);
  }
  (NAnimStateEntry.prototype = new UNode()),
    ((NAnimStateEntry.prototype.constructor =
      NAnimStateEntry).prototype.generateHTML = function () {
      return {
        tag: "div",
        classes: ["node", "n_anim_state"],
        attrs: [
          { name: "style", value: this.generateCssNodeStyle().join(";") },
          { name: "data-id", value: this.guid },
        ],
        childs: [
          {
            tag: "div",
            classes: ["body"],
            childs: [
              {
                tag: "div",
                classes: ["right-col"],
                childs: this.generateHTMLPinsOutput(),
              },
            ],
          },
        ],
      };
    });
  function NAnimStateTransition() {
    UNode.call(this), (this.containsVisualNodes = !0);
  }
  (NAnimStateTransition.prototype = new UNode()),
    ((NAnimStateTransition.prototype.constructor =
      NAnimStateTransition).prototype.generateHTML = function () {
      return (
        (this.pins[0].props.bHidden = !1),
        (this.pins[1].props.bHidden = !1),
        {
          tag: "div",
          classes: [
            "node",
            "n_anim_state",
            "n_anim_state_reset_body",
            "white_body",
            "round",
          ],
          attrs: [
            { name: "style", value: this.generateCssNodeStyle().join(";") },
            { name: "data-id", value: this.guid },
          ],
          childs: [
            {
              tag: "div",
              classes: ["body"],
              childs: [{ tag: "div", classes: ["n_anim_transition"] }],
            },
          ],
        }
      );
    }),
    (NAnimStateTransition.prototype.findHeaderName = function () {
      var t = "",
        n = searchPropWithName(this.props, "BoundGraph");
      return null === n
        ? "undefined"
        : '"' === (t = n.value.substring(25)).substring(0, 1)
        ? t.substring(1, t.length - 2)
        : t.substring(0, t.length - 1);
    }),
    (NAnimStateTransition.prototype.generateTextForUnreal = function (t) {
      return "";
    });
  function NArray() {
    UNode.call(this);
  }
  (NArray.prototype = new UNode()),
    ((NArray.prototype.constructor = NArray).prototype.generateHTML =
      function () {
        return (
          this.disableTextOnPins(),
          {
            tag: "div",
            classes: ["node", "narray"],
            attrs: [
              { name: "style", value: this.generateCssNodeStyle().join(";") },
              { name: "data-id", value: this.guid },
            ],
            childs: [this.generateHTMLToolTip(), this.generateHTMLBody()],
          }
        );
      }),
    (NArray.prototype.generateHTMLBody = function () {
      var t = [],
        e = searchPropWithName(this.objectDefinition, "Class"),
        r = searchPropWithName(this.props, "FunctionReference"),
        i = "",
        s = 130;
      return (
        null === r
          ? null !== e &&
            -1 !== e.value.indexOf("K2Node_GetArrayItem") &&
            (i = "GET")
          : null !== (e = searchPropWithName(r.value, "MemberName")) &&
            (i = getArrayText(e.value)),
        "LastIndex" === i &&
          ((i = ""),
          (t = [{ text: "Last" }, { tag: "br" }, { text: "Index" }]),
          (s = 150)),
        "IsValidIndex" === i &&
          ((i = ""),
          (t = [{ text: "Is Valid" }, { tag: "br" }, { text: "Index" }]),
          (s = 185)),
        "Remove" === i &&
          ((i = ""),
          (t = [{ text: "Remove" }, { tag: "br" }, { text: "Index" }]),
          (s = 185)),
        "IsNotEmpty" === i &&
          ((i = ""),
          (t = [{ text: "Is Not" }, { tag: "br" }, { text: "Empty" }]),
          (s = 185)),
        "RemoveItem" === i && ((i = "Remove"), (s = 185)),
        "Length" === i
          ? (s = 180)
          : "AddUnique" === i
          ? (s = 225)
          : "Append" === i
          ? (s = 180)
          : "Clear" === i
          ? (s = 150)
          : "Contains" === i
          ? (s = 200)
          : "Shuffle" === i
          ? (s = 180)
          : "Resize" === i && (s = 150),
        {
          tag: "div",
          classes: ["body"],
          attrs: [{ name: "style", value: "min-width:" + s + "px" }],
          childs: [
            {
              tag: "div",
              classes: ["center-text"],
              childs: [{ tag: "span", text: i, childs: t }],
            },
            {
              tag: "div",
              classes: ["center-text"],
              childs: [
                {
                  tag: "div",
                  classes: ["img-array", this.findCssClassArray()],
                },
              ],
            },
            { tag: "div", classes: ["round-bg"] },
            {
              tag: "div",
              classes: ["left-col"],
              childs: this.generateHTMLPinsInput(),
            },
            {
              tag: "div",
              classes: ["right-col"],
              childs: this.generateHTMLPinsOutput(),
            },
          ],
        }
      );
    }),
    (NArray.prototype.disableTextOnPins = function () {
      for (var t, e = 0, r = this.pins.length; e < r; ++e)
        this.pins[e].disableText(),
          null !== (t = this.pins[e].getPropFromPinType("PinCategory")) &&
            '"int"' !== t.value &&
            this.pins[e].disableInput();
    }),
    (NArray.prototype.findCssClassArray = function () {
      for (
        var t,
          e = null,
          r = null,
          i = null,
          s = "",
          a = 0,
          n = this.pins.length;
        a < n;
        ++a
      )
        this.pins[a].isInput() &&
          null !== (t = searchPropWithName(this.pins[a].props, "PinName")) &&
          ("TargetArray" === t.value &&
            "struct" ===
              (e = this.pins[a].getPropFromPinType("PinCategory").value) &&
            (i = this.pins[a].getPropFromPinType("PinSubCategoryObject")),
          "Array" === t.value &&
            "struct" ===
              (r = this.pins[a].getPropFromPinType("PinCategory").value) &&
            (i = this.pins[a].getPropFromPinType("PinSubCategoryObject")));
      return (
        null !== e ? (s = e) : null !== r && (s = r),
        "struct" === s &&
          null !== i &&
          ("/Script/CoreUObject.ScriptStruct'" === i.value.substring(0, 33) &&
            (i.value = i.value.substring(20)),
          "ScriptStruct'/Script/CoreUObject.Vector'" === i.value ||
          "ScriptStruct'\"/Script/CoreUObject.Vector\"'" === i.value ||
          "ScriptStruct'/Script/CoreUObject.Vector3f'" === i.value ||
          "ScriptStruct'\"/Script/CoreUObject.Vector3f\"'" === i.value
            ? (s = "vector")
            : "ScriptStruct'/Script/CoreUObject.Rotator'" === i.value ||
              "ScriptStruct'\"/Script/CoreUObject.Rotator\"'" === i.value
            ? (s = "rotator")
            : ("ScriptStruct'/Script/CoreUObject.Transform'" !== i.value &&
                "ScriptStruct'\"/Script/CoreUObject.Transform\"'" !==
                  i.value) ||
              (s = "transform")),
        s
      );
    });
  function NComment() {
    UNode.call(this), (this.size = [400, 96]);
  }
  (NComment.prototype = new UNode()),
    ((NComment.prototype.constructor = NComment).prototype.generateHTML =
      function () {
        return {
          tag: "div",
          classes: ["node", "ncomment"],
          attrs: [
            { name: "style", value: this.generateCssNodeStyle().join(";") },
            { name: "data-id", value: this.guid },
          ],
          childs: [null, this.generateHTMLHeader()],
        };
      }),
    (NComment.prototype.generateCssNodeStyle = function () {
      var e = UNode.prototype.generateCssNodeStyle.call(this);
      return e.push(this.addBodyStyleColor()), e;
    }),
    (NComment.prototype.generateHTMLHeader = function () {
      var e,
        t = [],
        o = 0,
        r = {
          tag: "div",
          classes: ["header"],
          attrs: [{ name: "style", value: this.addHeaderStyleColor() }],
        },
        n = removeQuotes(this.comment)
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\r/g, "")
          .replace(/\\n/g, "\n"),
        a = n.split(/\n/g);
      if (1 === a.length) r.text = n;
      else {
        for (e = a.length; o < e; ++o)
          t.push({ text: a[o] }), o + 1 < a.length && t.push({ tag: "br" });
        r.childs = t;
      }
      return r;
    }),
    (NComment.prototype.getColorComment = function () {
      var e = rgba(255, 255, 255, 1),
        t = searchPropWithName(this.props, "CommentColor");
      return null !== t && e.setValuesFromProps(t.value), e;
    }),
    (NComment.prototype.addBodyStyleColor = function () {
      var e = this.getColorComment();
      return (e.alpha = 0.1), "background-color:" + e.generateCss();
    }),
    (NComment.prototype.addHeaderStyleColor = function () {
      var e = this.getColorComment();
      return (e.alpha = 0.5), "background-color:" + e.generateCss();
    });
  function getTextDeclarationForUnreal(e, t) {
    for (
      var n, o, i = "", r = getIndentFormat(t), s = 0, a = e.length, d = 0;
      s < a;
      ++s
    ) {
      if (
        ((i += r + "Begin " + e[s].generateTextObjectDefinition()),
        0 < e[s].nodes.length &&
          (i += getTextDeclarationForUnreal(e[s].nodes, t + 1)),
        e[s].isBelow413Version)
      )
        for (
          n = getIndentFormat(t + 1), d = 0, o = e[s].pins.length;
          d < o;
          ++d
        )
          i =
            i +
            (n + 'Begin Object Class=EdGraphPin Name="' + e[s].pins[d].id) +
            '"\n' +
            n +
            "End Object\n";
      i += r + "End " + e[s].objectDefinition[0].value + "\n";
    }
    return i;
  }
  function getTextDescriptionForUnreal(e, t) {
    for (var n = "", o = getIndentFormat(t), i = 0, r = e.length; i < r; ++i)
      (n += o + "Begin Object" + e[i].generateTextObjectDefinitionNameOnly()),
        0 < e[i].nodes.length &&
          (n += getTextDescriptionForUnreal(e[i].nodes, t + 1)),
        (n = n + e[i].generateTextProps(t + 1) + (o + "End Object\n"));
    return n;
  }
  function NComposite() {
    UNode.call(this), (this.containsVisualNodes = !0);
  }
  (NComposite.prototype = new UNode()),
    ((NComposite.prototype.constructor =
      NComposite).prototype.generateHTMLHeader = function () {
      return {
        tag: "div",
        classes: ["header"],
        childs: [
          {
            tag: "span",
            classes: ["name"],
            childs: [
              { text: this.findHeaderName() },
              { tag: "br" },
              { tag: "span", classes: ["subname"], text: "Collapsed Graph" },
            ],
          },
        ],
      };
    }),
    (NComposite.prototype.findHeaderName = function () {
      var e = "",
        t = searchPropWithName(this.props, "BoundGraph");
      return null === t
        ? "undefined"
        : '"' === (e = t.value.substring(8)).substring(0, 1)
        ? e.substring(1, e.length - 2)
        : e.substring(0, e.length - 1);
    }),
    (NComposite.prototype.generateTextForUnreal = function (e) {
      var t = this.nodes.length,
        n = 0,
        o = "",
        i = getIndentFormat(e);
      for (o += "Begin " + this.generateTextObjectDefinition(); n < t; ++n)
        o =
          (o =
            (o =
              (o =
                (o =
                  (o +=
                    i +
                    "Begin " +
                    this.nodes[n].generateTextObjectDefinition()) +
                  getTextDeclarationForUnreal(this.nodes[n].nodes, e + 1)) +
                i +
                "End " +
                this.nodes[n].objectDefinition[0].value +
                "\n") +
              i +
              "Begin Object " +
              this.nodes[n].generateTextObjectDefinitionNameOnly()) +
            getTextDescriptionForUnreal(this.nodes[n].nodes, e + 1)) +
          this.nodes[n].generateTextProps(e + 1) +
          i +
          "End Object\n";
      return (o =
        (o += this.generateTextProps(e)) +
        ("End " + this.objectDefinition[0].value));
    }),
    (NComposite.prototype.isRealCompositeNode = function () {
      var e = searchPropWithName(this.objectDefinition, "Class"),
        t = searchPropWithName(this.objectDefinition, "Name");
      return null !== e
        ? -1 !== e.value.indexOf("K2Node_Composite")
        : null === t || -1 !== t.value.indexOf("K2Node_Composite");
    });
  function NConv() {
    UNode.call(this);
  }
  (NConv.prototype = new UNode()),
    ((NConv.prototype.constructor = NConv).prototype.generateHTML =
      function () {
        return (
          this.disableTextOnPins(),
          {
            tag: "div",
            classes: ["node", "nconv"],
            attrs: [
              { name: "style", value: this.generateCssNodeStyle().join(";") },
              { name: "data-id", value: this.guid },
            ],
            childs: [this.generateHTMLToolTip(), this.generateHTMLBody()],
          }
        );
      }),
    (NConv.prototype.generateHTMLBody = function () {
      return {
        tag: "div",
        classes: ["body"],
        childs: [
          { tag: "div", classes: ["round-bg"] },
          {
            tag: "div",
            classes: ["left-col"],
            childs: this.generateHTMLPinsInput(),
          },
          {
            tag: "div",
            classes: ["right-col"],
            childs: this.generateHTMLPinsOutput(),
          },
        ],
      };
    }),
    (NConv.prototype.disableTextOnPins = function () {
      for (var t = 0, e = this.pins.length; t < e; ++t)
        this.pins[t].disableText();
    });
  function NDelegate() {
    UNode.call(this);
  }
  (NDelegate.prototype = new UNode()),
    ((NDelegate.prototype.constructor =
      NDelegate).prototype.findCssClassNodeColor = function () {
      return "pure-function-call";
    }),
    (NDelegate.prototype.findCssClassNodeIcon = function () {
      return "blueprint-node";
    }),
    (NDelegate.prototype.findHeaderName = function () {
      return "Create Event";
    }),
    (NDelegate.prototype.generateHTMLPinDelegate = function () {
      return [];
    }),
    (NDelegate.prototype.generateHTMLPinsOutput = function () {
      for (
        var e = [],
          t = 0,
          n = this.isAdvancedPinDisplayExpanded(),
          a = this.pins.length;
        t < a;
        ++t
      )
        this.pins[t].isOutput() && e.push(this.pins[t].generateHTML(n, this));
      return e;
    }),
    (NDelegate.prototype.generateHTMLBody = function () {
      var e = [
          {
            tag: "div",
            classes: ["body"],
            childs: [
              {
                tag: "div",
                classes: ["left-col"],
                childs: this.generateHTMLPinsInput(),
              },
              {
                tag: "div",
                classes: ["right-col"],
                childs: this.generateHTMLPinsOutput(),
              },
            ],
          },
        ],
        t = searchPropWithName(this.props, "SelectedFunctionName");
      return (
        null !== t &&
          e.push({
            tag: "div",
            childs: [
              {
                tag: "div",
                attrs: [{ name: "style", value: "padding:5px" }],
                text: "Signature: ()",
              },
              {
                tag: "div",
                attrs: [{ name: "style", value: "padding:5px" }],
                childs: [
                  {
                    tag: "select",
                    attrs: [{ name: "disabled", value: "disabled" }],
                    childs: [{ tag: "option", text: t.value + "()" }],
                  },
                ],
              },
            ],
          }),
        e
      );
    });
  function NDot() {
    UNode.call(this);
  }
  (NDot.prototype = new UNode()),
    ((NDot.prototype.constructor = NDot).prototype.generateHTML = function () {
      return (
        this.disableTextOnPins(),
        {
          tag: "div",
          classes: ["node", "ndot"],
          attrs: [
            { name: "style", value: this.generateCssNodeStyle().join(";") },
            { name: "data-id", value: this.guid },
          ],
          childs: [this.generateHTMLToolTip(), this.generateHTMLBody()],
        }
      );
    }),
    (NDot.prototype.generateHTMLBody = function () {
      return {
        tag: "div",
        classes: ["body"],
        childs: [
          { tag: "div", classes: ["round-bg"] },
          {
            tag: "div",
            classes: ["left-col"],
            childs: this.generateHTMLPinsInput(),
          },
          {
            tag: "div",
            classes: ["right-col"],
            childs: this.generateHTMLPinsOutput(),
          },
        ],
      };
    }),
    (NDot.prototype.disableTextOnPins = function () {
      for (var t = 0, e = this.pins.length; t < e; ++t)
        this.pins[t].disableText();
    });
  function NEnhancedInputAction() {
    UNode.call(this);
  }
  (NEnhancedInputAction.prototype = new UNode()),
    ((NEnhancedInputAction.prototype.constructor =
      NEnhancedInputAction).prototype.findCssClassNodeColor = function () {
      return "event";
    }),
    (NEnhancedInputAction.prototype.findCssClassNodeIcon = function () {
      return "event";
    }),
    (NEnhancedInputAction.prototype.findHeaderName = function () {
      var n,
        t = searchPropWithName(this.props, "InputAction"),
        e = "None";
      return (
        "EnhancedInputAction " +
        (e =
          null !== t && -1 !== (n = t.value.lastIndexOf("."))
            ? t.value
                .substring((n += 1))
                .replace("'", "")
                .replace('"', "")
            : e)
      );
    });
  function NEvent() {
    UNode.call(this);
  }
  (NEvent.prototype = new UNode()),
    ((NEvent.prototype.constructor = NEvent).prototype.findCssClassNodeColor =
      function () {
        return "event";
      }),
    (NEvent.prototype.findCssClassNodeIcon = function () {
      return "event";
    }),
    (NEvent.prototype.findHeaderName = function () {
      var e,
        t,
        n,
        r = "Event",
        o = ["FunctionReference", "EventReference", "EventSignatureName"],
        a = 0,
        i = o.length,
        u = "",
        l = searchPropWithName(this.objectDefinition, "Class"),
        p = null;
      if (
        null !== l &&
        (-1 !== l.value.indexOf("K2Node_ComponentBoundEvent") ||
          -1 !== l.value.indexOf("K2Node_ActorBoundEvent"))
      ) {
        if (
          ((u =
            null ===
            (e = searchPropWithName(this.props, "ComponentPropertyName"))
              ? "None"
              : e.value),
          (e = searchPropWithName(this.props, "DelegatePropertyName")),
          null !==
            (t = searchPropWithName(this.props, "DelegatePropertyDisplayName")))
        )
          return formatTextL11nFromProp(t) + " (" + u + ")";
        if (null !== e) return e.value + " (" + u + ")";
      }
      if (null !== l && -1 !== l.value.indexOf("K2Node_InputAxisEvent"))
        return (
          "InputAxis " + searchPropWithName(this.props, "InputAxisName").value
        );
      for (; a < i; ++a)
        if (null !== (n = searchPropWithName(this.props, o[a])))
          return null === (p = searchPropWithName(n.value, "MemberName"))
            ? n.value
            : -1 !== p.value.indexOf("Receive")
            ? r + " " + p.value.substring(7)
            : r + " " + p.value;
      return r;
    });
  function NEventCustom() {
    UNode.call(this);
  }
  (NEventCustom.prototype = new UNode()),
    ((NEventCustom.prototype.constructor =
      NEventCustom).prototype.findCssClassNodeColor = function () {
      return "event";
    }),
    (NEventCustom.prototype.findCssClassNodeIcon = function () {
      return "event-custom";
    }),
    (NEventCustom.prototype.findHeaderName = function () {
      var t = searchPropWithName(this.props, "CustomFunctionName");
      return null === t ? "" : t.value;
    }),
    (NEventCustom.prototype.findHeaderSubname = function () {
      return "CustomEvent";
    });
  function NIfThenElse() {
    UNode.call(this);
  }
  (NIfThenElse.prototype = new UNode()),
    ((NIfThenElse.prototype.constructor =
      NIfThenElse).prototype.findCssClassNodeColor = function () {
      return "exec-branch";
    }),
    (NIfThenElse.prototype.findCssClassNodeIcon = function () {
      return "exec-branch";
    }),
    (NIfThenElse.prototype.findHeaderName = function () {
      return "Branch";
    });
  function NInputAction() {
    UNode.call(this);
  }
  (NInputAction.prototype = new UNode()),
    ((NInputAction.prototype.constructor =
      NInputAction).prototype.findCssClassNodeColor = function () {
      return "event";
    }),
    (NInputAction.prototype.findCssClassNodeIcon = function () {
      return "event";
    }),
    (NInputAction.prototype.findHeaderName = function () {
      return (
        "InputAction " + searchPropWithName(this.props, "InputActionName").value
      );
    });
  var propsConvertion = {
    Exclamation: "!",
    Quote: '"',
    LeftParantheses: "(",
    RightParantheses: ")",
    LeftBracket: "[",
    RightBracket: "]",
    Section: "§",
    Slash: "/",
    Backslash: "\\",
    Ampersand: "&",
    Tilde: "`",
    Caret: "^",
    Equals: "=",
    Dollar: "$",
    Zero: "0",
    One: "1",
    Two: "2",
    Three: "3",
    Four: "4",
    Five: "5",
    Six: "6",
    Seven: "7",
    Eight: "8",
    Nine: "9",
    A_AccentGrave: "à",
    AnyKey: "Any Key",
    C_Cedille: "ç",
    CapsLock: "Caps Lock",
    E_AccentAigu: "é",
    E_AccentGrave: "è",
    LeftAlt: "Left Alt",
    LeftCommand: "Left Cmd",
    LeftControl: "Left Ctrl",
    LeftShift: "Left Shift",
    Subtract: "Num -",
    Decimal: "Num .",
    Multiply: "Num *",
    Divide: "Num /",
    Add: "Num +",
    NumPadZero: "Num 0",
    NumPadOne: "Num 1",
    NumPadTwo: "Num 2",
    NumPadThree: "Num 3",
    NumPadFour: "Num 4",
    NumPadFive: "Num 5",
    NumPadSix: "Num 6",
    NumPadSeven: "Num 7",
    NumPadEight: "Num 8",
    NumPadNine: "Num 9",
    NumLock: "Num Lock",
    PageDown: "Page Down",
    PageUp: "Page Up",
    RightAlt: "Right Alt",
    RightCommand: "Right Cmd",
    RightControl: "Right Ctrl",
    RightShift: "Right Shift",
    ScrollLock: "Scroll Lock",
    SpaceBar: "Space Bar",
  };
  function NInputKey() {
    UNode.call(this);
  }
  (NInputKey.prototype = new UNode()),
    ((NInputKey.prototype.constructor =
      NInputKey).prototype.findCssClassNodeColor = function () {
      return "event";
    }),
    (NInputKey.prototype.findCssClassNodeIcon = function () {
      var e = searchPropWithName(this.props, "InputKey"),
        t = searchPropWithName(this.props, "AxisKey"),
        n = searchPropWithName(this.objectDefinition, "Class");
      if (null !== e) {
        if (0 === e.value.indexOf("Gamepad_")) return "input-gamepad";
        if (0 === e.value.indexOf("MotionController_")) return "input-gamepad";
        if (0 === e.value.indexOf("Oculus")) return "input-gamepad";
        if (0 === e.value.indexOf("Steam")) return "input-gamepad";
        if (-1 !== e.value.indexOf("Mouse")) return "input-mouse";
        if (0 === e.value.indexOf("Touch")) return "input-touch";
      } else {
        if (null !== n && -1 !== n.value.indexOf("K2Node_InputTouch"))
          return "input-touch";
        if (
          null !== n &&
          -1 !== n.value.indexOf("K2Node_InputAxisKeyEvent") &&
          null !== t.value
        ) {
          if (-1 !== t.value.indexOf("Mouse")) return "input-mouse";
          if (0 === t.value.indexOf("Gamepad_")) return "input-gamepad";
        }
      }
      return "input-key";
    }),
    (NInputKey.prototype.findHeaderName = function () {
      var e = "",
        t = searchPropWithName(this.props, "InputKey"),
        n = searchPropWithName(this.props, "AxisKey"),
        u = searchPropWithName(this.objectDefinition, "Class");
      if (null !== t) e = t.value;
      else {
        if (null !== u && -1 !== u.value.indexOf("K2Node_InputTouch"))
          return "InputTouch";
        null !== u &&
          -1 !== u.value.indexOf("K2Node_InputAxisKeyEvent") &&
          null !== n &&
          (e = n.value);
      }
      return (
        (e =
          void 0 === propsConvertion[e]
            ? transformInternalName(e)
            : propsConvertion[e]),
        (e =
          null !== u && -1 !== u.value.indexOf("K2Node_InputDebugKey")
            ? "Debug Key " + e
            : e)
      );
    }),
    (NInputKey.prototype.generateHTMLBody = function () {
      return [
        {
          tag: "div",
          classes: ["body"],
          childs: [
            {
              tag: "div",
              classes: ["right-col"],
              childs: this.generateHTMLPinsOutput(),
            },
          ],
        },
      ];
    });
  function NKismetMath() {
    UNode.call(this);
  }
  (NKismetMath.prototype = new UNode()),
    ((NKismetMath.prototype.constructor = NKismetMath).prototype.generateHTML =
      function () {
        return (
          this.disableTextOnPins(),
          {
            tag: "div",
            classes: ["node", "nkismetmath"],
            attrs: [
              { name: "style", value: this.generateCssNodeStyle().join(";") },
              { name: "data-id", value: this.guid },
            ],
            childs: [this.generateHTMLToolTip(), this.generateHTMLBody()],
          }
        );
      }),
    (NKismetMath.prototype.generateHTMLBody = function () {
      var e = "",
        t = searchPropWithName(this.props, "MacroGraphReference"),
        a = searchPropWithName(this.objectDefinition, "Class"),
        s = null;
      return (
        null !== a && -1 !== a.value.indexOf("K2Node_EnumEquality")
          ? (e = "==")
          : null !== a && -1 !== a.value.indexOf("K2Node_EnumInequality")
          ? (e = "!=")
          : null === t
          ? ((a = searchPropWithName(this.props, "FunctionReference")),
            (a = searchPropWithName(a.value, "MemberName")),
            (e = getKismetMathText(a.value)))
          : -1 !==
            (s = searchPropWithName(t.value, "MacroGraph")).value.indexOf(
              "StandardMacros:Increment"
            )
          ? (e = "++")
          : -1 !== s.value.indexOf("StandardMacros:Decrement") && (e = "--"),
        {
          tag: "div",
          classes: ["body"],
          childs: [
            {
              tag: "div",
              classes: ["center-text"],
              childs: [{ tag: "span", text: e, childs: e }],
            },
            { tag: "div", classes: ["round-bg"] },
            {
              tag: "div",
              classes: ["left-col"],
              childs: this.generateHTMLPinsInput(),
            },
            {
              tag: "div",
              classes: ["right-col"],
              childs: this.generateHTMLPinsOutput(),
            },
          ],
        }
      );
    }),
    (NKismetMath.prototype.disableTextOnPins = function () {
      for (var e = 0, t = this.pins.length; e < t; ++e)
        null === searchPropWithName(this.pins[e].props, "PinFriendlyName") &&
          this.pins[e].disableText();
    });
  function NKnot() {
    UNode.call(this);
  }
  (NKnot.prototype = new UNode()),
    ((NKnot.prototype.constructor = NKnot).prototype.generateHTML =
      function () {
        var t,
          e = {
            tag: "div",
            classes: ["node", "knot"],
            attrs: [
              { name: "style", value: this.generateCssNodeStyle().join(";") },
              { name: "data-id", value: this.guid },
            ],
            childs: [this.generateHTMLToolTip()],
          },
          n = 0,
          s = this.generateHTMLBody();
        if (Array.isArray(s))
          for (t = s.length; n < t; ++n) e.childs.push(s[n]);
        else e.childs.push(s);
        return e;
      }),
    (NKnot.prototype.generateHTMLPinsInput = function () {
      for (
        var t = [],
          e = this.isAdvancedPinDisplayExpanded(),
          n = 0,
          s = this.pins.length;
        n < s;
        ++n
      )
        this.pins[n].isInput() &&
          (this.pins[n].disableTextAndInput(),
          t.push(this.pins[n].generateHTML(e, this)));
      return t;
    }),
    (NKnot.prototype.generateHTMLPinsOutput = function () {
      for (
        var t = [],
          e = this.isAdvancedPinDisplayExpanded(),
          n = 0,
          s = this.pins.length;
        n < s;
        ++n
      )
        this.pins[n].isOutput() &&
          (this.pins[n].disableTextAndInput(),
          t.push(this.pins[n].generateHTML(e, this)));
      return t;
    });
  function NMaterialGraphNode() {
    UNode.call(this);
  }
  (NMaterialGraphNode.prototype = new UNode()),
    ((NMaterialGraphNode.prototype.constructor =
      NMaterialGraphNode).prototype.generateHTMLHeader = function () {
      for (var e = 0, n = this.pins.length; e < n; ++e)
        this.pins[e].disableInput(),
          (this.pins[e].override.connectorType = {
            connector: "connector",
            type: "materialinput",
          });
      return {
        tag: "div",
        classes: [
          "header",
          "node-color",
          this.findCssClassNodeColor(),
          "gradient",
        ],
        childs: [
          { tag: "span", classes: ["name"], text: this.getMaterialName() },
        ],
      };
    }),
    (NMaterialGraphNode.prototype.findCssClassNodeColor = function () {
      var e = searchPropWithName(this.nodes[0].objectDefinition, "Class");
      return null !== e &&
        -1 !== e.value.indexOf("MaterialExpressionMaterialFunctionCall")
        ? "function-call"
        : null !== e &&
          -1 !== e.value.indexOf("MaterialExpressionConstantVector")
        ? "material-constant"
        : (null !== e &&
            -1 !== e.value.indexOf("MaterialExpressionConstant")) ||
          (null !== e && -1 !== e.value.indexOf("MaterialExpression"))
        ? "pure-function-call"
        : "";
    }),
    (NMaterialGraphNode.prototype.getMaterialName = function () {
      var e,
        n,
        t = "",
        a = -1,
        i = "Lerp",
        r = ["0", "1", "0.5"],
        l = null,
        o = 0,
        s = null,
        u = null,
        p = null,
        d = null,
        h = searchPropWithName(this.nodes[0].objectDefinition, "Class"),
        c = null,
        f = null,
        v = null;
      if (null === h) return "";
      if (-1 !== h.value.indexOf("MaterialExpressionMaterialFunctionCall")) {
        if (
          null ===
          (c = searchPropWithName(this.nodes[1].props, "MaterialFunction"))
        )
          return "Unspecified Function";
        if (
          -1 !== (a = c.value.indexOf(".")) &&
          -1 !== (c = (t = c.value.substring((a += 1))).indexOf("'"))
        )
          return t.substr(0, c).replace('"', "");
      } else {
        if (-1 !== h.value.indexOf("MaterialExpressionLinearInterpolate"))
          return (
            this.pins[0].isLinkedTo() && (r[0] = ""),
            this.pins[1].isLinkedTo() && (r[1] = ""),
            this.pins[2].isLinkedTo() && (r[2] = ""),
            ",," !== (t = r.join(",")) && (i += "(" + t + ")"),
            i
          );
        if (-1 !== h.value.indexOf("MaterialExpressionConstant")) {
          if (
            null === (l = searchPropWithName(this.nodes[1].props, "Constant"))
          )
            return (
              (f = searchPropWithName(this.nodes[1].props, "R")),
              (v = searchPropWithName(this.nodes[1].props, "G")),
              null !== f && null !== v
                ? f.value.replace(/(\.\d+?)0+\b/, "$1") +
                  "," +
                  v.value.replace(/(\.\d+?)0+\b/, "$1")
                : null !== f
                ? f.value.replace(/(\.\d+?)0+\b/, "$1")
                : "0"
            );
          for (e = l.value.length; o < e; ++o)
            (n = l.value[o].value.replace(/(\.\d+?)0+\b/, "$1")),
              "R" === l.value[o].name && (s = n),
              "G" === l.value[o].name && (u = n),
              "B" === l.value[o].name && (p = n),
              "A" === l.value[o].name && (d = n);
          return -1 !== h.value.indexOf("Constant4Vector")
            ? s + "," + u + "," + p + "," + d
            : s + "," + u + "," + p;
        }
        if (
          -1 !== h.value.indexOf("MaterialExpression") &&
          -1 !== (a = h.value.indexOf("MaterialExpression"))
        )
          return h.value.substr((a += 18));
      }
      return "";
    }),
    (NMaterialGraphNode.prototype.generateTextForUnreal = function (e) {
      var n = "",
        t = 0,
        a = this.nodes.length;
      for (n += "Begin " + this.generateTextObjectDefinition(); t < a; ++t)
        void 0 !== this.nodes[t].generateText
          ? (n += this.nodes[t].generateText() + "\n")
          : void 0 !== this.nodes[t].generateTextForUnreal &&
            (n += this.nodes[t].generateTextForUnreal(e + 1) + "\n");
      return (n =
        (n += this.generateTextProps(e)) +
        ("End " + this.objectDefinition[0].value));
    });
  function NMaterialGraphNodeComment() {
    UNode.call(this), (this.size = [400, 96]);
  }
  (NMaterialGraphNodeComment.prototype = new UNode()),
    ((NMaterialGraphNodeComment.prototype.constructor =
      NMaterialGraphNodeComment).prototype.generateHTML = function () {
      return {
        tag: "div",
        classes: ["node", "ncomment"],
        attrs: [
          { name: "style", value: this.generateCssNodeStyle().join(";") },
          { name: "data-id", value: this.guid },
        ],
        childs: [this.generateHTMLHeader()],
      };
    }),
    (NMaterialGraphNodeComment.prototype.generateCssNodeStyle = function () {
      var e = UNode.prototype.generateCssNodeStyle.call(this);
      return e.push(this.addBodyStyleColor()), e;
    }),
    (NMaterialGraphNodeComment.prototype.generateHTMLHeader = function () {
      var e,
        t = [],
        o = 0,
        r = {
          tag: "div",
          classes: ["header"],
          attrs: [{ name: "style", value: this.addHeaderStyleColor() }],
        },
        a = removeQuotes(this.comment)
          .replace(/\\"/g, '"')
          .replace(/\\'/g, "'")
          .replace(/\\r/g, "")
          .replace(/\\n/g, "\n"),
        n = a.split(/\n/g);
      if (1 === n.length) r.text = a;
      else {
        for (e = n.length; o < e; ++o)
          t.push({ text: n[o] }), o + 1 < n.length && t.push({ tag: "br" });
        r.childs = t;
      }
      return r;
    }),
    (NMaterialGraphNodeComment.prototype.getColorComment = function () {
      var e = rgba(255, 255, 255, 1),
        t = searchPropWithName(this.props, "CommentColor");
      return null !== t && e.setValuesFromProps(t.value), e;
    }),
    (NMaterialGraphNodeComment.prototype.addBodyStyleColor = function () {
      var e = this.getColorComment();
      return (e.alpha = 0.1), "background-color:" + e.generateCss();
    }),
    (NMaterialGraphNodeComment.prototype.addHeaderStyleColor = function () {
      var e = this.getColorComment();
      return (e.alpha = 0.5), "background-color:" + e.generateCss();
    });
  function NMaterialGraphNodeRoot() {
    UNode.call(this);
  }
  (NMaterialGraphNodeRoot.prototype = new UNode()),
    ((NMaterialGraphNodeRoot.prototype.constructor =
      NMaterialGraphNodeRoot).prototype.generateHTMLHeader = function () {
      for (var e = 0, t = this.pins.length; e < t; ++e)
        this.pins[e].disableInput();
      return {
        tag: "div",
        classes: ["header", "node-color", "material-graph-root", "gradient"],
        childs: [
          { tag: "span", classes: ["name"], text: this.getMaterialName() },
        ],
      };
    }),
    (NMaterialGraphNodeRoot.prototype.getMaterialName = function () {
      var e,
        t = searchPropWithName(this.props, "Material"),
        a = t.value.indexOf(".");
      if (-1 !== a)
        return (
          (e = t.value.indexOf("'", (a += 1))),
          t.value.substr(a, e - a).replace('"', "")
        );
    });
  var ENUM_METASOUND = {
    BIQUAD_FILTER_TYPE: [
      { name: "Low Pass", value: "0" },
      { name: "High Pass", value: "1" },
      { name: "Band Pass", value: "2" },
      { name: "Notch", value: "3" },
      { name: "Parametric EQ", value: "4" },
      { name: "Low Shelf", value: "5" },
      { name: "High Shelf", value: "6" },
      { name: "All Pass", value: "7" },
      { name: "Butterworth Low Pass", value: "8" },
      { name: "Butterworth High Pass", value: "9" },
    ],
    BUFFER_TRIGGER_TYPE: [
      { name: "Rising Edge", value: "0" },
      { name: "Falling Edge", value: "1" },
      { name: "Abs Threshold", value: "2" },
    ],
    DYNAMIC_FILTER_TYPE: [
      { name: "Bell", value: "0" },
      { name: "Low Shelf", value: "1" },
      { name: "High Shelf", value: "2" },
    ],
    ENVELOPE_PEAK_MODE: [
      { name: "MS", value: "1" },
      { name: "RMS", value: "2" },
      { name: "Peak", value: "0" },
    ],
    FILTER_ORDER: [
      { name: "Two Pole", value: "0" },
      { name: "Four Pole", value: "1" },
      { name: "Six Pole", value: "2" },
      { name: "Eight Pole", value: "3" },
    ],
    GRAIN_DELAY_ENVELOPE: [
      { name: "Gaussian", value: "0" },
      { name: "Triangle", value: "1" },
      { name: "Downward Triangle", value: "2" },
      { name: "Upward Triangle", value: "3" },
      { name: "Exponential Decay", value: "4" },
      { name: "Exponential Attack", value: "5" },
    ],
    KNEE_MODE: [
      { name: "Hard", value: "0" },
      { name: "Soft", value: "1" },
    ],
    LFO_WAVESHAPE_TYPE: [
      { name: "Sine", value: "0" },
      { name: "Saw", value: "1" },
      { name: "Triangle", value: "2" },
      { name: "Square", value: "3" },
    ],
    MUSICAL_SCALE: [
      { name: "Major Scale", value: "0" },
      { name: "Minor (Dorian)", value: "2" },
      { name: "Phrygian", value: "27" },
      { name: "Lydian", value: "6" },
      { name: "Dominant 7th (Mixolydian)", value: "1" },
      { name: "Natural Minor (Aeolian)", value: "28" },
      { name: "Half Diminished (Locrian)", value: "3" },
      { name: "Diminished", value: "4" },
      { name: "Chromatic", value: "19" },
      { name: "Whole-Tone", value: "18" },
      { name: "Diminished Whole-Tone", value: "20" },
      { name: "Major Pentatonic", value: "5" },
      { name: "Minor Pentatonic", value: "21" },
      { name: "Blues", value: "13" },
      { name: "Bebop (Major)", value: "7" },
      { name: "Bebop (Minor)", value: "22" },
      { name: "Bebop (Minor) #2", value: "24" },
      { name: "Bebop (Dominant)", value: "14" },
      { name: "Harmonic Major", value: "8" },
      { name: "Harmonic Minor", value: "25" },
      { name: "Melodic Minor", value: "23" },
      { name: "Sixth Mode of Harmonic Minor", value: "11" },
      { name: "Lydian Augmented", value: "9" },
      { name: "Lydian Dominant", value: "16" },
      { name: "Augmented", value: "10" },
      { name: "Diminished (Begin With Half-Step)", value: "12" },
      { name: "Diminished (Begin With Whole-Step)", value: "26" },
      { name: "Half-Diminished (Locrian #2)", value: "29" },
      { name: "Spanish or Jewish Scale", value: "15" },
      { name: "Hindu", value: "17" },
    ],
    NOISE_TYPE: [
      { name: "Pink Noise", value: "0" },
      { name: "White Noise", value: "1" },
    ],
    PANNING_LAW: [
      { name: "Equal Power", value: "0" },
      { name: "Linear", value: "1" },
    ],
    SAW_GENERATION_TYPE: [
      { name: "Poly Smooth", value: "0" },
      { name: "Trivial", value: "1" },
    ],
    SINE_GENERATION_TYPE: [
      { name: "2D Rotation", value: "0" },
      { name: "Pure Math", value: "1" },
      { name: "Bhaskara", value: "2" },
      { name: "Wavetable", value: "3" },
    ],
    SQUARE_GENERATION_TYPE: [
      { name: "Poly Smooth", value: "0" },
      { name: "Trivial", value: "1" },
    ],
    STEREO_DELAY_MODE: [
      { name: "Normal", value: "0" },
      { name: "Cross", value: "1" },
      { name: "Ping Pong", value: "2" },
    ],
    TRIANGLE_GENERATION_TYPE: [
      { name: "Poly Smooth", value: "0" },
      { name: "Trivial", value: "1" },
    ],
    TRIGGER_COMPARISON_TYPE: [
      { name: "Equals", value: "0" },
      { name: "Not Equals", value: "1" },
      { name: "Less Than", value: "2" },
      { name: "Greater Than", value: "3" },
      { name: "Less Than Or Equals", value: "4" },
      { name: "Greater Than Or Equals", value: "5" },
    ],
    WAVE_SHAPER_TYPE: [
      { name: "Sine", value: "0" },
      { name: "Inverse Tangent", value: "1" },
      { name: "Hyperbolic Tangent", value: "2" },
      { name: "Cubic Polynomial", value: "3" },
      { name: "Hard Clip", value: "4" },
    ],
    WAVE_TABLE_ENVELOPE_MODE: [
      { name: "Loop", value: "3" },
      { name: "Hold", value: "2" },
      { name: "Unit", value: "1" },
      { name: "Zero", value: "0" },
    ],
    WAVE_TABLE_INTERPOLATION: [
      { name: "None (Step)", value: "0" },
      { name: "Linear", value: "1" },
      { name: "Cubic", value: "2" },
    ],
  };
  function NMetasound() {
    UNode.call(this);
  }
  (NMetasound.prototype = new UNode()),
    ((NMetasound.prototype.constructor = NMetasound).prototype.findHeaderName =
      function () {
        var e = null,
          a = "",
          n = null,
          l = searchPropWithName(this.props, "ClassName"),
          t = searchPropWithName(this.props, "bIsClassNative"),
          i = {
            DynamicFilter: "Dynamic Filter",
            "Musical Scale To Note Array": "Scale To Note Array",
            TriggerOnThreshold: "Trigger On Threshold",
            "Wave BPMToSeconds": "BPM To Seconds",
            GrainDelayNode: "Grain Delay",
            WaveTableEnvelope: "WaveTable Envelope",
            WaveTableOscillator: "WaveTable Oscillator",
            "Convert Filter Q To Bandwidth": "Filter Q To Bandwidth",
            MetasoundWaveTableGet: "Get WaveTable From Bank",
          };
        if (null !== l)
          return null !== t && "False" === t.value
            ? "MetaSoundSource"
            : ((t = searchPropWithName(l.value, "Namespace")),
              (e = searchPropWithName(l.value, "Name")),
              (l = searchPropWithName(l.value, "Variant")),
              null !== t &&
              -1 !==
                [
                  "Array",
                  "Print Log",
                  "AD Envelope",
                  "ADSR Envelope",
                  "Crossfade",
                  "MapRange",
                  "Clamp",
                  "Max",
                  "Min",
                  "TriggerCompare",
                  "TriggerRoute",
                ].indexOf(t.value)
                ? "Crossfade" === t.value
                  ? "Crossfade " + e.value.substring(13)
                  : "TriggerRoute" === t.value
                  ? e.value
                  : ((a = e.value),
                    "Concat" === e.value && (a = "Concatenate"),
                    "MapRange" === t.value && (a = "Map Range"),
                    (a = "TriggerCompare" === t.value ? "Trigger Compare" : a) +
                      " (" +
                      l.value +
                      ")")
                : "Wave Player" === e.value
                ? "5dot1" === l.value
                  ? "Wave Player (5.1)"
                  : "7dot1" === l.value
                  ? "Wave Player (7.1)"
                  : "Wave Player (" + l.value + ")"
                : "WaveWriter" === (t = e.value.substring(0, 10))
                ? "Wave Writer (Mono)"
                : "Band Split" === t
                ? e.value.substring(
                    e.value.indexOf("(") + 1,
                    e.value.indexOf(",")
                  ) +
                  " Band Splitter (" +
                  e.value.substring(e.value.length - 2, e.value.length - 1) +
                  ")"
                : "Audio Mixe" === t
                ? e.value.substring(
                    e.value.indexOf("(") + 1,
                    e.value.indexOf(",")
                  ) +
                  " Mixer (" +
                  e.value.substring(e.value.length - 2, e.value.length - 1) +
                  ")"
                : void 0 !== i[e.value]
                ? i[e.value]
                : -1 !==
                  [
                    "MIDI To Frequency",
                    "Trigger On Value Change",
                    "Value",
                  ].indexOf(e.value)
                ? e.value + " (" + l.value + ")"
                : e.value);
        if (null !== (n = searchPropWithName(this.objectDefinition, "Class"))) {
          if (
            -1 !==
            n.value.indexOf(
              "/Script/MetasoundEditor.MetasoundEditorGraphInputNode"
            )
          )
            return "Input";
          if (
            -1 !==
            n.value.indexOf(
              "/Script/MetasoundEditor.MetasoundEditorGraphOutputNode"
            )
          )
            return "Output";
        }
        return UNode.prototype.findHeaderName.call(this);
      }),
    (NMetasound.prototype.generateHTML = function () {
      var e,
        a = {
          tag: "div",
          classes: ["node", "nmetasound", this.findCssClassNodeIcon()],
          attrs: [
            { name: "style", value: this.generateCssNodeStyle().join(";") },
            { name: "data-id", value: this.guid },
          ],
          childs: [this.generateHTMLToolTip(), this.generateHTMLHeader()],
        },
        n = null,
        l = 0,
        t = searchPropWithName(this.props, "ClassName"),
        i = !1;
      if (
        (null === t ||
          null === (t = searchPropWithName(t.value, "Namespace")) ||
          ("VariableMutator" !== t.value &&
            "VariableAccessor" !== t.value &&
            "VariableDeferredAccessor" !== t.value) ||
          ((i = !0), a.classes.push("variable")),
        this.detectInputSelectToCreate(),
        (n = this.generateHTMLBody()),
        Array.isArray(n))
      )
        for (
          i &&
            n[0].childs.unshift({
              tag: "div",
              attrs: [{ name: "class", value: "round-bg" }],
            }),
            e = n.length;
          l < e;
          ++l
        )
          a.childs.push(n[l]);
      else
        n.childs.unshift({
          tag: "div",
          attrs: [{ name: "class", value: "round-bg" }],
        }),
          a.childs.push(n);
      return (
        "" !== (t = this.getIconCenterClass()) &&
          (a.classes.push("icon-center"), a.classes.push(t)),
        a
      );
    }),
    (NMetasound.prototype.getIconCenterClass = function () {
      var e = searchPropWithName(this.props, "ClassName"),
        a = "",
        n = "";
      if (null !== e) {
        if (
          null !== (a = searchPropWithName(e.value, "Namespace")) &&
          "convert" === a.value.toLowerCase()
        )
          return "conv";
        if (null !== (n = searchPropWithName(e.value, "Name"))) {
          if ("conversion" === n.value.toLowerCase().substring(0, 10))
            return "conv";
          if (
            -1 !==
            [
              "add",
              "divide",
              "logarithm",
              "modulo",
              "multiply",
              "power",
              "subtract",
            ].indexOf(n.value.toLowerCase())
          )
            return "math-" + n.value.toLowerCase();
        }
      }
      return "";
    }),
    (NMetasound.prototype.generateHTMLHeader = function () {
      var e,
        a = searchPropWithName(this.props, "ClassName"),
        n = "",
        l = null,
        t = this.generateHTMLPinDelegate(),
        i = 0,
        s = t.length;
      if (null !== a) {
        if (null !== (e = searchPropWithName(a.value, "Namespace"))) {
          if ("Convert" === e.value) return this.disableTextOnPins(), l;
          if ("VariableMutator" === e.value || "VariableAccessor" === e.value)
            return l;
          if ("VariableDeferredAccessor" === e.value)
            return { tag: "div", classes: ["header", "icon-async"] };
        }
        if (null !== (n = searchPropWithName(a.value, "Name"))) {
          if ("Conversion" === n.value.substring(0, 10))
            return this.disableTextOnPins(), l;
          if (
            -1 !==
            [
              "add",
              "divide",
              "logarithm",
              "modulo",
              "multiply",
              "power",
              "subtract",
            ].indexOf(n.value.toLowerCase())
          )
            return this.disableTextOnPins(), l;
        }
      }
      for (
        l = {
          tag: "div",
          classes: [
            "header",
            "node-color",
            this.findCssClassNodeColor(),
            "gradient",
          ],
          childs: [
            {
              tag: "span",
              classes: ["has-icon", "name"],
              childs: [
                {
                  tag: "div",
                  classes: ["icon", this.findCssClassNodeIcon()],
                  text: this.findHeaderName(),
                },
              ],
            },
          ],
        };
        i < s;
        ++i
      )
        l.childs.push(t[i]);
      return l;
    }),
    (NMetasound.prototype.generateHTMLBody = function () {
      var e = this.findCssClassNodeIcon(),
        a = [
          {
            tag: "div",
            classes: ["body"],
            childs: [
              {
                tag: "div",
                classes: ["left-col"],
                childs: this.generateHTMLPinsInput(),
              },
              {
                tag: "div",
                classes: ["right-col"],
                childs: this.generateHTMLPinsOutput(),
              },
            ],
          },
        ];
      return (
        "input" === e && (a[0].childs = [a[0].childs[1]]),
        "output" === e && (a[0].childs = [a[0].childs[0]]),
        this.hasAdvancedPinDisplay() &&
          (this.isAdvancedPinDisplayExpanded()
            ? a.push({
                tag: "div",
                classes: ["less"],
                childs: [{ tag: "span" }],
              })
            : a.push({
                tag: "div",
                classes: ["more"],
                childs: [{ tag: "span" }],
              })),
        a
      );
    }),
    (NMetasound.prototype.findCssClassNodeIcon = function () {
      var e = searchPropWithName(this.objectDefinition, "Class"),
        a = searchPropWithName(this.props, "bIsClassNative");
      if (null !== a && "False" === a.value) return "graph";
      if (null !== e) {
        if (
          -1 !==
          e.value.indexOf(
            "/Script/MetasoundEditor.MetasoundEditorGraphInputNode"
          )
        )
          return "input";
        if (
          -1 !==
          e.value.indexOf(
            "/Script/MetasoundEditor.MetasoundEditorGraphOutputNode"
          )
        )
          return "output";
      }
      return "native";
    }),
    (NMetasound.prototype.disableTextOnPins = function () {
      for (var e = 0, a = this.pins.length; e < a; ++e)
        this.pins[e].disableText();
    }),
    (NMetasound.prototype.detectInputSelectToCreate = function () {
      var e = {
          "Stereo Delay": ["STEREO_DELAY_MODE", "Delay Mode"],
          Compressor: ["ENVELOPE_PEAK_MODE", "Envelope Mode"],
          Limiter: ["KNEE_MODE", "Knee"],
          "Biquad Filter": ["BIQUAD_FILTER_TYPE", "Type"],
          LFO: ["LFO_WAVESHAPE_TYPE", "Shape"],
          Square: ["SQUARE_GENERATION_TYPE", "Type"],
          Noise: ["NOISE_TYPE", "Type"],
          Sine: ["SINE_GENERATION_TYPE", "Type"],
          Saw: ["SAW_GENERATION_TYPE", "Type"],
          Triangle: ["TRIANGLE_GENERATION_TYPE", "Type"],
          "Musical Scale To Note Array": ["MUSICAL_SCALE", "Scale Degrees"],
          "Stereo Panner": ["PANNING_LAW", "Panning Law"],
          TriggerOnThreshold: ["BUFFER_TRIGGER_TYPE", "Type"],
          "Envelope Follower": ["ENVELOPE_PEAK_MODE", "Peak Mode"],
          WaveShaper: ["WAVE_SHAPER_TYPE", "Type"],
          GrainDelayNode: ["GRAIN_DELAY_ENVELOPE", "Grain Envelope"],
        },
        a = "",
        n = "",
        l = "",
        t = searchPropWithName(this.props, "ClassName"),
        i = searchPropWithName(this.props, "bIsClassNative");
      if (null !== t) {
        if (null !== i && "False" === i.value) return "MetaSoundSource";
        if (
          ((i = searchPropWithName(t.value, "Namespace")),
          (a = searchPropWithName(t.value, "Name")),
          (n = searchPropWithName(t.value, "Variant")),
          void 0 !== e[a.value])
        )
          this.setInputSelectValuesToPin(e[a.value][0], e[a.value][1]);
        else {
          if (
            "Convert" === i.value &&
            null !== n &&
            "Enum:" === n.value.substring(0, 5)
          )
            return (
              (l = n.value
                .substring(5)
                .replace(" ", "")
                .split(/(?=[A-Z])/)
                .join("_")
                .toUpperCase()),
              void this.setInputSelectValuesToPin(l, n.value)
            );
          if (
            "VariableMutator" === i.value &&
            "Enum:" === a.value.substring(0, 5)
          )
            return (
              (l = a.value
                .substring(5)
                .replace(" ", "")
                .split(/(?=[A-Z])/)
                .join("_")
                .toUpperCase()),
              void this.setInputSelectValuesToPin(l, "Value")
            );
          if ("TriggerCompare" === i.value)
            this.setInputSelectValuesToPin("TRIGGER_COMPARISON_TYPE", "Type");
          else {
            if ("Band Splitter" !== a.value.substring(0, 13))
              return "DynamicFilter" === a.value
                ? (this.setInputSelectValuesToPin(
                    "DYNAMIC_FILTER_TYPE",
                    "FilterType"
                  ),
                  void this.setInputSelectValuesToPin(
                    "ENVELOPE_PEAK_MODE",
                    "EnvelopeMode"
                  ))
                : void (
                    "WaveTableEnvelope" === a.value &&
                    (this.setInputSelectValuesToPin(
                      "WAVE_TABLE_ENVELOPE_MODE",
                      "Mode"
                    ),
                    this.setInputSelectValuesToPin(
                      "WAVE_TABLE_INTERPOLATION",
                      "Interpolation"
                    ))
                  );
            this.setInputSelectValuesToPin("FILTER_ORDER", "Filter Order");
          }
        }
      }
    }),
    (NMetasound.prototype.setInputSelectValuesToPin = function (e, a, n) {
      for (var l, t = 0, i = this.pins.length, s = n || 0; t < i; ++t)
        if (
          this.pins[t].isInput() &&
          null !== (l = searchPropWithName(this.pins[t].props, "PinName")) &&
          l.value === a
        )
          return void this.pins[t].setInputSelectValues(ENUM_METASOUND[e], s);
    });
  var ENUM_NIAGARA = {
    ECollisionChannel: [
      { name: "World Static", value: "ECC_WorldStatic" },
      { name: "World Dynamic", value: "ECC_WorldDynamic" },
      { name: "Pawn", value: "ECC_Pawn" },
      { name: "Visibility", value: "ECC_Visibility" },
      { name: "Camera", value: "ECC_Camera" },
      { name: "PhysicsBody", value: "ECC_PhysicsBody" },
      { name: "Vehicule", value: "ECC_Vehicle" },
      { name: "Destructible", value: "ECC_Destructible" },
    ],
    EFieldIntegerType: [
      { name: "Dynamic State", value: "Integer_DynamicState" },
      { name: "Activate Disabled", value: "Integer_ActivateDisabled" },
      { name: "Collision Group", value: "Integer_CollisionGroup" },
    ],
    EFieldScalarType: [
      { name: "External Strain", value: "Scalar_ExternalClusterStrain" },
      { name: "Kill Particle", value: "Scalar_Kill" },
      { name: "Disable Threshold", value: "Scalar_DisableThreshold" },
      { name: "Sleeping Threshold", value: "Scalar_SleepingThreshold" },
      { name: "Internal Strain", value: "Scalar_InternalClusterStrain" },
    ],
    EFieldVectorType: [
      { name: "Linear Force", value: "Vector_LinearForce" },
      { name: "Linear Velocity", value: "Vector_LinearVelocity" },
      { name: "Angular Velocity", value: "Vector_AngularVelocity" },
      { name: "Angular Torque", value: "Vector_AngularTorque" },
    ],
    ENiagara_AngleInput: [
      { name: "Degrees", value: "NewEnumerator0" },
      { name: "Normalized Angle (0-1)", value: "NewEnumerator1" },
      { name: "Radians", value: "NewEnumerator2" },
    ],
    ENiagara_CPUCollisionType: [
      { name: "Ray Traced", value: "NewEnumerator1" },
      { name: "Analytical Planes", value: "NewEnumerator3" },
    ],
    ENiagara_Float4Channel: [
      { name: "R", value: "NewEnumerator0" },
      { name: "G", value: "NewEnumerator1" },
      { name: "B", value: "NewEnumerator2" },
      { name: "A", value: "NewEnumerator3" },
    ],
    ENiagara_GPUCollisionType: [
      { name: "GPU Depth Buffer", value: "NewEnumerator1" },
      { name: "GPU Distance Fields", value: "NewEnumerator2" },
      { name: "GPU Ray Traces (Experimental)", value: "NewEnumerator4" },
      { name: "Analytics Planes", value: "NewEnumerator3" },
    ],
    ENiagara_Waveforms: [
      { name: "Sine", value: "NewEnumerator0" },
      { name: "Cosine", value: "NewEnumerator1" },
      { name: "Compound Sin/Cos", value: "NewEnumerator2" },
      { name: "Pendulum", value: "NewEnumerator3" },
      { name: "Square", value: "NewEnumerator4" },
      { name: "Pulse", value: "NewEnumerator5" },
      { name: "Triangle", value: "NewEnumerator6" },
      { name: "Sawtooth", value: "NewEnumerator7" },
      { name: "Random", value: "NewEnumerator8" },
      { name: "Random Blend", value: "NewEnumerator9" },
      { name: "Random Spline", value: "NewEnumerator10" },
      { name: "Random Spline Smooth", value: "NewEnumerator12" },
      { name: "Random Spline Segmented", value: "NewEnumerator13" },
    ],
    ENiagaraCalculateRadiusOptions: [
      { name: "Bounds", value: "NewEnumerator0" },
      { name: "Minimum Axis", value: "NewEnumerator1" },
      { name: "Maximum Axis", value: "NewEnumerator2" },
    ],
    ENiagaraCompileUsageStaticSwitch: [
      { name: "Spawn", value: "Spawn" },
      { name: "Update", value: "Update" },
      { name: "Event", value: "Event" },
      { name: "Simulation Stage", value: "SimulationStage" },
      { name: "Default", value: "Default" },
    ],
    ENiagaraCoordinateSpace: [
      { name: "Simulation", value: "Simulation" },
      { name: "World", value: "World" },
      { name: "Local", value: "Local" },
    ],
    ENiagaraExecutionState: [
      { name: "Active", value: "Active" },
      { name: "Inactive", value: "Inactive" },
      { name: "Inactive Clear", value: "InactiveClear" },
      { name: "Complete", value: "Complete" },
    ],
    ENiagaraExecutionStateSource: [
      { name: "Scalability", value: "Scalability" },
      { name: "Internal", value: "Internal" },
      { name: "Owner", value: "Owner" },
      { name: "Internal Completion", value: "InternalCompletion" },
    ],
    ENiagaraFrictionMergeType: [
      { name: "Ignore", value: "NewEnumerator0" },
      { name: "Average", value: "NewEnumerator1" },
      { name: "Min", value: "NewEnumerator2" },
      { name: "Max", value: "NewEnumerator3" },
    ],
    ENiagaraFunctionDebugState: [
      { name: "No Debug", value: "NoDebug" },
      { name: "Basic", value: "Basic" },
    ],
    ENiagaraLegacyTrailWidthMode: [
      { name: "From Centre", value: "FromCentre" },
      { name: "From First", value: "FromFirst" },
      { name: "From Second", value: "FromSecond" },
    ],
    ENiagaraOrientationAxis: [
      { name: "X Axis", value: "XAxis" },
      { name: "Y Axis", value: "YAxis" },
      { name: "Z Axis", value: "ZAxis" },
    ],
    ENiagaraRandomnessEvaluation: [
      { name: "Spawn Only", value: "NewEnumerator0" },
      { name: "Every Frame", value: "NewEnumerator1" },
    ],
    ENiagaraRandomnessMode: [
      { name: "Simulation Defaults", value: "NewEnumerator0" },
      { name: "Deterministic", value: "NewEnumerator1" },
      { name: "Non-Deterministic", value: "NewEnumerator2" },
    ],
    ENiagaraScriptContextStaticSwitch: [
      { name: "System", value: "System" },
      { name: "Emitter", value: "Emitter" },
      { name: "Particle", value: "Particle" },
    ],
    ENiagaraSimTarget: [
      { name: "CPUSim", value: "CPUSim" },
      { name: "GPUComputeSim", value: "GPUComputeSim" },
    ],
    ENiagaraRestitutionMergeType: [
      { name: "Ignore", value: "NewEnumerator3" },
      { name: "Min", value: "NewEnumerator0" },
      { name: "Max", value: "NewEnumerator1" },
      { name: "Average", value: "NewEnumerator2" },
    ],
    ENiagaraVector2_Channels: [
      { name: "X", value: "NewEnumerator0" },
      { name: "Y", value: "NewEnumerator1" },
    ],
    ENiagaraVector3_Channels: [
      { name: "X", value: "NewEnumerator0" },
      { name: "Y", value: "NewEnumerator1" },
      { name: "Z", value: "NewEnumerator2" },
    ],
    ENiagaraVector4_Channels: [
      { name: "X", value: "NewEnumerator0" },
      { name: "Y", value: "NewEnumerator1" },
      { name: "Z", value: "NewEnumerator2" },
      { name: "W", value: "NewEnumerator3" },
    ],
  };
  function convertHlsl(e) {
    for (
      var a,
        n = [],
        t = 0,
        r = (a = e
          .replaceAll("\\t", "    ")
          .replaceAll('\\"', '"')
          .split("\\r\\n")).length;
      t < r;
      ++t
    )
      n.push({ text: a[t] }), t + 1 < a.length && n.push({ tag: "br" });
    return n;
  }
  function NNiagara() {
    UNode.call(this), (this.inputObject = ""), (this.datasetObject = "");
  }
  (NNiagara.prototype = new UNode()),
    ((NNiagara.prototype.constructor = NNiagara).prototype.generateHTML =
      function () {
        var e,
          a = null;
        return (
          this.detectInputSelectToCreate(),
          (a = UNode.prototype.generateHTML.call(this)),
          null !== (e = searchPropWithName(this.props, "CustomHlsl")) &&
            a.childs.push({
              tag: "div",
              classes: ["bottom"],
              childs: [
                {
                  tag: "div",
                  classes: ["fake-input", "hlsl"],
                  attrs: [{ name: "contenteditable", value: "true" }],
                  childs: convertHlsl(e.value),
                },
              ],
            }),
          a
        );
      }),
    (NNiagara.prototype.findHeaderName = function () {
      var e = "/Script/NiagaraEditor.",
        a = null,
        n = searchPropWithName(this.props, "FunctionDisplayName");
      if (null !== n) return transformInternalName(n.value);
      if (null !== (n = searchPropWithName(this.props, "OpName")))
        return "Mul" === (n = transformInternalName(n.value).split("::"))[1]
          ? "Multiply"
          : "Cmp LT" === n[1]
          ? "Less Than"
          : "Cmp LE" === n[1]
          ? "Less Than Or Equal"
          : n[1];
      if (null !== (a = searchPropWithName(this.objectDefinition, "Class"))) {
        if (-1 !== a.value.indexOf(e + "NiagaraNodeParameterMapSet"))
          return "Map Set";
        if (-1 !== a.value.indexOf(e + "NiagaraNodeParameterMapGet"))
          return "Map Get";
        if (-1 !== a.value.indexOf(e + "NiagaraNodeParameterMapFor"))
          return "Map For";
        if (-1 !== a.value.indexOf(e + "NiagaraNodeCustomHlsl"))
          return "CustomHlsl";
        if (-1 !== a.value.indexOf(e + "NiagaraNodeStaticSwitch"))
          return null ===
            (n = searchPropWithName(this.props, "InputParameterName"))
            ? "Static Switch (Undefined parameter name)"
            : "Static Switch (" + n.value + ")";
        if (-1 !== a.value.indexOf(e + "NiagaraNodeIf")) return "If";
        if (-1 !== a.value.indexOf(e + "NiagaraNodeInput"))
          return this.inputObject.replaceAll('\\"', '"').replaceAll("\\'", "'");
        if (-1 !== a.value.indexOf(e + "NiagaraNodeConvert")) return "Convert";
        if (-1 !== a.value.indexOf(e + "NiagaraNodeReadDataSet"))
          return this.datasetObject + " Read";
        if (-1 !== a.value.indexOf(e + "NiagaraNodeWriteDataSet"))
          return this.datasetObject + " Read";
      }
      return UNode.prototype.findHeaderName.call(this);
    }),
    (NNiagara.prototype.generateHTMLHeader = function () {
      for (
        var e = this.generateHTMLPinDelegate(),
          a = 0,
          n = e.length,
          t = {
            tag: "div",
            classes: [
              "header",
              "node-color",
              this.findCssClassNodeColor(),
              "gradient",
              this.findIconAfterNode(),
            ],
            childs: [
              {
                tag: "span",
                classes: ["name"],
                text: this.findHeaderName(),
                childs: [
                  { tag: "br" },
                  {
                    tag: "span",
                    classes: ["subname"],
                    text: this.findHeaderSubname(),
                  },
                ],
              },
            ],
          };
        a < n;
        ++a
      )
        t.childs.push(e[a]);
      return t;
    }),
    (NNiagara.prototype.findCssClassNodeColor = function () {
      var e = searchPropWithName(this.objectDefinition, "Class");
      if (null !== e) {
        if (-1 !== e.value.indexOf("NiagaraNodeCustomHlsl")) return "switch";
        if (-1 !== e.value.indexOf("NiagaraNodeStaticSwitch")) return "event";
        if (-1 !== e.value.indexOf("NiagaraNodeFunctionCall"))
          return "break-struct";
        if (-1 !== e.value.indexOf("NiagaraNodeInput"))
          return searchPropWithName(this.props, "Usage"), "event";
        if (-1 !== e.value.indexOf("NiagaraNodeReadDataSet")) return "event";
        if (-1 !== e.value.indexOf("NiagaraNodeWriteDataSet")) return "event";
      }
      return "function-call";
    }),
    (NNiagara.prototype.callbackInspectNode = function (e, a) {
      var n;
      null !== (n = searchPropWithName(this.props, "Input")) &&
        (this.inputObject = searchPropWithName(n.value, "Name").value),
        null !== (n = searchPropWithName(this.props, "DataSet")) &&
          (this.datasetObject = searchPropWithName(n.value, "Name").value);
    }),
    (NNiagara.prototype.detectInputSelectToCreate = function () {
      for (var e, a, n = 0, t = this.pins.length, r = null, l = ""; n < t; ++n)
        null === (a = this.pins[n].getPropFromPinType("PinCategory")) ||
          ("Enum" !== a.value && "StaticEnum" !== a.value) ||
          (null !==
            (r = this.pins[n].getPropFromPinType("PinSubCategoryObject")) &&
            ((a = r.value
              .substr(r.value.lastIndexOf(".") + 1)
              .replace('"', "")
              .replace("'", "")),
            void 0 !== ENUM_NIAGARA[a] &&
              ((l = ""),
              null !==
                (e = searchPropWithName(this.pins[n].props, "DefaultValue")) &&
                (l = e.value),
              this.pins[n].setInputSelectValues(ENUM_NIAGARA[a], l))));
    });
  function NNiagaraClipboardContent() {
    UNode.call(this);
  }
  (NNiagaraClipboardContent.prototype = new UNode()),
    ((NNiagaraClipboardContent.prototype.constructor =
      NNiagaraClipboardContent).prototype.getExportedNodes = function () {
      var o = searchPropWithName(this.props, "ExportedNodes");
      return null === o ? "" : atob(o.value);
    });
  function NPCG() {
    (this.headerName = ""), (this.isKnot = !1), UNode.call(this);
  }
  (NPCG.prototype = new UNode()),
    ((NPCG.prototype.constructor = NPCG).prototype.generateHTML = function () {
      var e,
        t,
        n = 0,
        o = this.pins.length,
        r = null,
        a = 0,
        i = searchPropWithName(this.objectDefinition, "Class"),
        s = ["node", "npcg"];
      for (
        null !== i &&
        -1 !== i.value.indexOf("PCGEditorGraphNodeReroute") &&
        ((this.isKnot = !0), s.push("knot"));
        n < o;
        ++n
      )
        this.pins[n].disableInput();
      if (
        ((r = {
          tag: "div",
          classes: s,
          attrs: [
            { name: "style", value: this.generateCssNodeStyle().join(";") },
            { name: "data-id", value: this.guid },
          ],
          childs: [this.generateHTMLToolTip(), this.generateHTMLHeader()],
        }),
        this.overrideConnectorTypeForPins(),
        (e = this.generateHTMLBody()),
        Array.isArray(e))
      )
        for (t = e.length; a < t; ++a) r.childs.push(e[a]);
      else r.childs.push(e);
      return r;
    }),
    (NPCG.prototype.generateCssNodeHeader = function () {
      var e,
        t = null,
        n = this.nodes[0].objectDefinition[2].value,
        o = [
          "Modifier",
          "CreateSpline",
          "Difference",
          "Distance",
          "Data",
          "Gather",
          "Projection",
          "NormalToDensity",
          "TransformPoints",
          "Bounds",
          "Union",
          "Merge",
          "Intersection",
          "Debug",
          "ToPoint",
          "Query",
        ],
        r = 0,
        a = o.length;
      if ("ExecuteBlueprint_" === n.substring(0, 17)) {
        if (
          this.nodes[0] &&
          this.nodes[0].nodes[1] &&
          this.nodes[0].nodes[1].nodes[0] &&
          this.nodes[0].nodes[1].nodes[0].objectDefinition[1]
        ) {
          if (
            -1 !==
            this.nodes[0].nodes[1].nodes[0].objectDefinition[2].value.indexOf(
              "Debug"
            )
          )
            return "pcg-default";
          if (
            -1 !==
            this.nodes[0].nodes[1].nodes[0].objectDefinition[2].value.indexOf(
              "AppendAttributeSet"
            )
          )
            return "pcg-params";
        }
        return "pcg-execute-bp";
      }
      if (-1 !== n.indexOf("Attribute")) return "pcg-attribute";
      if (-1 !== n.indexOf("Spawn")) return "pcg-spawn";
      if (
        "Subgraph" === (n = -1 !== (e = n.indexOf("_")) ? n.substring(0, e) : n)
      )
        return "pcg-input";
      if (
        null !== (t = searchPropWithName(this.objectDefinition, "Class")) &&
        (-1 !== t.value.indexOf("PCGEditorGraphNodeOutput") ||
          -1 !== t.value.indexOf("PCGEditorGraphNodeInput"))
      )
        return "pcg-input";
      for (; r < a; ++r) if (-1 !== n.indexOf(o[r])) return "pcg-spatial";
      return "DensityNoise" === n || "DensityRemap" === n
        ? "pcg-density"
        : "GetActorProperty" === n
        ? "pcg-params"
        : -1 !== n.indexOf("Filter") || -1 !== n.indexOf("SelfPruning")
        ? "pcg-filter"
        : -1 !== n.indexOf("PointMatchAndSet")
        ? "pcg-attribute"
        : "pcg-default";
    }),
    (NPCG.prototype.findHeaderName = function () {
      var e,
        t,
        n = null,
        o = null,
        r = -1,
        a = this.nodes[0].objectDefinition[2].value,
        i = 0;
      if (this.nodes.length < 2) return "";
      if (null !== (e = searchPropWithName(this.nodes[1].props, "NodeTitle")))
        return e.value;
      if ("ExecuteBlueprint_" === a.substring(0, 17)) {
        if (
          ((a = "Execute Blueprint"),
          this.nodes[0] &&
            this.nodes[0].nodes[1] &&
            this.nodes[0].nodes[1].nodes[0] &&
            this.nodes[0].nodes[1].nodes[0].objectDefinition[1])
        ) {
          if (
            "BP_Element_MeshToPointsWithColors" ===
            (a =
              this.nodes[0].nodes[1].nodes[0].objectDefinition[2]
                .value).substring(0, 33)
          )
            return "BP_Element_MeshToPointsWithColors";
          a = a.substring(0, a.indexOf("_"));
        }
        return "IntersectWithTaggedActorGeo" === a
          ? "IntersectWithTaggedActorGeometry"
          : a;
      }
      if ("DefaultInputNode" === a) return "Input";
      if ("DefaultOutputNode" === a) return "Output";
      if (
        "Subgraph" !== (a = -1 !== (e = a.indexOf("_")) ? a.substring(0, e) : a)
      )
        return (
          "FilterByTag" === a &&
            (null !==
              (o = searchPropWithName(
                this.nodes[1].nodes[1].props,
                "Operation"
              )) && "RemoveTagged" === o.value
              ? (a += "(Remove)")
              : (a += "(Keep)"),
            null !==
              (o = searchPropWithName(
                this.nodes[1].nodes[1].props,
                "SelectedTags"
              )) && (a += ": " + o.value)),
          "AddAttribute" === a || "CreateAttribute" === a
            ? ((a = "None: 0.00"),
              null !==
                (o = searchPropWithName(
                  this.nodes[1].nodes[1].props,
                  "OutputAttributeName"
                )) && (a = o.value),
              null !==
              (o = searchPropWithName(
                this.nodes[1].nodes[1].props,
                "AttributeTypes"
              ))
                ? a + ": " + this.getAttributeValue(o)
                : a + ": 0.00")
            : ("FilterAttribute" === a &&
                (null !==
                  (o = searchPropWithName(
                    this.nodes[1].nodes[1].props,
                    "Operation"
                  )) && "DeleteSelectedAttributes" === o.value
                  ? (a += "(Delete)")
                  : (a += "(Keep)"),
                null !==
                  (o = searchPropWithName(
                    this.nodes[1].nodes[1].props,
                    "SelectedAttributes"
                  )) && (a += ": " + o.value)),
              "AttributeBitwiseOp" === a
                ? this.getOperationName("Bitwise", "And")
                : "AttributeBooleanOp" === a
                ? this.getOperationName("Boolean", "And")
                : "AttributeCompareOp" === a
                ? this.getOperationName("Compare", "Equal")
                : "AttributeMathsOp" === a
                ? this.getOperationName("Maths", "Add")
                : "AttributeRotatorOp" === a
                ? this.getOperationName("Rotator", "Combine")
                : "AttributeTransformOp" === a
                ? this.getOperationName("Transform", "Compose")
                : "AttributeTrigOp" === a
                ? this.getOperationName("Trig", "Acos")
                : "AttributeVectorOp" === a
                ? this.getOperationName("Vector", "Cross")
                : "AttributeReduce" === a
                ? ((a = "Reduce LastAttribute"),
                  null !==
                    (o = searchPropWithName(
                      this.nodes[1].nodes[1].props,
                      "OutputAttributeName"
                    )) && (a += " to " + o.value),
                  this.getOperationName(a, "Average"))
                : "AttributeSelect" === a
                ? ((a = this.getOperationName("Select LastAttribute", "Min")),
                  null !==
                  (o = searchPropWithName(this.nodes[1].nodes[1].props, "Axis"))
                    ? "CustomAxis" === o.value
                      ? null !==
                        (o = searchPropWithName(
                          this.nodes[1].nodes[1].props,
                          "CustomAxis"
                        ))
                        ? a +
                          " on (" +
                          formatAxisValueForDisplay(o.value[0].value) +
                          ", " +
                          formatAxisValueForDisplay(o.value[1].value) +
                          ", " +
                          formatAxisValueForDisplay(o.value[2].value) +
                          ", " +
                          formatAxisValueForDisplay(o.value[3].value) +
                          ")"
                        : a + " on (0.00, 0.00, 0.00, 0.00)"
                      : a + " on " + o.value
                    : a + " on X")
                : ("TransferAttribute" === a &&
                    ((a +=
                      null ===
                      (o = searchPropWithName(
                        this.nodes[1].nodes[1].props,
                        "SourceAttributeName"
                      ))
                        ? " None"
                        : " " + o.value),
                    null !==
                      (o = searchPropWithName(
                        this.nodes[1].nodes[1].props,
                        "TargetAttributeName"
                      )) && (a += " to " + o.value)),
                  "DataTableRowToAttributeSet" === a &&
                    ((a =
                      null ===
                      (o = searchPropWithName(
                        this.nodes[1].nodes[1].props,
                        "DataTable"
                      ))
                        ? " None"
                        : -1 === (r = o.value.lastIndexOf("."))
                        ? " " + o.value
                        : " " + o.value.substring(r + 1)),
                    (a +=
                      null ===
                      (o = searchPropWithName(
                        this.nodes[1].nodes[1].props,
                        "RowName"
                      ))
                        ? "[ None ]"
                        : "[ " + o.value + " ]")),
                  a))
        );
      for (i = 0, t = this.nodes[1].nodes.length; i < t; ++i)
        0 < this.nodes[1].nodes[i].nodes.length &&
          (n = searchPropWithName(
            this.nodes[1].nodes[i].nodes[0].props,
            "Graph"
          ));
      return null !== n && -1 !== (r = n.value.lastIndexOf("."))
        ? n.value
            .substring((r += 1))
            .replace("'", "")
            .replace('"', "")
        : "invalid subgraph";
    }),
    (NPCG.prototype.getAttributeValue = function (e) {
      var t = [
          { name: "Float", value: "FloatValue", defaultValue: "0.00" },
          { name: "Integer32", value: "Int32Value", defaultValue: "0" },
          { name: "Integer64", value: "IntValue", defaultValue: "0" },
          {
            name: "Vector2",
            value: "Vector2Value",
            defaultValue: "V(0.00, 0.00)",
          },
          {
            name: "Vector",
            value: "VectorValue",
            defaultValue: "V(0.00, 0.00, 0.00)",
          },
          {
            name: "Vector4",
            value: "Vector4Value",
            defaultValue: "V(0.00, 0.00, 0.00, 0.00)",
          },
          {
            name: "Quaternion",
            value: "QuatValue",
            defaultValue: "Q(0.00, 0.00, 0.00, 1.00)",
          },
          { name: "Transform", value: "-", defaultValue: "Transform" },
          { name: "String", value: "StringValue", defaultValue: '""' },
          { name: "Boolean", value: "BoolValue", defaultValue: "False" },
          {
            name: "Rotator",
            value: "RotatorValue",
            defaultValue: "R(0.00, 0.00, 0.00)",
          },
          { name: "Name", value: "NameValue", defaultValue: 'N("None")' },
        ],
        n = 0,
        o = t.length,
        r = null,
        a = "",
        i = [];
      if (null === searchPropWithName(e.value, "Type"))
        return null === (r = searchPropWithName(e.value, "DoubleValue"))
          ? "0.00"
          : formatAxisValueForDisplay(r.value);
      for (; n < o; ++n)
        if (e.value[0].value === t[n].name) {
          if (null === (r = searchPropWithName(e.value, t[n].value)))
            return t[n].defaultValue;
          if (
            "Vect" !== (a = t[n].name.substring(0, 4)) &&
            "Quat" !== a &&
            "Rota" !== a
          )
            return "Name" === a
              ? "N(" + r.value + ")"
              : "Floa" === a
              ? formatAxisValueForDisplay(r.value)
              : r.value;
          for (n = 0, o = r.value.length; n < o; ++n)
            i.push(formatAxisValueForDisplay(r.value[n].value));
          return a.substring(0, 1) + "(" + i.join(",") + ")";
        }
      return "";
    }),
    (NPCG.prototype.getOperationName = function (e, t) {
      var n = searchPropWithName(this.nodes[1].nodes[1].props, "Operation");
      return null !== n ? e + ": " + n.value : e + ": " + t;
    }),
    (NPCG.prototype.generateTextForUnreal = function (e) {
      var t = "",
        n = getIndentFormat(e);
      return (
        (t += "Begin " + this.generateTextObjectDefinition()) +
        (n + "Begin " + this.nodes[0].generateTextObjectDefinition()) +
        getTextDeclarationForUnreal(this.nodes[0].nodes, e + 1) +
        (n + "End " + this.nodes[0].objectDefinition[0].value + "\n") +
        (n + "Begin " + this.nodes[1].generateTextObjectDefinition()) +
        this.getTextDescriptionForUnreal(this.nodes[1].nodes, e + 1) +
        this.nodes[1].generateTextProps(e + 1) +
        (n + "End Object\n") +
        this.generateTextProps(e) +
        ("End " + this.objectDefinition[0].value)
      );
    }),
    (NPCG.prototype.getTextDescriptionForUnreal =
      function getTextDescriptionForUnreal(e, t) {
        for (
          var n = "", o = getIndentFormat(t), r = 0, a = e.length;
          r < a;
          ++r
        )
          (n += o + "Begin " + e[r].generateTextObjectDefinition()),
            0 < e[r].nodes.length &&
              (n += getTextDescriptionForUnreal(e[r].nodes, t + 1)),
            (n = n + e[r].generateTextProps(t + 1) + (o + "End Object\n"));
        return n;
      }),
    (NPCG.prototype.generateHTMLHeader = function () {
      return this.isKnot
        ? {}
        : ((this.headerName = this.findHeaderName()),
          {
            tag: "div",
            classes: [
              "header",
              "node-color",
              "gradient",
              "pcg",
              this.generateCssNodeHeader(),
            ],
            childs: [{ tag: "span", classes: ["name"], text: this.headerName }],
          });
    }),
    (NPCG.prototype.overrideConnectorTypeForPins = function () {
      for (
        var e,
          t,
          n,
          o,
          r = 0,
          a = this.pins.length,
          i = null,
          s = null,
          l = 0,
          u = !1,
          p = -1,
          d = "connector",
          c = "exec",
          h = 0,
          g = 0,
          f = "",
          m = !0,
          v = !0,
          N = [];
        r < a;
        ++r
      )
        if (
          ((e = this.pins[r].getPropFromPinType("PinCategory")),
          (i = this.pins[r].getPropFromPinType("PinSubCategory")),
          (s = searchPropWithName(this.pins[r].props, "PinName")),
          this.isKnot)
        )
          (this.pins[r].override.connectorType = {
            connector: "connector",
            type: "pcg-any-data",
          }),
            i &&
              "" !== i.value &&
              (this.pins[r].override.connectorType.type =
                "pcg-" + i.value.toLowerCase().replaceAll(" ", "-"));
        else if (null !== e && "Attribute Set" === e.value)
          this.pins[r].override.connectorType = {
            connector: "connector-pcg-attribute-set",
            type: "pcg-attribute-set",
          };
        else if (null !== e && "Spatial Data" === e.value)
          this.pins[r].override.connectorType = {
            connector: "connector-pcg-spatial-data",
            type: "pcg-spatial-data",
          };
        else if (
          null === (s = searchPropWithName(this.pins[r].props, "PinName"))
        )
          this.pins[r].override.connectorType = {
            connector: "connector",
            type: "exec",
          };
        else if (2 !== this.nodes.length)
          this.pins[r].override.connectorType = {
            connector: "connector",
            type: "exec",
          };
        else {
          for (u = !1, l = 0, t = this.nodes[1].nodes.length; l < t; ++l)
            if (0 !== this.nodes[1].nodes[l].props.length) {
              for (
                p = -1, h = 0, n = this.nodes[1].nodes[l].props.length;
                h < n;
                ++h
              )
                if ("Properties" === this.nodes[1].nodes[l].props[h].name) {
                  p = h;
                  break;
                }
              if (-1 !== p) {
                for (
                  v = m = !(f = ""),
                    g = 0,
                    o = (N = this.nodes[1].nodes[l].props[p].value).length;
                  g < o;
                  ++g
                )
                  "Label" === N[g].name && (f = N[g].value.toLowerCase()),
                    "bAllowMultipleData" === N[g].name &&
                      "False" === N[g].value &&
                      (m = !1),
                    "bAllowMultipleConnections" === N[g].name &&
                      "False" === N[g].value &&
                      (v = !1);
                if (f === s.value.toLowerCase()) {
                  (d = "connector"),
                    m && v
                      ? (d = "connector-pcg-multiple-data-multiple-connection")
                      : m &&
                        !v &&
                        (d = "connector-pcg-multiple-data-single-connection"),
                    (c = "exec") ===
                      (c =
                        "" !== i.value
                          ? "pcg-" + i.value.toLowerCase().replaceAll(" ", "-")
                          : c) &&
                      ((c = "pcg-any-data"),
                      null !== e &&
                        "Concrete Data" === e.value &&
                        "" === i.value &&
                        (c = "pcg-concrete-data")),
                    (this.pins[r].override.connectorType = {
                      connector: d,
                      type: c,
                    }),
                    (u = !0);
                  break;
                }
              }
            }
          u ||
            (this.pins[r].override.connectorType = {
              connector: "connector",
              type: "exec",
            });
        }
    });
  function NSelf() {
    UNode.call(this);
  }
  (NSelf.prototype = new UNode()),
    ((NSelf.prototype.constructor = NSelf).prototype.generateHTML =
      function () {
        var e = this.getVariableType();
        return {
          tag: "div",
          classes: ["node", "nvariableget", e.connector, e.type],
          attrs: [
            { name: "style", value: this.generateCssNodeStyle().join(";") },
            { name: "data-id", value: this.guid },
          ],
          childs: [this.generateHTMLToolTip(), this.generateHTMLBody()],
        };
      }),
    (NSelf.prototype.generateHTMLBody = function () {
      return {
        tag: "div",
        classes: ["body"],
        childs: [
          { tag: "div", classes: ["round-bg"] },
          {
            tag: "div",
            classes: ["right-col"],
            childs: this.generateHTMLPinsOutput(),
          },
        ],
      };
    }),
    (NSelf.prototype.getVariableType = function () {
      for (var e = 0, t = this.pins.length; e < t; ++e)
        if (this.pins[e].isOutput() && !1 === this.pins[e].isDelegateOutput())
          return this.pins[e].getConnectorType();
      return { connector: "connector", type: "object" };
    });
  function NSubsystem() {
    UNode.call(this);
  }
  (NSubsystem.prototype = new UNode()),
    ((NSubsystem.prototype.constructor = NSubsystem).prototype.generateHTML =
      function () {
        return (
          this.disableTextOnPins(),
          {
            tag: "div",
            classes: ["node", "nsubsystem"],
            attrs: [
              { name: "style", value: this.generateCssNodeStyle().join(";") },
              { name: "data-id", value: this.guid },
            ],
            childs: [this.generateHTMLToolTip(), this.generateHTMLBody()],
          }
        );
      }),
    (NSubsystem.prototype.generateHTMLBody = function () {
      var t,
        e,
        s = "",
        a = 0,
        i = searchPropWithName(this.props, "CustomClass"),
        n = [],
        l = 0;
      if (null !== i && ((s = i.value), -1 !== (i = i.value.lastIndexOf("."))))
        if (
          "DataDrivenCVarEngineSubsystem" ===
          (s = s.substr(i + 1).replace("'", ""))
        )
          n = [{ text: "DataDrivenCVars" }];
        else if ("QuartzSubsystem" === s) n = [{ text: "Quartz" }];
        else if ("GeometryCollectionISMPoolSubSystem" === s)
          n = [
            { text: "Geometry" },
            { tag: "br" },
            { text: "Collection" },
            { tag: "br" },
            { text: "ISMPool" },
            { tag: "br" },
            { text: "Sub System" },
          ];
        else if ("PPMChainGraphWorldSubsystem" === s)
          n = [
            { text: "PPMChain" },
            { tag: "br" },
            { text: "Graph" },
            { tag: "br" },
            { text: "World" },
            { tag: "br" },
            { text: "Subsystem" },
          ];
        else
          for (
            e = (t = s.match(/[A-Z]?[a-z]+|[0-9]+|[A-Z]+(?![a-z])/g)).length;
            a < e;
            ++a
          )
            n.push({ text: t[a] }),
              (l += t[a].length),
              "HLOD" !== t[a] &&
                "ISM" !== t[a] &&
                "PCG" !== t[a] &&
                a + 1 < e &&
                (l + t[a + 1].length < 11
                  ? (n.push({ text: " " }), (l += t[a + 1].length))
                  : (n.push({ tag: "br" }), (l = 0)));
      return {
        tag: "div",
        classes: ["body"],
        childs: [
          { tag: "div", classes: ["round-bg"] },
          {
            tag: "div",
            classes: ["left-col"],
            childs: this.generateHTMLPinsInput(),
          },
          {
            tag: "div",
            classes: ["left-text"],
            childs: [{ tag: "span", childs: n }],
          },
          {
            tag: "div",
            classes: ["right-col"],
            childs: this.generateHTMLPinsOutput(),
          },
        ],
      };
    }),
    (NSubsystem.prototype.disableTextOnPins = function () {
      for (var t = 0, e = this.pins.length; t < e; ++t)
        null === searchPropWithName(this.pins[t].props, "PinFriendlyName") &&
          this.pins[t].disableText();
    });
  function NVariableGet() {
    UNode.call(this);
  }
  (NVariableGet.prototype = new UNode()),
    ((NVariableGet.prototype.constructor =
      NVariableGet).prototype.generateHTML = function () {
      var e = this.getVariableType();
      return {
        tag: "div",
        classes: ["node", "nvariableget", e.connector, e.type],
        attrs: [
          { name: "style", value: this.generateCssNodeStyle().join(";") },
          { name: "data-id", value: this.guid },
        ],
        childs: [this.generateHTMLToolTip(), this.generateHTMLBody()],
      };
    }),
    (NVariableGet.prototype.generateHTMLBody = function () {
      return {
        tag: "div",
        classes: ["body"],
        childs: [
          { tag: "div", classes: ["round-bg"] },
          {
            tag: "div",
            classes: ["left-col"],
            childs: this.generateHTMLPinsInput(),
          },
          {
            tag: "div",
            classes: ["right-col"],
            childs: this.generateHTMLPinsOutput(),
          },
        ],
      };
    }),
    (NVariableGet.prototype.getVariableType = function () {
      for (var e = 0, t = this.pins.length; e < t; ++e)
        if (this.pins[e].isOutput() && !1 === this.pins[e].isDelegateOutput())
          return this.pins[e].getConnectorType();
      return { connector: "connector", type: "object" };
    });
  function NVariableSet() {
    UNode.call(this);
  }
  (NVariableSet.prototype = new UNode()),
    ((NVariableSet.prototype.constructor =
      NVariableSet).prototype.generateHTML = function () {
      var e;
      return (
        this.disableTextOnPins(),
        {
          tag: "div",
          classes: [
            "node",
            "nvariableset",
            (e = this.getVariableType()).connector,
            e.type,
          ],
          attrs: [
            { name: "style", value: this.generateCssNodeStyle().join(";") },
            { name: "data-id", value: this.guid },
          ],
          childs: [this.generateHTMLToolTip(), this.generateHTMLBody()],
        }
      );
    }),
    (NVariableSet.prototype.generateHTMLBody = function () {
      var e = this.getVariableType();
      return {
        tag: "div",
        classes: ["body"],
        childs: [
          { tag: "div", classes: ["round-bg-color", e.connector, e.type] },
          { tag: "div", classes: ["round-bg"], text: "SET" },
          {
            tag: "div",
            classes: ["left-col"],
            childs: this.generateHTMLPinsInput(),
          },
          {
            tag: "div",
            classes: ["right-col"],
            childs: this.generateHTMLPinsOutput(),
          },
        ],
      };
    }),
    (NVariableSet.prototype.getVariableType = function () {
      for (var e = 0, t = this.pins.length; e < t; ++e)
        if (
          this.pins[e].isOutput() &&
          !1 === this.pins[e].isDelegateOutput() &&
          "exec" !== this.pins[e].getPropFromPinType("PinCategory").value
        )
          return this.pins[e].getConnectorType();
      return { connector: "connector", type: "object" };
    }),
    (NVariableSet.prototype.disableTextOnPins = function () {
      for (var e = 0, t = this.pins.length; e < t; ++e)
        this.pins[e].isOutput() &&
          null === searchPropWithName(this.pins[e].props, "PinFriendlyName") &&
          this.pins[e].disableText();
    });
  function Pin() {
    (this.props = []),
      (this.hasToGenerateText = !0),
      (this.hasToGenerateInput = !0),
      (this.override = { connectorType: null }),
      (this.isBelow413Version = !1),
      (this.id = null),
      (this.inputSelectValues = []),
      (this.inputSelectDefaultValue = 0);
  }
  (Pin.prototype.disableText = function () {
    this.hasToGenerateText = !1;
  }),
    (Pin.prototype.enableText = function () {
      this.hasToGenerateText = !0;
    }),
    (Pin.prototype.disableInput = function () {
      this.hasToGenerateInput = !1;
    }),
    (Pin.prototype.enableInput = function () {
      this.hasToGenerateInput = !0;
    }),
    (Pin.prototype.disableTextAndInput = function () {
      (this.hasToGenerateText = !1), (this.hasToGenerateInput = !1);
    }),
    (Pin.prototype.enableTextAndInput = function () {
      (this.hasToGenerateText = !0), (this.hasToGenerateInput = !0);
    }),
    (Pin.prototype.addProp = function (t) {
      var e,
        a = 0;
      if (Array.isArray(t))
        for (e = t.length; a < e; ++a)
          t[a].name && "PinId" === t[a].name && (this.id = t[a].value),
            this.props.push(t[a]);
      else
        t.name && "PinId" === t.name && (this.id = t.value), this.props.push(t);
    }),
    (Pin.prototype.getLinks = function () {
      var t,
        e = [],
        a = 0,
        r = 0;
      if (this.isBelow413Version)
        for (r = this.props.length; a < r; ++a)
          "LinkedTo(" === this.props[a].name.substring(0, 9) &&
            e.push(this.props[a].value);
      else if (
        null !== (t = searchPropWithName(this.props, "LinkedTo")) &&
        Array.isArray(t.value)
      )
        for (r = t.value.length; a < r; ++a) e.push(t.value[a].value);
      return e;
    }),
    (Pin.prototype.generateTextForUnreal = function (t) {
      var e,
        a = [],
        r = getIndentFormat(t),
        s = 0,
        i = this.props.length,
        n = [];
      if (this.isBelow413Version) {
        for (
          e = getIndentFormat(t + 1),
            a.push(r + 'Begin Object Name="' + this.id + '"');
          s < i;
          ++s
        )
          a.push(e + convertPropsToText(this.props[s]));
        a.push(r + "End Object"), (a = a.join("\n"));
      } else {
        for (a.push("CustomProperties Pin ("); s < i; ++s)
          n.push(convertPropsToText(this.props[s]));
        a.push(n.join(",")), a.push(")"), (a = r + a.join(""));
      }
      return a;
    }),
    (Pin.prototype.generateHTML = function (t, e) {
      var a,
        r = "",
        s = {},
        i = "",
        n = "",
        l = null,
        u = ["label-text"],
        o = null,
        c = [],
        p = null,
        h = null,
        v = null,
        g = "",
        f = "",
        x = null,
        d = null,
        m = [],
        S = 0,
        b = null;
      if (this.isHidden()) return null;
      if (
        (this.hasToHidePin(t) && (r = "hidden"),
        (s = this.getConnectorType()),
        "NKnot" === e.constructor.name && (s.connector = "connector"),
        this.isLinkedTo() && (i = "filled"),
        "" !== s.type && (n = s.type),
        (t = searchPropWithName(e.objectDefinition, "Name")),
        this.isDelegateOutput())
      )
        l = {
          tag: "div",
          classes: ["pin", r],
          attrs: [{ name: "data-id", value: t.value + " " + this.id }],
          childs: [
            "NDelegate" === e.constructor.name && {
              tag: "div",
              classes: [u],
              text: "Event",
            },
            { tag: "div", classes: ["clink", s.connector, s.type, i] },
          ],
        };
      else if (this.isInput())
        if (
          (null !== (o = this.getPropFromPinType("PinSubCategory")) &&
            "DynamicAddPin" === o.value &&
            ((this.hasToGenerateInput = !1), u.push("icon-plus")),
          null !== (e = this.getPropFromPinType("PinCategory")) &&
            "WaveTable" === e.value &&
            (this.hasToGenerateInput = !1),
          (c = []),
          "connector-map" === s.connector &&
            ((v = this.getPropFromPinType("PinValueType")),
            (p = searchPropWithName(v.value, "TerminalSubCategoryObject")),
            (h = v.value[0].value),
            null !== p &&
              ("/Script/CoreUObject.ScriptStruct'" ===
                p.value.substring(0, 33) && (p.value = p.value.substring(20)),
              "ScriptStruct'/Script/CoreUObject.Vector'" === p.value ||
              "ScriptStruct'\"/Script/CoreUObject.Vector\"'" === p.value ||
              "ScriptStruct'/Script/CoreUObject.Vector3f'" === p.value ||
              "ScriptStruct'\"/Script/CoreUObject.Vector3f\"'" === p.value
                ? (h = "vector")
                : "ScriptStruct'/Script/CoreUObject.Rotator'" === p.value ||
                  "ScriptStruct'\"/Script/CoreUObject.Rotator\"'" === p.value
                ? (h = "rotator")
                : ("ScriptStruct'/Script/CoreUObject.Transform'" !== p.value &&
                    "ScriptStruct'\"/Script/CoreUObject.Transform\"'" !==
                      p.value) ||
                  (h = "transform")),
            (c = [
              { tag: "div", classes: ["key", s.type] },
              { tag: "div", classes: ["value", h] },
            ])),
          (f = ""),
          (x = this.getPropFromPinType("bIsReference")),
          (d = this.getPropFromPinType("bIsConst")),
          null !== x &&
            "True" === x.value &&
            null !== d &&
            "False" === d.value &&
            "delegate" !== s.type &&
            (f = "ref"),
          (m = this.generateHTMLInput()),
          ("connector-map" !== s.connector && "transform" !== s.type) ||
            (m = []),
          (e = this.findText()),
          (l = {
            tag: "div",
            classes: ["pin", r],
            attrs: [{ name: "data-id", value: t.value + " " + this.id }],
            childs: [
              {
                tag: "div",
                classes: ["div-inside", n],
                childs: [
                  {
                    tag: "div",
                    classes: ["clink", f, s.connector, s.type, i],
                    childs: c,
                  },
                  { tag: "div", classes: u, text: e },
                ],
              },
            ],
          }),
          this.hasInputSelect())
        )
          "" !== e &&
            (l.childs[0].childs[1].classes.push("space-input-select"),
            l.childs[0].childs.push({ tag: "br" })),
            l.childs[0].childs.push(this.generateInputSelect());
        else for (a = m.length; S < a; ++S) l.childs[0].childs.push(m[S]);
      else
        this.isExecOutput() && (g = "no-margin-bottom"),
          null !== (o = this.getPropFromPinType("PinSubCategory")) &&
            "DynamicAddPin" === o.value &&
            ((this.hasToGenerateInput = !1), u.push("icon-plus")),
          (b = null),
          (e = searchPropWithName(this.props, "PinFriendlyName")),
          (b =
            (0 < g.length && null === e && this.findText().length,
            { tag: "div", classes: u, text: this.findText() })),
          (c = []),
          "connector-map" === s.connector &&
            ((v = this.getPropFromPinType("PinValueType")),
            (p = searchPropWithName(v.value, "TerminalSubCategoryObject")),
            (h = v.value[0].value),
            null !== p &&
              ("/Script/CoreUObject.ScriptStruct'" ===
                p.value.substring(0, 33) && (p.value = p.value.substring(20)),
              "ScriptStruct'/Script/CoreUObject.Vector'" === p.value ||
              "ScriptStruct'\"/Script/CoreUObject.Vector\"'" === p.value ||
              "ScriptStruct'/Script/CoreUObject.Vector3f'" === p.value ||
              "ScriptStruct'\"/Script/CoreUObject.Vector3f\"'" === p.value
                ? (h = "vector")
                : "ScriptStruct'/Script/CoreUObject.Rotator'" === p.value ||
                  "ScriptStruct'\"/Script/CoreUObject.Rotator\"'" === p.value
                ? (h = "rotator")
                : ("ScriptStruct'/Script/CoreUObject.Transform'" !== p.value &&
                    "ScriptStruct'\"/Script/CoreUObject.Transform\"'" !==
                      p.value) ||
                  (h = "transform")),
            (c = [
              { tag: "div", classes: ["key", s.type] },
              { tag: "div", classes: ["value", h] },
            ])),
          (f = ""),
          (x = this.getPropFromPinType("bIsReference")),
          (d = this.getPropFromPinType("bIsConst")),
          null !== x &&
            "True" === x.value &&
            null !== d &&
            "False" === d.value &&
            "delegate" !== s.type &&
            (f = "ref"),
          (l = {
            tag: "div",
            classes: ["pin", r, g],
            attrs: [{ name: "data-id", value: t.value + " " + this.id }],
            childs: [
              {
                tag: "div",
                classes: ["div-inside", n],
                childs: [
                  b,
                  {
                    tag: "div",
                    classes: ["clink", f, s.connector, s.type, i],
                    childs: c,
                  },
                ],
              },
            ],
          });
      return l;
    }),
    (Pin.prototype.getConnectorType = function () {
      var t,
        e,
        a = "connector",
        r = null,
        s = null,
        i = "";
      return null !== this.override.connectorType
        ? this.override.connectorType
        : ((r = this.getPropFromPinType("PinCategory")),
          (t = this.getPropFromPinType("bIsArray")),
          (s = this.getPropFromPinType("PinSubCategoryObject")),
          (e = this.getPropFromPinType("ContainerType")),
          null === r
            ? { connector: a, type: "" }
            : ((r = r.value.toLowerCase()),
              -1 !== ["exec"].indexOf((i = r))
                ? (a = "connector-image")
                : null !== t && "True" === t.value
                ? (a = "connector-array")
                : null !== e && "Set" === e.value
                ? (a = "connector-set")
                : null !== e && "Map" === e.value
                ? (a = "connector-map")
                : null !== e && "Array" === e.value
                ? (a = "connector-array")
                : "trigger" === i && (a = "connector-trigger"),
              "statictype" === i &&
                null !== s &&
                (-1 !== s.value.indexOf("Niagara.NiagaraInt32")
                  ? (i += "-int")
                  : -1 !== s.value.indexOf("Niagara.NiagaraBool") &&
                    (i += "-bool")),
              "struct" === r
                ? (null !== s &&
                    ("/Script/CoreUObject.ScriptStruct'" ===
                      s.value.substring(0, 33) &&
                      (s.value = s.value.substring(20)),
                    "ScriptStruct'/Script/CoreUObject.Vector'" === s.value ||
                    "ScriptStruct'\"/Script/CoreUObject.Vector\"'" ===
                      s.value ||
                    "ScriptStruct'/Script/CoreUObject.Vector3f'" === s.value ||
                    "ScriptStruct'\"/Script/CoreUObject.Vector3f\"'" === s.value
                      ? (i = "vector")
                      : "ScriptStruct'/Script/CoreUObject.Rotator'" ===
                          s.value ||
                        "ScriptStruct'\"/Script/CoreUObject.Rotator\"'" ===
                          s.value
                      ? (i = "rotator")
                      : ("ScriptStruct'/Script/CoreUObject.Transform'" !==
                          s.value &&
                          "ScriptStruct'\"/Script/CoreUObject.Transform\"'" !==
                            s.value) ||
                        (i = "transform")),
                  { connector: a, type: i })
                : "type" === r
                ? (null !== s &&
                    ("/Script/CoreUObject.ScriptStruct'" ===
                      s.value.substring(0, 33) &&
                      (s.value = s.value.substring(20)),
                    "ScriptStruct'\"/Script/Niagara.NiagaraParameterMap\"'" ===
                    s.value
                      ? ((a = "connector-image"), (i = "exec"))
                      : "ScriptStruct'\"/Script/Niagara.NiagaraFloat\"'" ===
                        s.value
                      ? (i = "float")
                      : "ScriptStruct'\"/Script/Niagara.NiagaraNumeric\"'" ===
                        s.value
                      ? (i = "struct")
                      : "ScriptStruct'\"/Script/CoreUObject.Vector\"'" ===
                          s.value ||
                        "ScriptStruct'\"/Script/CoreUObject.Vector2f\"'" ===
                          s.value ||
                        "ScriptStruct'\"/Script/CoreUObject.Vector3f\"'" ===
                          s.value
                      ? (i = "vector")
                      : "ScriptStruct'\"/Script/Niagara.NiagaraInt32\"'" ===
                        s.value
                      ? (i = "int")
                      : "ScriptStruct'\"/Script/Niagara.NiagaraMatrix\"'" ===
                        s.value
                      ? (i = "struct")
                      : "ScriptStruct'\"/Script/Niagara.NiagaraBool\"'" ===
                        s.value
                      ? (i = "bool")
                      : "ScriptStruct'\"/Script/CoreUObject.Vector2D\"'" ===
                          s.value ||
                        "ScriptStruct'\"/Script/CoreUObject.Vector4\"'" ===
                          s.value ||
                        "ScriptStruct'\"/Script/CoreUObject.Vector4f\"'" ===
                          s.value ||
                        "ScriptStruct'\"/Script/CoreUObject.Quat4f\"'" ===
                          s.value
                      ? (i = "struct")
                      : "ScriptStruct'\"/Script/Niagara.NiagaraPosition\"'" ===
                        s.value
                      ? (i = "position")
                      : ("ScriptStruct'\"/Script/Engine.UserDefinedEnum\"'" !==
                          s.value &&
                          "ScriptStruct'\"/Script/CoreUObject.LinearColor\"'" !==
                            s.value) ||
                        (i = "enum")),
                  { connector: a, type: i })
                : ("class" === r && (i = "wildcard"),
                  "misc" === r && (i = "wildcard"),
                  "assetclass" === r && (i = "asset-class"),
                  "softclass" === r && (i = "soft-class"),
                  "softobject" === r && (i = "soft-object"),
                  {
                    connector: a,
                    type: (i = (i =
                      "int32" ===
                      (i =
                        "float" === (i = "time:array" === r ? "time" : i) &&
                        null !==
                          (t = this.getPropFromPinType("PinSubCategory")) &&
                        "time" === t.value
                          ? "time"
                          : i)
                        ? "int"
                        : i).replaceAll(" ", "-")),
                  })));
    }),
    (Pin.prototype.isLinkedTo = function () {
      return this.isBelow413Version
        ? null !== searchPropWithName(this.props, "LinkedTo(0)")
        : null !== searchPropWithName(this.props, "LinkedTo");
    }),
    (Pin.prototype.findText = function () {
      var t,
        e,
        a = "",
        r = null;
      if (!1 === this.hasToGenerateText) return a;
      if (
        null !== (t = this.getPropFromPinType("PinSubCategory")) &&
        "DynamicAddPin" === t.value
      )
        return a;
      if (
        ((r = this.getPropFromPinType("PinCategory")),
        (t = searchPropWithName(this.props, "PinFriendlyName")),
        null !== (e = searchPropWithName(this.props, "PinName")) &&
          null === t &&
          ("then" === e.value || "execute" === e.value || "exec" === e.value))
      )
        return a;
      if (null === r)
        return (a =
          null === t
            ? transformInternalName(e.value)
            : formatTextL11nFromProp(t));
      if (null !== t) a = formatTextL11nFromProp(t);
      else if (null !== e) {
        if ("trigger" === (t = r.value.toLowerCase())) {
          if ("UE.Source.OnPlay" === e.value) return "On Play";
          if ("UE.Source.OneShot.OnFinished" === e.value) return "On Finished";
        }
        if ("audio" === t && "UE.OutputFormat.Mono.Audio:0" === e.value)
          return "Out Mono";
        "then" !== e.value &&
          "execute" !== e.value &&
          ((a = e.value),
          "bool" === t && a.match(/^[b][A-Z]/) && (a = a.substring(1)),
          (a = transformInternalName(a)));
      }
      return ucfirst(a);
    }),
    (Pin.prototype.generateHTMLInput = function () {
      var t,
        e = [],
        a = null,
        r = null,
        s = null,
        i = "",
        n = ["exec", "delegate", "trigger", "audio"],
        l = "Asset",
        u = "",
        o = [],
        c = [],
        p = 0,
        h = 0;
      if (!1 === this.hasToGenerateInput) return e;
      if (this.isLinkedTo()) return e;
      if (
        ((r = this.getPropFromPinType("PinCategory")),
        (t = this.getPropFromPinType("PinSubCategory")),
        null !== (s = this.getPropFromPinType("PinSubCategoryObject")) &&
          "/Script/CoreUObject.ScriptStruct'" === s.value.substring(0, 33) &&
          (s.value = s.value.substring(20)),
        (i = ""),
        this.isLinkedTo() && (i = "hidden"),
        (r = r.value.toLowerCase()),
        -1 !== n.indexOf(r))
      )
        return e;
      if (-1 !== (n = ["delegate"]).indexOf(r))
        return { tag: "span", classes: ["no-input"] };
      if (
        null !== (n = this.getPropFromPinType("bIsArray")) &&
        "True" === n.value
      )
        return [{ tag: "span", classes: ["no-input"] }];
      if (
        null !== (n = this.getPropFromPinType("ContainerType")) &&
        "Array" === n.value
      )
        e = [{ tag: "span", classes: ["no-input"] }];
      else if ("bool" === r)
        (e = [
          {
            tag: "input",
            classes: ["checkbox", i],
            attrs: [
              { name: "type", value: "checkbox" },
              { name: "value", value: "1" },
            ],
          },
        ]),
          "true" === this.getValue() &&
            e[0].attrs.push({ name: "checked", value: "checked" });
      else if ("struct" === r)
        if (
          null === s ||
          ("ScriptStruct'/Script/CoreUObject.LinearColor'" !== s.value &&
            "ScriptStruct'\"/Script/CoreUObject.LinearColor\"'" !== s.value)
        ) {
          if (
            null !== s &&
            -1 !== s.value.indexOf("/Script/EnhancedInput.ModifyContextOptions")
          )
            return [{ tag: "span", classes: ["no-input"] }];
          e =
            null === s ||
            ("ScriptStruct'/Script/CoreUObject.Vector2D'" !== s.value &&
              "ScriptStruct'\"/Script/CoreUObject.Vector2D\"'" !== s.value)
              ? null === s ||
                ("ScriptStruct'/Script/CoreUObject.Vector'" !== s.value &&
                  "ScriptStruct'\"/Script/CoreUObject.Vector\"'" !== s.value &&
                  "ScriptStruct'/Script/CoreUObject.Vector3f'" !== s.value &&
                  "ScriptStruct'\"/Script/CoreUObject.Vector3f\"'" !== s.value)
                ? null === s ||
                  ("ScriptStruct'/Script/CoreUObject.Rotator'" !== s.value &&
                    "ScriptStruct'\"/Script/CoreUObject.Rotator\"'" !== s.value)
                  ? [
                      {
                        tag: "span",
                        classes: ["fake-input", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: this.getValue(),
                      },
                    ]
                  : ("" === (a = this.getValue()) && (a = "0.0,0.0,0.0"),
                    0 < this.findText().length
                      ? [
                          { tag: "br" },
                          {
                            tag: "span",
                            classes: ["tri-input-wrapper", i],
                            childs: [
                              {
                                tag: "span",
                                classes: ["fake-input", "axis", "axis-X", i],
                                attrs: [
                                  { name: "contenteditable", value: "true" },
                                ],
                                text: formatAxisValueForDisplay(
                                  a.split(",")[2]
                                ),
                              },
                              {
                                tag: "span",
                                classes: ["fake-input", "axis", "axis-Y", i],
                                attrs: [
                                  { name: "contenteditable", value: "true" },
                                ],
                                text: formatAxisValueForDisplay(
                                  a.split(",")[0]
                                ),
                              },
                              {
                                tag: "span",
                                classes: ["fake-input", "axis", "axis-Z", i],
                                attrs: [
                                  { name: "contenteditable", value: "true" },
                                ],
                                text: formatAxisValueForDisplay(
                                  a.split(",")[1]
                                ),
                              },
                            ],
                          },
                        ]
                      : [
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-X", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a.split(",")[2]),
                          },
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-Y", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a.split(",")[0]),
                          },
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-Z", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a.split(",")[1]),
                          },
                        ])
                : ("" === (a = this.getValue()) && (a = "0.0,0.0,0.0"),
                  0 < this.findText().length
                    ? [
                        { tag: "br" },
                        {
                          tag: "span",
                          classes: ["tri-input-wrapper", i],
                          childs: [
                            {
                              tag: "span",
                              classes: ["fake-input", "axis", "axis-X", i],
                              attrs: [
                                { name: "contenteditable", value: "true" },
                              ],
                              text: formatAxisValueForDisplay(a.split(",")[0]),
                            },
                            {
                              tag: "span",
                              classes: ["fake-input", "axis", "axis-Y", i],
                              attrs: [
                                { name: "contenteditable", value: "true" },
                              ],
                              text: formatAxisValueForDisplay(a.split(",")[1]),
                            },
                            {
                              tag: "span",
                              classes: ["fake-input", "axis", "axis-Z", i],
                              attrs: [
                                { name: "contenteditable", value: "true" },
                              ],
                              text: formatAxisValueForDisplay(a.split(",")[2]),
                            },
                          ],
                        },
                      ]
                    : [
                        {
                          tag: "span",
                          classes: ["fake-input", "axis", "axis-X", i],
                          attrs: [{ name: "contenteditable", value: "true" }],
                          text: formatAxisValueForDisplay(a.split(",")[0]),
                        },
                        {
                          tag: "span",
                          classes: ["fake-input", "axis", "axis-Y", i],
                          attrs: [{ name: "contenteditable", value: "true" }],
                          text: formatAxisValueForDisplay(a.split(",")[1]),
                        },
                        {
                          tag: "span",
                          classes: ["fake-input", "axis", "axis-Z", i],
                          attrs: [{ name: "contenteditable", value: "true" }],
                          text: formatAxisValueForDisplay(a.split(",")[2]),
                        },
                      ])
              : ((a =
                  "" === this.getValue()
                    ? [{ value: "0.0" }, { value: "0.0" }]
                    : convertTextToProps(this.getValue())),
                0 < this.findText().length
                  ? [
                      { tag: "br" },
                      {
                        tag: "span",
                        classes: ["tri-input-wrapper", i],
                        childs: [
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-X", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a[0].value),
                          },
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-Y", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a[1].value),
                          },
                        ],
                      },
                    ]
                  : [
                      {
                        tag: "span",
                        classes: ["fake-input", "axis", "axis-X", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: formatAxisValueForDisplay(a[0].value),
                      },
                      {
                        tag: "span",
                        classes: ["fake-input", "axis", "axis-Y", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: formatAxisValueForDisplay(a[1].value),
                      },
                    ]);
        } else
          e = [
            {
              tag: "span",
              classes: ["fake-input-colorpicker", i],
              attrs: [
                {
                  name: "style",
                  value:
                    "background-color: " +
                    this.convertColorToRgbaCssFromValue(),
                },
              ],
            },
          ];
      else if ("object" === r || "class" === r)
        e =
          !1 === this.hasValue() && !1 === this.hasObject()
            ? [{ tag: "span", classes: ["no-input"] }]
            : null !== t && "self" === t.value
            ? [
                {
                  tag: "span",
                  classes: ["fake-input", i],
                  attrs: [{ name: "contenteditable", value: "false" }],
                  text: "self",
                },
              ]
            : ((l = "Asset"),
              [
                { tag: "br" },
                {
                  tag: "span",
                  classes: ["fake-input-select", i],
                  childs: [
                    { text: this.getObject((l = "class" === r ? "Class" : l)) },
                    { tag: "span", classes: ["dropdown"] },
                  ],
                },
                { tag: "span", classes: ["asset-browser", i] },
                { tag: "span", classes: ["browse", i] },
              ]);
      else if ("type" === r) {
        if (null !== s)
          if (-1 !== s.value.indexOf("Niagara.NiagaraBool"))
            (e = [
              {
                tag: "input",
                classes: ["checkbox", i],
                attrs: [
                  { name: "type", value: "checkbox" },
                  { name: "value", value: "1" },
                ],
              },
            ]),
              "true" === this.getValue() &&
                e[0].attrs.push({ name: "checked", value: "checked" });
          else if (
            -1 !== s.value.indexOf("Vector3f") ||
            -1 !== s.value.indexOf("NiagaraPosition")
          )
            "" === (a = this.getValue()) && (a = "0.0,0.0,0.0"),
              (e =
                0 < this.findText().length
                  ? [
                      { tag: "br" },
                      {
                        tag: "span",
                        classes: ["tri-input-wrapper", i],
                        childs: [
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-X", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a.split(",")[0]),
                          },
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-Y", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a.split(",")[1]),
                          },
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-Z", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a.split(",")[2]),
                          },
                        ],
                      },
                    ]
                  : [
                      {
                        tag: "span",
                        classes: ["fake-input", "axis", "axis-X", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: formatAxisValueForDisplay(a.split(",")[0]),
                      },
                      {
                        tag: "span",
                        classes: ["fake-input", "axis", "axis-Y", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: formatAxisValueForDisplay(a.split(",")[1]),
                      },
                      {
                        tag: "span",
                        classes: ["fake-input", "axis", "axis-Z", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: formatAxisValueForDisplay(a.split(",")[2]),
                      },
                    ]);
          else if (-1 !== s.value.indexOf("Vector2f"))
            (a =
              "" === this.getValue()
                ? [{ value: "0.0" }, { value: "0.0" }]
                : convertTextToProps(
                    "(" + this.getValue().replace(" ", ",") + ")"
                  )),
              (e =
                0 < this.findText().length
                  ? [
                      { tag: "br" },
                      {
                        tag: "span",
                        classes: ["tri-input-wrapper", i],
                        childs: [
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-X", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a[0].value),
                          },
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-Y", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a[1].value),
                          },
                        ],
                      },
                    ]
                  : [
                      {
                        tag: "span",
                        classes: ["fake-input", "axis", "axis-X", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: formatAxisValueForDisplay(a[0].value),
                      },
                      {
                        tag: "span",
                        classes: ["fake-input", "axis", "axis-Y", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: formatAxisValueForDisplay(a[1].value),
                      },
                    ]);
          else if (-1 !== s.value.indexOf("Vector4f"))
            (a =
              "" === this.getValue()
                ? [
                    { value: "0.0" },
                    { value: "0.0" },
                    { value: "0.0" },
                    { value: "0.0" },
                  ]
                : convertTextToProps(
                    "(" + this.getValue().replace(" ", ",") + ")"
                  )),
              (e =
                0 < this.findText().length
                  ? [
                      { tag: "br" },
                      {
                        tag: "span",
                        classes: ["tri-input-wrapper", i],
                        childs: [
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-X", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a[0].value),
                          },
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-Y", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a[1].value),
                          },
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-Z", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a[2].value),
                          },
                          {
                            tag: "span",
                            classes: ["fake-input", "axis", "axis-W", i],
                            attrs: [{ name: "contenteditable", value: "true" }],
                            text: formatAxisValueForDisplay(a[3].value),
                          },
                        ],
                      },
                    ]
                  : [
                      {
                        tag: "span",
                        classes: ["fake-input", "axis", "axis-X", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: formatAxisValueForDisplay(a[0].value),
                      },
                      {
                        tag: "span",
                        classes: ["fake-input", "axis", "axis-Y", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: formatAxisValueForDisplay(a[1].value),
                      },
                      {
                        tag: "span",
                        classes: ["fake-input", "axis", "axis-Z", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: formatAxisValueForDisplay(a[2].value),
                      },
                      {
                        tag: "span",
                        classes: ["fake-input", "axis", "axis-W", i],
                        attrs: [{ name: "contenteditable", value: "true" }],
                        text: formatAxisValueForDisplay(a[3].value),
                      },
                    ]);
          else if (-1 !== s.value.indexOf("CoreUObject.LinearColor"))
            e = [
              {
                tag: "span",
                classes: ["fake-input-colorpicker", i],
                attrs: [
                  {
                    name: "style",
                    value:
                      "background-color: " +
                      this.convertColorToRgbaCssFromValue(),
                  },
                ],
              },
            ];
          else if (
            -1 === s.value.indexOf("Quat4f") &&
            -1 === s.value.indexOf("Niagara.NiagaraMatrix")
          )
            if (
              ((u = this.getValue()),
              -1 ===
                (u =
                  -1 === s.value.indexOf("Niagara.NiagaraInt32") &&
                  -1 === s.value.indexOf("Niagara.NiagaraFloat")
                    ? u
                    : u.replace(/(\.\d+?)0+\b/, "$1")).indexOf("<br>"))
            )
              e = [
                {
                  tag: "span",
                  classes: ["fake-input", i],
                  attrs: [{ name: "contenteditable", value: "true" }],
                  text: u,
                },
              ];
            else {
              for (o = [], h = (c = u.split("<br>")).length; p < h; ++p)
                o.push({ text: c[p] }),
                  p + 1 < c.length && o.push({ tag: "br" });
              e = [
                {
                  tag: "span",
                  classes: ["fake-input", i],
                  attrs: [{ name: "contenteditable", value: "true" }],
                  childs: o,
                },
              ];
            }
      } else if (
        ((u = this.getValue()),
        "" ===
          (u =
            "float" !== r &&
            "double" !== r &&
            "real" !== r &&
            "time" !== r &&
            "int32" !== r
              ? u
              : u.replace(/(\.\d+?)0+\b/, "$1")) &&
          ("int32" === r || "int" === r
            ? (u = "0")
            : ("float" !== r &&
                "double" !== r &&
                "real" !== r &&
                "time" !== r) ||
              (u = "0.0")),
        -1 === u.indexOf("<br>"))
      )
        e = [
          {
            tag: "span",
            classes: ["fake-input", i],
            attrs: [{ name: "contenteditable", value: "true" }],
            text: u,
          },
        ];
      else {
        for (o = [], h = (c = u.split("<br>")).length; p < h; ++p)
          o.push({ text: c[p] }), p + 1 < c.length && o.push({ tag: "br" });
        e = [
          {
            tag: "span",
            classes: ["fake-input", i],
            attrs: [{ name: "contenteditable", value: "true" }],
            childs: o,
          },
        ];
      }
      return e;
    }),
    (Pin.prototype.hasValue = function () {
      return null !== searchPropWithName(this.props, "DefaultValue");
    }),
    (Pin.prototype.hasObject = function () {
      return null !== searchPropWithName(this.props, "DefaultObject");
    }),
    (Pin.prototype.getObject = function (t) {
      var e = searchPropWithName(this.props, "DefaultObject");
      return null !== e ? getLastPartAsset(nl2br(e.value)) : "Select " + t;
    }),
    (Pin.prototype.getValue = function () {
      var t = null,
        e = searchPropWithName(this.props, "DefaultValue");
      return null !== e
        ? nl2br(e.value)
        : null !== (t = searchPropWithName(this.props, "DefaultTextValue"))
        ? "INVTEXT" === t.value
          ? t.value.substring(10).substring(0, t.value.length - 13)
          : nl2br(formatTextL11nFromProp(t))
        : "";
    }),
    (Pin.prototype.convertColorToRgbaCssFromValue = function () {
      var t,
        e,
        a = this.getValue(),
        r = [];
      return 0 < a.length
        ? ((a = (r = a.split(","))[0].substr(3)),
          (t = r[1].substr(2)),
          (e = r[2].substr(2)),
          (r = r[3].substr(2, r[3].length - 3)),
          "rgba(" +
            float2dec(a) +
            "," +
            float2dec(t) +
            "," +
            float2dec(e) +
            "," +
            r +
            ")")
        : "rgba(0,0,0,1)";
    }),
    (Pin.prototype.isHidden = function () {
      var t = searchPropWithName(this.props, "bHidden");
      return null !== t && "True" === t.value;
    }),
    (Pin.prototype.hasToHidePin = function (t) {
      var e;
      return (
        !t &&
        ((t = searchPropWithName(this.props, "bAdvancedView")),
        (e = searchPropWithName(this.props, "LinkedTo")),
        null !== t && "True" === t.value && null === e)
      );
    }),
    (Pin.prototype.isInput = function () {
      var t = searchPropWithName(this.props, "Direction");
      return null === t || "EGPD_Output" !== t.value;
    }),
    (Pin.prototype.isOutput = function () {
      var t = searchPropWithName(this.props, "Direction");
      return null !== t && "EGPD_Output" === t.value;
    }),
    (Pin.prototype.isDelegateOutput = function () {
      var t = this.getPropFromPinType("PinCategory");
      return this.isOutput() && null !== t && "delegate" === t.value;
    }),
    (Pin.prototype.isExecOutput = function () {
      var t = this.getPropFromPinType("PinCategory");
      return this.isOutput() && null !== t && "exec" === t.value;
    }),
    (Pin.prototype.getPropFromPinType = function (t) {
      var e;
      return this.isBelow413Version
        ? null === (e = searchPropWithName(this.props, "PinType"))
          ? null
          : searchPropWithName(e.value, t)
        : searchPropWithName(this.props, "PinType." + t);
    }),
    (Pin.prototype.hasInputSelect = function () {
      return 0 < this.inputSelectValues.length;
    }),
    (Pin.prototype.generateInputSelect = function () {
      var t = {
          tag: "select",
          attrs: [{ name: "class", value: "nmetasound-select" }],
          childs: [],
        },
        e = 0,
        a = this.inputSelectValues.length,
        r = null,
        s = this.getValue();
      for ("" === s && (s = this.inputSelectDefaultValue); e < a; ++e)
        (r = [{ name: "value", value: this.inputSelectValues[e].value }]),
          this.inputSelectValues[e].value === s &&
            r.push({ name: "selected", value: "selected" }),
          t.childs.push({
            tag: "option",
            text: this.inputSelectValues[e].name,
            attrs: r,
          });
      return t;
    }),
    (Pin.prototype.setInputSelectValues = function (t, e) {
      (this.inputSelectValues = t), (this.inputSelectDefaultValue = e);
    });
  function Updater(t, e) {
    return "object" != typeof t
      ? new TypeError(
          "Argument 'options' is incorrect, expect object, get " + typeof t
        )
      : e instanceof Bus
      ? ((this.data = { options: t }), void (this.bus = e))
      : new TypeError("Bus argument must be instance of Bus");
  }
  (Updater.prototype.html = function () {}),
    (Updater.prototype.blueprint = function () {}),
    (Updater.prototype.cpp = function () {});
  function isIE() {
    var t = document.createElement("div");
    return (
      (t.innerHTML = "\x3c!--[if lte IE 7]>1<![endif]--\x3e"),
      "1" === t.innerHTML ||
        -1 !== window.navigator.userAgent.toUpperCase().indexOf("TRIDENT") ||
        -1 !== window.navigator.userAgent.toUpperCase().indexOf("MSIE")
    );
  }
  function correctionWidth(t) {
    return t.classList.contains("connector-image") ? 5 : 6;
  }
  function correctionHeight(t) {
    return t.classList.contains("connector-image") ? 7 : 6;
  }
  function getLinkColor(t) {
    for (
      var e = [
          { css: "asset", color: "95FFFF" },
          { css: "asset-class", color: "FF95FF" },
          { css: "bool", color: "950000" },
          { css: "byte", color: "006F65" },
          { css: "class", color: "5900BC" },
          { css: "default", color: "E1CCAA" },
          { css: "delegate", color: "FF3838" },
          { css: "exec", color: "FFFFFF" },
          { css: "float", color: "A1FF45" },
          { css: "index", color: "1EE4AF" },
          { css: "int", color: "1EE4AF" },
          { css: "interface", color: "F1FFAA" },
          { css: "name", color: "CD82FF" },
          { css: "object", color: "00AAF5" },
          { css: "rotator", color: "A1B4FF" },
          { css: "string", color: "FF00D5" },
          { css: "struct", color: "0059CC" },
          { css: "text", color: "E87CAA" },
          { css: "transform", color: "FF7300" },
          { css: "vector", color: "FFCA22" },
          { css: "wildcard", color: "817A7A" },
          { css: "audio", color: "FD94FD" },
          { css: "time", color: "95FEFE" },
          { css: "wavetable", color: "C800EB" },
          { css: "real", color: "38D500" },
          { css: "pcg-spatial-data", color: "FFFFFF" },
          { css: "pcg-attribute-set", color: "C8811C" },
          { css: "pcg-point-data", color: "3F89FF" },
          { css: "pcg-poly-line-data", color: "3FE1EA" },
          { css: "pcg-landscape-data", color: "D4D44B" },
          { css: "pcg-texture-data", color: "E65019" },
          { css: "pcg-render-target-data", color: "E77661" },
          { css: "pcg-surface-data", color: "45C47E" },
          { css: "pcg-volume-data", color: "E645BC" },
          { css: "pcg-primitive-data", color: "813FFF" },
          { css: "pcg-concrete-data", color: "B3A6FA" },
          { css: "pcg-any-data", color: "939393" },
        ],
        o = 0,
        a = e.length;
      o < a;
      ++o
    )
      if (t.classList.contains(e[o].css)) return e[o].color;
    return "FFFFFF";
  }
  function Environment(t, e, o) {
    (this.dom = { canvas: null, frame: null, overlay: null, root: t }),
      (this.options = e),
      (this.bus = o),
      (this.eventsBinding = {
        drawNewLink: this.drawNewLink.bind(this),
        moveLink: this.moveLink.bind(this),
        newLink: this.newLink.bind(this),
      }),
      this.bus.listen("draw_new_link", this.drawNewLink.bind(this)),
      this.bus.listen("move_link", this.moveLink.bind(this)),
      this.bus.listen("new_link", this.newLink.bind(this));
  }
  (Environment.prototype.createPlayground = function (t) {
    var e = [],
      o = "CREATE PLAYGROUND...";
    return (
      this.options.height && e.push("height:" + this.options.height),
      isIE() &&
        (o =
          "This website stop supporting Internet Explorer from version 5.5 to 11, consequently you have to use a modern browser."),
      (e = createElems([
        {
          tag: "div",
          classes: ["bue-render"],
          childs: [
            {
              tag: "div",
              classes: ["frame"],
              attrs: [{ name: "style", value: e.join(";") }],
              childs: [
                {
                  tag: "div",
                  classes: ["layer"],
                  childs: [
                    { tag: "div", classes: ["reference"] },
                    { tag: "div", classes: ["canvas"] },
                  ],
                },
                {
                  tag: "div",
                  classes: ["frame-header"],
                  childs: [
                    {
                      tag: "div",
                      classes: ["frame-header__buttons"],
                      childs: [
                        {
                          tag: "div",
                          classes: ["frame-header__buttons-fullscreen"],
                          text: "Fullscreen",
                        },
                        {
                          tag: "div",
                          classes: ["frame-header__buttons-reset"],
                          text: "Reset",
                        },
                      ],
                    },
                    {
                      tag: "div",
                      classes: ["frame-header__breadcrumb"],
                      childs: [
                        {
                          tag: "span",
                          classes: ["frame-header__breadcrumb-item"],
                          attrs: [{ name: "data-node-id", value: "" }],
                          text: "Graph",
                        },
                      ],
                    },
                    {
                      tag: "div",
                      classes: ["frame-header__current-zoom"],
                      text: "Zoom 1:1",
                    },
                  ],
                },
                { tag: "div", classes: ["blueprint-type"], text: t },
                {
                  tag: "div",
                  classes: ["panel"],
                  childs: [
                    {
                      tag: "div",
                      attrs: [
                        { name: "data-feature-panel", value: "debug-infos" },
                      ],
                      childs: [
                        {
                          tag: "label",
                          classes: ["panel__button"],
                          childs: [
                            {
                              tag: "input",
                              attrs: [
                                { name: "type", value: "checkbox" },
                                {
                                  name: "data-feature-panel-checkbox",
                                  value: "",
                                },
                                {
                                  name: "data-feature-panel-name",
                                  value: "debug-infos",
                                },
                              ],
                            },
                            { text: "Show Debug Informations" },
                          ],
                        },
                        { tag: "div", classes: ["panel__infos"] },
                      ],
                    },
                    {
                      tag: "div",
                      attrs: [
                        { name: "data-feature-panel", value: "read-write" },
                      ],
                      childs: [
                        {
                          tag: "label",
                          classes: ["panel__button"],
                          childs: [
                            {
                              tag: "input",
                              attrs: [
                                { name: "type", value: "checkbox" },
                                {
                                  name: "data-feature-panel-checkbox",
                                  value: "",
                                },
                                {
                                  name: "data-feature-panel-name",
                                  value: "read-write",
                                },
                              ],
                            },
                            { text: "Enable Write Mode" },
                          ],
                        },
                      ],
                    },
                    {
                      tag: "div",
                      attrs: [
                        { name: "data-feature-panel", value: "multi-users" },
                      ],
                      childs: [
                        {
                          tag: "label",
                          classes: ["panel__button"],
                          childs: [
                            {
                              tag: "input",
                              attrs: [
                                { name: "type", value: "checkbox" },
                                {
                                  name: "data-feature-panel-checkbox",
                                  value: "",
                                },
                                {
                                  name: "data-feature-panel-name",
                                  value: "multi-users",
                                },
                              ],
                            },
                            { text: "Enable Multi Users" },
                          ],
                        },
                        { tag: "div", classes: ["panel__infos"], text: "soon" },
                      ],
                    },
                    {
                      tag: "div",
                      attrs: [
                        { name: "data-feature-panel", value: "material-viz" },
                      ],
                      childs: [
                        {
                          tag: "label",
                          classes: ["panel__button"],
                          childs: [
                            {
                              tag: "input",
                              attrs: [
                                { name: "type", value: "checkbox" },
                                {
                                  name: "data-feature-panel-checkbox",
                                  value: "",
                                },
                                {
                                  name: "data-feature-panel-name",
                                  value: "material-viz",
                                },
                              ],
                            },
                            { text: "Enable Material Viz" },
                          ],
                        },
                        { tag: "div", classes: ["panel__infos"], text: "soon" },
                      ],
                    },
                    {
                      tag: "div",
                      attrs: [
                        { name: "data-feature-panel", value: "annotations" },
                      ],
                      childs: [
                        {
                          tag: "label",
                          classes: ["panel__button"],
                          childs: [
                            {
                              tag: "input",
                              attrs: [
                                { name: "type", value: "checkbox" },
                                {
                                  name: "data-feature-panel-checkbox",
                                  value: "",
                                },
                                {
                                  name: "data-feature-panel-name",
                                  value: "annotations",
                                },
                              ],
                            },
                            { text: "Enable Annotations" },
                          ],
                        },
                        { tag: "div", classes: ["panel__infos"], text: "soon" },
                      ],
                    },
                  ],
                },
                { tag: "div", classes: ["overlay"], text: o },
              ],
            },
          ],
        },
      ])),
      this.dom.root.appendChild(e[0]),
      (this.dom.frame = this.dom.root.querySelector(".frame")),
      (this.dom.canvas = this.dom.root.querySelector(".canvas")),
      (this.dom.overlay = this.dom.root.querySelector(".overlay")),
      !isIE()
    );
  }),
    (Environment.prototype.cleanViewport = function () {
      for (var t = this.dom.canvas.childNodes.length - 1; 0 <= t; --t)
        this.dom.canvas.childNodes[t].remove();
    }),
    (Environment.prototype.displayNodesInViewport = function (e) {
      for (
        var t, o = document.createDocumentFragment(), a = 0, n = e.length;
        a < n;
        ++a
      )
        try {
          (t = e[a].generateHTML()), o.appendChild(createElems([t])[0]);
        } catch (t) {
          throw (
            (e[a].guid
              ? ((t.message = "NodeGUID " + e[a].guid + ": " + t.message),
                (t.NodeGUID = e[a].guid))
              : ((t.message = "Node #" + a + ": " + t.message),
                (t.NodeIdx = a)),
            t)
          );
        }
      this.dom.canvas.appendChild(o);
    }),
    (Environment.prototype.getCenterCanvas = function () {
      var t = this.dom.canvas.getBoundingClientRect();
      return [(t.width / 2) >> 0, (t.height / 2) >> 0];
    }),
    (Environment.prototype.computeSVGLink = function (t, e, o) {
      var a = null,
        n = null,
        s = 0,
        i = 0,
        r = t.getBoundingClientRect(),
        l = e.getBoundingClientRect(),
        c = this.dom.canvas.getBoundingClientRect(),
        r = { top: r.top + window.scrollY, left: r.left + window.scrollX },
        l = { top: l.top + window.scrollY, left: l.left + window.scrollX },
        d = this.dom.canvas.offsetTop,
        u = this.dom.canvas.offsetLeft,
        p = c.top + window.scrollY,
        c = c.left + window.scrollX;
      return (
        (r.top -= d + p),
        (r.left -= u + c),
        (l.top -= d + p),
        (l.left -= u + c),
        (d = correctionWidth(t)),
        (p = correctionHeight(t)),
        (u = Math.min(r.left, l.left) + d),
        (c = Math.min(r.top, l.top) + p),
        0 ===
          (s = (Math.max(r.left, l.left) - Math.min(r.left, l.left)) >> 0) &&
          (s = 2),
        0 === (i = (Math.max(r.top, l.top) - Math.min(r.top, l.top)) >> 0) &&
          (i = 2),
        (d = getSvgPath(r, l, s, i)),
        (d = correctSvgPathForKnot(d, t, e, r, l, s, i)),
        (a = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        )).classList.add("link"),
        a.setAttribute("data-id", o),
        a.setAttribute(
          "style",
          "transform: translate(" + u + "px, " + c + "px)"
        ),
        a.setAttribute("width", s),
        a.setAttribute("height", i),
        a.setAttribute("pointer-events", "none"),
        a.setAttribute("position", "absolute"),
        (n = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        )).setAttribute("d", d),
        n.setAttribute("transform", ""),
        n.setAttribute("pointer-events", "visibleStroke"),
        n.setAttribute("fill", "none"),
        n.setAttribute("stroke", "#" + getLinkColor(t)),
        n.setAttribute("style", ""),
        n.setAttribute("stroke-width", "2"),
        a.appendChild(n),
        a
      );
    }),
    (Environment.prototype.drawLinks = function (t) {
      for (
        var e,
          o,
          a = document.createDocumentFragment(),
          n = this.dom.canvas.querySelectorAll(".pin .clink.filled"),
          s = {},
          i = 0,
          r = n.length,
          l = 0,
          c = t.length;
        i < r;
        ++i
      )
        s[n[i].closest(".pin").getAttribute("data-id")] = n[i];
      for (; l < c; ++l)
        (e = s[(o = t[l].split(","))[0]] || null),
          (o = s[o[1]] || null),
          null !== e &&
            null !== o &&
            a.appendChild(this.computeSVGLink(e, o, t[l]));
      this.dom.canvas.appendChild(a);
    }),
    (Environment.prototype.reDrawLinks = function (t, e) {
      for (
        var o,
          a,
          n,
          s,
          i = 0,
          r = t.length,
          l = null,
          c = null,
          d = null,
          u = this.dom.frame.getBoundingClientRect(),
          p = {},
          m = {},
          h = 0,
          g = 0;
        i < r;
        ++i
      )
        (a = t[i].split(",")),
          (l = this.dom.canvas.querySelector(
            '.pin[data-id="' + a[0] + '"] .clink'
          )),
          (c = this.dom.canvas.querySelector(
            '.pin[data-id="' + a[1] + '"] .clink'
          )),
          (d = this.dom.canvas.querySelector('svg[data-id="' + t[i] + '"]')),
          null !== l &&
            null !== c &&
            null !== d &&
            ((a = {
              top: this.dom.canvas.offsetTop,
              left: this.dom.canvas.offsetLeft,
            }),
            (s = l.getBoundingClientRect()),
            (o = c.getBoundingClientRect()),
            (n = {
              top: u.top + window.scrollY,
              left: u.left + window.scrollX,
            }),
            (p = {
              top: s.top + window.scrollY,
              left: s.left + window.scrollX,
            }),
            (m = {
              top: o.top + window.scrollY,
              left: o.left + window.scrollX,
            }),
            (p.top -= a.top + n.top),
            (p.left -= a.left + n.left),
            (m.top -= a.top + n.top),
            (m.left -= a.left + n.left),
            (s = correctionWidth(l)),
            (o = correctionHeight(l)),
            (a = Math.min(p.left, m.left) + s),
            (n = Math.min(p.top, m.top) + o),
            0 === (h = Math.max(p.left, m.left) - Math.min(p.left, m.left)) &&
              (h = 2),
            0 === (g = Math.max(p.top, m.top) - Math.min(p.top, m.top)) &&
              (g = 2),
            (s = getSvgPath(p, m, h, g)),
            (s = correctSvgPathForKnot(s, l, c, p, m, h, g)),
            d.querySelector("path").setAttribute("d", s),
            d.setAttribute(
              "style",
              "transform: translate(" + a + "px, " + n + "px)"
            ),
            d.setAttribute("width", h),
            d.setAttribute("height", g));
      "function" == typeof e && e();
    }),
    (Environment.prototype.computeSVGLinkWithMouse = function (t, e, o, a) {
      var n = null,
        s = null,
        i = 0,
        r = 0,
        l = t.getBoundingClientRect(),
        c = this.dom.canvas.getBoundingClientRect(),
        d = c.top + window.scrollY,
        c = c.left + window.scrollX,
        l = {
          top: (l.top + window.scrollY) / a,
          left: (l.left + window.scrollX) / a,
        },
        e = { left: e.pageX / a, top: e.pageY / a };
      return (
        (l.top -= d / a),
        (l.left -= c / a),
        (e.top -= d / a),
        (e.left -= c / a),
        (d = correctionWidth(t)),
        (c = correctionHeight(t)),
        (a = Math.min(l.left, e.left) + d),
        (d = Math.min(l.top, e.top) + c),
        0 ===
          (i = (Math.max(l.left, e.left) - Math.min(l.left, e.left)) >> 0) &&
          (i = 2),
        0 === (r = (Math.max(l.top, e.top) - Math.min(l.top, e.top)) >> 0) &&
          (r = 2),
        (n = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        )).classList.add("link", "moving"),
        n.setAttribute("data-id", o),
        n.setAttribute(
          "style",
          "transform: translate(" + a + "px, " + d + "px)"
        ),
        n.setAttribute("width", i),
        n.setAttribute("height", r),
        n.setAttribute("pointer-events", "none"),
        n.setAttribute("position", "absolute"),
        (s = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        )).setAttribute("d", getSvgPath(l, e, i, r)),
        s.setAttribute("transform", ""),
        s.setAttribute("pointer-events", "visibleStroke"),
        s.setAttribute("fill", "none"),
        s.setAttribute("stroke", "#" + getLinkColor(t)),
        s.setAttribute("style", ""),
        s.setAttribute("stroke-width", "2"),
        n.appendChild(s),
        n
      );
    }),
    (Environment.prototype.drawNewLink = function (t, e, o) {
      (t = t.querySelector(".clink")),
        (t = this.computeSVGLinkWithMouse(t, e, "moving", o));
      this.dom.canvas.appendChild(t);
    }),
    (Environment.prototype.moveLink = function (t, e, o) {
      this.dom.canvas.querySelector("svg.moving").remove(),
        (t = t.querySelector(".clink")),
        (t = this.computeSVGLinkWithMouse(t, e, "moving", o)),
        this.dom.canvas.appendChild(t);
    }),
    (Environment.prototype.newLink = function (t, e) {
      this.dom.canvas.appendChild(this.computeSVGLink(t, e, ""));
    }),
    (Environment.prototype.updateLoading = function (t) {
      this.dom.overlay.textContent = t;
    }),
    (Environment.prototype.removeLoading = function () {
      this.dom.overlay.style.display = "none";
    }),
    (Environment.prototype.showLoading = function () {
      this.dom.overlay.style.display = "";
    }),
    (Environment.prototype.addDataTimerInPlayground = function (t) {
      this.dom.frame.setAttribute(
        "data-parse_blueprint",
        (t.parseBlueprint >> 0).toString()
      ),
        this.dom.frame.setAttribute(
          "data-create_playground",
          (t.createPlayground >> 0).toString()
        ),
        this.dom.frame.setAttribute(
          "data-display_nodes",
          (t.displayNodesInViewport >> 0).toString()
        ),
        this.dom.frame.setAttribute(
          "data-draw_links",
          (t.drawLinks >> 0).toString()
        ),
        this.dom.frame.setAttribute(
          "data-interactions",
          (t.startAllBinding >> 0).toString()
        ),
        this.dom.frame.setAttribute(
          "data-sum",
          (
            (t.parseBlueprint +
              t.createPlayground +
              t.displayNodesInViewport +
              t.drawLinks +
              t.startAllBinding) >>
            0
          ).toString()
        );
    }),
    (Environment.prototype.stop = function () {
      var t = null;
      for (
        this.dom.canvas = null,
          this.dom.frame = null,
          this.dom.overlay = null,
          t = this.dom.root.lastElementChild;
        t;

      )
        this.dom.root.removeChild(t), (t = this.dom.root.lastElementChild);
      this.dom.root = null;
    });
  function Main(t, e, n) {
    var r = {},
      i = null;
    return "string" != typeof t
      ? new TypeError("Argument 'text', expect string, get " + typeof t)
      : e instanceof HTMLElement
      ? ((r = { htmlElement: e, options: n || {}, text: t }),
        (this.start = function (t) {
          i && (i.stop(), (i = null)),
            (i = new Editor(r.text, r.htmlElement, r.options, new Bus())).start(
              t
            );
        }),
        (this.updateBlueprintText = function (t, e) {
          if ("string" != typeof t)
            return new TypeError(
              "Argument 'newBlueprintText', expect string, get " + typeof t
            );
          (r.text = t), i && i.updateBlueprintText(t, e);
        }),
        (this.stop = function () {
          i && (i.stop(), (i = null));
        }),
        (this.getBlueprintData = function () {
          return i.getBlueprintData();
        }),
        void (this.moveTo = function (t, e, n) {
          i.moveTo(t, e, n);
        }))
      : new TypeError(
          "Argument 'htmlElement', expect HTMLElement, get " + typeof e
        );
  }
  Object.freeze(Main.prototype),
    Object.freeze(Main),
    (window.blueprintUE.render.Main = Main);
})();
