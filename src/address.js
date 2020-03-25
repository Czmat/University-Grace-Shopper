const apiKey = "WS72-FSN3-HDQ2"
const axios = require("axios")

const address = async e => {
  e.preventDefault()
  let words
  let address = e.target[0].value
  let city = e.target[1].value
  let state = e.target[2].value
  let zip = e.target[3].value
  console.log(address, city, state, zip)
  await axios
    .get(
      `https://trial.serviceobjects.com/AD/api.svc/FindAddressJson?Address1=${address}&City=${city}&State=${state}&PostalCode=${zip}&LicenseKey=${apiKey}`
    )
    .then(response => {
      if (response.data.Error) {
        console.log("Error")
        words = response.data.Error
        return words
      } else {
        console.log("Valid")
        words = response.data.Addresses[0]
        return words
      }
    })
}

module.exports = address
