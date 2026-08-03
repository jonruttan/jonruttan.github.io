/* turtle-player.js — embeddable animated turtle for blog posts.
 *
 * Extracted from x-lang's apps/logo/viewer.html. Each element matching
 * .turtle-player becomes an instance. Bytecode comes from either:
 *
 *   <div class="turtle-player" data-bc='["F",100,"R",90]'></div>
 *   <div class="turtle-player" data-src="/assets/turtle-geometry/bc/fig1.1b.json"></div>
 *
 * Options: data-speed="1..200" (default 30; 200 = instant).
 *
 * The final drawing is shown immediately, as a static figure would be.
 * Play clears the canvas and replays the turtle drawing it.
 *
 * Bytecode format — flat JSON array: ["F",100,"R",90,"U","F",50,"D"]
 * Opcodes: F(dist) B(dist) R(deg) L(deg) U D C H(deg) M(x,y) O K(color) W(width)
 */
(function () {
  'use strict';
  if (window.TurtlePlayer) return;
  window.TurtlePlayer = true;

  var OPARGS = { F: 1, B: 1, R: 1, L: 1, U: 0, D: 0, C: 0, H: 1, M: 2, O: 0, K: 1, W: 1 };
  var ns = 'http://www.w3.org/2000/svg';

  var CSS = [
    '.turtle-player { background: #fff; border: 1px solid #ddd; border-radius: 3px; }',
    '.turtle-player svg { display: block; width: 100%; height: auto; }',
    '.turtle-player .tp-controls { display: flex; align-items: center; gap: 10px;',
    '  padding: 6px 10px; border-top: 1px solid #eee; }',
    '.turtle-player button { font: inherit; font-size: 13px; padding: 2px 12px;',
    '  cursor: pointer; border: 1px solid #bbb; border-radius: 3px; background: #fff; color: #333; }',
    '.turtle-player button:hover { background: #eee; }',
    '.turtle-player input[type=range] { width: 110px; }',
    '.turtle-player .tp-speed-label { font-size: 12px; color: #777; }'
  ].join('\n');

  function injectCSS() {
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // Parse flat bytecode array into instruction objects:
  // {op, args, x, y, h, pen, color, width, dist, x2, y2, h2}
  function parseBytecode(bc) {
    var result = [];
    var x = 0, y = 0, h = 0, pen = true, color = '#222', width = 1;
    var i = 0;
    while (i < bc.length) {
      var op = bc[i++];
      var nargs = OPARGS[op] || 0;
      var args = [];
      for (var j = 0; j < nargs; j++) args.push(bc[i++]);

      var instr = { op: op, args: args, x: x, y: y, h: h, pen: pen, dist: 0, color: color, width: width };

      switch (op) {
        case 'F': {
          var d = args[0];
          var rad = h * Math.PI / 180;
          x += d * Math.sin(rad);
          y -= d * Math.cos(rad);
          instr.dist = Math.abs(d);
          break;
        }
        case 'B': {
          var db = -args[0];
          var radb = h * Math.PI / 180;
          x += db * Math.sin(radb);
          y -= db * Math.cos(radb);
          instr.dist = Math.abs(db);
          break;
        }
        case 'R': h += args[0]; break;
        case 'L': h -= args[0]; break;
        case 'U': pen = false; break;
        case 'D': pen = true; break;
        case 'C': x = 0; y = 0; h = 0; pen = true; break;
        case 'H': h = args[0]; break;
        case 'M': {
          var dx = args[0] - x, dy = args[1] - y;
          instr.dist = Math.sqrt(dx * dx + dy * dy);
          x = args[0]; y = args[1];
          break;
        }
        case 'O': {
          instr.dist = Math.sqrt(x * x + y * y);
          x = 0; y = 0; h = 0;
          break;
        }
        case 'K': color = args[0]; break;
        case 'W': width = args[0]; break;
      }
      instr.x2 = x; instr.y2 = y; instr.h2 = h;
      result.push(instr);
    }
    return result;
  }

  function computeViewBox(instrs) {
    if (!instrs.length) return { x: -100, y: -100, w: 200, h: 200 };
    var minX = 0, minY = 0, maxX = 0, maxY = 0;
    for (var i = 0; i < instrs.length; i++) {
      var s = instrs[i];
      minX = Math.min(minX, s.x, s.x2);
      minY = Math.min(minY, s.y, s.y2);
      maxX = Math.max(maxX, s.x, s.x2);
      maxY = Math.max(maxY, s.y, s.y2);
    }
    // Square viewBox so aspect ratio doesn't distort
    var size = Math.max(maxX - minX, maxY - minY, 100);
    var cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    var pad = size * 0.1 + 20;
    var half = size / 2 + pad;
    return { x: cx - half, y: cy - half, w: half * 2, h: half * 2 };
  }

  function mount(el) {
    if (el.dataset.tpMounted) return;
    el.dataset.tpMounted = '1';

    var speed = parseInt(el.dataset.speed || '30', 10);

    // --- DOM scaffold ---
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('xmlns', ns);
    el.appendChild(svg);

    var controls = document.createElement('div');
    controls.className = 'tp-controls';
    var playBtn = document.createElement('button');
    playBtn.type = 'button';
    playBtn.textContent = 'Play';
    var speedLabel = document.createElement('span');
    speedLabel.className = 'tp-speed-label';
    speedLabel.textContent = 'Speed';
    var speedSlider = document.createElement('input');
    speedSlider.type = 'range';
    speedSlider.min = '1';
    speedSlider.max = '200';
    speedSlider.value = String(speed);
    controls.appendChild(playBtn);
    controls.appendChild(speedLabel);
    controls.appendChild(speedSlider);
    el.appendChild(controls);

    // --- Per-instance state ---
    var instrs = [];
    var lines = [];
    var cursorEl = null;
    var playing = false;
    var instrIndex = 0;
    var instrProgress = 0;
    var lastRenderedLine = -1;
    var lastTime = 0;
    var animId = null;

    function buildSVG() {
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      lines = [];

      var linesGroup = document.createElementNS(ns, 'g');
      linesGroup.setAttribute('stroke-linecap', 'round');
      svg.appendChild(linesGroup);

      for (var i = 0; i < instrs.length; i++) {
        var s = instrs[i];
        if (s.pen && s.dist > 0) {
          var line = document.createElementNS(ns, 'line');
          line.setAttribute('x1', s.x);
          line.setAttribute('y1', s.y);
          line.setAttribute('x2', s.x2);
          line.setAttribute('y2', s.y2);
          line.setAttribute('stroke', s.color);
          line.style.display = 'none';
          linesGroup.appendChild(line);
          lines.push({ el: line, idx: i, width: s.width });
        }
      }

      // Turtle cursor
      cursorEl = document.createElementNS(ns, 'g');
      var tri = document.createElementNS(ns, 'polygon');
      tri.setAttribute('points', '0,-7 4,5 -4,5');
      tri.setAttribute('fill', 'rgba(0,160,0,0.7)');
      tri.setAttribute('stroke', '#060');
      tri.setAttribute('stroke-width', '0.5');
      cursorEl.appendChild(tri);
      svg.appendChild(cursorEl);

      // Fixed viewBox from the whole drawing — the frame doesn't move while
      // the turtle draws.
      var vb = computeViewBox(instrs);
      svg.setAttribute('viewBox', vb.x + ' ' + vb.y + ' ' + vb.w + ' ' + vb.h);
      var scale = Math.max(vb.w, vb.h) / 500;
      for (var j = 0; j < lines.length; j++) {
        lines[j].el.setAttribute('stroke-width', Math.max(0.3, lines[j].width * scale));
      }
    }

    function positionTurtle(x, y, heading) {
      if (!cursorEl) return;
      var vb = svg.viewBox.baseVal;
      var s = Math.max(0.5, Math.max(vb.width, vb.height) / 500);
      cursorEl.setAttribute('transform',
        'translate(' + x + ',' + y + ') scale(' + s + ') rotate(' + heading + ')');
    }

    function renderFrame() {
      while (lastRenderedLine + 1 < lines.length &&
             lines[lastRenderedLine + 1].idx < instrIndex) {
        lastRenderedLine++;
        var li = lines[lastRenderedLine];
        li.el.style.display = '';
        var s = instrs[li.idx];
        li.el.setAttribute('x2', s.x2);
        li.el.setAttribute('y2', s.y2);
      }

      if (lastRenderedLine + 1 < lines.length &&
          lines[lastRenderedLine + 1].idx === instrIndex &&
          instrs[instrIndex].dist > 0) {
        var lp = lines[lastRenderedLine + 1];
        lp.el.style.display = '';
        var sp = instrs[instrIndex];
        lp.el.setAttribute('x2', sp.x + (sp.x2 - sp.x) * instrProgress);
        lp.el.setAttribute('y2', sp.y + (sp.y2 - sp.y) * instrProgress);
      }

      if (instrIndex < instrs.length) {
        var sc = instrs[instrIndex];
        if (sc.dist === 0) {
          positionTurtle(sc.x, sc.y, sc.h2);
        } else {
          positionTurtle(sc.x + (sc.x2 - sc.x) * instrProgress,
                         sc.y + (sc.y2 - sc.y) * instrProgress, sc.h);
        }
      } else if (instrs.length > 0) {
        var last = instrs[instrs.length - 1];
        positionTurtle(last.x2, last.y2, last.h2);
      } else {
        positionTurtle(0, 0, 0);
      }
    }

    function showFinal() {
      for (var k = 0; k < lines.length; k++) {
        var s = instrs[lines[k].idx];
        lines[k].el.style.display = '';
        lines[k].el.setAttribute('x2', s.x2);
        lines[k].el.setAttribute('y2', s.y2);
      }
      lastRenderedLine = lines.length - 1;
      instrIndex = instrs.length;
      instrProgress = 0;
      renderFrame();
    }

    function restart() {
      for (var k = 0; k < lines.length; k++) lines[k].el.style.display = 'none';
      lastRenderedLine = -1;
      instrIndex = 0;
      instrProgress = 0;
    }

    function stop() {
      playing = false;
      playBtn.textContent = 'Play';
      if (animId) cancelAnimationFrame(animId);
    }

    function animate(timestamp) {
      if (!playing) return;
      if (!lastTime) lastTime = timestamp;
      var dt = (timestamp - lastTime) / 1000;
      lastTime = timestamp;

      if (instrIndex >= instrs.length) {
        stop();
        renderFrame();
        return;
      }

      // Speed: quadratic scaling. 30 ≈ 900 px/s; 200 = instant.
      if (speed >= 200) {
        showFinal();
        stop();
        return;
      }
      var advance = speed * speed * dt;

      while (advance > 0 && instrIndex < instrs.length) {
        if (instrs[instrIndex].dist === 0) {
          instrIndex++;
          instrProgress = 0;
          continue;
        }
        var sl = instrs[instrIndex].dist;
        var remaining = (1 - instrProgress) * sl;
        if (advance >= remaining) {
          advance -= remaining;
          instrIndex++;
          instrProgress = 0;
        } else {
          instrProgress += advance / sl;
          advance = 0;
        }
      }

      renderFrame();
      if (instrIndex >= instrs.length) {
        stop();
      } else {
        animId = requestAnimationFrame(animate);
      }
    }

    playBtn.addEventListener('click', function () {
      if (playing) {
        stop();
        return;
      }
      if (instrIndex >= instrs.length) restart();
      playing = true;
      playBtn.textContent = 'Pause';
      lastTime = 0;
      animId = requestAnimationFrame(animate);
    });

    speedSlider.addEventListener('input', function () {
      speed = parseInt(this.value, 10);
    });

    function load(bc) {
      instrs = parseBytecode(bc);
      buildSVG();
      showFinal();
    }

    // --- Bytecode source ---
    if (el.dataset.bc) {
      load(JSON.parse(el.dataset.bc));
    } else if (el.dataset.src) {
      fetch(el.dataset.src)
        .then(function (r) { return r.json(); })
        .then(load)
        .catch(function () { el.textContent = 'Failed to load turtle drawing.'; });
    }
  }

  function init() {
    injectCSS();
    var els = document.querySelectorAll('.turtle-player');
    for (var i = 0; i < els.length; i++) mount(els[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
