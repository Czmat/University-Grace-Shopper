import React from "react"

const StarRating = ({ product }) => {
  console.log(product, "star")
  //   if (rating.rating < 5) {
  //     return (
  //       <div>
  //         <span className="fa fa-star checked"></span>
  //         <span className="fa fa-star  checked"></span>
  //         <span className="fa fa-star checked "></span>
  //         <span className="fa fa-star "></span>
  //         <span className="fa fa-star"></span>
  //       </div>
  //     );
  //   } else if (rating.rating >= 50 && rating.rating < 85) {
  //     return (
  //       <div>
  //         <span className="fa fa-star checked"></span>
  //         <span className="fa fa-star  checked"></span>
  //         <span className="fa fa-star checked "></span>
  //         <span className="fa fa-star checked "></span>
  //         <span className="fa fa-star"></span>
  //       </div>
  //     );
  //   } else if (rating.rating >= 85) {
  //     return (
  //       <div>
  //         <span className="fa fa-star checked"></span>
  //         <span className="fa fa-star  checked"></span>
  //         <span className="fa fa-star checked "></span>
  //         <span className="fa fa-star checked "></span>
  //         <span className="fa fa-star checked"></span>
  //       </div>
  //     );
  //   }
  // };

  if (true) {
    return (
      <form>
        <fieldset className="rating">
          <input type="radio" id="star5" name="rating" value="5" />
          <label
            className="full"
            htmlFor="star5"
            title="Awesome - 5 stars"
          ></label>
          <input
            type="radio"
            id="star4half"
            name="rating"
            value="4 and a half"
          />
          <label
            className="half"
            htmlFor="star4half"
            title="Pretty good - 4.5 stars"
          ></label>
          <input type="radio" id="star4" name="rating" value="4" />
          <label
            className="full"
            htmlFor="star4"
            title="Pretty good - 4 stars"
          ></label>
          <input
            type="radio"
            id="star3half"
            name="rating"
            value="3 and a half"
          />
          <label
            className="half"
            htmlFor="star3half"
            title="Meh - 3.5 stars"
          ></label>
          <input type="radio" id="star3" name="rating" value="3" />
          <label className="full" htmlFor="star3" title="Meh - 3 stars"></label>
          <input
            type="radio"
            id="star2half"
            name="rating"
            value="2 and a half"
          />
          <label
            className="half"
            htmlFor="star2half"
            title="Kinda bad - 2.5 stars"
          ></label>
          <input type="radio" id="star2" name="rating" value="2" />
          <label
            className="full"
            htmlFor="star2"
            title="Kinda bad - 2 stars"
          ></label>
          <input
            type="radio"
            id="star1half"
            name="rating"
            value="1 and a half"
          />
          <label
            className="half"
            htmlFor="star1half"
            title="Meh - 1.5 stars"
          ></label>
          <input type="radio" id="star1" name="rating" value="1" />
          <label
            className="full"
            htmlFor="star1"
            title="Sucks big time - 1 star"
          ></label>
          <input type="radio" id="starhalf" name="rating" value="half" />
          <label
            className="half"
            htmlFor="starhalf"
            title="Sucks big time - 0.5 stars"
          ></label>
        </fieldset>
      </form>
    )
  }
}

export default StarRating
