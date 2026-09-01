/**
 * BEPCal - Kalkulator Titik Impas (Break-Even Point) UMKM
 * Master Application Script
 * Pure Vanilla JavaScript (Client-Side, No External Dependencies)
 */

(function () {
  'use strict';

  // --- STATE MANAGEMENT ---
  const state = {
    fixedCost: 6000000,       // Default: Rp 6.000.000
    sellingPrice: 22000,      // Default: Rp 22.000
    variableCost: 9000,       // Default: Rp 9.000
    targetProfit: 3000000,    // Default: Rp 3.000.000
    estimatedUnits: 650,      // Default: 650 Unit
    theme: 'dark',

    // Itemizer Default Lists
    fixedItems: [
      { name: 'Sewa Bar / Kios Bulanan', amount: 2500000 },
      { name: 'Gaji 1 Barista', amount: 2500000 },
      { name: 'Listrik & Wi-Fi', amount: 700000 },
      { name: 'Iuran Kebersihan & Alat', amount: 300000 }
    ],
    varItems: [
      { name: 'Biji Kopi Espresso Blend', amount: 3500 },
      { name: 'Fresh Milk / Oat Milk', amount: 3000 },
      { name: 'Gula Aren & Perasa', amount: 1000 },
      { name: 'Cup Sablon, Tutup & Sedotan', amount: 1500 }
    ]
  };

  // Preset Configurations for Popular Indonesian UMKM
  const PRESETS = {
    kopi: {
      fixedCost: 6000000,
      sellingPrice: 22000,
      variableCost: 9000,
      targetProfit: 3000000,
      estimatedUnits: 650,
      fixedItems: [
        { name: 'Sewa Bar / Kios Bulanan', amount: 2500000 },
        { name: 'Gaji 1 Barista', amount: 2500000 },
        { name: 'Listrik & Wi-Fi', amount: 700000 },
        { name: 'Iuran Kebersihan & Alat', amount: 300000 }
      ],
      varItems: [
        { name: 'Biji Kopi Espresso Blend', amount: 3500 },
        { name: 'Fresh Milk / Oat Milk', amount: 3000 },
        { name: 'Gula Aren & Perasa', amount: 1000 },
        { name: 'Cup Sablon, Tutup & Sedotan', amount: 1500 }
      ]
    },
    kaos: {
      fixedCost: 4500000,
      sellingPrice: 95000,
      variableCost: 48000,
      targetProfit: 5000000,
      estimatedUnits: 150,
      fixedItems: [
        { name: 'Sewa Workshop Sablon', amount: 2000000 },
        { name: 'Gaji Operator Cetak', amount: 2000000 },
        { name: 'Listrik & Kuota Promosi', amount: 500000 }
      ],
      varItems: [
        { name: 'Kaos Polos Cotton Combed 24s/30s', amount: 32000 },
        { name: 'Tinta Plastisol & Finishing Cetak', amount: 9000 },
        { name: 'Hangtag, Stiker & Plastik Zipper', amount: 4000 },
        { name: 'Komisi Marketplace / Ongkir Packing', amount: 3000 }
      ]
    },
    bakery: {
      fixedCost: 8000000,
      sellingPrice: 35000,
      variableCost: 14000,
      targetProfit: 6000000,
      estimatedUnits: 500,
      fixedItems: [
        { name: 'Sewa Dapur & Kios Display', amount: 3500000 },
        { name: 'Gaji Baker & Asisten', amount: 3500000 },
        { name: 'Gas Elpiji & Listrik Oven', amount: 1000000 }
      ],
      varItems: [
        { name: 'Tepung Terigu, Mentega & Telur', amount: 8500 },
        { name: 'Isian Cokelat, Keju & Topping', amount: 3500 },
        { name: 'Kotak Kue & Pita Kemasan', amount: 2000 }
      ]
    },
    laundry: {
      fixedCost: 3500000,
      sellingPrice: 40000,
      variableCost: 12000,
      targetProfit: 3000000,
      estimatedUnits: 180,
      fixedItems: [
        { name: 'Sewa Kios Laundry', amount: 1500000 },
        { name: 'Gaji Tenaga Cuci & Treatment', amount: 1600000 },
        { name: 'Listrik, Air & Promosi Medsos', amount: 400000 }
      ],
      varItems: [
        { name: 'Sabun Khusus Shoe Cleaner & Parfume', amount: 4500 },
        { name: 'Plastik Ziplock, Silica Gel & Tag', amount: 3500 },
        { name: 'Penyusutan Sikat & Mikrofiber', amount: 2000 },
        { name: 'Bonus Pengerjaan Cepat', amount: 2000 }
      ]
    }
  };

  // --- HELPER UTILITIES ---

  /**
   * Format number as Indonesian Currency (e.g. 5000000 -> "5.000.000")
   */
  function formatNumber(num) {
    if (isNaN(num) || num === null || num === undefined) return '0';
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /**
   * Format with Rp prefix
   */
  function formatRp(num) {
    return 'Rp ' + formatNumber(num);
  }

  /**
   * Parse input string containing digits and dots to standard integer
   */
  function parseRupiahInput(val) {
    if (!val) return 0;
    const digitsOnly = val.toString().replace(/\D/g, '');
    return parseInt(digitsOnly, 10) || 0;
  }

  /**
   * Bind auto-formatting mask on typing for currency inputs
   */
  function bindCurrencyMask(inputElement, onUpdateCallback) {
    if (!inputElement) return;

    inputElement.addEventListener('input', function () {
      const rawVal = parseRupiahInput(this.value);
      this.value = rawVal > 0 ? formatNumber(rawVal) : '';
      if (onUpdateCallback) onUpdateCallback(rawVal);
    });

    inputElement.addEventListener('blur', function () {
      const rawVal = parseRupiahInput(this.value);
      this.value = rawVal > 0 ? formatNumber(rawVal) : '0';
    });
  }

  // --- DOM ELEMENTS REFERENCE ---
  let el = {};

  function initDomRefs() {
    el = {
      // Inputs
      fixedCost: document.getElementById('fixedCost'),
      sellingPrice: document.getElementById('sellingPrice'),
      variableCost: document.getElementById('variableCost'),
      targetProfit: document.getElementById('targetProfit'),
      estimatedUnits: document.getElementById('estimatedUnits'),
      costWarning: document.getElementById('costWarning'),

      // Accordion
      btnToggleAdvanced: document.getElementById('btnToggleAdvanced'),
      advancedPanel: document.getElementById('advancedPanel'),

      // Presets
      presetPills: document.querySelectorAll('.preset-pill'),

      // Main Outputs
      outBepUnit: document.getElementById('outBepUnit'),
      outDailyUnit: document.getElementById('outDailyUnit'),
      valDailyUnit: document.getElementById('valDailyUnit'),
      outBepRupiah: document.getElementById('outBepRupiah'),
      outDailyRupiah: document.getElementById('outDailyRupiah'),
      valDailyRupiah: document.getElementById('valDailyRupiah'),

      // Sub-metric Outputs
      outUnitMargin: document.getElementById('outUnitMargin'),
      outUnitMarginDesc: document.getElementById('outUnitMarginDesc'),
      outMarginRatio: document.getElementById('outMarginRatio'),
      outTargetUnits: document.getElementById('outTargetUnits'),
      outTargetUnitsDesc: document.getElementById('outTargetUnitsDesc'),
      outMarginSafety: document.getElementById('outMarginSafety'),
      outMarginSafetyDesc: document.getElementById('outMarginSafetyDesc'),

      // Chart & Zone labels
      chartWrapper: document.getElementById('chartWrapper'),
      bepChart: document.getElementById('bepChart'),
      chartTooltip: document.getElementById('chartTooltip'),
      ttVolume: document.getElementById('ttVolume'),
      ttRevenue: document.getElementById('ttRevenue'),
      ttCost: document.getElementById('ttCost'),
      ttProfit: document.getElementById('ttProfit'),
      ttProfitLabel: document.getElementById('ttProfitLabel'),
      lblLossMax: document.getElementById('lblLossMax'),
      lblProfitMin: document.getElementById('lblProfitMin'),

      // Table
      tableSensitivityBody: document.getElementById('tableSensitivityBody'),

      // Header buttons
      btnThemeToggle: document.getElementById('btnThemeToggle'),
      btnResetAll: document.getElementById('btnResetAll'),
      btnPrintReport: document.getElementById('btnPrintReport'),

      // Modals
      modalFixedCost: document.getElementById('modalFixedCost'),
      btnOpenFixedItemizer: document.getElementById('btnOpenFixedItemizer'),
      btnCloseFixedModal: document.getElementById('btnCloseFixedModal'),
      btnCancelFixedModal: document.getElementById('btnCancelFixedModal'),
      btnApplyFixedModal: document.getElementById('btnApplyFixedModal'),
      fixedItemsList: document.getElementById('fixedItemsList'),
      btnAddFixedRow: document.getElementById('btnAddFixedRow'),
      modalFixedTotal: document.getElementById('modalFixedTotal'),

      modalVarCost: document.getElementById('modalVarCost'),
      btnOpenVarItemizer: document.getElementById('btnOpenVarItemizer'),
      btnCloseVarModal: document.getElementById('btnCloseVarModal'),
      btnCancelVarModal: document.getElementById('btnCancelVarModal'),
      btnApplyVarModal: document.getElementById('btnApplyVarModal'),
      varItemsList: document.getElementById('varItemsList'),
      btnAddVarRow: document.getElementById('btnAddVarRow'),
      modalVarTotal: document.getElementById('modalVarTotal'),

      // Print Container Elements
      printDate: document.getElementById('printDate'),
      printValFixed: document.getElementById('printValFixed'),
      printValPrice: document.getElementById('printValPrice'),
      printValVar: document.getElementById('printValVar'),
      printValMargin: document.getElementById('printValMargin'),
      printValRatio: document.getElementById('printValRatio'),
      printValBepUnit: document.getElementById('printValBepUnit'),
      printValBepRupiah: document.getElementById('printValBepRupiah'),
      printTableBody: document.getElementById('printTableBody')
    };
  }

  // --- CORE FINANCIAL CALCULATIONS ---

  function calculateBEP() {
    const fixed = state.fixedCost || 0;
    const price = state.sellingPrice || 0;
    const variable = state.variableCost || 0;
    const targetProfit = state.targetProfit || 0;
    const estimatedUnits = state.estimatedUnits || 0;

    // Unit Contribution Margin = Price - Variable Cost
    const unitMargin = price - variable;
    const isDeficit = unitMargin <= 0;

    // Show / Hide Deficit Warning
    if (el.costWarning) {
      if (isDeficit && price > 0) {
        el.costWarning.style.display = 'flex';
      } else {
        el.costWarning.style.display = 'none';
      }
    }

    if (isDeficit || fixed <= 0 || price <= 0) {
      renderZeroState(isDeficit);
      return;
    }

    // 1. BEP in Units = Fixed Cost / Unit Contribution Margin
    const bepUnitRaw = fixed / unitMargin;
    const bepUnit = Math.ceil(bepUnitRaw); // Round up to next whole unit for practical business

    // 2. BEP in Rupiah = BEP Unit * Selling Price
    const bepRupiah = bepUnit * price;

    // 3. Contribution Margin Ratio = Unit Margin / Selling Price
    const marginRatio = (unitMargin / price) * 100;

    // 4. Daily approximations (assuming 30 operational days per month)
    const dailyUnit = (bepUnit / 30).toFixed(1);
    const dailyRupiah = Math.round(bepRupiah / 30);

    // 5. Target Profit Units (if target is set)
    let targetUnits = null;
    if (targetProfit > 0) {
      targetUnits = Math.ceil((fixed + targetProfit) / unitMargin);
    }

    // 6. Margin of Safety (if estimated sales is set)
    let marginOfSafetyPct = null;
    if (estimatedUnits > 0) {
      marginOfSafetyPct = (((estimatedUnits - bepUnit) / estimatedUnits) * 100).toFixed(1);
    }

    // Update DOM Display
    if (el.outBepUnit) el.outBepUnit.textContent = formatNumber(bepUnit);
    if (el.valDailyUnit) el.valDailyUnit.textContent = dailyUnit;
    if (el.outBepRupiah) el.outBepRupiah.textContent = formatRp(bepRupiah);
    if (el.valDailyRupiah) el.valDailyRupiah.textContent = formatRp(dailyRupiah);

    if (el.outUnitMargin) el.outUnitMargin.textContent = formatRp(unitMargin);
    if (el.outUnitMarginDesc) el.outUnitMarginDesc.textContent = `Laba kotor ${formatRp(unitMargin)} per unit untuk menutup Biaya Tetap`;

    if (el.outMarginRatio) el.outMarginRatio.textContent = marginRatio.toFixed(1) + '%';
    if (el.outMarginRatioDesc) el.outMarginRatioDesc.textContent = `Setiap Rp 100 omzet, tersedia Rp ${marginRatio.toFixed(1)} untuk operasional`;

    if (el.outTargetUnits) {
      if (targetUnits !== null) {
        el.outTargetUnits.textContent = formatNumber(targetUnits) + ' Unit';
        if (el.outTargetUnitsDesc) el.outTargetUnitsDesc.textContent = `Untuk mencapai laba bersih ${formatRp(targetProfit)}`;
      } else {
        el.outTargetUnits.textContent = '-';
        if (el.outTargetUnitsDesc) el.outTargetUnitsDesc.textContent = 'Isi kolom target laba di panel kiri';
      }
    }

    if (el.outMarginSafety) {
      if (marginOfSafetyPct !== null) {
        const mosVal = parseFloat(marginOfSafetyPct);
        el.outMarginSafety.textContent = (mosVal >= 0 ? '+' : '') + marginOfSafetyPct + '%';
        if (mosVal >= 0) {
          el.outMarginSafety.style.color = 'var(--accent-emerald)';
          if (el.outMarginSafetyDesc) el.outMarginSafetyDesc.textContent = `Penjualan aman turun hingga ${marginOfSafetyPct}% sebelum mulai rugi`;
        } else {
          el.outMarginSafety.style.color = 'var(--color-loss)';
          if (el.outMarginSafetyDesc) el.outMarginSafetyDesc.textContent = 'Target kapasitas saat ini masih di bawah Titik Impas';
        }
      } else {
        el.outMarginSafety.textContent = '-';
        el.outMarginSafety.style.color = 'var(--text-primary)';
        if (el.outMarginSafetyDesc) el.outMarginSafetyDesc.textContent = 'Isi estimasi penjualan di panel kiri';
      }
    }

    if (el.lblLossMax) el.lblLossMax.textContent = formatNumber(bepUnit);
    if (el.lblProfitMin) el.lblProfitMin.textContent = formatNumber(bepUnit);

    // Render Dynamic SVG Chart
    renderChart(bepUnit, bepRupiah, fixed, price, variable, estimatedUnits);

    // Render Sensitivity Matrix
    renderSensitivityTable(bepUnit, fixed, price, variable, estimatedUnits);
  }

  function renderZeroState(isDeficit) {
    if (el.outBepUnit) el.outBepUnit.textContent = isDeficit ? 'N/A' : '0';
    if (el.valDailyUnit) el.valDailyUnit.textContent = '0';
    if (el.outBepRupiah) el.outBepRupiah.textContent = isDeficit ? 'N/A' : 'Rp 0';
    if (el.valDailyRupiah) el.valDailyRupiah.textContent = 'Rp 0';
    if (el.outUnitMargin) el.outUnitMargin.textContent = 'Rp 0';
    if (el.outMarginRatio) el.outMarginRatio.textContent = '0%';
    if (el.outTargetUnits) el.outTargetUnits.textContent = '-';
    if (el.outMarginSafety) el.outMarginSafety.textContent = '-';
    if (el.lblLossMax) el.lblLossMax.textContent = '0';
    if (el.lblProfitMin) el.lblProfitMin.textContent = '0';

    renderEmptyChart();
    if (el.tableSensitivityBody) {
      el.tableSensitivityBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 1.5rem; color: var(--text-muted);">
            Masukkan parameter biaya tetap, harga jual, dan biaya variabel untuk melihat simulasi.
          </td>
        </tr>
      `;
    }
  }

  // --- DYNAMIC SVG CHART GENERATOR ---

  let chartDataStore = null;

  function renderChart(bepUnit, bepRupiah, fixedCost, price, varCost, estimatedUnits) {
    const svg = el.bepChart;
    if (!svg) return;

    const w = 760;
    const h = 360;
    const pad = { top: 30, right: 35, bottom: 45, left: 90 };

    const graphW = w - pad.left - pad.right;
    const graphH = h - pad.top - pad.bottom;

    // Max X: Scaling to show BEP in the comfortable middle (1.8x to 2.2x BEP)
    const maxX = Math.max(Math.ceil(bepUnit * 2), Math.ceil((estimatedUnits || 0) * 1.3), 50);
    // Max Y: Total Revenue at Max X
    const maxY = Math.ceil(maxX * price * 1.1);

    // Coordinate Mapping Helpers
    function getX(units) {
      return pad.left + (units / maxX) * graphW;
    }

    function getY(rupiah) {
      return pad.top + graphH - (rupiah / maxY) * graphH;
    }

    chartDataStore = {
      bepUnit,
      bepRupiah,
      fixedCost,
      price,
      varCost,
      maxX,
      maxY,
      pad,
      graphW,
      graphH,
      getX,
      getY
    };

    // Calculate Key Coordinates
    const bepX = getX(bepUnit);
    const bepY = getY(bepRupiah);

    const fixedY = getY(fixedCost);
    const costEndX = getX(maxX);
    const costEndY = getY(fixedCost + (maxX * varCost));
    const revEndX = getX(maxX);
    const revEndY = getY(maxX * price);

    const xSteps = 5;
    const ySteps = 5;

    let svgHtml = `
      <!-- Defs & Gradients -->
      <defs>
        <!-- Loss Area Gradient -->
        <linearGradient id="gradLoss" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color: #f43f5e; stop-opacity: 0.30;"/>
          <stop offset="100%" style="stop-color: #f43f5e; stop-opacity: 0.04;"/>
        </linearGradient>

        <!-- Profit Area Gradient -->
        <linearGradient id="gradProfit" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color: #10b981; stop-opacity: 0.32;"/>
          <stop offset="100%" style="stop-color: #10b981; stop-opacity: 0.05;"/>
        </linearGradient>
      </defs>

      <!-- Background Gridlines & Axis Values -->
      <g class="chart-grid-group">
    `;

    // Horizontal Y Gridlines
    for (let i = 0; i <= ySteps; i++) {
      const valY = (maxY / ySteps) * i;
      const py = getY(valY);
      let labelText = '';
      if (valY >= 1000000) {
        labelText = 'Rp ' + (valY / 1000000).toFixed(1) + ' jt';
      } else if (valY >= 1000) {
        labelText = 'Rp ' + (valY / 1000).toFixed(0) + ' rb';
      } else {
        labelText = 'Rp ' + valY.toFixed(0);
      }

      svgHtml += `
        <line x1="${pad.left}" y1="${py}" x2="${w - pad.right}" y2="${py}" class="chart-grid-line" />
        <text x="${pad.left - 10}" y="${py + 4}" text-anchor="end" class="chart-axis-text">${labelText}</text>
      `;
    }

    // Vertical X Gridlines
    for (let i = 0; i <= xSteps; i++) {
      const valX = Math.round((maxX / xSteps) * i);
      const px = getX(valX);
      svgHtml += `
        <line x1="${px}" y1="${pad.top}" x2="${px}" y2="${h - pad.bottom}" class="chart-grid-line" />
        <text x="${px}" y="${h - pad.bottom + 18}" text-anchor="middle" class="chart-axis-text">${formatNumber(valX)} u</text>
      `;
    }

    svgHtml += `</g>`;

    // Shaded Loss Area: Polygon from (0, fixedCost) to (bepUnit, bepRev) down to (0, 0)
    const lossPoly = `${getX(0)},${getY(fixedCost)} ${bepX},${bepY} ${getX(0)},${getY(0)}`;
    svgHtml += `
      <!-- Loss Zone Polygon -->
      <polygon points="${lossPoly}" fill="url(#gradLoss)" />
    `;

    // Shaded Profit Area: Polygon from (bepUnit, bepRev) to (maxX, revEnd) to (maxX, costEnd)
    const profitPoly = `${bepX},${bepY} ${revEndX},${revEndY} ${costEndX},${costEndY}`;
    svgHtml += `
      <!-- Profit Zone Polygon -->
      <polygon points="${profitPoly}" fill="url(#gradProfit)" />
    `;

    // Line 1: Fixed Cost (Horizontal dashed line)
    svgHtml += `
      <line x1="${pad.left}" y1="${fixedY}" x2="${w - pad.right}" y2="${fixedY}" class="chart-line-fixed" />
    `;

    // Line 2: Total Cost Line (Starting from Fixed Cost)
    svgHtml += `
      <line x1="${pad.left}" y1="${fixedY}" x2="${costEndX}" y2="${costEndY}" class="chart-line-cost" />
    `;

    // Line 3: Total Revenue Line (Starting from 0,0)
    svgHtml += `
      <line x1="${pad.left}" y1="${getY(0)}" x2="${revEndX}" y2="${revEndY}" class="chart-line-revenue" />
    `;

    // BEP Intersection Point with Halo Pulse
    svgHtml += `
      <!-- BEP Point Marker -->
      <g class="bep-intersection-marker">
        <circle cx="${bepX}" cy="${bepY}" r="12" class="bep-point-halo" />
        <circle cx="${bepX}" cy="${bepY}" r="6" class="bep-point-circle" />
        <text x="${bepX}" y="${bepY - 14}" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="11" font-weight="700" style="fill: var(--text-primary);">
          BEP (${formatNumber(bepUnit)} Unit)
        </text>
      </g>
    `;

    // Cursor Vertical Tracker Line (hidden by default)
    svgHtml += `
      <g id="trackerGroup" style="display: none;">
        <line id="trackerLine" x1="0" y1="${pad.top}" x2="0" y2="${h - pad.bottom}" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 3"/>
        <circle id="trackerDotRev" cx="0" cy="0" r="4" fill="#10b981"/>
        <circle id="trackerDotCost" cx="0" cy="0" r="4" fill="#f43f5e"/>
      </g>
    `;

    svg.innerHTML = svgHtml;
  }

  function renderEmptyChart() {
    const svg = el.bepChart;
    if (!svg) return;
    svg.innerHTML = `
      <rect x="0" y="0" width="760" height="360" fill="transparent" />
      <text x="380" y="180" text-anchor="middle" fill="#94a3b8" font-family="'Plus Jakarta Sans', sans-serif" font-size="14">
        Grafik Titik Impas akan muncul setelah data diisi dengan benar.
      </text>
    `;
  }

  // --- CHART HOVER INTERACTION ENGINE ---

  function attachChartHoverListeners() {
    const wrapper = el.chartWrapper;
    const svg = el.bepChart;
    const tooltip = el.chartTooltip;
    if (!wrapper || !svg || !tooltip) return;

    function handleMove(clientX, clientY) {
      if (!chartDataStore) return;

      // 1. Exact SVG Coordinate Mapping via getScreenCTM()
      let mouseSvgX = 0;
      let mouseSvgY = 0;

      if (svg.createSVGPoint && svg.getScreenCTM) {
        const pt = svg.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const ctm = svg.getScreenCTM();
        if (ctm) {
          const svgP = pt.matrixTransform(ctm.inverse());
          mouseSvgX = svgP.x;
          mouseSvgY = svgP.y;
        }
      } else {
        const rect = svg.getBoundingClientRect();
        if (!rect || rect.width <= 0) return;
        mouseSvgX = ((clientX - rect.left) / rect.width) * 760;
        mouseSvgY = ((clientY - rect.top) / rect.height) * 360;
      }

      const { pad, graphW, maxX, price, varCost, fixedCost, bepUnit, getX, getY } = chartDataStore;

      // Check if cursor is within graph horizontal bounds
      if (mouseSvgX < pad.left || mouseSvgX > pad.left + graphW) {
        tooltip.style.opacity = '0';
        const tracker = document.getElementById('trackerGroup');
        if (tracker) tracker.style.display = 'none';
        return;
      }

      // 2. Exact Unit Volume calculation
      const volumeRatio = (mouseSvgX - pad.left) / graphW;
      const volume = Math.max(0, Math.min(maxX, Math.round(volumeRatio * maxX)));

      const revenue = volume * price;
      const totalCost = fixedCost + (volume * varCost);
      const profit = revenue - totalCost;

      // 3. Update SVG Tracker Elements
      const tracker = document.getElementById('trackerGroup');
      const trackerLine = document.getElementById('trackerLine');
      const dotRev = document.getElementById('trackerDotRev');
      const dotCost = document.getElementById('trackerDotCost');

      const snapX = getX(volume);
      const revY = getY(revenue);
      const costY = getY(totalCost);

      if (tracker && trackerLine && dotRev && dotCost) {
        tracker.style.display = 'block';
        trackerLine.setAttribute('x1', snapX);
        trackerLine.setAttribute('x2', snapX);
        dotRev.setAttribute('cx', snapX);
        dotRev.setAttribute('cy', revY);
        dotCost.setAttribute('cx', snapX);
        dotCost.setAttribute('cy', costY);
      }

      // 4. Update Tooltip Content
      if (el.ttVolume) {
        const statusLabel = volume === bepUnit ? 'Titik Impas' : (volume > bepUnit ? 'Zona Laba' : 'Zona Rugi');
        el.ttVolume.textContent = `${formatNumber(volume)} Unit (${statusLabel})`;
      }
      if (el.ttRevenue) el.ttRevenue.textContent = formatRp(revenue);
      if (el.ttCost) el.ttCost.textContent = formatRp(totalCost);

      if (el.ttProfit && el.ttProfitLabel) {
        if (profit > 0) {
          el.ttProfitLabel.textContent = 'Laba Bersih:';
          el.ttProfit.textContent = '+' + formatRp(profit);
          el.ttProfit.style.color = 'var(--accent-emerald)';
        } else if (profit < 0) {
          el.ttProfitLabel.textContent = 'Rugi Bersih:';
          el.ttProfit.textContent = formatRp(profit);
          el.ttProfit.style.color = 'var(--color-loss)';
        } else {
          el.ttProfitLabel.textContent = 'Laba Bersih:';
          el.ttProfit.textContent = 'Rp 0 (Impas)';
          el.ttProfit.style.color = 'var(--accent-cyan)';
        }
      }

      // 5. Tooltip Screen Position Calculation (Anchor directly to the tracker line & dots)
      let screenTrackerX = clientX;
      if (svg.createSVGPoint && svg.getScreenCTM) {
        const pt = svg.createSVGPoint();
        pt.x = snapX;
        pt.y = revY;
        const ctm = svg.getScreenCTM();
        if (ctm) {
          const screenPt = pt.matrixTransform(ctm);
          screenTrackerX = screenPt.x;
        }
      }

      const wrapRect = wrapper.getBoundingClientRect();
      const ttRelX = screenTrackerX - wrapRect.left;
      const ttRelY = clientY - wrapRect.top;

      const ttWidth = tooltip.offsetWidth || 180;
      const ttHeight = tooltip.offsetHeight || 95;

      // Smart flip: If tracker is on right 50% of the chart, place tooltip to the LEFT of the line
      let posX = ttRelX + 14;
      if (ttRelX > wrapRect.width * 0.52) {
        posX = ttRelX - ttWidth - 14;
      }

      // Clamp X within chart wrapper bounds
      posX = Math.max(10, Math.min(posX, wrapRect.width - ttWidth - 10));

      // Vertically center near cursor Y, clamped within wrapper
      let posY = ttRelY - (ttHeight / 2);
      posY = Math.max(10, Math.min(posY, wrapRect.height - ttHeight - 10));

      tooltip.style.left = posX + 'px';
      tooltip.style.top = posY + 'px';
      tooltip.style.opacity = '1';
    }

    svg.addEventListener('mousemove', function (e) {
      handleMove(e.clientX, e.clientY);
    });

    svg.addEventListener('mouseleave', function () {
      tooltip.style.opacity = '0';
      const tracker = document.getElementById('trackerGroup');
      if (tracker) tracker.style.display = 'none';
    });

    svg.addEventListener('touchmove', function (e) {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    svg.addEventListener('touchend', function () {
      tooltip.style.opacity = '0';
      const tracker = document.getElementById('trackerGroup');
      if (tracker) tracker.style.display = 'none';
    });
  }

  // --- SENSITIVITY MATRIX GENERATOR ---

  function renderSensitivityTable(bepUnit, fixedCost, price, varCost, estimatedUnits) {
    if (!el.tableSensitivityBody) return;

    const scenarios = [
      { label: '50% BEP (Kondisi Rendah)', factor: 0.5 },
      { label: '75% BEP (Mendekati Impas)', factor: 0.75 },
      { label: '100% BEP (Titik Impas)', factor: 1.0, isBep: true },
      { label: '125% BEP (Mulai Menghasilkan Laba)', factor: 1.25 },
      { label: '150% BEP (Kondisi Tumbuh Sehat)', factor: 1.5 }
    ];

    // If custom estimated units is provided, include it in the table
    if (estimatedUnits > 0 && Math.abs(estimatedUnits - bepUnit) > 5) {
      const customFactor = estimatedUnits / bepUnit;
      scenarios.push({
        label: `Target Rencana Anda (${formatNumber(estimatedUnits)} Unit)`,
        factor: customFactor,
        isCustom: true
      });
      // Sort by factor
      scenarios.sort((a, b) => a.factor - b.factor);
    }

    let rowsHtml = '';
    scenarios.forEach(item => {
      const units = item.isCustom ? estimatedUnits : Math.round(bepUnit * item.factor);
      const revenue = units * price;
      const totalCost = fixedCost + (units * varCost);
      const profit = revenue - totalCost;

      let statusBadge = '';
      if (profit > 0) {
        statusBadge = `<span class="status-tag status-profit"><i class="ph-bold ph-trend-up"></i> Laba ${formatRp(profit)}</span>`;
      } else if (profit < 0) {
        statusBadge = `<span class="status-tag status-loss"><i class="ph-bold ph-trend-down"></i> Rugi ${formatRp(Math.abs(profit))}</span>`;
      } else {
        statusBadge = `<span class="status-tag status-bep"><i class="ph-bold ph-scales"></i> Impas (Rp 0)</span>`;
      }

      const rowClass = item.isBep ? 'highlight-bep' : (item.isCustom ? 'highlight-custom' : '');

      rowsHtml += `
        <tr class="${rowClass}">
          <td><strong>${item.label}</strong></td>
          <td class="font-mono">${formatNumber(units)} Unit</td>
          <td class="font-mono">${formatRp(revenue)}</td>
          <td class="font-mono">${formatRp(totalCost)}</td>
          <td class="font-mono" style="font-weight: 700; color: ${profit > 0 ? 'var(--accent-emerald)' : (profit < 0 ? 'var(--color-loss)' : 'var(--text-primary)')}">
            ${profit > 0 ? '+' : ''}${formatRp(profit)}
          </td>
          <td>${statusBadge}</td>
        </tr>
      `;
    });

    el.tableSensitivityBody.innerHTML = rowsHtml;
  }

  // --- PRESETS SYSTEM ---

  function applyPreset(presetKey) {
    const p = PRESETS[presetKey];
    if (!p) return;

    state.fixedCost = p.fixedCost;
    state.sellingPrice = p.sellingPrice;
    state.variableCost = p.variableCost;
    state.targetProfit = p.targetProfit;
    state.estimatedUnits = p.estimatedUnits;

    if (p.fixedItems) state.fixedItems = JSON.parse(JSON.stringify(p.fixedItems));
    if (p.varItems) state.varItems = JSON.parse(JSON.stringify(p.varItems));

    // Update Form Inputs
    if (el.fixedCost) el.fixedCost.value = formatNumber(state.fixedCost);
    if (el.sellingPrice) el.sellingPrice.value = formatNumber(state.sellingPrice);
    if (el.variableCost) el.variableCost.value = formatNumber(state.variableCost);
    if (el.targetProfit) el.targetProfit.value = state.targetProfit > 0 ? formatNumber(state.targetProfit) : '';
    if (el.estimatedUnits) el.estimatedUnits.value = state.estimatedUnits > 0 ? formatNumber(state.estimatedUnits) : '';

    // If preset has target profit or estimated units, expand the panel
    if (state.targetProfit > 0 || state.estimatedUnits > 0) {
      if (el.advancedPanel) el.advancedPanel.style.display = 'flex';
      if (el.btnToggleAdvanced) el.btnToggleAdvanced.setAttribute('aria-expanded', 'true');
    }

    calculateBEP();
  }

  function setupPresets() {
    if (!el.presetPills) return;

    el.presetPills.forEach(pill => {
      pill.addEventListener('click', function () {
        el.presetPills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');

        const presetKey = this.getAttribute('data-preset');
        if (presetKey === 'custom') {
          if (el.fixedCost) el.fixedCost.focus();
        } else {
          applyPreset(presetKey);
        }
      });
    });
  }

  // --- ITEMIZER MODAL SYSTEM (Fixed & Variable Costs) ---

  function renderFixedItems() {
    const list = el.fixedItemsList;
    if (!list) return;

    let html = '';
    let total = 0;

    state.fixedItems.forEach((item, idx) => {
      total += item.amount;
      html += `
        <div class="itemizer-row" data-idx="${idx}">
          <input type="text" class="item-input fixed-item-name" placeholder="Nama pos biaya..." value="${item.name}">
          <input type="text" class="item-input font-mono fixed-item-amount" placeholder="0" value="${formatNumber(item.amount)}">
          <button type="button" class="btn-item-del" data-idx="${idx}" title="Hapus baris">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      `;
    });

    list.innerHTML = html;
    if (el.modalFixedTotal) el.modalFixedTotal.textContent = formatRp(total);

    // Attach listeners to modal inputs
    list.querySelectorAll('.fixed-item-amount').forEach((inp, idx) => {
      inp.addEventListener('input', function () {
        const val = parseRupiahInput(this.value);
        this.value = val > 0 ? formatNumber(val) : '';
        if (state.fixedItems[idx]) state.fixedItems[idx].amount = val;
        updateFixedModalTotal();
      });
    });

    list.querySelectorAll('.fixed-item-name').forEach((inp, idx) => {
      inp.addEventListener('input', function () {
        if (state.fixedItems[idx]) state.fixedItems[idx].name = this.value;
      });
    });

    list.querySelectorAll('.btn-item-del').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-idx'), 10);
        state.fixedItems.splice(idx, 1);
        renderFixedItems();
      });
    });
  }

  function updateFixedModalTotal() {
    let total = 0;
    state.fixedItems.forEach(i => total += i.amount);
    if (el.modalFixedTotal) el.modalFixedTotal.textContent = formatRp(total);
  }

  function renderVarItems() {
    const list = el.varItemsList;
    if (!list) return;

    let html = '';
    let total = 0;

    state.varItems.forEach((item, idx) => {
      total += item.amount;
      html += `
        <div class="itemizer-row" data-idx="${idx}">
          <input type="text" class="item-input var-item-name" placeholder="Komponen bahan baku..." value="${item.name}">
          <input type="text" class="item-input font-mono var-item-amount" placeholder="0" value="${formatNumber(item.amount)}">
          <button type="button" class="btn-item-del" data-idx="${idx}" title="Hapus baris">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      `;
    });

    list.innerHTML = html;
    if (el.modalVarTotal) el.modalVarTotal.textContent = formatRp(total);

    list.querySelectorAll('.var-item-amount').forEach((inp, idx) => {
      inp.addEventListener('input', function () {
        const val = parseRupiahInput(this.value);
        this.value = val > 0 ? formatNumber(val) : '';
        if (state.varItems[idx]) state.varItems[idx].amount = val;
        updateVarModalTotal();
      });
    });

    list.querySelectorAll('.var-item-name').forEach((inp, idx) => {
      inp.addEventListener('input', function () {
        if (state.varItems[idx]) state.varItems[idx].name = this.value;
      });
    });

    list.querySelectorAll('.btn-item-del').forEach(btn => {
      btn.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-idx'), 10);
        state.varItems.splice(idx, 1);
        renderVarItems();
      });
    });
  }

  function updateVarModalTotal() {
    let total = 0;
    state.varItems.forEach(i => total += i.amount);
    if (el.modalVarTotal) el.modalVarTotal.textContent = formatRp(total);
  }

  function setupModals() {
    if (!el.modalFixedCost || !el.modalVarCost) return;

    // Fixed Cost Modal
    if (el.btnOpenFixedItemizer) {
      el.btnOpenFixedItemizer.addEventListener('click', () => {
        renderFixedItems();
        el.modalFixedCost.classList.add('active');
        el.modalFixedCost.setAttribute('aria-hidden', 'false');
      });
    }

    const closeFixed = () => {
      el.modalFixedCost.classList.remove('active');
      el.modalFixedCost.setAttribute('aria-hidden', 'true');
    };

    if (el.btnCloseFixedModal) el.btnCloseFixedModal.addEventListener('click', closeFixed);
    if (el.btnCancelFixedModal) el.btnCancelFixedModal.addEventListener('click', closeFixed);

    if (el.btnAddFixedRow) {
      el.btnAddFixedRow.addEventListener('click', () => {
        state.fixedItems.push({ name: '', amount: 0 });
        renderFixedItems();
      });
    }

    if (el.btnApplyFixedModal) {
      el.btnApplyFixedModal.addEventListener('click', () => {
        let sum = 0;
        state.fixedItems.forEach(i => sum += i.amount);
        state.fixedCost = sum;
        if (el.fixedCost) el.fixedCost.value = formatNumber(sum);
        closeFixed();
        calculateBEP();
      });
    }

    // Variable Cost Modal
    if (el.btnOpenVarItemizer) {
      el.btnOpenVarItemizer.addEventListener('click', () => {
        renderVarItems();
        el.modalVarCost.classList.add('active');
        el.modalVarCost.setAttribute('aria-hidden', 'false');
      });
    }

    const closeVar = () => {
      el.modalVarCost.classList.remove('active');
      el.modalVarCost.setAttribute('aria-hidden', 'true');
    };

    if (el.btnCloseVarModal) el.btnCloseVarModal.addEventListener('click', closeVar);
    if (el.btnCancelVarModal) el.btnCancelVarModal.addEventListener('click', closeVar);

    if (el.btnAddVarRow) {
      el.btnAddVarRow.addEventListener('click', () => {
        state.varItems.push({ name: '', amount: 0 });
        renderVarItems();
      });
    }

    if (el.btnApplyVarModal) {
      el.btnApplyVarModal.addEventListener('click', () => {
        let sum = 0;
        state.varItems.forEach(i => sum += i.amount);
        state.variableCost = sum;
        if (el.variableCost) el.variableCost.value = formatNumber(sum);
        closeVar();
        calculateBEP();
      });
    }

    // Click outside modal backdrop to close
    [el.modalFixedCost, el.modalVarCost].forEach(modal => {
      modal.addEventListener('click', function (e) {
        if (e.target === this) {
          this.classList.remove('active');
          this.setAttribute('aria-hidden', 'true');
        }
      });
    });
  }

  // --- THEME SWITCHER (Dark & Light Mode) ---

  function setupTheme() {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem('bepcal_theme');
    } catch (e) {
      // Storage access blocked/restricted
    }

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    state.theme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', state.theme);

    if (el.btnThemeToggle) {
      el.btnThemeToggle.addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', state.theme);
        try {
          localStorage.setItem('bepcal_theme', state.theme);
        } catch (e) {}
        // Re-render chart to adjust contrast
        calculateBEP();
      });
    }
  }

  // --- PRINT & REPORT GENERATION ---

  function setupPrintReport() {
    if (!el.btnPrintReport) return;

    el.btnPrintReport.addEventListener('click', () => {
      // Populate print data
      const now = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      if (el.printDate) el.printDate.textContent = 'Tanggal: ' + now.toLocaleDateString('id-ID', options);

      if (el.printValFixed) el.printValFixed.textContent = formatRp(state.fixedCost);
      if (el.printValPrice) el.printValPrice.textContent = formatRp(state.sellingPrice);
      if (el.printValVar) el.printValVar.textContent = formatRp(state.variableCost);

      const unitMargin = state.sellingPrice - state.variableCost;
      const marginRatio = state.sellingPrice > 0 ? (unitMargin / state.sellingPrice) * 100 : 0;
      const bepUnit = unitMargin > 0 ? Math.ceil(state.fixedCost / unitMargin) : 0;
      const bepRupiah = bepUnit * state.sellingPrice;

      if (el.printValMargin) el.printValMargin.textContent = formatRp(unitMargin);
      if (el.printValRatio) el.printValRatio.textContent = marginRatio.toFixed(1) + '%';
      if (el.printValBepUnit) el.printValBepUnit.textContent = formatNumber(bepUnit) + ' Unit / Bulan';
      if (el.printValBepRupiah) el.printValBepRupiah.textContent = formatRp(bepRupiah);

      // Populate Print Table Scenarios
      const scenarios = [
        { label: '50% Kapasitas BEP', factor: 0.5 },
        { label: '75% Kapasitas BEP', factor: 0.75 },
        { label: '100% Titik Impas (BEP)', factor: 1.0 },
        { label: '125% Kapasitas BEP', factor: 1.25 },
        { label: '150% Kapasitas BEP', factor: 1.5 }
      ];

      let printRows = '';
      scenarios.forEach(s => {
        const u = Math.round(bepUnit * s.factor);
        const rev = u * state.sellingPrice;
        const cost = state.fixedCost + (u * state.variableCost);
        const profit = rev - cost;

        printRows += `
          <tr>
            <td>${s.label}</td>
            <td class="text-right font-mono">${formatNumber(u)} Unit</td>
            <td class="text-right font-mono">${formatRp(rev)}</td>
            <td class="text-right font-mono">${formatRp(cost)}</td>
            <td class="text-right font-mono" style="font-weight:700;">${profit > 0 ? '+' : ''}${formatRp(profit)}</td>
          </tr>
        `;
      });
      if (el.printTableBody) el.printTableBody.innerHTML = printRows;

      // Trigger standard print dialog
      window.print();
    });
  }

  // --- RESET HANDLER ---

  function setupReset() {
    if (!el.btnResetAll) return;

    el.btnResetAll.addEventListener('click', () => {
      if (confirm('Apakah Anda ingin mereset kalkulator ke data awal?')) {
        if (el.presetPills) {
          el.presetPills.forEach(p => p.classList.remove('active'));
          const defaultPill = document.querySelector('[data-preset="kopi"]');
          if (defaultPill) defaultPill.classList.add('active');
        }
        applyPreset('kopi');
      }
    });
  }

  // --- INITIALIZATION ---

  function init() {
    initDomRefs();
    setupTheme();

    // Bind Currency Inputs
    if (el.fixedCost) {
      bindCurrencyMask(el.fixedCost, val => {
        state.fixedCost = val;
        calculateBEP();
      });
    }

    if (el.sellingPrice) {
      bindCurrencyMask(el.sellingPrice, val => {
        state.sellingPrice = val;
        calculateBEP();
      });
    }

    if (el.variableCost) {
      bindCurrencyMask(el.variableCost, val => {
        state.variableCost = val;
        calculateBEP();
      });
    }

    if (el.targetProfit) {
      bindCurrencyMask(el.targetProfit, val => {
        state.targetProfit = val;
        calculateBEP();
      });
    }

    if (el.estimatedUnits) {
      bindCurrencyMask(el.estimatedUnits, val => {
        state.estimatedUnits = val;
        calculateBEP();
      });
    }

    // Accordion Toggle
    if (el.btnToggleAdvanced && el.advancedPanel) {
      el.btnToggleAdvanced.addEventListener('click', function () {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        el.advancedPanel.style.display = isExpanded ? 'none' : 'flex';
      });
    }

    setupPresets();
    setupModals();
    attachChartHoverListeners();
    setupPrintReport();
    setupReset();

    // Initial calculation with default preset (Kedai Kopi)
    applyPreset('kopi');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
