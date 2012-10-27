function Places(arr) {
  this.maximums = arr;
  this.value = arr.map(function () { return 0 });
  this.placeIndex = 0;
}

Places.prototype.inc = function inc(amount) {
  var idx = this.placeIndex;
  // cheap equality check
  if (this.value.join() === this.maximums.join())
    return false;
  
  if (this.value[idx] + 1 > this.maximums[idx]) {
    do {
      this.value[idx] = 0;
      this.placeIndex = idx = idx + 1;
      this.value[idx]++;
    } while (this.value[idx] > this.maximums[idx]);
    this.placeIndex = 0;
  } else {
    this.value[idx]++;
  }
  return true;
};

module.exports = Places;