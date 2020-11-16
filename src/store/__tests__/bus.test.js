import {
  BUS_CREATE_APPOINTMENT,
  BUS_CREATE_PATIENT,
  BUS_DELETE_PATIENT,
  BUS_CREATE_MEDICAL_CARD,
  BUS_SAVE_MEDICAL_CARD
} from '../actions/bus.js'
import store from '../index.js'

it('Check bus', () => {
  store.dispatch(BUS_CREATE_APPOINTMENT)
  expect(store.state.bus.busCreateAppointment).toBe(1)
  store.dispatch(BUS_CREATE_PATIENT)
  expect(store.state.bus.busCreatePatient).toBe(1)
  store.dispatch(BUS_DELETE_PATIENT)
  expect(store.state.bus.busDeletePatient).toBe(1)
  store.dispatch(BUS_CREATE_MEDICAL_CARD)
  expect(store.state.bus.busCreateMedicalCard).toBe(1)
  store.dispatch(BUS_SAVE_MEDICAL_CARD)
  expect(store.state.bus.busSaveMedicalCard).toBe(1)
})
