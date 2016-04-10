import bookshelf from '../../bookshelf'

const Store = bookshelf.createModel({
  tableName: 'store',

  format(attributes) {
    attributes.value = JSON.stringify(attributes.value)
    return attributes
  },

  parse(attributes) {
    attributes.value = JSON.parse(attributes.value)
    return attributes
  }
}, {
  getSingle(name, withRelated = [], required = true) {
    let where = { name }

    return this.query({ where })
      .fetch({ require, withRelated })
  },
})

export default Store
