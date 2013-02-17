(function () {

  if (Meteor.isClient) {

    Template.clients.helpers({
      clients: function () {
        return BC.Clients.find({});
      },
      thereAreClients: function () {
        return BC.Clients.find({}).count();
      }
    });

    Template.clients.events = {
      'keyup #searchClients': function (ev) {
        var
          $target = $(ev.currentTarget),
          filterValue = $target.val(),
          $clientsList = $('ul.clients li');

        $clientsList.each(function (index, li) {
          var $li = $(li),
            name = $li.find('.name').text();

          if (name.toLowerCase().indexOf(filterValue.toLowerCase()) === -1) {
            $li.hide();
          } else {
            $li.show();
          }
        });
      }
    }

    Template.client_detail_form.helpers({
      nameToCreate: function () {
        return Session.get('clientNameToCreate');
      },
      clientToEdit: function () {
        return Session.get('clientToEdit');
      }
    });

    Template.new_client.events = {
      'click .add' : function () {
        var
          name = $('#name').val(),
          email = $('#email').val(),
          tel = $('#tel').val();

        if (BC.Clients.find({name: name}).count()) {
          alert ('Client with this name exists allready');
          return;
        }

        if (!(name && email && tel)) {
          alert('All fields are required');
          return;
        }

        BC.Clients.insert({
          name: name,
          email: email,
          tel: tel
        });
        navigate('/');
      }
    };

    Template.edit_client.events = {
      'click .update' : function () {
        var
          _id = Session.get('clientToEdit')._id,
          obj = BH.serializeForm($('.edit_client'));

        BC.Clients.update(_id, obj)
      }
    }

    Template.client.helpers({
      numberOfDocs: function () {
        return BC.Documents.find({client: this.name}).count();
      },

      numberOfProposals: function () {
        return BC.Documents.find({client: this.name, isInvoice: {$ne: true}}).count();
      },

      numberOfInvoices: function () {
        return BC.Documents.find({client: this.name, isInvoice: true}).count();
      }
    })

    Template.client.events = {
      'click .remove' : function (e) {
        var
          _id = this._id,
          name = this.name,
          youSure = isConfirmed('Delete this cliemt and all his docs?');

        if (youSure) {
          BC.Clients.remove({_id: _id});
          BC.Documents.remove({client: name});
        }
      },

      'click .details' : function (e) {
        var name = this.name;
        navigate('client/' + name);
      }
    };

    Template.client_detail.helpers({
      current_client: function () {
        var name = Session.get('current_client_name');
        return BC.Clients.findOne({name: name});
      },

      current_client_docs: function () {
        var
          name = Session.get('current_client_name');
        return BC.Documents.findOne({client: name});
      }
    });

    Template.client_detail.events({
      'click button.edit' : function () {
        Session.set('clientToEdit', this);
        navigate('/client/edit/' + this.name);
      }
    })
  }

  if (Meteor.isServer) {
    Meteor.startup(function () {

    });
  }

}());
