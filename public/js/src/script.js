// How vue talks to server

(function () {
  // vue has a constructor that allows us to be able to use vue

  new Vue({
    // bind vue to a specific DOM node(main) in index.html
    el: "main",
    data: {
      images: [],
    },

    // MOUNTED: one of the lifecycle method is 'mounted' is value is a func, a func that only runs once
    //runs after the html has been rendered
    // a better place to fetch data from a database and render it
    //axios is a libray that allows us make HTTP REQUEST
    mounted: function () {
      // console.log("this: ", this);
      // this.heading = "Lions are cute";
      var that = this;
      axios
        .get("/animals")
        .then(function (res) {
          console.log("results: ", res);
          //this in a nested fnc losses it focus and refers to a global obj(window obj)
          //using arrow fnc borrow the 'this' in the function they are in , so dont lose the vue focus
          // console.log("that inside then: ", that);
          //console.log(res.data.animals);
          that.images = res.data.setImage;
          console.log(" that.images: ", that.images);
        })
        .catch(function (err) {
          console.log("err in GET /animals: ", err);
        });
    },
  });
})();
