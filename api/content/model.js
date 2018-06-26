import bookshelf from '../bookshelf'

/* Content model:
{
  id,
  name,
  graphic,
  html,
  css,
  data,
}
*/

const Content = bookshelf.createModel({
  tableName: 'content',

  format(attributes) {
    attributes.graphic = JSON.stringify(attributes.graphic)
    attributes.data = JSON.stringify(attributes.data)
    return attributes
  },

  parse(attributes) {
    if (attributes.graphic) {
      attributes.graphic = JSON.parse(attributes.graphic)
    }
    if (attributes.data) {
      attributes.data = JSON.parse(attributes.data)
    }
    return attributes
  },
}, {
  getSingle(name, withRelated = [], require = false) {
    let where = { name }

    return this.query({ where })
      .fetch({ require, withRelated })
  },
})

export default Content
