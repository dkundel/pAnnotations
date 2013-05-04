(function chat_handlers_module (handlers) {

  var structure = {
    wrapper: null,
    messages: jq_element('ul'),
    chat_wrapper: jq_element('form'),
    chat: jq_element('input'),
    chat_submit: jq_element('input')
  };

  register_socket_handlers();

  $(function () {
    make_structure();
  });

  function make_structure () {
    structure.wrapper = $('#chat');
    structure.wrapper.append(
      structure.messages,
      structure.chat_wrapper.append(
        structure.chat.attr({type: 'text'}),
        structure.chat_submit.attr({type: 'submit', value:'chat'})
      )
    );
    structure.chat_wrapper.on('submit', function on_submit (event) {
      event.preventDefault();
      chat(structure.chat.val());
      structure.chat.val('');
    });
  }

  function register_socket_handlers () {
    handlers.chat = function on_chat (socket, data) {
      add_message(data);
    };

    handlers.chat_load = function on_chat_load (socket, data) {
      for (var i=0; i<data.messages.length; ++i) {
        add_message(data.messages[i]);
      }
    };
  }

  function add_message (data) {    

    if(!data.user){
      data.user = {};
      data.user.picture = {};
      data.user.picture.data = {};
      data.user.picture.data.url = data.photo;
      data.user.name = data.name;
    }

    structure.messages.append(
      '<li id="'+data.id+'" user_id="'+data.user_id+'">'+
        '<img src="'+data.user.picture.data.url+'" alt="image" />'+
        '<h4>'+data.user.name+'</h4>'+
        '<div>'+data.message+'</div>'+
        '<div class="meta">'+data.timestamp+'</div>'+
      '</li>'
    );
    // console.info('['+data.timestamp+'] '+data.id+': '+data.message);
  };

  function chat (message) {
    socket.emit('chat', {
      id: Math.floor(Math.random() * 10000),
      message: message,
      user: window.fbApi.user
    });
  }

})(window.socket_handlers);
