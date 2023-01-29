import _ from 'underscore';

const JokeModel = Backbone.Model.extend({
    urlRoot: 'https://v2.jokeapi.dev/joke/Any?safe-mode'
})

const JokeView = Backbone.View.extend({
    model: JokeModel,
    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },
    template: _.template(`
        <h3>Check out this hilarious joke: (Refresh after 30s)</h3>
        <p>Category: <%= content.type %></p>
        <p>Joke: <%= content.joke ?? 'Need time for telling!'%></p>
        <p>Setup: <%= content.setup ?? 'Not necessary' %></p>
        <p>Delivery: <%= content.delivery ?? 'Not necessary'%></p>
        `),
    render() {
        const content = this.model.toJSON();
        this.$el.html(this.template({ content: content }));
        return this;
    }
})

export const createComponent = async (element) => {
    const model = new JokeModel();
    await model.fetch();

    const newView = new JokeView({ model: model, el: element });
    const intervalId = setInterval(() => {
        model.fetch();
    }, 1000 * 30);
    return { newView, intervalId };
}
