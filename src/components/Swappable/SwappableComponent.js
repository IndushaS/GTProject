import React, { Component } from 'react'
import './Swappable.scss';
import icon from './UserIcon.png';

class Swappable extends Component {
    constructor() {
        super()

        this.state = {
            customFunc: null
        }
    }

    allowDrop(ev) {
        ev.preventDefault();
    }

    drag(ev, customFunc = null) {
        ev.dataTransfer.setData("src", ev.target.id);
        console.log(ev.target.parentNode, 'TARGET DRAGSTART')
        this.setState({
            initialParentNode: ev.target.parentNode
        })
    }

    dragEnd(ev, customFunc = null) {
            console.log(ev.target.parentNode, 'TARGET DRAGEND')
            if (customFunc && (ev.target.parentNode != this.state.initialParentNode)) {
                console.log('custom func')
                this.props.customFunc()
            }
    }

    drop(ev, dragableId, dropzoneId, customFunc = null, swappable = true) {
        ev.preventDefault();
        console.log("ev");
        console.log(ev);
        if (document.getElementById(ev.dataTransfer.getData("src"))) {
            let src = document.getElementById(ev.dataTransfer.getData("src"));
            //debugger;
            let srcParent = src.parentNode;
            let target = document.getElementById(dragableId);

            console.log(src, 'dragged element');
            console.log(srcParent, 'parent of dragged');
            console.log(target, 'element to be swapped')

            swappable ? this.swapElements(src, target, srcParent) : this.transferElement(src, dropzoneId)
        }
    }

    swapElements(src, target, srcParent) {
        target.replaceWith(src);
        srcParent.appendChild(target);
    }

    transferElement(src, dropzoneId) {
        let dropzone = document.getElementById(dropzoneId)
        dropzone.appendChild(src);
    }

    render() {

        const { id, content, swappable, customFunc, locked} = this.props
        const dropzoneId = 'drop' + id
        const dragableId = 'drag' + id

        console.log(customFunc, 'customFunc')
        return (
            <div className="dropZone"
                id = {dropzoneId}
                onDrop={(event) => this.drop(event, dragableId, dropzoneId, customFunc, swappable)} 
                onDragOver={(event) => this.allowDrop(event)} 
               // style={dropZoneStyle}
                >
                <div className="dragZone"
                    id={ dragableId }
                    draggable="true"
                    onDragStart={(event) => this.drag(event)}
                    onDragEnd = {(event) => this.dragEnd(event, customFunc)}
                    //style={draggableStyle}
                    >
                    <div>{this.props.editMode && (content==""? <div className="addButton"><button type="button" className="btn btn-outline-success" onClick={this.props.add}>Add Widget</button></div>:<div><button key={this.props.widget} className="close" onClick={this.props.delete}>&times;</button></div>)}</div>
                    { content }
                
                </div>
            </div>
        )
    }
}

export default Swappable;