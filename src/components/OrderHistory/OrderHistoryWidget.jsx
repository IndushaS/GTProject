import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import './OrderHistory.scss';
import OrderHistoryData from './OrderHistory.json';
import icon from './TruckIcon.png';

class OrderHistory extends Component {
  constructor(){
    super();
    this.state={

      OrderData:[],
      columns:[{
        Header: 'Action:',
        accessor: 'action'
      },{
        Header: 'Date:',
        accessor: 'date'
      },{
        Header: 'Created By:',
        accessor: 'createdBy'
      },{
        
        Header: 'Account Number:',
        accessor: 'accountNum'
      },{
        Header: 'PO Number:',
        accessor: 'PO'
      },{
        Header: 'Order Number:',
        accessor: 'orderNum'
      },{
        Header: 'Order Status:',
        accessor: 'orderStatus'
      },
      {
        Header: 'Total:',
        accessor: 'total'
      },
    ],
    }
  }
    componentDidMount() {
      fetch('wwww.grandandtoy.com/DashboardAPI/OrderTracking')
      .then(response =>  console.log(response))
      .then(data => {
        console.log(data) 
      })
      .catch(error => console.error(error))
    }
  
  
  render() {
    return (
          <div className="WidgetWrapper">
              <div className="Header">
                  <h4>Order History</h4>
                  <img className="icon" src={icon}></img>
                  <span className="btn btn-primary">View</span>
               </div>
              <ReactTable 
                data={OrderHistoryData}
                columns={this.state.columns}
                defaultPageSize = {10}
                style={{
                  height: "300px" 
                }}
               
              />
              
          </div>
    )

  }
}


export default OrderHistory;