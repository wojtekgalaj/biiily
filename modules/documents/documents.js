// • I will need a pref pane where the user will specify how he wants to
//   format the numbers of the invoices. With dates, ordered per client and so on.

if (Meteor.isClient) {
  /***********/
  /*DOCUMENTS*/
  /***********/
  Template.documents.documents = function () {
    return BC.Documents.find({});
  };

  Template.documents.currentDocSet = function () {
    return Session.get('current_document_id');
  };


  /**************/
  /*NEW DOCUMENT*/
  /**************/
  Template.new_document.events = {
    // Add new document
    'click .add' : function () {
      var
        title = $('#title').val(),
        client = $('#client').val(),
        createNewClient,
        _id;

      // If a client with this name does not exist
      if (!BC.Clients.findOne({name: client})) {
        createNewClient = confirm('Client with this name does not exist, do you want to create one?');
        if (!createNewClient) {return; }
        Session.set('clientNameToCreate', client);
        navigate('client/new');
        return false;
      }

      // Increment the order number for this clients document
      // Used to number the documents.
      BC.Clients.update({name : client}, {$inc: {docNr:1}});
      // -----------------------
      // I'm wondering if only the invoices should have a number, not the proposals.
      // Proposals are not really official docs anyway and since all the comunications
      // with the client will go thru this app, only when a doc becomes an invoice
      // is the number of importance.


      _id = BC.Documents.insert({
        title: title,
        client: client,
        number: client + '_' + BC.Clients.findOne({name: client}).docNr
      });

      // Go to the concepts form
      navigate('document/' + _id);
    },

    // Autocomplete client field
    'keyup #client' : function (ev) {
      var
        $target = $(ev.currentTarget),
        currentValue = $target.val(),
        matches,
        matchedNames = [];

      // This should be an implementation of a predictive input
      matches = BC.Clients.find({name: {$regex : currentValue}}).fetch();

      matches.forEach(function (match, index) {
        matchedNames.push(match.name);
      });

      $('#client').autocomplete({
        source: matchedNames
      });
    }
  };

  Template.new_document.helpers({
    // Return name of current client from Session
    currentClient: function () {
      return Session.get('current_client_name');
    }
  });


  Template.document.events = {
    // Delete a document
    'click .remove' : function (e) {
      var _id = this._id;
      BC.Documents.remove({_id: _id});
    },
    // Show details for the document
    'click .details' : function (e) {
      var _id = this._id;
      navigate('document/' + _id);
    }
  };

  Template.document_detail.helpers({
    current_document: function () {
      var _id = Session.get('current_document_id');

      return BC.Documents.findOne({_id: _id});
    },

    documentTotal: function () {
      var
        concepts = this.concepts,
        total = 0;

      _.each(concepts, function (concept, index) {
        total += parseFloat(concept.price);
      });
      return total;
    }
  });



  function addConcept(scope) {
    var
      task = $('#task').val(),
      quantity = $('#quantity').val(),
      price = $('#price').val(),
      newConcept = {
        task: task,
        quantity: quantity,
        price: price
      };

    // On keydown scope is set to this, so we know what doc is referenced
    scope = $(scope.currentTarget).is('.btn') ? this : scope;

    function formIsValid() {
      return true;
    }

    if (formIsValid()) {
      BC.Documents.update(
        scope._id,
        {$addToSet: {concepts: newConcept}}
      );
      $('#task').val('').focus();
    }
  }

  Template.document_detail.events = {
    // Add a new concept to the document
    'click .add_concept' : addConcept,
    'click .make_invoice': function () {
      BC.Documents.update(this._id, {$set: {isInvoice: true}});
    },
    'keydown' : function (e) {
      // If ENTER was pressed add concept
      if (e.keyCode === 13) {
        // pass this context so the concept can be addedd to the correct doc
        addConcept(this);
      }
    }
  };

  Template.template_concept.events = {
    'click .remove_concept' : function () {
      BC.Documents.update({concepts: this}, {$pull: {concepts: this}});
    }
  }



}

if (Meteor.isServer) {
  Meteor.startup(function () {

  });
}
