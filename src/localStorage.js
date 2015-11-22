(function () {
  "use strict";

  if (window.localStorage) {
    window.appLocalStorage = {
      get userName() {
        return localStorage.getItem('userName');
      },
      set userName(value) {
        localStorage.setItem('userName', value);
      },
      clear: localStorage.clear.bind(localStorage)
    };
  }
})();