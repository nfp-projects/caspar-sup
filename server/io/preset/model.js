import bookshelf from '../../bookshelf'

/* Preset model:
{
  id,
  graphic_id,
  values,
  sort,
  is_deleted,
}
*/

const Preset = bookshelf.createModel({
  tableName: 'presets',

  format(attributes) {
    attributes.values = JSON.stringify(attributes.values)
    return attributes
  },

  parse(attributes) {
    if (attributes.values) {
      attributes.values = JSON.parse(attributes.values)
    }
    return attributes
  }
}, {
})

export default Preset
