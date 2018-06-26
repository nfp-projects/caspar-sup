import bookshelf from '../bookshelf'

/* Settings model:
{
  id,
  name,
  value,
}
*/

const Settings = bookshelf.createModel({
  tableName: 'settings',
}, {
  getValue(name) {
    return this.query({ where: { name: name } })
      .fetch({ require: false })
      .then(item => item && item.get('value') || item)
  },

  setValue(name, value) {
    return this.query({ where: { name } })
      .fetch({ require: false })
      .then(item => {
        if (item) {
          item.set({ value })
          return item.save()
        }
        return this.create({
          name,
          value,
          is_deleted: false,
        })
      })
  },

  getSettings() {
    return this.query({ where: { }})
      .fetchAll({ })
      .then(data => {
        let out = { }

        data.forEach(item => {
          out[item.get('name')] = item.get('value')
        })

        return out
      })
  },
})

export default Settings
