(function () {
  // takes two argument, first the name and second binding the html and the script together
  Vue.component("image-details", {
    template: "#image-details",
    props: ["imageId", "parentCloseModal"],
    data: function () {
      return {
        name: "",
        image: {},
        comment: "",
        nextImageId: null,
        previousImageId: null,
        comments: [],
      };
    },
    //runs only when the component  is mounted
    mounted: function () {
      // use axios to make call to the server to get data
      this.displayImageInModal();
    },
    watch: {
      imageId: function () {
        this.displayImageInModal();
      },
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
          })
          .catch(function (err) {
            console.log(err);
          });
      },

      displayImageInModal: function () {
        var that = this;
        axios
          .get(`/images/${this.imageId}`)
          .then(function (res) {
            if (!res.data.image) {
              that.parentCloseModal();
            } else {
              that.image = res.data.image;
              that.comments = res.data.comments;
              that.nextImageId = res.data.nextImageId;
              that.previousImageId = res.data.previousImageId;
            }
          })
          .catch(function () {
            that.parentCloseModal();
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
      imageId: location.hash.slice(1),
    },

    mounted: function () {
      var that = this;
      axios
        .get("/images")
        .then(function (res) {
          that.images = res.data.images;
          that.checkScrollerPosition();
        })
        .catch(function (err) {
          console.log("err: ", err);
        });

      window.addEventListener("hashchange", function () {
        that.imageId = location.hash.slice(1);
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

      // handleFetchMore: function (e) {
      //   that = this;
      //   e.preventDefault();
      //   const lastId = that.images[that.images.length - 1].id;
      //   axios
      //     .get("/images", {
      //       params: { lastId: lastId },
      //     })
      //     .then(function (res) {
      //       that.images.push(...res.data.images);
      //     })
      //     .catch(function (err) {
      //       console.log(err);
      //     });
      // },

      checkScrollerPosition: function (e) {
        setTimeout(() => {
          var isBottom =
            window.pageYOffset + window.innerHeight >=
            document.body.clientHeight;
          if (isBottom) {
            this.fetchMore();
          } else {
            this.checkScrollerPosition();
          }
        }, 500);
      },

      fetchMore: function () {
        that = this;

        const lastId = that.images[that.images.length - 1].id;
        axios
          .get("/images", {
            params: { lastId: lastId },
          })
          .then(function (res) {
            that.images.push(...res.data.images);
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
        this.imageId = id;
      },

      closeModal: function () {
        this.imageId = null;
        history.pushState({}, "", "/");
      },
    },
  });
})();
