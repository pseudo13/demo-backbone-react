import _ from 'underscore';

const BoredomModel = Backbone.Model.extend({
    urlRoot: 'https://www.boredapi.com/api/activity'
})

const BoredomView = Backbone.View.extend({
    model: BoredomModel,
    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },
    template: _.template(`
        <h3>Try this out: (Refresh after 30s)</h3>
        <p>Activity: <%= activity %></p>
        <p>Category: <%= type %></p>
        `),
    render() {
        const content = this.model.toJSON();
        this.$el.html(this.template(content));
        return this;
    }
})

export const createComponent = async (element) => {
    const model = new BoredomModel();
    await model.fetch();

    const newView = new BoredomView({ model: model, el: element });
    const intervalId = setInterval(() => {
        model.fetch();
    }, 1000 * 30);
    return { newView, intervalId };
}
