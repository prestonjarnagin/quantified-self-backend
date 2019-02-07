const Food = require('../models/food')

const index = (request, response) => {
  Food.all()
    .then((food) => {
      response.status(200).json(food);
    })
    .catch((error) => {
      response.status(500).json({error});
    })
}

const show = (request, response) => {
  Food.find(request.params.id)
  .then((food) => {
    response.status(200).json(food);
  })
  .catch((error) => {
    response.status(500).json({error});
  })
}

module.exports = {
  index, show,
}
