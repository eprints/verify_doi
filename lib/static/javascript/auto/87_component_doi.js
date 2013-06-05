var Component_DOI = Class.create({
  url: eprints_http_cgiroot + '/users/lookup/verify_doi',
  timer: null,

  initialize: function(input) {
    this.input = input;

    this.container = new Element('div', {
    });
    this.container.hide();
    this.container.style.width = this.input.getWidth() + 'px';
    input.insert({
      after: this.container
    });

    var cval;
    input.observe('keyup', (function(e) {
      if (this.input.value != cval) {
        window.clearTimeout (this.timer);
        this.timer = (function() {
            this.verify();
          }).bind(this).delay(.5);
      }
      cval = this.input.value;
    }).bindAsEventListener(this));

    this.verify();
  },

  verify: function() {
    if (this.input.value.length == 0) {
      this.container.hide();
      this.input.style.backgroundColor = null;
      return;
    }

    new Ajax.Request(this.url, {
      onException: function(req, e) {
        throw new Error ('Error ' + e + ' requesting DOI check');
      },
      onSuccess: (function(transport) {
        var json = transport.responseJSON;

        this.container.hide();
        if (json.ok) {
          this.input.style.backgroundColor = '#8f8';
          this.container.update(json.citation);
          new Effect.SlideDown(this.container, {
            duration: .2
          });
        }
        else {
          this.input.style.backgroundColor = '#f88';
        }
      }).bind(this),
      parameters: {
        doi: this.input.value
      }
    });
  }
});
