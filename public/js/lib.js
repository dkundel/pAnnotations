function User (options) {
  var defaults = {
    id: 'no-id',
    name: 'no name',
    photo: 'img/no-photo.png'
  };
  var methods = {
    toString: function toString () {
      return '['+this.id+'#'+this.name+']';
    }
  };
  return $.extend(defaults, options, methods);
}