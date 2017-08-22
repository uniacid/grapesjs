var Backbone = require('backbone');
var PropertyView = require('./PropertyView');

module.exports = PropertyView.extend({
  template: _.template(`<div class="<%= pfx %>field <%= pfx %>file">
    <div id='<%= pfx %>input-holder'>
      <div class="<%= pfx %>btn-c">
        <button class="<%= pfx %>btn" id="<%= pfx %>images" type="button"><%= assets %></button>
      </div>
      <div style="clear:both;"></div>
    </div>
    <div id="<%= pfx %>preview-box">
      <div id="<%= pfx %>preview-file"></div>
      <div id="<%= pfx %>close">&Cross;</div>
    </div>
  </div>
  <div style="clear:both"></div>`),

  initialize(options) {
    PropertyView.prototype.initialize.apply(this, arguments);
    this.assets    = this.target.get('assets');
    this.modal    = this.target.get('Modal');
    this.am      = this.target.get('AssetManager');
    this.className   = this.className + ' '+ this.pfx +'file';
    this.events['click #'+this.pfx+'close']    = 'removeFile';
    this.events['click #'+this.pfx+'images']  = 'openAssetManager';
    this.delegateEvents();
  },

  /** @inheritdoc */
  renderInput() {
    if (!this.$input) {
      this.$input = $('<input>', {placeholder: this.defaultValue, type: 'text' });
    }

    if (!this.$preview) {
      this.$preview = this.$el.find('#' + this.pfx + 'preview-file');
    }

    if (!this.$previewBox) {
      this.$previewBox = this.$el.find('#' + this.pfx + 'preview-box');
    }

    this.setValue(this.componentValue, 0);
  },

  setValue(value, f) {
    PropertyView.prototype.setValue.apply(this, arguments);
    this.setPreviewView(value && value != this.getDefaultValue());
    this.setPreview(value);
  },

  /**
   * Change visibility of the preview box
   * @param bool Visibility
   *
   * @return void
   * */
  setPreviewView(v) {
    if(!this.$previewBox)
      return;
    if(v)
      this.$previewBox.addClass(this.pfx + 'show');
    else
      this.$previewBox.removeClass(this.pfx + 'show');
  },

  /**
   * Spread url
   * @param string Url
   *
   * @return void
   * */
  spreadUrl(url) {
    this.setValue(url);
    this.setPreviewView(1);
  },

  /**
   * Shows file preview
   * @param string Value
   * */
  setPreview(url) {
    if(this.$preview)
      this.$preview.css('background-image', "url(" + url + ")");
  },


  /** @inheritdoc */
  renderTemplate() {
    this.$el.append( this.template({
      upload  : 'Upload',
      assets  : 'Images',
      pfx    : this.pfx
    }));
  },

  /** @inheritdoc */
  cleanValue() {
    this.setPreviewView(0);
    this.model.set({value: ''},{silent: true});
  },

  /**
   * Remove file from input
   *
   * @return void
   * */
  removeFile(...args) {
    this.model.set('value',this.defaultValue);
    PropertyView.prototype.cleanValue.apply(this, args);
    this.setPreviewView(0);
  },

  /**
   * Open dialog for image selecting
   * @param  {Object}  e  Event
   *
   * @return void
   * */
  openAssetManager(e) {
    var that  = this;
    var em = this.em;
    var editor = em ? em.get('Editor') : '';

    var imageAssets = { assets: [
        { type: 'image', src : 'http://placehold.it/350x250/78c5d6/fff/image1.jpg', height:350, width:250},
        { type: 'image', src : 'http://placehold.it/350x250/459ba8/fff/image2.jpg', height:350, width:250},
        { type: 'image', src : 'http://placehold.it/350x250/79c267/fff/image3.jpg', height:350, width:250},
        { type: 'image', src : 'http://placehold.it/350x250/c5d647/fff/image4.jpg', height:350, width:250},
        { type: 'image', src : 'http://placehold.it/350x250/f28c33/fff/image5.jpg', height:350, width:250},
        { type: 'image', src : 'http://placehold.it/350x250/e868a2/fff/image6.jpg', height:350, width:250},
        { type: 'image', src : 'http://placehold.it/350x250/cc4360/fff/image7.jpg', height:350, width:250},    
    ]};

    if(editor) {
      console.log('open-assets');
      this.modal.setTitle('Select image');
      this.modal.setContent(this.am.render());
      this.am.setTarget(null);
      editor.runCommand('open-assets', {
        target: this.model,
        modalTitle: 'Select image',
        addBtnText: 'Add image',
        uploadPlaceholderText: 'http://path/to/the/image.jpg',
        assets: imageAssets,
        onSelect(target) {
          that.modal.close();
          that.spreadUrl(target.get('src'));
          that.valueChanged(e);
        }
      });
    }
  },
});
