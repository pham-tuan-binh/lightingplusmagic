$(document).ready(function () {
  $("#datepicker").datepicker();
  $("#datepicker").datepicker("setDate", "0");
  // $( "#datepicker" ).datepicker("show");

  function CalculateZenitalAbsolutes(turbidity, solar_zenith) {
    var ret = {};

    var Yz =
      (4.0453 * turbidity - 4.971) *
        Math.tan((4 / 9 - turbidity / 120) * (Math.PI - 2 * solar_zenith)) -
      0.2155 * turbidity +
      2.4192;
    //var Y0 = (4.0453 * turbidity - 4.9710) * Math.tan((4/9 - turbidity/120) * (Math.PI)) - 0.2155 * turbidity + 2.4192;
    Y0 = 40;
    ret.Yz = Yz / Y0;

    var z3 = Math.pow(solar_zenith, 3);
    var z2 = Math.pow(solar_zenith, 2);
    var z = solar_zenith;
    var T_vec = [turbidity * turbidity, turbidity, 1.0];

    var x = [
      0.00166 * z3 - 0.00375 * z2 + 0.00209 * z + 0,
      -0.02903 * z3 + 0.06377 * z2 - 0.03202 * z + 0.00394,
      0.11693 * z3 - 0.21196 * z2 + 0.06052 * z + 0.25886,
    ];
    ret.xz = T_vec[0] * x[0] + T_vec[1] * x[1] + T_vec[2] * x[2]; // dot(T_vec, x);

    var y = [
      0.00275 * z3 - 0.0061 * z2 + 0.00317 * z + 0,
      -0.04214 * z3 + 0.0897 * z2 - 0.04153 * z + 0.00516,
      0.15346 * z3 - 0.26756 * z2 + 0.0667 * z + 0.26688,
    ];
    ret.yz = T_vec[0] * y[0] + T_vec[1] * y[1] + T_vec[2] * y[2]; // dot(T_vec, y);

    return ret;
  }

  function CalculateCoefficents(turbidity) {
    var ret = {};

    var coeffsY = {};
    coeffsY.A = 0.1787 * turbidity - 1.463;
    coeffsY.B = -0.3554 * turbidity + 0.4275;
    coeffsY.C = -0.0227 * turbidity + 5.3251;
    coeffsY.D = 0.1206 * turbidity - 2.5771;
    coeffsY.E = -0.067 * turbidity + 0.3703;
    ret.coeffsY = coeffsY;

    var coeffsx = {};
    coeffsx.A = -0.0193 * turbidity - 0.2592;
    coeffsx.B = -0.0665 * turbidity + 0.0008;
    coeffsx.C = -0.0004 * turbidity + 0.2125;
    coeffsx.D = -0.0641 * turbidity - 0.8989;
    coeffsx.E = -0.0033 * turbidity + 0.0452;
    ret.coeffsx = coeffsx;

    var coeffsy = {};
    coeffsy.A = -0.0167 * turbidity - 0.2608;
    coeffsy.B = -0.095 * turbidity + 0.0092;
    coeffsy.C = -0.0079 * turbidity + 0.2102;
    coeffsy.D = -0.0441 * turbidity - 1.6537;
    coeffsy.E = -0.0109 * turbidity + 0.0529;
    ret.coeffsy = coeffsy;

    return ret;
  }

  function Perez(zenith, gamma, coeffs) {
    return (
      (1 + coeffs.A * Math.exp(coeffs.B / Math.cos(zenith))) *
      (1 +
        coeffs.C * Math.exp(coeffs.D * gamma) +
        coeffs.E * Math.pow(Math.cos(gamma), 2))
    );
  }

  function gamma_correct(v) {
    return Math.max(Math.min(Math.pow(v, 1 / 1.8), 1), 0);
  }

  function Yxy_to_RGB(Y, x, y) {
    var X = (x / y) * Y;
    var Z = ((1.0 - x - y) / y) * Y;
    return {
      r: gamma_correct(3.2406 * X - 1.5372 * Y - 0.4986 * Z),
      g: gamma_correct(-0.9689 * X + 1.8758 * Y + 0.0415 * Z),
      b: gamma_correct(0.0557 * X - 0.204 * Y + 1.057 * Z),
    };
  }

  function Gamma(zenith, azimuth, solar_zenith, solar_azimuth) {
    return Math.acos(
      Math.sin(solar_zenith) *
        Math.sin(zenith) *
        Math.cos(azimuth - solar_azimuth) +
        Math.cos(solar_zenith) * Math.cos(zenith)
    );
  }

  function getAverageRGB(imgEl) {
    var blockSize = 5, // only visit every 5 pixels
      defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
      canvas = document.createElement("canvas"),
      context = canvas.getContext && canvas.getContext("2d"),
      data,
      width,
      height,
      i = -4,
      length,
      rgb = { r: 0, g: 0, b: 0 },
      count = 0;

    if (!context) {
      return defaultRGB;
    }

    height = canvas.height =
      imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width =
      imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
      data = context.getImageData(0, 0, width, height);
    } catch (e) {
      /* security error, img on diff domain */
      return defaultRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
      ++count;
      rgb.r += data.data[i];
      rgb.g += data.data[i + 1];
      rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;
  }
  function Calc_Sky_RGB(
    zenith,
    azimuth,
    zen_abs,
    solar_zenith,
    solar_azimuth,
    coeffs_mtx
  ) {
    var gamma = Gamma(zenith, azimuth, solar_zenith, solar_azimuth);
    zenith = Math.min(zenith, Math.PI / 2.0);
    var Yp =
      (zen_abs.Yz * Perez(zenith, gamma, coeffs_mtx.coeffsY)) /
      Perez(0.0, solar_zenith, coeffs_mtx.coeffsY);
    var xp =
      (zen_abs.xz * Perez(zenith, gamma, coeffs_mtx.coeffsx)) /
      Perez(0.0, solar_zenith, coeffs_mtx.coeffsx);
    var yp =
      (zen_abs.yz * Perez(zenith, gamma, coeffs_mtx.coeffsy)) /
      Perez(0.0, solar_zenith, coeffs_mtx.coeffsy);

    return Yxy_to_RGB(Yp, xp, yp);
  }

  function html_rgb(r, g, b) {
    return (
      "rgb(" +
      Math.floor(r * 255) +
      "," +
      Math.floor(g * 255) +
      "," +
      Math.floor(b * 255) +
      ")"
    );
  }

  function scale_range(k, k_min, k_max, v_min, v_max) {
    return ((k - k_min) / (k_max - k_min)) * (v_max - v_min) + v_min;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  function day_of_year(date) {
    var start = new Date(date.getFullYear(), 0, 0);
    var diff = date - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var day = Math.floor(diff / oneDay);
    return day;
  }

  var timer = 0;

  var refreshId = setInterval(function () {
    timer = timer + 0.25;

    var turbidity = parseFloat($("#turbidity").val());
    var longitude = deg2rad(parseFloat($("#longitude").val()));
    var latitude = deg2rad(parseFloat($("#latitude").val()));
    var time_zone_meridian = deg2rad(parseFloat($("#tz_sm").val()));
    var date = $("#datepicker").datepicker("getDate");

    var tz_offset = Math.floor(time_zone_meridian / deg2rad(15) + 0.5);

    var julian = day_of_year(date);
    total_hours_today = timer % 24;

    time_str =
      Math.floor(total_hours_today) +
      ":" +
      Math.floor((total_hours_today - Math.floor(total_hours_today)) * 60);
    $("#curtime").val(time_str);

    var solar_time =
      total_hours_today +
      0.17 * Math.sin((4 * Math.PI * (julian - 80)) / 373) -
      0.129 * Math.sin((2 * Math.PI * (julian - 8)) / 355) +
      (12 * (time_zone_meridian - longitude)) / Math.PI;

    var declination = 0.4093 * Math.sin((2 * Math.PI * (julian - 81)) / 368);

    var sin_l = Math.sin(latitude);
    var cos_l = Math.cos(latitude);
    var sin_d = Math.sin(declination);
    var cos_d = Math.cos(declination);
    var cos_pi_t_12 = Math.cos((Math.PI * solar_time) / 12);
    var sin_pi_t_12 = Math.sin((Math.PI * solar_time) / 12);
    var solar_zenith =
      Math.PI / 2 - Math.asin(sin_l * sin_d - cos_l * cos_d * cos_pi_t_12);
    var solar_azimuth = Math.atan2(
      -cos_d * sin_pi_t_12,
      cos_l * sin_d - sin_l * cos_d * cos_pi_t_12
    );

    zen_abs = CalculateZenitalAbsolutes(turbidity, solar_zenith);
    coeffs_mtx = CalculateCoefficents(turbidity);

    // Visualize
    var canvas = document.getElementById("sky");
    var colorAverage = document.getElementById("avg-color");
    canvas.style.filter = "blur(3px) saturate(150%)";
    var ctx = canvas.getContext("2d");

    var resolution_x = 640;
    var resolution_y = 240;
    var scale_x = canvas.width;
    var scale_y = canvas.height;

    var cavg = getAverageRGB(canvas);

    console.log(`rgb(${cavg.r},${cavg.g},${cavg.b})`);

    colorAverage.value = `rgb(${cavg.r},${cavg.g},${cavg.b})`;
    colorAverage.style.backgroundColor = `rgb(${cavg.r},${cavg.g},${cavg.b})`;

    for (var row = 0; row < 1; row += 1 / resolution_y) {
      for (var col = 0; col < 1; col += 1 / resolution_x) {
        azimuth = deg2rad(scale_range(col, 0, 1, -180, 180));
        zenith = deg2rad(scale_range(row, 0, 1, 0, 90));

        var rgb = Calc_Sky_RGB(
          zenith,
          azimuth,
          zen_abs,
          solar_zenith,
          solar_azimuth,
          coeffs_mtx
        );
        ctx.fillStyle = html_rgb(rgb.r, rgb.g, rgb.b);

        // coordinates of the top-left corner
        var y = row * scale_y;
        var x = col * scale_x;
        ctx.fillRect(x, y, scale_x / resolution_x, scale_y / resolution_y);
      }
    }

    //    $('#img-container').load('images/gallery/best/random.php?'+r);
  }, 100);
});