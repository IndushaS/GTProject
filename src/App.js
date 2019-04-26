import React, { Component } from 'react';
import Swappable from './components/Swappable/SwappableComponent'
import './App.scss';
import AddWidgetDialog from './components/Modal/Modal';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Toggle from 'react-toggle'

import UserManagement from './components/UserManagement/UserManagementWidget'
import NewOrder from './components/NewOrder/NewOrder';
import OrderHistory from './components/OrderHistory/OrderHistoryWidget';
import Subscriptions from './components/Subscriptions/Subscriptions'
import PendingApproval from './components/PendingApproval/PendingApproval'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: "center",
    color: theme.palette.text.secondary
  }
});

class App extends Component {
    constructor(props) {
      super(props);
      this.state={
        selectedWidgetId: null,
        widgetOptions:[{name:"Order History", comp:<OrderHistory/>},{name:"Add To Cart", comp:<NewOrder/>},{name:"User Management", comp:<UserManagement/>},{name:"Subscriptions", comp:<Subscriptions/>},{name:"Pending Approval", comp:<PendingApproval/>}],

        widgets:[ //array for layout 
          //{id:1, content: <img className="img" src="https://www.grandandtoy.com/OnlineRepository/dcr/landingpage/Services/header-banner-images-services.png" alt="new"/>, xs:12, sm:12},
          {id:1, content: <OrderHistory/>,xs:12,sm:6},
          {id:2, content: <NewOrder/>,xs:12,sm:6},
          {id:3, content: <UserManagement/>,xs:12,sm:6},
          {id:4, content: <Subscriptions/>,xs:12,sm:6}
        ],
        editMode:false,
        isModalOpen: false,
        selectedWidgetIndex:null,
        num:4
      }

    }
    handleWidgetSelection=(id) => {
      
      this.setState({ selectedWidgetId: id })
      var content=this.state.widgetOptions.find(x=>x.name==id).comp;
      this.setState({ myArray: this.state.widgets.push( {id:this.state.num+=1, content: content,xs:12,sm:6}) })
      this.onRequestClose();
    }
    deleteEvent=(id)=>{
      this.setState({
        widgets:this.state.widgets.filter(el => el != id )
      }); 
    }
    addEvent=(index)=>{
        this.setState({ 
            isModalOpen: true,
            selectedWidgetIndex:index
        })
        
    }
    
    onRequestClose = () => {
        this.setState({
          isModalOpen: false,
        });
      }

    editEvent=()=>{
      this.setState(prevState=>({
        editMode:!prevState.editMode,
      }));
    }
  

  
    render() {
      const { classes } = this.props;

      return (
       <div className="wrapper"> 
      <div className={classes.root}>
      <AddWidgetDialog handleWidgetSelection={this.handleWidgetSelection} widgets={this.state.widgetOptions} isModalOpen={this.state.isModalOpen} onRequestClose={this.onRequestClose} />
        <div className="gridItem">
        <Grid container spacing={24}>
        <div className="Add"><span onClick={this.addEvent.bind(this)} class="btn btn-primary">+Add Widget</span></div>
        <div className="editToggle">
        <div className="checkbox">
        <label>
  
        <span className="edit">Edit</span>
            <Toggle
              onClick={this.editEvent}
              defaultChecked={this.state.tofuIsReady}
              icons={false}
              onChange={this.handleTofuChange} />
           
         </label>
        

        </div>
        </div>
        
        <Grid item xs={12}>
                <Paper className={classes.paper}><img className="img" src="https://www.grandandtoy.com/OnlineRepository/dcr/landingpage/Services/header-banner-images-services.png" alt="new"/></Paper>
            </Grid>
            {
                this.state.widgets.map((widget)=>{
                    return(
                        <Grid item xs={widget.xs} sm={widget.sm}>
                            <Paper className={classes.paper}><Swappable id={widget.id} content={widget.content} delete={this.deleteEvent.bind(this,widget)}  editMode={this.state.editMode} locked={widget.locked}/></Paper>
                         </Grid>
                    )
                })
            }
        </Grid>
       
        </div>
      </div>
      </div>
      );
    }
  }

  App.propTypes = {
    classes: PropTypes.object.isRequired
  };

  export default withStyles(styles)(App);
