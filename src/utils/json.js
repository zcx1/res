const isObject = obj => {
  return typeof obj === 'object' && obj !== null
}

const checkRecursion = obj => {
  if (isObject(obj) || Array.isArray(obj)) return getClearDict(obj)
  else return obj
}

const getClearDict = json => {
  if (Array.isArray(json)) {
    const newJson = []
    json.forEach(element => {
      if (checkRecursion(element)) newJson[element] = element
    })
    return newJson
  }
  const newJson = {}
  Object.keys(json).forEach(element => {
    if (checkRecursion(json[element])) newJson[element] = json[element]
  })
  return newJson
}

export { getClearDict }
