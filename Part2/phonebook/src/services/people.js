import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const read = () => {
    return axios.get(baseUrl);
}
  
const deletePerson = id => {
    return axios.delete(`${baseUrl}/${id}`)
}


const update = (id, newObject) => {
    return axios.put(`${baseUrl}/${id}`, newObject)
};

const create = newPerson => {
    return axios.post(baseUrl, newPerson)
  }
  

export default { 
  deletePerson, read, create, update 
  
}



