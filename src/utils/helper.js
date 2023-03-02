export const downloadFile = (url) => {
  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const popupWindow = (url, title) => {
  var width = window.outerWidth ? window.outerWidth : document.documentElement.clientWidth;
  var height = window.outerHeight ? window.outerHeight : document.documentElement.clientHeight;
  var w = width * 1;
  var h = height * 0.7;
  var left = width / 2 - w / 2;
  var top = height / 2 - h / 2;
  var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus();
  }
  return newWindow;
};
