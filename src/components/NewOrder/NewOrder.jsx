import React, { Component } from 'react';
import icon from './ShoppingCartIcon.png';
import './NewOrder.scss';

class NewOrder extends React.Component {
  render() {
    return (
      <div className="WidgetWrapper">
        <div className="Header">
          <h4>Shopping Cart</h4>
          <img className="icon" src={icon}></img>
          <span className="btn btn-primary">View</span>
        </div>


        <div id="DIV_1">
          <h3 id="H3_2">
            Quick Product Entry
	</h3>
          <div id="DIV_3">
            <div id="DIV_4">
              <div id="DIV_5">
                <h5 id="H5_6">
                  Product Code
				</h5>
              </div>
              <div id="DIV_7">
                <h5 id="H5_8">
                  Qty
				</h5>
              </div>
              <div id="DIV_9">
                <h5 id="H5_10">
                  Unit
				</h5>
              </div>
              <div id="DIV_11">
                <h5 id="H5_12">
                  Description
				</h5>
              </div>
            </div>
            <div id="DIV_13">
              <div id="DIV_14">
                <div id="DIV_15">
                  <input id="INPUT_16" maxlength="30" name="AddToShoppingCart.AddToShoppingCartItems[0].ProductCode" type="text" />
                </div>
                <div id="DIV_17">
                  <input id="INPUT_18" maxlength="5" name="AddToShoppingCart.AddToShoppingCartItems[0].Quantity" type="number" value="1" />
                </div>
                <div id="DIV_19">
                  <div id="DIV_15">
                    <input id="INPUT_16" maxlength="30" name="AddToShoppingCart.AddToShoppingCartItems[0].ProductCode" type="text" />
                  </div>
                </div>
                <div id="DIV_22">
                  <div id="DIV_23">
                    <h5 id="H5_24">
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="DIV_25">
            <div id="DIV_26">

              <button type="button" id="BUTTON_27">
                Add to cart
			</button>
            </div>
          </div>
        </div>
        <div id="sum">
           <h5>Order Summary</h5>  
           <div id="promo">
            <p>Promotional Code:  <input type="text"></input> </p>
            
          
            </div>
            <div id="total">
            Total:
          
           </div>
        </div>
      </div>




    )
  }

}



export default NewOrder;

