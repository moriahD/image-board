// inside of JS directory, create "script.js" here is where All the Vue code will go!
// client side javascript
// el stands for element

(function() {
    new Vue({
        el: ".main", //element outside of this will not have access to vue
        data: {
            images: []
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
        } //adding mounted function to make ajax request or get API data
    }); // closing Vue
})();

// mounted: runs after HTML has loaded. It's a "lifecycle method"
// In "mounted" we're going to make ajax requests to get data the user wnats to see the initial moment the page is loaded

// If you're ever in a situation (which you will be a lot!) in which you want to render information the moment the page is rendered... you'll probably want to fetch that data in the "mounted" function!

// PROPERTIES OF "DATA" BECOMES PROPERTIES OF "THIS"
