module.exports = {

  run(editor, sender, opts) {
    var opt = opts || {};
    var config = editor.getConfig();
    var modal = editor.Modal;
    var assetManager = editor.AssetManager;
    
    config.assetManager.addBtnText = opt.addBtnText;
    assetManager.addBtnText = opt.addBtnText;
    assetManager.updateConfig({
      'addBtnText': opt.addBtnText,
      'uploadPlaceholderText': opt.uploadPlaceholderText
    });
    if (opt.assets) {
      // Reset assets and load
      console.log('assets:',opt.assets);
      assetManager.getAll().reset();
      assetManager.load(opt.assets);
    }

    assetManager.onClick(opt.onClick);
    assetManager.onDblClick(opt.onDblClick);

    // old API
    assetManager.setTarget(opt.target);
    assetManager.onSelect(opt.onSelect);
    
    modal.setTitle(opt.modalTitle || 'Select image');
    modal.setContent(assetManager.render());
    modal.open();
  },

};
