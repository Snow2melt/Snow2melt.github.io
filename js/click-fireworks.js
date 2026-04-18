/* 自定义鼠标点击烟花特效 */
(function () {
  var COLORS = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#f8a5c2','#a29bfe','#fd9644','#45aaf2'];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticle(x, y) {
    var el = document.createElement('canvas');
    var size = Math.floor(rand(6, 12));
    el.width = size;
    el.height = size;
    el.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:99999',
      'left:' + x + 'px',
      'top:' + y + 'px',
      'transform:translate(-50%,-50%)',
      'border-radius:50%',
    ].join(';');
    var ctx = el.getContext('2d');
    ctx.fillStyle = COLORS[Math.floor(rand(0, COLORS.length))];
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    document.body.appendChild(el);
    return el;
  }

  function burst(x, y) {
    var count = 24;
    var particles = [];
    for (var i = 0; i < count; i++) {
      var angle = (i / count) * Math.PI * 2 + rand(-0.2, 0.2);
      var speed = rand(60, 200);
      particles.push({
        el: createParticle(x, y),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        x: x,
        y: y,
        alpha: 1,
      });
    }

    var start = null;
    var DURATION = 900;

    function step(ts) {
      if (!start) start = ts;
      var elapsed = ts - start;
      var t = elapsed / DURATION;

      if (t >= 1) {
        particles.forEach(function (p) { p.el.remove(); });
        return;
      }

      particles.forEach(function (p) {
        // 物理：水平匀速 + 竖直加速度模拟重力
        p.x += p.vx * (1 / 60);
        p.y += p.vy * (1 / 60);
        p.vy += 4; // gravity
        p.alpha = 1 - t;
        p.el.style.left = p.x + 'px';
        p.el.style.top = p.y + 'px';
        p.el.style.opacity = p.alpha;
        // 粒子随时间缩小
        var scale = 1 - t * 0.6;
        p.el.style.transform = 'translate(-50%,-50%) scale(' + scale + ')';
      });

      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function init() {
    document.addEventListener('click', function (e) {
      burst(e.clientX, e.clientY);
    });
  }

  // pjax 兼容：每次页面切换后重新绑定不会重复，因为是 document 级别
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
