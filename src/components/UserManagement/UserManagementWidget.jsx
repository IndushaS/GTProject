import React, { Component } from 'react';
import icon from './UserIcon.png';
import './UserManagement.scss';

class UserManagement extends React.Component {
    render() {
        return (
            <div className="WidgetWrapper">
                <div className="Header">
                    <h4>User Management</h4>
                    <img className="icon" src={icon}></img>
                    <span className="btn btn-primary">View</span>
                </div>
                <div className="FilterWrapper">
                <div className="UserContent">
                    <div className="CreateUser">
                        <span className="btn btn-primary">Create New User</span>
                    </div>
                    <div className="FilterInput">
                    <div className="row">
                        <div class="col-sm-6">
                            <div class="row">
                                <div class="col-xs-12 form-group">
                                    <label for="manage_users__search_input">
                                      Search by Cost Centre, account number, email address, or username:
                                        <span class="form-alerts" role="alert"></span>
                                    </label>
                                    <input id="manage_users__search_input" name="SearchParameter" type="text" value=""></input>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="row">
                                <div class="form-group col-xs-12">
                                    <label for="manage-users__permissions-input" class="manage-users__permissions-label">
                                       Permissions
                                        <span class="form-alerts" role="alert"></span>
                                    </label>
                                    <div>
                                        <select id="SelectedPermissionID" name="SelectedPermission"><option value="0">All</option>
                                            <option value="5">Administrators</option>
                                            <option value="4">Approvers</option>
                                            <option value="13">Budget Approver</option>
                                            <option value="6">Bypass Approvers</option>
                                            <option value="8">Final Approvers</option>
                                            <option value="7">Non-Contract Approvers</option>
                                            <option value="2">Purchasers</option>
                                            <option value="9">Restricted Approvers</option>
                                            <option value="3">Viewers</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                        
                        <input className="btn btn-primary" type="submit" value="Filter Users"></input>
                        <input className="btn btn-primary" type="submit" value="Clear"></input>

                    </div>
                </div>
            </div>
        )
    }
}

export default UserManagement;
                  