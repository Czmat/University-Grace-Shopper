import React, { useEffect, useState } from "react"
import axios from "axios"

const StarRating = ({ product, link }) => {
  const [rating, setRating] = useState(product.rating)
  useEffect(() => {
    axios
      .get(`/api/products/${product.id}`)
      .then(response => console.log(response.data))
  }, [])
  const updateRating = e => {
    e.preventDefault()

    const rating = (Number(product.rating) + Number(e.target.value)) / 2
    console.log(rating)
    console.log(product.id, rating, "huh")
    axios
      .post(`api/postRating/${product.id}/${rating}`)
      .then(response =>
        axios
          .get(`/api/products/${product.id}`)
          .then(
            axios
              .get(`/api/products/${product.id}`)
              .then(response => console.log(response))
          )
      )
      .catch(err => console.log(err))
  }
  if (link != "orders") {
    console.log(product.rating)
    if (Number(product.rating) <= 1) {
      return (
        <div>
          <span className="fa fa-star checked"></span>
          <span className="fa fa-star"></span>
          <span className="fa fa-star"></span>
          <span className="fa fa-star"></span>
          <span className="fa fa-star"></span>
        </div>
      )
    } else if (Number(product.rating) > 1 || Number(product.rating) <= 2) {
      return (
        <div>
          <span className="fa fa-star checked"></span>
          <span className="fa fa-star  checked"></span>
          <span className="fa fa-star"></span>
          <span className="fa fa-star"></span>
          <span className="fa fa-star"></span>
        </div>
      )
    } else if (Number(product.rating) > 2 || Number(product.rating) <= 3) {
      return (
        <div>
          <span className="fa fa-star checked"></span>
          <span className="fa fa-star checked"></span>
          <span className="fa fa-star checked "></span>
          <span className="fa fa-star"></span>
          <span className="fa fa-star"></span>
        </div>
      )
    } else if (Number(product.rating) > 3 || Number(product.rating) <= 4) {
      return (
        <div>
          <span className="fa fa-star checked"></span>
          <span className="fa fa-star checked"></span>
          <span className="fa fa-star checked "></span>
          <span className="fa fa-star checked "></span>
          <span className="fa fa-star"></span>
        </div>
      )
    } else if (Number(product.rating) > 4 || Number(product.rating) <= 5) {
      return (
        <div>
          <span className="fa fa-star checked"></span>
          <span className="fa fa-star checked"></span>
          <span className="fa fa-star checked "></span>
          <span className="fa fa-star checked "></span>
          <span className="fa fa-star checked"></span>
        </div>
      )
    } else {
      return true
    }
  } else {
    return (
      <fieldset className="rating">
        <input
          type="radio"
          id="star5"
          name="rating"
          value="5"
          onClick={updateRating}
        />
        <label
          className="full"
          htmlFor="star5"
          title="Awesome - 5 stars"
        ></label>
        <input
          type="radio"
          id="star4half"
          name="rating"
          value="4.5"
          onClick={updateRating}
        />
        <label
          className="half"
          htmlFor="star4half"
          title="Pretty good - 4.5 stars"
        ></label>
        <input
          type="radio"
          id="star4"
          name="rating"
          value="4"
          onClick={updateRating}
        />
        <label
          className="full"
          htmlFor="star4"
          title="Pretty good - 4 stars"
        ></label>
        <input
          type="radio"
          id="star3half"
          name="rating"
          value="3.5"
          onClick={updateRating}
        />
        <label
          className="half"
          htmlFor="star3half"
          title="Meh - 3.5 stars"
        ></label>
        <input
          type="radio"
          id="star3"
          name="rating"
          value="3"
          onClick={updateRating}
        />
        <label className="full" htmlFor="star3" title="Meh - 3 stars"></label>
        <input
          type="radio"
          id="star2half"
          name="rating"
          value="2.5"
          onClick={updateRating}
        />
        <label
          className="half"
          htmlFor="star2half"
          title="Kinda bad - 2.5 stars"
        ></label>
        <input
          type="radio"
          id="star2"
          name="rating"
          value="2"
          onClick={updateRating}
        />
        <label
          className="full"
          htmlFor="star2"
          title="Kinda bad - 2 stars"
        ></label>
        <input
          type="radio"
          id="star1half"
          name="rating"
          value="1.5"
          onClick={updateRating}
        />
        <label
          className="half"
          htmlFor="star1half"
          title="Meh - 1.5 stars"
        ></label>
        <input
          type="radio"
          id="star1"
          name="rating"
          value="1"
          onClick={updateRating}
        />
        <label
          className="full"
          htmlFor="star1"
          title="Sucks big time - 1 star"
        ></label>
        <input
          type="radio"
          id="starhalf"
          name="rating"
          value="0.5"
          onClick={updateRating}
        />
        <label
          className="half"
          htmlFor="starhalf"
          title="Sucks big time - 0.5 stars"
        ></label>
      </fieldset>
    )
  }
}

export default StarRating
