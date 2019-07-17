(function() {
    Vue.component("image-modal", {
        //writing name"love-component" , multiple way with dashes is convention
        template: "#currentImage", //no el, but specify template, and component should be written in html tag. not string. it should be one wrapped element contains everything else, backtick is not suggeted
        data: function() {
            return {
                something: "vue"
            };
        },
        props: ["currentImage"],
        mounted: function() {
            console.log("id: ", this.id);
        },
        methods: {
            clicked: function() {
                this.something = this.whatever;
            }, //should not change property again inside of component. props comes from outside and just use it.
            clickedspan: function() {
                this.$emit("change");
            },
            closebtn: function() {
                console.log("let's close");
                this.$emit("close");
                this.currentImage = false;
            }
        }
    });
})();

// objecct passed with vue component is just exactly like vue object...
// but you do not get 'el', idea of component is there is already element. there isn't no pre-exist element.
// component can also have data but different way from they way you do inside of vue, the data in component runs only once and shared with everything. each instance of component should have own data

///passing data to child////
// parents know the name of property and child should know what that name is
