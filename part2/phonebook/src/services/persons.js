import axios from "axios";

const baseUrl = "api/persons"

const getAllPerson = () => {
  const request = axios.get(baseUrl)
  return request.then(res => res.data)
}

const createPerson = (newObject) => {
  const request = axios.post(baseUrl, newObject)
  return request.then(res => res.data)
}

const updatePerson = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(res => res.data)
}

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`)
  return request.then(res => res.data)
}

export default { getAllPerson, createPerson, updatePerson, deletePerson }