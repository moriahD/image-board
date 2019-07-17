--------------------------index.html--------------------------

<!doctype html>
<html>
<head>
    <title>Imageboard</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <h1>I <span>squre</span> pixels</h1>
    <p>latest images</p>

    <div class="main">
        <love-component v-bind:whatever="favoritething"></love-component>
        <div>
            <input v-model="favoritething">
        </div>
        <love-component v-if="showSecondLovecomponent" :whatever="favoritething"
        @change ="change">



    </love-component>
        <form>
            <input v-model='title' type="text" name="title" placeholder="title">
            <input v-model='description' type="text" name="description" placeholder="description">
            <input v-model='username' type="text" name="username" placeholder="username">
            <input @change='handleChange' type="file" name="file" accept='image/*'>
            <button @click.prevent.default='handleClick'>submit</button>
        </form>
        <section v-if="images.length > 0" class="grid-container">
            <div v-for='image in images' class="card" @click="clicked">

                <img :src="image.url" :alt="image.title">
                <div class="wrap_p">
                    <p>{{image.title}}</p>
                </div>

            </div>
        </section>
        <p v-else>no images!!!</p>
        <image-model v-if="currentImage" :id="currentImage" @close="closeModal"></image-modal>
    </div>


    <script src="text/x-template" id="love-template">
        <p @click="clicked" class="compo" >I love <strong>component</strong> {{something}} <span v-if="whatever" @click="clickedspan"> and {{whatever}} {{favoritething}}</span></p>
    </script> <!--for styling or adding component contents. it must stay outside of vue element-->
    <script src="/js/vue.js"></script>
    <script src="/js/axios.min.js"></script>
    <script src="/js/component.js" ></script>
    <script src="/js/script.js" ></script>

</body>
</html>

------------------------script.js----------------------------
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
showSecondLovecomponent: false,
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
            clicked: function() {
                this.showSecondLovecomponent = true;
            },
            change: function() {
                this.favoritething = "kittens";
            }
        } // closes methods
    }); // closing Vue

})(); //closing lifecycle

------------------------component.js----------------------------
