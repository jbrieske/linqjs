/*!
 * linqjs v0.0.0
 * (c) Sven Schmidt 
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
  'use strict';

  // this || (0, eval)('this') is a robust way for getting a reference
  // to the global object

  var window = this || (0, eval)('this'); // jshint ignore:line
  (function (factory) {
    try {
      if (typeof define === 'function' && define.amd) {
        // AMD asynchronous module definition (e.g. requirejs)
        define(['require', 'exports'], factory);
      } else if (exports && module && module.exports) {
        // CommonJS/Node.js where module.exports is for nodejs
        factory(exports || module.exports);
      }
    } catch (err) {
      // no module loader (simple <script>-tag) -> assign Maybe directly to the global object
      // -> (0, eval)('this') is a robust way for getting a reference to the global object
      factory(window.linqjs = {}); // jshint ignore:line
    }
  })(function (linqjs) {
    function __assert(condition, msg) {
      if (!condition) {
        throw new Error(msg);
      }
    }

    function __assertFunction(param) {
      __assert(isFunction(param), 'Parameter must be function!');
    }

    function __assertArray(param) {
      __assert(isArray(param), 'Parameter must be array!');
    }

    function __assertNotEmpty(arr) {
      __assert(isArray(arr));
      __assert(!isEmpty(arr), 'Sequence is empty');
    }

    function __assertIterable(obj) {
      __assert(isIterable(obj), 'Parameter must be iterable!');
    }

    function __assertIterationNotStarted(collection) {
      var iterationStarted = 'StartedIterating' in collection && collection.StartedIterating();
      __assert(!iterationStarted, 'Iteration already started!');
    }

    function __assertString(obj) {
      __assert(isString(obj), 'Parameter must be string!');
    }
    function isArray(obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function isFunction(obj) {
      return typeof obj === 'function';
    }

    function isNumeric(n) {
      return !isNaN(parseFloat(n));
    }

    function isEmpty(arr) {
      __assertArray(arr);

      return arr.length === 0;
    }

    function isIterable(obj) {
      return Symbol.iterator in obj;
    }

    function isString(obj) {
      return typeof obj === 'string';
    }function __assign(target, source) {
      target = Object(target);

      if (Object.hasOwnProperty('assign') && typeof Object.assign === 'function') {
        Object.assign(target, source);
      } else {
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    }

    function __export(obj) {
      __assign(linqjs, obj);
    }

    function isES6() {
      // use evaluation to prevent babel to transpile this test into ES5
      return new Function('\n      try {\n        return (() => true)();\n      } catch (err) {\n        return false\n      }\n    ')();
    }

    function capitalize(str) {
      str = String(str);

      return str.charAt(0).toUpperCase() + str.substr(1);
    }

    function filterArray(arr) {
      var predicate = arguments.length <= 1 || arguments[1] === undefined ? function (elem, index) {
        return true;
      } : arguments[1];
      var stopAfter = arguments.length <= 2 || arguments[2] === undefined ? Infinity : arguments[2];

      __assert(isArray(arr), 'arr must be array!');
      __assertFunction(predicate);
      __assert(isNumeric(stopAfter), 'stopAfter must be numeric!');

      var result = [];
      var length = arr.length;

      for (var i = 0; i < length; i++) {
        if (predicate(arr[i], i)) {
          result.push(arr[i]);

          if (result.length >= stopAfter) {
            break;
          }
        }
      }

      return result;
    }

    function aggregateArray(arr, seed, accumulator, resultTransformFn) {
      __assertFunction(accumulator);
      __assertFunction(resultTransformFn);
      __assertNotEmpty(arr);

      return resultTransformFn([seed].concat(arr).reduce(accumulator));
    }

    var defaultEqualityCompareFn = function defaultEqualityCompareFn(a, b) {
      return a === b;
    };

    function removeDuplicates(arr) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? defaultEqualityCompareFn : arguments[1];

      __assert(isArray(arr), 'arr must be array!');
      __assertFunction(equalityCompareFn);

      var result = [];
      var length = arr.length;

      outer: for (var i = 0; i < length; i++) {
        var current = arr[i];

        inner: for (var j = 0; j < result.length; j++) {
          if (equalityCompareFn(current, result[j])) {
            continue outer;
          }
        }

        result.push(current);
      }

      return result;
    }

    var nativeConstructors = [Object, Number, Boolean, String, Symbol];

    function isNative(obj) {
      return (/native code/.test(Object(obj).toString()) || !!~nativeConstructors.indexOf(obj)
      );
    }

    function getDefault() {
      var constructorOrValue = arguments.length <= 0 || arguments[0] === undefined ? Object : arguments[0];

      if (constructorOrValue && isNative(constructorOrValue) && typeof constructorOrValue === 'function') {
        var defaultValue = constructorOrValue();

        if (defaultValue instanceof Object || constructorOrValue === Date) {
          return null;
        } else {
          return defaultValue;
        }
      }

      return constructorOrValue;
    }
    function install() {
      __assign(Array.prototype, linqjs);
    }

    function __assertAllNumeric(arr) {}

    function Min() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertFunction(mapFn);
      __assertNotEmpty(this);

      return Math.min.apply(null, this.map(mapFn));
    }

    function Max() {
      var mapFn = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return x;
      } : arguments[0];

      __assertFunction(mapFn);
      __assertNotEmpty(this);

      return Math.max.apply(null, this.map(mapFn));
    }

    function Sum() {
      __assertNotEmpty(this);

      return this.reduce(function (prev, curr) {
        return prev + curr;
      });
    }

    function Average() {
      __assertNotEmpty(this);

      return Sum.call(this) / this.length;
    }

    function Concat(second) {
      __assert(isArray(second), 'second must be an array!');

      return Array.prototype.concat.apply(this, second);
    }

    function Union(second) {
      var equalityCompareFn = arguments.length <= 1 || arguments[1] === undefined ? function (a, b) {
        return a === b;
      } : arguments[1];

      return removeDuplicates(this.Concat(second), equalityCompareFn);
    }

    function Where() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      return filterArray(this, predicate);
    }

    /**
     * Count - Returns the amount of elements matching a predicate or the array length if no parameters given
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.count(v=vs.110).aspx
     * @param  {Function} predicate
     * @return {Number}
     */
    function Count() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      return filterArray(this, predicate).length;
    }

    /**
     * Any - Returns true if at least one element matches the predicate or if no predicate is given but the sequence contains at least one element
     *
     * @see https://msdn.microsoft.com/de-de/library/bb337697(v=vs.110).aspx
     * @param  {Function} predicate
     * @return {Boolean}
     */
    function Any(predicate) {
      if (!predicate) {
        return this.length > 0;
      }

      __assertFunction(predicate);
      return filterArray(this, predicate, 1).length > 0;
    }

    /**
     * All - Returns true if all elements match the predicate
     *
     * @see https://msdn.microsoft.com/de-de/library/bb548541(v=vs.110).aspx
     * @param  {Function} predicate
     * @return {Boolean}
     */
    function All() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      // All is equal to the question if there's no element which does not match the predicate
      // 'all fruits are yellow' -> 'there is no fruit which is not yellow'
      return !this.Any(function (x) {
        return !predicate(x);
      });
    }

    function Contains(elem) {
      return !!~this.indexOf(elem);
    }

    /**
     * ElementAt - Returns the element at the given index
     *
     * @see https://msdn.microsoft.com/de-de/library/bb299233(v=vs.110).aspx
     * @param  {Number} index
     * @return {any}
     */
    function ElementAt(index) {
      __assert(index < this.length && index >= 0, 'Array index is out of bounds!');
      __assert(isNumeric(index), 'Index must be numeric!');

      return this[index];
    }

    /**
     * Take - Returns count elements of the sequence starting from the beginning
     *
     * @see https://msdn.microsoft.com/de-de/library/bb503062(v=vs.110).aspx
     * @param  {Number} count = 0 number of elements to be returned
     * @return {Array}
     */
    function Take() {
      var count = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      __assert(isNumeric(count), 'First parameter must be numeric!');

      if (count <= 0) {
        return [];
      }

      return this.slice(0, count);
    }

    /**
     * findFirstNonMatchingIndex - Returns the first index of the array which does not match the predicate
     *
     * @param  {Array} arr
     * @param  {Function} predicate
     * @return {Number}
     */
    function findFirstNonMatchingIndex(arr, predicate) {
      __assertArray(arr);

      var length = arr.length;

      for (var i = 0; i < length; i++) {
        if (!predicate(arr[i], i)) {
          return i;
        }
      }

      return arr.length - 1;
    }

    /**
     * Skip - Skips count elements of the sequence and returns the remaining ones
     *
     * @see https://msdn.microsoft.com/de-de/library/bb358985(v=vs.110).aspx
     * @param  {Nu,ber count = 0 amount of elements to skip
     * @return {Array}
     */
    function Skip() {
      var count = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

      __assert(isNumeric(count), 'First parameter must be numeric!');

      if (count <= 0) {
        return this;
      }

      return this.slice(count, this.length);
    }

    /**
     * TakeWhile - Takes elements from the beginning of a sequence until the predicate yields false for an element
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.takewhile(v=vs.110).aspx
     * @param  {Function} predicate     the predicate of the form elem => boolean or (elem, index) => boolean
     * @return {Array}
     */
    function TakeWhile() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      return this.Take(findFirstNonMatchingIndex(this, predicate));
    }

    /**
     * SkipWhile - Skips elements in the array until the predicate yields false and returns the remaining elements
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.skipwhile(v=vs.110).aspx
     * @param  {type} predicate         the predicate of the form elem => boolean or (elem, index) => boolean
     * @return {Array}
     */
    function SkipWhile() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (elem, index) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);

      return this.Skip(findFirstNonMatchingIndex(this, predicate));
    }

    function First() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);
      __assertNotEmpty(this);

      var result = filterArray(this, predicate, 1);

      if (result[0]) {
        return result[0];
      }

      return null;
    }

    function resultOrDefault(arr, originalFn) {
      var predicateOrConstructor = arguments.length <= 2 || arguments[2] === undefined ? function (x) {
        return true;
      } : arguments[2];
      var constructor = arguments.length <= 3 || arguments[3] === undefined ? Object : arguments[3];

      __assertArray(arr);

      var predicate = void 0;

      if (isNative(predicateOrConstructor)) {
        predicate = function predicate(x) {
          return true;
        };
        constructor = predicateOrConstructor;
      } else {
        predicate = predicateOrConstructor;
      }

      __assertFunction(predicate);
      __assert(isNative(constructor), 'constructor must be native constructor, e.g. Number!');

      if (!isEmpty(arr)) {
        var result = originalFn.call(arr, predicate);

        if (result) {
          return result;
        }
      }

      return getDefault(constructor);
    }

    function FirstOrDefault() {
      var predicateOrConstructor = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];
      var constructor = arguments.length <= 1 || arguments[1] === undefined ? Object : arguments[1];

      return resultOrDefault(this, First, predicateOrConstructor, constructor);
    }

    function Last() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);
      __assertNotEmpty(this);

      return this.reverse().First(predicate);
    }

    function LastOrDefault() {
      var predicateOrConstructor = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];
      var constructor = arguments.length <= 1 || arguments[1] === undefined ? Object : arguments[1];

      return resultOrDefault(this, Last, predicateOrConstructor, constructor);
    }

    function Single() {
      var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];

      __assertFunction(predicate);
      __assertNotEmpty(this);

      var result = filterArray(this, predicate);

      if (result.length === 1) {
        return result[0];
      }

      throw new Error('Sequence contains more than one element');
    }

    function SingleOrDefault() {
      var predicateOrConstructor = arguments.length <= 0 || arguments[0] === undefined ? function (x) {
        return true;
      } : arguments[0];
      var constructor = arguments.length <= 1 || arguments[1] === undefined ? Object : arguments[1];

      return resultOrDefault(this, Single, predicateOrConstructor, constructor);
    }

    /**
     * DefaultIfEmpty - Returns the array or a new array containing the provided constructors default if empty
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
     * @param {Function} constructor A native constructor to get the default for, e.g. Number
     * @return {Array} 
     */ /**
        * DefaultIfEmpty - Returns the array or a new array containing the provided default value if empty
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.defaultifempty(v=vs.110).aspx
        * @param {any} value The default vlaue
        * @return {Array}
        */
    function DefaultIfEmpty(constructorOrValue) {
      if (!isEmpty(this)) {
        return this;
      }

      return [getDefault(constructorOrValue)];
    }

    /**
     * Default comparator implementation that uses the "<" operator.
     * Retuns values as specified by the comparator function fir Array.sort().
     * 
     * @param  {T}  a   Element "a" to be compared.
     * @param  {T}  b   Element "b" to be compared.
     * @param {any} <T> Element type.
     *
     * @return {number} Returns -1 if "a" is smaller than "b",
     *                  returns  1 if "b" is smaller than "a",
     *                  returns  0 if they are equal.
     */
    var DefaultComparator = function DefaultComparator(a, b) {
      if (a < b) {
        return -1;
      }
      if (b < a) {
        return 1;
      }
      return 0;
    };

    /*
     * Partially sorted heap that contains the smallest element within root position.
     */
    var MinHeap = function () {

      /**
       * Creates the heap from the array of elements with the given comparator function.
       * 
       * @param {T[]}              elements   Array with elements to create the heap from.
       *                                      Will be modified in place for heap logic.
       * @param {(T, T) => number} comparator Comparator function (same as the one for Array.sort()).
       * @param {any}              <T>        Heap element type.
       */
      function MinHeap(elements) {
        var comparator = arguments.length <= 1 || arguments[1] === undefined ? DefaultComparator : arguments[1];

        __assertArray(elements);
        __assertFunction(comparator);

        this.comparator = comparator;
        this.elements = elements;

        // create heap ordering
        createHeap(this.elements, this.comparator);
      }

      /**
       * Places the element at the given position into the correct position within the heap.
       * 
       * @param {T}                elements   Array with elements used for the heap.
       * @param {(T, T) => number} comparator Comparator function (same as the one for Array.sort()).
       * @param {number}           i          Index of the element that will be placed to the correct position.
       * @param {any}              <T>        Heap element type.
       */
      function heapify(elements, comparator, i) {
        var right = 2 * (i + 1);
        var left = right - 1;
        var bestIndex = i;

        // check if the element is currently misplaced
        if (left < elements.length && comparator(elements[left], elements[bestIndex]) < 0) {
          bestIndex = left;
        }
        if (right < elements.length && comparator(elements[right], elements[bestIndex]) < 0) {
          bestIndex = right;
        }

        // if the element is misplaced, swap elements and continue until we get the right position
        if (bestIndex !== i) {
          var tmp = elements[i];
          elements[i] = elements[bestIndex];
          elements[bestIndex] = tmp;

          // let misplaced elements "bubble up" to get heap properties
          heapify(elements, comparator, bestIndex);
        }
      }

      /**
       * Creates a heap from the given array using the given comparator.
       * 
       * @param {T[]}              elements   Array with elements used for the heap.
       *                                      Will be modified in place for heap logic.
       * @param {(T, T) => number} comparator Comparator function (same as the one for Array.sort()).
       * @param {any}              <T>        Heap element type.
       */
      function createHeap(elements, comparator) {
        for (var i = Math.floor(elements.length / 2); i >= 0; i--) {

          // do fancy stuff
          heapify(elements, comparator, i);
        }
      }

      /**
       * Checks if the heap contains at least one element.
       * 
       * @return {boolean} If the heap contains elements or not.
       */
      MinHeap.prototype.hasTopElement = function () {
        return this.elements.length > 0;
      };

      /**
       * Gets and removes the top element from the heap.
       * This method performs a bit of reordering to keep heap properties.
       * 
       * @param {any} <T> Heap element type.
       * 
       * @return {T} Top element from heap.
       */
      MinHeap.prototype.getTopElement = function () {
        // special case: only one element left
        if (this.elements.length === 1) {
          return this.elements.pop();
        }

        var topElement = this.elements[0];
        var tmp = this.elements.pop();
        this.elements[0] = tmp;

        // do fancy stuff
        heapify(this.elements, this.comparator, 0);

        return topElement;
      };

      /**
       * Creates an iterator for this heap instance.
       * 
       * @return {Iterator} Iterator for the heap.
       */
      MinHeap.prototype[Symbol.iterator] = function () {

        // keep matching heap instance
        var heap = this;
        return {
          next: function next() {
            if (heap.hasTopElement()) {
              return {
                done: false,
                value: heap.getTopElement()
              };
            }
            return {
              done: true
            };
          }
        };
      };

      return MinHeap;
    }();

    /*
     * Partially sorted heap that contains the largest element within root position.
     */
    var MaxHeap = function () {

      /**
       * Creates the heap from the array of elements with the given comparator function.
       * 
       * @param {T[]}               elements   Array with elements to create the heap from.
       *                                       Will be modified in place for heap logic.
       * @param {(T, T) => boolean} comparator Comparator function (same as the one for Array.sort()).
       * @param {any}               <T>        Heap element type.
       */
      function MaxHeap(elements) {
        var comparator = arguments.length <= 1 || arguments[1] === undefined ? DefaultComparator : arguments[1];

        __assertArray(elements);
        __assertFunction(comparator);

        // simply negate the result of the comparator function so we get reverse ordering within the heap
        MinHeap.apply(this, [elements, function (a, b) {
          return -1 * comparator(a, b);
        }]);
      }

      // inheritance stuff (we don't want to implement stuff twice)
      MaxHeap.prototype = Object.create(MinHeap.prototype);
      MaxHeap.prototype.constructor = MaxHeap;

      return MaxHeap;
    }();

    // TODO: change implementation to use iterators!

    function Order() {
      return this.OrderBy(DefaultComparator);
    }

    function OrderCompare() {
      return this.sort(DefaultComparator);
    }

    function OrderBy(comparator) {
      __assertFunction(comparator);
      var heap = new MinHeap(this, comparator);
      return [].concat(_toConsumableArray(heap));
    }

    function OrderDescending() {
      return this.OrderByDescending(DefaultComparator);
    }

    function OrderByDescending(comparator) {
      __assertFunction(comparator);
      var heap = new MaxHeap(this, comparator);
      return [].concat(_toConsumableArray(heap));
    }

    /**
     * Aggregate - applies a accumulator function to a sequence
     *
     * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
     * @param {Function} accumulator The accumulator function of the form (prev, current) => any
     * @return {any} the result of the accumulation
     */ /**
        * Aggregate - applies a accumulator function to a sequence. Starts with seed.
        *
        * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
        * @param {any} seed The starting value of the accumulation
        * @param {Function} accumulator The accumulator function of the form (prev, current) => any
        * @return {any} the result of the accumulation
        */ /**
           * Aggregate - applies a accumulator function to a sequence. Starts with seed and transforms the result using resultTransformFn.
           *
           * @see https://msdn.microsoft.com/de-de/library/system.linq.enumerable.aggregate(v=vs.110).aspx
           * @param {any} seed The starting value of the accumulation
           * @param {Function} accumulator The accumulator function of the form (prev, current) => any
           * @param {Function} resultTransformFn A function to transform the result
           * @return {any} the result of the accumulation
           * @
           */
    function Aggregate(seedOrAccumulator, accumulator, resultTransformFn) {
      if (typeof seedOrAccumulator === 'function' && !accumulator && !resultTransformFn) {
        return aggregateArray(this.slice(1, this.length), this[0], seedOrAccumulator, function (elem) {
          return elem;
        });
      } else if (typeof seedOrAccumulator !== 'function' && typeof accumulator === 'function' && !resultTransformFn) {
        return aggregateArray(this, seedOrAccumulator, accumulator, function (elem) {
          return elem;
        });
      } else {
        return aggregateArray(this, seedOrAccumulator, accumulator, resultTransformFn);
      }
    }

    /**
     * Distinct - Returns the distinct elemens from a sequence using the default equality compare function
     *
     * https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
     * @return {Array} 
     */ /**
        * Distinct - Returns the distinct elemens from a sequence using a provided equality compare function
        *
        * https://msdn.microsoft.com/de-de/library/system.linq.enumerable.distinct(v=vs.110).aspx
        * @param {Function} equalityCompareFn The function of the form (first, second) => boolean determining if the values are equal
        * @return {Array}
        */
    function Distinct() {
      var equalityCompareFn = arguments.length <= 0 || arguments[0] === undefined ? defaultEqualityCompareFn : arguments[0];

      __assertFunction(equalityCompareFn);

      return removeDuplicates(this, equalityCompareFn);
    }

    /*
     * Basic collection for lazy linq operations.
     */
    var LinqCollection = function () {

      /**
       * Creates a new LinqCollection from the given iterable.
       * 
       * @param {Iterable<T>} iterable Datasource for this collection.
       * @param {any}         <T>      Element type.
       */
      function LinqCollection(iterable) {
        __assertIterable(iterable);
        this._source = iterable;
        this.__startedIterating = false;
        this.__iterationIndex = 0;
      }

      /**
       * Hook function that will be called once before iterating.
       */
      LinqCollection.prototype._initialize = function _initialize() {
        this.__sourceIterator = this._source[Symbol.iterator]();
      };

      /**
       * Internal iterator.next() method.
       * 
       * @param {any} <T> Element type.
       * @return {IterationElement<T>} Next element when iterating.
       */
      LinqCollection.prototype._next = function _next() {
        return this.__sourceIterator.next();
      };

      /**
       * Internal function that ensures the _initialize() hook is invoked once.
       * This function also adds the iteration index to the result of _next().
       * 
       * @param {any} <T> Element type.
       * @return {IterationElement<T>} Next element when iterating.
       */
      LinqCollection.prototype.__wrappedNext = function __wrappedNext() {
        if (!this.__startedIterating) {
          this.__startedIterating = true;
          this._initialize();
        }
        var result = this._next();
        if (!result.done) {
          result.index = this.__iterationIndex;
          this.__iterationIndex++;
        }
        return result;
      };

      /**
       * Creates an array from this collection.
       * Iterates once over its elements.
       * 
       * @param {any} <T> Element type.
       * @return {T[]} Array with elements from this collection.
       */
      LinqCollection.prototype.ToArray = function toArray() {
        return [].concat(_toConsumableArray(this));
      };

      /**
       * Returns wheather iteration has started or not.
       * If iteration has not been started yet, _initialize() has not yet been called.
       *
       * @return {boolean}
       */
      LinqCollection.prototype.StartedIterating = function StartedIterating() {
        return this.__startedIterating;
      };

      /**
       * Provides an iterator for this collection.
       * 
       * @param {any} <T> Element type.
       * @return {Iterator<T>} Iterator for this collection.
       */
      LinqCollection.prototype[Symbol.iterator] = function () {
        var _this = this;

        __assertIterationNotStarted(this);
        return {
          next: function next() {
            return _this.__wrappedNext();
          }
        };
      };

      return LinqCollection;
    }();

    /**
     * Creates a LinqCollection from the given iterable.
     * 
     * @param {Iterable<T>} iterable Datasource for the collection.
     * @param {any}         <T>      Element type.
     * @return {LinqCollection<T>} Created LinqCollection.
     */
    function Linq(iterable) {
      __assertIterable(iterable);
      return new LinqCollection(iterable);
    }

    /*
     * Ordered linq collection.
     */
    var OrderedLinqCollection = function () {

      /**
       * Creates a new ordered linq collection using the given comparator and heap for sorting.
       * 
       * @param {Iterable<T>}       iterable        Datasource for this collection.
       * @param {(T, T) => boolean} comparator      Comparator for sorting.
       * @param {MinHeap|MaxHeap}   heapConstructor Heap implementation for sorting.
       * @param {any}               <T>             Element type.
       */
      function OrderedLinqCollection(iterable, comparator, heapConstructor) {
        __assertIterable(iterable);
        __assertFunction(comparator);
        __assertFunction(heapConstructor);
        LinqCollection.apply(this, [iterable]);

        this.__comparator = comparator;
        this.__heapConstructor = heapConstructor;
      }

      // inheritance stuff (we don't want to implement stuff twice)
      OrderedLinqCollection.prototype = Object.create(LinqCollection.prototype);
      OrderedLinqCollection.prototype.constructor = OrderedLinqCollection;

      /**
       * Specifies further sorting by the given comparator for equal elements.
       * 
       * @param {(T, T) => boolean} additionalComparator Comparator for sorting.
       * @param {any}               <T>                  Element type.
       * @return {OrderedLinqCollection<T>} Created ordered linq collection.
       */
      OrderedLinqCollection.prototype.ThenBy = function ThenBy(additionalComparator) {
        __assertIterationNotStarted(this);
        if (isString(additionalComparator)) {
          additionalComparator = GetComparatorFromKeySelector(additionalComparator);
        }
        __assertFunction(additionalComparator);

        // build new comparator function when not yet iterated
        var currentComparator = this.__comparator;
        this.__comparator = function (a, b) {
          var res = currentComparator(a, b);
          if (res !== 0) {
            return res;
          }
          return additionalComparator(a, b);
        };
        return this;
      };

      /**
       * Builds the heap for sorting.
       */
      OrderedLinqCollection.prototype._initialize = function _initialize() {

        // create array for heap
        var values = [].concat(_toConsumableArray(this._source));

        // create heap instance
        var heap = Reflect.construct(this.__heapConstructor, [values, this.__comparator]);

        // grab iterator for later use
        this.__heapIterator = heap[Symbol.iterator]();
      };

      /**
       * Returns the result of the heap iterator.
       * 
       * @param {any} <T> Element type.
       * @return {IterationElement<T>} Next element when iterating.
       */
      OrderedLinqCollection.prototype._next = function _next() {
        __assert(!!this.__heapIterator, 'No heap build!');
        return this.__heapIterator.next();
      };

      return OrderedLinqCollection;
    }();

    /*
     * Extend basis collection with ordering functions.
     */
    (function () {

      /**
       * Orderes this linq collection using the given comparator.
       * 
       * @param {(T, T) => boolean} comparator Comparator to be used.
       * @param {any}               <T>        Element type.
       * @return {OrderedLinqCollection<T>} Ordered collection.
       */
      LinqCollection.prototype.OrderBy = function OrderBy(comparator) {
        if (isString(comparator)) {
          comparator = GetComparatorFromKeySelector(comparator);
        }
        __assertFunction(comparator);
        return new OrderedLinqCollection(this, comparator, MinHeap);
      };

      /**
       * Orderes this linq collection in descending order using the given comparator.
       * 
       * @param {(T, T) => boolean} comparator Comparator to be used.
       * @param {any}               <T>        Element type.
       * @return {OrderedLinqCollection<T>} Ordered collection.
       */
      LinqCollection.prototype.OrderByDescending = function OrderByDescending(comparator) {
        if (isString(comparator)) {
          comparator = GetComparatorFromKeySelector(comparator);
        }
        __assertFunction(comparator);
        return new OrderedLinqCollection(this, comparator, MaxHeap);
      };
    })();

    /**
     * Creates a comparator function from the given selector string.
     * The selector string has to be in same format as within javascript code.
     * 
     * @param  {string} selector Javascript code selector string.
     * @return {(any, any) => boolean} Created comparator function.
     */
    function GetComparatorFromKeySelector(selector) {
      __assertString(selector);
      if (selector === '') {
        return Array.prototype.DefaultComparator;
      }
      if (!(selector.startsWith('[') || selector.startsWith('.'))) {
        selector = '.' + selector;
      }
      var result = void 0;
      eval('result = function (a, b) { return Array.prototype.DefaultComparator(a' + selector + ', b' + selector + ') }');
      return result;
    }

    /* Export public interface */
    __export({ install: install, Min: Min, Max: Max, Average: Average, Sum: Sum, Concat: Concat, Union: Union, Where: Where, Count: Count, Any: Any, All: All, ElementAt: ElementAt, Take: Take, TakeWhile: TakeWhile, Skip: Skip, SkipWhile: SkipWhile, Contains: Contains, First: First, FirstOrDefault: FirstOrDefault, Last: Last, LastOrDefault: LastOrDefault, Single: Single, SingleOrDefault: SingleOrDefault, DefaultIfEmpty: DefaultIfEmpty, DefaultComparator: DefaultComparator, MinHeap: MinHeap, MaxHeap: MaxHeap, Order: Order, OrderCompare: OrderCompare, OrderBy: OrderBy, OrderDescending: OrderDescending, OrderByDescending: OrderByDescending, Aggregate: Aggregate, Distinct: Distinct, LinqCollection: LinqCollection, Linq: Linq, GetComparatorFromKeySelector: GetComparatorFromKeySelector, OrderedLinqCollection: OrderedLinqCollection });
  });
})();