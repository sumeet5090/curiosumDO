import Api from '@/middleware/Api'

let getMany = () => {
    return Api().get(`/team`)
  },
  getOne = (id = '') => {
    return Api().get(`/team/${id}`)
  },
  create = (body) => {
    return Api().post(`/team/create`, body)
  },
  update = (id, body) => {
    return Api().put(`/team/update/${id}`, body)
  },
  remove = (id) => {
    return Api().delete(`/team/delete/${id}`)
  }
export default {
  getMany,
  getOne,
  create,
  update,
  remove
}