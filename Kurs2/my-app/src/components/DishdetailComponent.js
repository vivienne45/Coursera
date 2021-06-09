import React, { Component } from "react";
import {
  Card,
  CardImg,
  CardImgOverlay,
  CardText,
  CardBody,
  CardTitle,
} from "reactstrap";

class DishDetail extends Component {

  componentDidMount() {
    console.log("DishDetail component componentDidMounbt is invoked");
  }

  componentDidUpdate(){
    console.log("DishDetail component componentDidMounbt is invoked");
  }

function RenderDish({dish}) {
      return (
        <div className="col-12 col-md-5 m-1">
          <Card>
            <CardImg width="100%" src={dish.image} alt={dish.name} />
            <CardBody>
              <CardTitle> {dish.name}</CardTitle>
              <CardText> {dish.description} </CardText>
            </CardBody>
          </Card>
        </div>
      );
    }
  }

  function RenderComments({comments}) {
    if (comments == null) {
    return (
      <div className="col-12 col-md-5 m-1">
        <h4> Comments </h4>
        <ul className="list-unstyled">
            {comments.map((comment) => {
              return (
                <li key={comment.id}>
                <p>{comment.comment}</p>
              </li>
            );
          })}
          </ul>
      </div>
    );
  }else {
      return )
      <div></div>
    );
  }
}

  const DishDetail = (props) =>  {

    console.log("DishDetail component render is invoked");

    if(props.dish != null)
    return (
      <div class="container">
      <div className)"row">
        <RenderDish dish={props.dish} />
        <RenderComments comments= {props.dish.comments} />
      </div>
      </div>
    );
}

export default DishDetail;
