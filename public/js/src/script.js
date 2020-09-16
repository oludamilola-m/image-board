(function () {
  // takes two argument, first the name and second binding the html and the script together
  Vue.component("image-details", {
    template: "#image-details",
    props: ["imageId"],
    data: function () {
      return {
        image: {},
        comment: "",
        comments: [],
        name: "",
      };
    },
    //runs only when the component  is mounted
    mounted: function () {
      // use axios to make call to the server to get data
      var that = this;
      axios
        .get(`/images/${this.imageId}`)
        .then(function (res) {
          that.image = res.data.image;
          that.comments = res.data.comments;
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    // all d functions that handles event happens inside methods
    methods: {
      handleClick: function (e) {
        var that = this;
        e.preventDefault();
        var newInfo = {
          username: this.name,
          comment: this.comment,
          image_id: this.imageId,
        };
        axios
          .post("/comments", newInfo)
          .then(function (res) {
            that.comments.unshift(res.data.comment);
            console.log("posting res:", res.data.comment.username);
          })
          .catch(function (err) {
            console.log(err);
          });
      },
    },
  });

  //controls how component is rendered once the page loads
  //any code that has to do with rendering leaves in the vue instance
  new Vue({
    // bind vue to a specific DOM node(main) in index.html
    el: "main",
    data: {
      images: [],
      title: "",
      description: "",
      username: "",
      file: null,
      showModal: false, //toggling component
      imageId: null,
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
    //method in vue instance can only function on element in main
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

      openModal: function (id) {
        this.showModal = true;
        this.imageId = id;
      },

      closeModal: function () {
        this.showModal = false;
      },

      onEnlargeText: function (enlargeAmount) {
        this.postFontSize += enlargeAmount;
      },
    },
  });
})();
