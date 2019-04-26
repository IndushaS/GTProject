import React, { Component } from 'react';
import ReactTable from "react-table";
import "react-table/react-table.css";
import './PendingApproval.scss';
import PendingData from './PendingData.json';
import icon from './PendingApprovalIcon.png';

class PendingApproval extends Component {
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
                  <h4>Pending Approval</h4>
                  <img className="icon" src={icon}></img>
                  <span className="btn btn-primary">View</span>
               </div>
              <ReactTable 
                data={PendingData}
                columns={this.state.columns}
                defaultPageSize = {10}
                style={{
                  height: "270px" 
                }}
               
              />
              <input className="btn btn-primary approve" type="submit" value="Approve All"></input>
              
          </div>
    )

  }
}


export default PendingApproval;