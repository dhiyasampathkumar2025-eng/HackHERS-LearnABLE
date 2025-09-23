// transition.js: Handles smooth page transitions for dashboard navigation

document.addEventListener('DOMContentLoaded', function() {
  // Fade-in on arrival
  if (document.body.classList.contains('fade-in')) {
    requestAnimationFrame(function() {
      document.body.classList.add('loaded');
    });
  }

  var visualCard = document.getElementById('card-visual');
  if (visualCard) {
    visualCard.addEventListener('click', function(e) {
      // Only intercept if href is not Flask/Jinja
      if (visualCard.getAttribute('href') && visualCard.getAttribute('href') !== '#') {
        e.preventDefault();
      }
      startTransition(visualCard.getAttribute('href') || 'visual-impairment.html');
    });
  }
});

function startTransition(targetUrl) {
  // Animate body fade-out
  requestAnimationFrame(function() {
    document.body.classList.add('fade-out');
    setTimeout(function() {
      window.location.href = targetUrl;
    }, 800); // Match transition duration
  });
}
