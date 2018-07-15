import bookshelf from '../bookshelf'

/* Graphic model:
{
  id,
  name,
  engine,
  settings,
  is_deleted,
}
*/

const Graphic = bookshelf.createModel({
  tableName: 'graphics',

  format(attributes) {
    attributes.settings = JSON.stringify(attributes.settings)
    return attributes
  },

  parse(attributes) {
    if (attributes.settings) {
      attributes.settings = JSON.parse(attributes.settings)
    }
    return attributes
  },
}, {
})

export default Graphic
