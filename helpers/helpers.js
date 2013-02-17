// Biiily Helper methods
var BH = {
  allKeysHaveValue: function (obj) {
    var
      result = true;
      key;

    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (!obj.key) {result = false;}
      }
    }
    return result;
  },

  serializeForm: function ($form) {
    var obj = {};

    $form.find('input, textarea').each(function (index, input) {
      var
        $input = $(input),
        key = $input[0].name,
        value = $input.val();
      obj[key] = value;
    });
    console.log(obj);
    return obj;
  }
}
