$(document).ready(() => {
  function t(t, a) {
    let e = {},
      o =
        (4.0453 * t - 4.971) * Math.tan((4 / 9 - t / 120) * (Math.PI - 2 * a)) -
        0.2155 * t +
        2.4192,
      l =
        (4.0453 * t - 4.971) * Math.tan((4 / 9 - t / 120) * Math.PI) -
        0.2155 * t +
        2.4192;
    e.Yz = o / l;
    let h = Math.pow(a, 3),
      r = Math.pow(a, 2),
      n = a,
      M = [t * t, t, 1],
      s = [
        0.00166 * h - 0.00375 * r + 0.00209 * n + 0,
        -0.02903 * h + 0.06377 * r - 0.03202 * n + 0.00394,
        0.11693 * h - 0.21196 * r + 0.06052 * n + 0.25886,
      ];
    e.xz = M[0] * s[0] + M[1] * s[1] + M[2] * s[2];
    let i = [
      0.00275 * h - 0.0061 * r + 0.00317 * n + 0,
      -0.04214 * h + 0.0897 * r - 0.04153 * n + 0.00516,
      0.15346 * h - 0.26756 * r + 0.0667 * n + 0.26688,
    ];
    return (e.yz = M[0] * i[0] + M[1] * i[1] + M[2] * i[2]), e;
  }
  function a(t) {
    let a = {},
      e = {};
    (e.A = 0.1787 * t - 1.463),
      (e.B = -0.3554 * t + 0.4275),
      (e.C = -0.0227 * t + 5.3251),
      (e.D = 0.1206 * t - 2.5771),
      (e.E = -0.067 * t + 0.3703),
      (a.coeffsY = e);
    let o = {};
    (o.A = -0.0193 * t - 0.2592),
      (o.B = -0.0665 * t + 8e-4),
      (o.C = -4e-4 * t + 0.2125),
      (o.D = -0.0641 * t - 0.8989),
      (o.E = -0.0033 * t + 0.0452),
      (a.coeffsx = o);
    let l = {};
    return (
      (l.A = -0.0167 * t - 0.2608),
      (l.B = -0.095 * t + 0.0092),
      (l.C = -0.0079 * t + 0.2102),
      (l.D = -0.0441 * t - 1.6537),
      (l.E = -0.0109 * t + 0.0529),
      (a.coeffsy = l),
      a
    );
  }
  function e(t, a, e) {
    return (
      (1 + e.A * Math.exp(e.B / Math.cos(t))) *
      (1 + e.C * Math.exp(e.D * a) + e.E * Math.pow(Math.cos(a), 2))
    );
  }
  function o(t) {
    return Math.max(Math.min(Math.pow(t, 1 / 1.8), 1), 0);
  }
  function l(t, a, l, h, r, n) {
    let M = (function (t, a, e, o) {
      return Math.acos(
        Math.sin(e) * Math.sin(t) * Math.cos(a - o) + Math.cos(e) * Math.cos(t)
      );
    })(t, a, h, r);
    return (
      (t = Math.min(t, Math.PI / 2)),
      (function (t, a, e) {
        let l = a * (t / e),
          h = (t / e) * (1 - a - e);
        return {
          r: o(3.2406 * l - 1.5372 * t - 0.4986 * h) || "0",
          g: o(-0.9689 * l + 1.8758 * t + 0.0415 * h) || "0",
          b: o(0.0557 * l - 0.204 * t + 1.057 * h) || "0",
        };
      })(
        (l.Yz * e(t, M, n.coeffsY)) / e(0, h, n.coeffsY),
        (l.xz * e(t, M, n.coeffsx)) / e(0, h, n.coeffsx),
        (l.yz * e(t, M, n.coeffsy)) / e(0, h, n.coeffsy)
      )
    );
  }
  function h(t, a, e, o, l) {
    return ((t - a) / (e - a)) * (l - o) + o;
  }
  function r(t) {
    return t * (Math.PI / 180);
  }
  function n(t) {
    let a = t - new Date(t.getFullYear(), 0, 0);
    return Math.floor(a / 864e5);
  }
  function M(e) {
    let o = parseFloat($("#turbidity").val()),
      h = r(parseFloat($("#longitude").val())),
      M = r(parseFloat($("#latitude").val())),
      s = r(15 * parseFloat($("#tz_sm").val())),
      i = n($("#datepicker").datepicker("getDate")),
      f = e % 24,
      c =
        (Math.floor(f) < 10 ? "0" + Math.floor(f) : Math.floor(f)) +
        ":" +
        Math.floor(60 * (f - Math.floor(f)));
    $("#curtime").val(c);
    let u =
        f +
        0.17 * Math.sin((4 * Math.PI * (i - 80)) / 373) -
        0.129 * Math.sin((2 * Math.PI * (i - 8)) / 355) +
        (12 * (s - h)) / Math.PI,
      d = 0.4093 * Math.sin((2 * Math.PI * (i - 81)) / 368),
      p = Math.sin(M),
      m = Math.cos(M),
      z = Math.sin(d),
      g = Math.cos(d),
      I = Math.cos((Math.PI * u) / 12),
      v = Math.sin((Math.PI * u) / 12),
      P = Math.PI / 2 - Math.asin(p * z - m * g * I),
      b = Math.atan2(-g * v, m * z - p * g * I);
    (zen_abs = t(o, P)),
      (coeffs_mtx = a(o)),
      (azimuth = r(-180)),
      (zenith = r(0));
    let x = l(zenith, azimuth, zen_abs, P, b, coeffs_mtx);
    return [
      Math.floor(255 * x.r),
      Math.floor(255 * x.g),
      Math.floor(255 * x.b),
    ];
  }
  let s = 0;
  (onmessage = function (e) {
    switch (e.data) {
      case "render":
        (function (e) {
          let o = parseFloat($("#turbidity").val()),
            M = r(parseFloat($("#longitude").val())),
            s = r(parseFloat($("#latitude").val())),
            i = r(15 * parseFloat($("#tz_sm").val())),
            f = n($("#datepicker").datepicker("getDate")),
            c = e % 24,
            u =
              (Math.floor(c) < 10 ? "0" + Math.floor(c) : Math.floor(c)) +
              ":" +
              Math.floor(60 * (c - Math.floor(c)));
          $("#curtime").val(u);
          let d =
              c +
              0.17 * Math.sin((4 * Math.PI * (f - 80)) / 373) -
              0.129 * Math.sin((2 * Math.PI * (f - 8)) / 355) +
              (12 * (i - M)) / Math.PI,
            p = 0.4093 * Math.sin((2 * Math.PI * (f - 81)) / 368),
            m = Math.sin(s),
            z = Math.cos(s),
            g = Math.sin(p),
            I = Math.cos(p),
            v = Math.cos((Math.PI * d) / 12),
            P = Math.sin((Math.PI * d) / 12),
            b = Math.PI / 2 - Math.asin(m * g - z * I * v),
            x = Math.atan2(-I * P, z * g - m * I * v);
          (zen_abs = t(o, b)), (coeffs_mtx = a(o));
          let y = document.getElementById("sky");
          y.style.filter = "blur(3px)";
          let F = y.getContext("2d"),
            _ = y.width,
            k = y.height;
          for (let t = 0; t < 1; t += 0.025)
            for (let a = 0; a < 1; a += 1 / 60) {
              (azimuth = r(h(a, 0, 1, -180, 180))),
                (zenith = r(h(t, 0, 1, 0, 90)));
              let e = l(zenith, azimuth, zen_abs, b, x, coeffs_mtx);
              F.fillStyle =
                ((D = e.r),
                (w = e.g),
                (B = e.b),
                "rgb(" +
                  Math.floor(255 * D) +
                  "," +
                  Math.floor(255 * w) +
                  "," +
                  Math.floor(255 * B) +
                  ")");
              let o = t * k,
                n = a * _;
              F.fillRect(n, o, _ / 60, k / 40);
            }
          var D, w, B;
        })((s += 0.02));
        break;
      case "data":
        !(function () {
          let t = {
            turbidity: parseFloat($("#turbidity").val()),
            longitude: parseFloat($("#longitude").val()),
            latitude: parseFloat($("#latitude").val()),
            timeZone: parseFloat($("#tz_sm").val()),
            date: $("#datepicker").datepicker("getDate"),
            data: [],
          };
          for (let a = 0; a < 24; a += 1.5) {
            let e =
              (Math.floor(a) < 10 ? "0" + Math.floor(a) : Math.floor(a)) +
              ":" +
              (Math.floor(60 * (a - Math.floor(a))) < 10
                ? "0" + Math.floor(60 * (a - Math.floor(a)))
                : Math.floor(60 * (a - Math.floor(a))));
            t.data.push({ time: e, color: M(a) });
          }
          var a = new Blob([JSON.stringify(t, null, 2)]);
          saveAs(
            a,
            (Math.random().toString(36) + "00000000000000000").slice(2, 10) +
              ".solarpreset"
          );
        })();
    }
  }),
    setInterval(() => {
      postMessage("render");
    }, 10),
    $("#exportData").click(() => {
      postMessage("data");
    });
});
