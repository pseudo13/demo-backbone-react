import _ from 'underscore';

const DogModel = Backbone.Model.extend({
    urlRoot: 'https://random.dog/woof.json'
})

const DogView = Backbone.View.extend({
    model: DogModel,
    template: _.template(`
        <h3>Look at this cute puppy: (Refresh after 30s)</h3>
        <%if(isImage){%>
            <img height="200" src="<%= url %>" on/>
        <%}else{%>
            <video style="width: 150px; height: 200px" src="<%= url %>" control="true" />
        <%}%>
        <%if(error){%>
            <p><%= error %></>
            <%}%>
    `),
    events: { 'error img': 'failedToLoadImage' },
    failedToLoadImage: function () {
        this.models.error = "Failed to load image from url";
    },
    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },
    render() {
        const content = this.model.toJSON();
        const isImage = this.isImage(content.url);
        this.$el.html(this.template({ url: content.url.toLowerCase(), error: content.error, isImage: isImage }));
        return this;
    },
    isImage: (url) => {
        return url.match(/\.(jpeg|jpg|png|gif)/g)
    }
})

export const createComponent = async (element) => {
    const model = new DogModel();
    await model.fetch();

    const newView = new DogView({ model: model, el: element });

    const intervalId = setInterval(() => {
        model.fetch();
    }, 1000 * 30);
    return { newView, intervalId };
}
