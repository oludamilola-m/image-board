(function () {
  new Vue({
    // bind vue to a specific DOM node(main) in index.html
    el: "main",
    data: {
      images: [],
      title: "",
      description: "",
      username: "",
      file: null,
    },

    mounted: function () {
      var that = this;
      axios
        .get("/images")
        .then(function (res) {
          that.images = res.data.images;
        })
        .catch(function (err) {
          console.log("err: ", err);
        });
    },
    methods: {
      handleClick: function (e) {
        var that = this;
        e.preventDefault();
        var formData = new FormData(); //send file to server
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("username", this.username);
        formData.append("file", this.file);

        axios
          .post("/upload", formData)
          .then(function (res) {
            that.images.unshift(res.data.image);
          })
          .catch(function (err) {
            console.log(err);
          });
      },

      handleChange: function (e) {
        e.preventDefault();
        this.file = e.target.files[0];
      },
    },
  });
})();
