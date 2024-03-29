// inside of JS directory, create "script.js" here is where All the Vue code will go!
// client side javascript
// el stands for element

(function() {
    new Vue({
        el: ".main", //element outside of this will not have access to vue
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            id: location.hash.slice(1),
            currentImage: false,
            favoritething: "peanut butter",
            showLoadMore: true
        }, //closing data

        mounted: function() {
            var self = this;
            axios
                .get("/images")
                .then(function(resp) {
                    self.images = resp.data;
                    addEventListener("hashchange", function() {
                        self.id = location.hash.slice(1);
                    });
                })
                .catch(function(err) {
                    console.log("err in GET /images: ", err);
                });
        }, //closes mounted
        methods: {
            // every single function that runs in reponse to an event must be defined in methods
            handleClick: function() {
                console.log("this", this);
                // FormData API is necessary for sending FIELS from client to server
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("username", this.username);
                formData.append("description", this.description);
                formData.append("file", this.file);
                var self = this;
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("resp from POST / upload: ", resp);
                        return self.images.unshift(resp.data);
                    })
                    .catch(function(err) {
                        console.log("error in POST / upload: ", err);
                    });
            }, //closes handle click function
            handleChange: function(event) {
                this.file = event.target.files[0];
            }, // closes handle change function
            clicked: function(id) {
                this.currentImage = id;
                console.log("id in clicked current img", id);
            },
            close: function() {
                this.currentImage = false;
                location.hash = "";
                history.replaceState(null, null, " ");
            },
            getMoreImages: function() {
                var lastImageDisplayedId = this.images[this.images.length - 1]
                    .id;
                // console.log("lastImageDisplayedId : ", lastImageDisplayedId);
                // console.log("this", this);
                var oldestImageId = null;
                axios
                    .get("/images/oldestId")
                    .then(result => {
                        oldestImageId = result.data[0].id;
                    })
                    .then(
                        axios
                            .get("/images/" + lastImageDisplayedId)
                            .then(resp => {
                                var lastImageLoadedId =
                                    resp.data[resp.data.length - 1].id;

                                if (lastImageLoadedId == oldestImageId) {
                                    this.showLoadMore = false;
                                }
                                this.images = this.images.concat(resp.data);
                            })
                            .catch()
                    )
                    .catch();

                //axios get
            }
        } // closes methods
    }); // closing Vue
})(); //closing lifecycle
