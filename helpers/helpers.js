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
  }
}
