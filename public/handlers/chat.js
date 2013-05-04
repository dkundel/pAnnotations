var messages = [];
(function chat_handlers_module (handlers) {

  var structure = {
    wrapper: null,
    navigation: jq_element('div'),
    navigation_input: jq_element('input'),
    messages: jq_element('ul'),
    chat_wrapper: jq_element('form'),
    chat: jq_element('input'),
    chat_submit: jq_element('input'),
    revisions: jq_element('div'),
    revisions_text_id: jq_element('select'),
    revisions_text_input: jq_element('input'),
    revisions_image_id: jq_element('select'),
    revisions_image_input: jq_element('input')
  };


  var objects = null;

  register_socket_handlers();

  $(function () {
    make_structure();
    init_prezi();
  });

  function init_prezi () {
    var player = PreziControl.Prezi;
    player.on(PreziPlayer.EVENT_STATUS, function (event) {
      if (event.value == PreziPlayer.STATUS_CONTENT_READY){
        player.on(PreziPlayer.EVENT_OBJECT_QUERY_RESPONSE, function(event){
          player.off(PreziPlayer.EVENT_OBJECT_QUERY_RESPONSE);
          objects = event.data.getObjects;
          console.log(objects);
          make_revisions();
        });
        player.getObjects();
      }
    });
  }

  function make_revisions () {
    var texts = structure.revisions_text_id;
    objects.texts.forEach(function (text) {
      texts.append(
        jq_element('option').attr({
          value: text.objectId
        }).html(text.text)
      );
    });
    texts.on('change', function on_change () {
      PreziControl.Prezi.toObject($(this).val());
    });
    structure.revisions_text_input.
      on('keyup', function on_change () {
        PreziControl.Prezi.setText(texts.val(), $(this).val());
      });

    var images = structure.revisions_image_id;
    objects.images.forEach(function (image) {
      images.append(
        jq_element('option').attr({
          value: image.objectId
        }).html(image.url)
      );
    });
    structure.revisions_image_input.
      on('keyup', function on_change () {
        PreziControl.Prezi.setText(images.val(), $(this).val());
      });

    structure.revisions.append(
      jq_element('h3').html('Add a text revision'),
      structure.revisions_text_input.attr({type: 'text'}),
      texts,
      jq_element('h3').html('Add an image revision'),
      structure.revisions_image_input.attr({type: 'text'}),
      images
    );
  }

  function make_structure () {
    structure.wrapper = $('#chat');
    structure.wrapper.append(
      structure.navigation,
      structure.revisions,
      structure.messages,
      structure.chat_wrapper.append(
        structure.chat.attr({type: 'text'}),
        structure.chat_submit.attr({type: 'submit', value:'chat'})
      )
    );
    structure.navigation.append(
      'Filter Comments #',
      structure.navigation_input.attr({
        type: 'number',
        min: 0,
        value: 0,
        max: 10 // PreziControl.Prezi.getStepCount() - 1
      })
    );
    structure.navigation_input.on('change.view-comments', function (event) {
      var slide_number = $(this).val();
      if (slide_number == 0) {
        go_to(0);
        structure.messages.children().show();
      } else {
        go_to(slide_number - 1);
        structure.messages.
          children().
          hide().
          filter(function () {
            return $(this).
                      find('.prezi-go-to[slide-number="'+slide_number+'"]').
                      length > 0;
          }).
          show();
      }
    });
    structure.revisions.addClass('revisions');
    structure.messages.on('click.prezi-go-to', '.prezi-go-to', function (event) {
      event.preventDefault();
      go_to(Number($(this).attr('slide-number')));
    });
    structure.messages.on('click.show-revision', '.object-revision', function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      PreziControl.Prezi.toObject($(this).attr('object-id'));
      console.log($(this).attr('method'))
      PreziControl.Prezi[$(this).attr('method')](
        $(this).attr('object-id'),
        $(this).attr('replace')
      );
    });
    structure.chat_wrapper.
      on('keydown', function on_keydown (event) {
        var R_keyCode = 82;
        if (event.keyCode == R_keyCode && event.ctrlKey) {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();
          structure.revisions.fadeToggle();
        }
      }).
      on('submit', function on_submit (event) {
        event.preventDefault();
        chat(structure.chat.val());
        structure.chat.val('');
      });
  }

  function go_to (slide_number) {
    PreziControl.Prezi.toStep(slide_number);
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
    messages.push(data);
    var message = data.message;
    // make all words of the type #[0-9]+ into proper links
    message = message.replace(/#([0-9]+)/gi, '<a href="javascript:void(0)" class="prezi-go-to" slide-number="$1">#$1</a>');
        if(!data.user){
      data.user = {};
      data.user.picture = {};
      data.user.picture.data = {};
      data.user.picture.data.url = data.photo;
      data.user.name = data.name;
    }

    var revisions = '';
    if (data.revision_text) {
      revisions += '<a href="#" object-id="'+data.revision_text.id+'" replace="'+data.revision_text.value+'" class="object-revision" method="setText">text revision</a>';
    }
    if (data.revision_image) {
      revisions += '<a href="#" object-id="'+data.revision_image.id+'" replace="'+data.revision_image.value+'" class="object-revision" method="setImageUrl">text revision</a>';
    }
    revisions = '<div class="message-revisions">'+revisions+'</div>';


    structure.messages.append(
      '<li id="'+data.id+'" user_id="'+data.user_id+'">'+
        '<img src="'+data.user.picture.data.url+'" alt="image" />'+
        '<h4>'+data.user.name+'</h4>'+
        '<div>'+message+'</div>'+
        // '<div class="meta">'+data.timestamp+'</div>'+
        revisions+
        '<div class="clearfix"></div>'+
      '</li>'
    );
    structure.messages[0].scrollTop = structure.messages[0].scrollHeight;
  };

  function chat (message) {
    var obj = {
      id: Math.floor(Math.random() * 10000),
      message: message,
      user: window.fbApi.user
    };
    if (structure.revisions_text_input.val().length > 0) {
      obj.revision_text = {
        id: structure.revisions_text_id.val(),
        value: structure.revisions_text_input.val()
      };
    }
    if (structure.revisions_image_input.val().length > 0) {
      obj.revision_image = {
        id: structure.revisions_image_id.val(),
        value: structure.revisions_image_input.val()
      };
    }
    socket.emit('chat', obj);
  }

})(window.socket_handlers);
