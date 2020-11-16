import backendApi from '@/gateways/backend-api.js'

const getShortName = ({ first_name, middle_name, last_name }) => {
  let name = last_name
  if (first_name) name += ` ${first_name[0]}.`
  if (middle_name) name += ` ${middle_name[0]}.`
  return name
}

const getFullName = ({ first_name, middle_name, last_name }) => {
  let name = last_name
  if (first_name) name += ` ${first_name}`
  if (middle_name) name += ` ${middle_name}`
  return name
}

const getLastFirstName = ({ first_name, last_name }) => `${last_name} ${first_name}`

const createUser = async user => await backendApi.post('/users/', user)

const updateUser = async user => await backendApi.put(`/users/${user.id}/`, user)

const deleteUser = async id => await backendApi.delete(`/users/${id}/`)

export { getShortName, getFullName, getLastFirstName, createUser, updateUser, deleteUser }
