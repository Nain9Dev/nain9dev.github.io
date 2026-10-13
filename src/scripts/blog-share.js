import { message } from './locale.js';

window.shareViaWebShare = function() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      text: message('shareDescription'),
      url: window.location.href
    }).catch(console.error);
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert(message('shareCopied'))).catch(console.error);
  }
};

window.shareOnLinkedIn = function() {
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
};

window.shareOnTwitter = function() {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message('shareDescription'))}&url=${encodeURIComponent(window.location.href)}`, '_blank');
};
