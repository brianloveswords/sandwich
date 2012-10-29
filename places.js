function Places(arr) {
  this.maximums = arr;
  this.value = arr.map(function () { return 0 });
  this.placeIndex = 0;
}

Places.prototype.next = function next(amount) {
  var idx = this.placeIndex;
  if (this.maxedOut())
    return null;
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
  return this.value;
};

Places.prototype.maxedOut = function maxedOut() {
  // cheap equality check
  return this.value.join() === this.maximums.join();
};

module.exports = Places;