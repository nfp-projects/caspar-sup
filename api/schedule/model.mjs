import bookshelf from '../bookshelf.mjs'
import Graphic from '../graphic/model.mjs'

/* Schedule model:
{
  id,
  graphic_id,
  values,
  sort,
  is_deleted,
}
*/

const Schedule = bookshelf.createModel({
  tableName: 'schedule',

  graphic() {
    return this.belongsTo(Graphic, 'graphic_id')
  },

  format(attributes) {
    attributes.values = JSON.stringify(attributes.values)
    return attributes
  },

  parse(attributes) {
    if (attributes.values) {
      attributes.values = JSON.parse(attributes.values)
    }
    return attributes
  },
}, {
})

export default Schedule
