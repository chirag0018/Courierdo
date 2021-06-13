import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

import Home from "./Home";
import AdminPortal from "./AdminPortal";
import AdminPanel from "./AdminPanel";
import OrderNotReview from "./OrderNotReview";
import OrderReviewed from "./OrderReviewed";
import OrderDelivered from "./OrderDelivered";
import MyOrders from "./MyOrders";
import Charges from "./Charges";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/adminportal">
          <AdminPortal />
        </Route>
        <Route exact path="/adminpanel">
          <AdminPanel />
        </Route>
        <Route exact path="/order/notreviewed">
          <OrderNotReview />
        </Route>
        <Route exact path="/order/reviewed">
          <OrderReviewed />
        </Route>
        <Route exact path="/order/delivered">
          <OrderDelivered />
        </Route>
        <Route exact path="/myorders">
          <MyOrders />
        </Route>
        <Route exact path="/order/charges">
          <Charges />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
