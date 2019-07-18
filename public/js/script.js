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
            id: "",
            currentImage: false,
            favoritething: "peanut butter"
        }, //closing data
        mounted: function() {
            var self = this;

            axios
                .get("/images")
                .then(function(resp) {
                    self.images = resp.data;
                })
                .catch(function(err) {
                    console.log("err in GET /images: ", err);
                });
            // addEventListener('hashchange', function(){
            //  self.currentImage = location.hash.slice(1);
            // });
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

                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("resp from POST / upload: ", resp);
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
            },
            close: function() {
                this.currentImage = false;
                location.hash = "";
                history.replaceState(null, null, " ");
            }
            // ,
            // submit_comment: function() {
            //
            // }
        } // closes methods
    }); // closing Vue
})(); //closing lifecycle
