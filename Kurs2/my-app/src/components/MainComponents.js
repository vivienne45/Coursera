import React, { Component } from 'react';
import Home from './HomeComponent';
import Menu from './MenuComponent';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import DishDetail from './DishdetailComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'

import { DISHES } from '../shared/dishes';
import { COMMENTS } from '../shared/comments';
import { PROMOTIONS } from '../shared/promotions';
import { LEADERS } from '../shared/leaders';
import { connect } from 'react-redux';

import { Switch, Route, Redirect } from 'react-router-dom';

const mappropsToProps = props => {
  return {
    dishes: props.dishes,
    comments: props.comments,
    promotions: props.promotions,
    leaders: props.leaders
  }
}

class Main extends Component {

    constructor(props) {
        super(props);

        this.props = {
            dishes: DISHES,
            comments: COMMENTS,
            promotions: PROMOTIONS,
            leaders: LEADERS
        };
    }

    render() {

        const HomePage = () => {
            return (
                <Home
                    dish={this.props.dishes.filter((dish) => dish.featured)[0]}
                    promotion={this.props.promotions.filter((promo) => promo.featured)[0]}
                    leader={this.props.leaders.filter((leader) => leader.featured)[0]}
                />
            );
        }

        const AboutUsPage = () => {
            return (
                <About leaders={this.props.leaders} />
            );
        };

        const DishWithId = ({ match }) => {
            return (
                <DishDetail dish={this.props.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
                    comments={this.props.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))} />
            );
        };

        return (
            <div>
                <Header />
                <Switch>
                    <Route path='/home' component={HomePage} />
                    <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
                    <Route path='/menu/:dishId' component={DishWithId} />
                    <Route exact path='/contactus' component={Contact} />} />
                    <Route exact path="/aboutus" component={AboutUsPage} />

                    {/* if url dosesnt match, bydefault redirect to */}
                    <Redirect to="/home" />
                </Switch>
                <Footer />
            </div>
        );
    }
}

export default withRouter(connect(mappropsToProps)(Main));
