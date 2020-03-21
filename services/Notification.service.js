import Api from '@/middleware/Api'

let getMany = () => {
    return Api().get(`/notification`)
  },
  getOne = (id = '') => {
    return Api().get(`/notification/${id}`)
  },
  create = (body) => {
    return Api().post(`/notification/create`, body)
  },
  update = (id, body) => {
    return Api().put(`/notification/update/${id}`, body)
  },
  remove = (id) => {
    return Api().delete(`/notification/delete/${id}`)
  }
export default {
  getMany,
  getOne,
  create,
  update,
  remove
}
