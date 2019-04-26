import React, { PropTypes } from 'react';
import Modal from 'react-modal';
import './Modal.scss';

const AddWidgetDialog = ({ handleWidgetSelection, widgets, isModalOpen, onRequestClose}) => {
  const widgetItems = widgets.map((widget) => {
    return (
      <div className="list-group">
      <a href="#" onClick={() => handleWidgetSelection(widget.name)} className="list-group-item">
          <h6 className="list-group-item-heading">{widget.name}</h6>
        </a>
      </div>
    );
  });
  return (
    <Modal
      className="Modal__Bootstrap modal-dialog"
      isOpen={isModalOpen}>
      <div className="modal-content">
       <div className="modal-header">
         <button type="button" className="close" onClick={onRequestClose}>
           <span aria-hidden="true">&times;</span>
           <span className="sr-only">Close</span>
         </button>
         <h4 className="modal-title">Add a widget</h4>
       </div>
       <div className="modal-body">
         <h5>Pick a widget to add</h5>
         {widgetItems}
       </div>
       <div className="modal-footer">
         <button type="button" className="btn btn-default" onClick={onRequestClose}>Close</button>
       </div>
      </div>
    </Modal>
  );
};

export default AddWidgetDialog;

