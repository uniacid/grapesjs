var Backbone = require('backbone');
var ComponentView = require('./ComponentView');

module.exports = ComponentView.extend({

  tagName: 'div',

  events: {
    'dblclick': 'openModal',
  },

  initialize(o) {
    ComponentView.prototype.initialize.apply(this, arguments);
    this.listenTo(this.model, 'change:loop change:autoplay change:controls change:color', this.updateVideo);
    this.listenTo(this.model, 'change:provider', this.updateProvider);
    this.listenTo(this.model, 'change:src', this.updateSrc);
    this.listenTo(this.model, 'dblclick active', this.openModal);
    this.classEmpty = this.ppfx + 'plh-image';
  },

  /**
   * Rerender on update of the provider
   * @private
   */
  updateProvider() {
    var prov = this.model.get('provider');
    this.el.innerHTML = '';
    this.el.appendChild(this.renderByProvider(prov));
  },

  /**
   * Update the source of the video
   * @private
   */
  updateSrc() {
    var prov = this.model.get('provider');
    var src = this.model.get('src');
    switch (prov) {
      case 'yt':
        src = this.model.getYoutubeSrc();
        break;
      case 'vi':
        src = this.model.getVimeoSrc();
        break;
    }
    this.videoEl.src = src;
    if(!src)
      this.$el.addClass(this.classEmpty);
    else
      this.$el.removeClass(this.classEmpty);
  },

  /**
   * Update video parameters
   * @private
   */
  updateVideo() {
    var prov = this.model.get('provider');
    var videoEl = this.videoEl;
    var md = this.model;
    switch (prov) {
      case 'yt': case 'vi':
        this.model.trigger('change:videoId');
        break;
      default:
        videoEl.loop = md.get('loop');
        videoEl.autoplay = md.get('autoplay');
        videoEl.controls = md.get('controls');
    }
  },

  renderByProvider(prov) {
    var videoEl;
    switch (prov) {
      case 'yt':
        videoEl = this.renderYoutube();
        break;
      case 'vi':
        videoEl = this.renderVimeo();
        break;
      default:
        videoEl = this.renderSource();
    }
    this.videoEl = videoEl;
    return videoEl;
  },

  renderSource() {
    var el = document.createElement('video');
    el.src = this.model.get('src');
    this.initVideoEl(el);
    return el;
  },

  renderYoutube() {
    var el = document.createElement('iframe');
    el.src = this.model.getYoutubeSrc();
    el.frameBorder = 0;
    el.setAttribute('allowfullscreen', true);
    this.initVideoEl(el);
    return el;
  },

  renderVimeo() {
    var el = document.createElement('iframe');
    el.src = this.model.getVimeoSrc();
    el.frameBorder = 0;
    el.setAttribute('allowfullscreen', true);
    this.initVideoEl(el);
    return el;
  },

  initVideoEl(el) {
    el.className = this.ppfx + 'no-pointer';
    el.style.height = '100%';
    el.style.width = '100%';
  },

  /**
   * Open dialog for video changing
   * @param  {Object}  e  Event
   * @private
   * */
  openModal(e) {
    var em = this.opts.config.em;
    var editor = em ? em.get('Editor') : '';

    var videoAssets = { assets: [
      { 
        type: 'video', 
        src : 'https://ia800209.us.archive.org/4/items/placeholder-videos-2016/1920x1080.mp4', 
      },
      { 
        type: 'video', 
        src : 'https://puu.sh/wOqVA/3fe46c9353.mp4', 
      },
    ]};

    if(editor) {
      editor.runCommand('open-assets', {
        target: this.model,
        modalTitle: 'Select video',
        addBtnText: 'Add video',
        uploadPlaceholderText: 'http://path/to/the/video.mp4',
        assets: videoAssets,
        onSelect() {
          editor.Modal.close();
          editor.AssetManager.setTarget(null);
        }
      });
    }
  },


  render(...args) {
    ComponentView.prototype.render.apply(this, args);
    this.updateClasses();

    var actCls = this.$el.attr('class') || '';
    if(!this.model.get('src'))
      this.$el.attr('class', (actCls + ' ' + this.classEmpty).trim());

    var prov = this.model.get('provider');
    this.el.appendChild(this.renderByProvider(prov));
    // Avoid strange behaviours while try to drag
    this.$el.attr('onmousedown', 'return false');
    return this;
  },

});
