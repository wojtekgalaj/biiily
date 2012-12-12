// Biiily Collections Namespace
var BC = {
  Clients: new Meteor.Collection('clients'),
  Documents: new Meteor.Collection('documents')
};

function render(tmpl, container, options) {
  container = container || '#main_container';
  var template = Meteor.render(function () {
    return Template[tmpl]();
  });
  Spark.finalize($(container)[0]);
  $(container).html(template);
}

function navigate(to) {
  app_router.navigate(to, {trigger: true})
}

function isConfirmed(message) {
  return confirm(message);
}

if (Meteor.isClient) {
  var AppRouter = Backbone.Router.extend({
    routes: {
      '/' : 'dashboard',
      '' : 'dashboard',
      'client/:name' : 'client',
      'document/:id' : 'document'
    },

    dashboard: function () {
      render('dashboard');
    },

    client: function (name) {
      if (name === 'new') {
        render('new_client');
      } else {
        Session.set('current_client_name', name);
        render('client_detail');
      }
    },

    document: function (_id) {
      if (_id === 'new') {
        render('new_document');
      } else {
        Session.set('current_document_id', _id);
        render('document_detail');
      }
    }
  });

  var app_router = new AppRouter();

  Template.dashboard.events = {
    'click .minmax' : function (ev) {
      $(ev.currentTarget).next().stop().slideToggle();
    }
  }

  Template.dashboard.rendered = function () {
    Session.set('current_client_name', false);
  };

  Meteor.startup(function () {
    $('body').on('click', '[data-link]', function (ev) {
      var linksTo = $(ev.currentTarget).data('link');
      if (linksTo) {
        navigate(linksTo);
      }
    });
    Backbone.history.start({pushState: true});

  });
}