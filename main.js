(function () {
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
        'clients' : 'clients',
        'client/:name' : 'client',
        'client/edit/:name' : 'clientEdit',
        'documents' : 'documents',
        'document/:id' : 'document'
      },

      dashboard: function () {
        render('dashboard');
      },

      clients: function () {
        render('clients');
      },

      documents: function(){
        render('documents');
      },

      client: function (name) {
        if (name === 'new') {
          render('new_client');
        } else {
          Session.set('current_client_name', name);
          render('client_detail');
        }
      },

      clientEdit: function () {
        render('edit_client');
      },

      document: function (_id) {
        if (_id !== 'new') {
          Session.set('current_document_id', _id);
          render('document_detail');
        } else {
          render('new_document');
        }
      }
    });

    var app_router = new AppRouter();

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
}());