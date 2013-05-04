jQuery(function onDomLoad() {
  if (window.presenter === true) {
    window.PreziControl.initPresenter($('#prezi'));
  } else {
    window.PreziControl.initListener($('#prezi'));
  }
});
