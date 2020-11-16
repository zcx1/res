import {
  BUS_CREATE_APPOINTMENT,
  BUS_CREATE_PATIENT,
  BUS_DELETE_PATIENT,
  BUS_CREATE_MEDICAL_CARD,
  BUS_SAVE_MEDICAL_CARD
} from '../actions/bus.js'

const state = {
  busCreateAppointment: 0,
  busCreatePatient: 0,
  busDeletePatient: 0,
  busCreateMedicalCard: 0,
  busSaveMedicalCard: 0
}

const genActions = actionList => {
  const actions = {}
  actionList.forEach(element => {
    actions[element] = ({ commit }) => {
      commit(element)
    }
  })
  return actions
}

const actions = genActions([
  BUS_CREATE_APPOINTMENT,
  BUS_CREATE_PATIENT,
  BUS_DELETE_PATIENT,
  BUS_CREATE_MEDICAL_CARD,
  BUS_SAVE_MEDICAL_CARD
])

const mutations = {
  [BUS_CREATE_APPOINTMENT]: state => {
    state.busCreateAppointment++
  },
  [BUS_CREATE_PATIENT]: state => {
    state.busCreatePatient++
  },
  [BUS_DELETE_PATIENT]: state => {
    state.busDeletePatient++
  },
  [BUS_CREATE_MEDICAL_CARD]: state => {
    state.busCreateMedicalCard++
  },
  [BUS_SAVE_MEDICAL_CARD]: state => {
    state.busSaveMedicalCard++
  }
}

export default {
  state,
  actions,
  mutations
}
