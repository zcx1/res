import backendApi from '@/gateways/backend-api.js'
import { createUser, updateUser, deleteUser } from './user.js'

const updatePatient = async patient => await updateUser(patient.user)

const createPatient = async patient => {
  let response = await createUser(patient.user)
  return await backendApi.post('/patients/', { user: response.data.url })
}

const deletePatient = async id => await deleteUser(id)

export { createPatient, updatePatient, deletePatient }
