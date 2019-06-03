import React, { Component } from 'react';
import { connect } from 'react-redux';
import CompletedArea from './completedArea';
import {
  toggleTask,
  setCurrentTaskId,
  deleteTask,
  addTodo,
  showEditTaskModal,
  showCompletedTasksArea
} from '../actions/taskActions';
import { showSubTaskPanel, fetchSubTasks } from '../actions/subTaskActions';

class TaskTable extends Component {
  state = {};

  handleSubmit = e => {
    e.preventDefault();
    this.props.onAddTodo(this.props.currentListId, this.state.taskTitle);
    e.target.reset();
  };

  handleBodyChange(e) {
    this.setState({
      taskTitle: e.target.value
    });
  }

  render() {
    return (
      <div className="col-lg-10" style={{ display: 'inline-block', paddingTop: '45px' }}>
        <form onSubmit={this.handleSubmit}>
          <div className="input-group">
            <input
              className="form-control"
              style={{ marginRight: '5px', borderRadius: '5px' }}
              onChange={e => this.handleBodyChange(e)}
              type="text"
              id="addTask"
            />
            <span className="input-group-btn">
              <button type="submit" id="list_nav_submit" className="btn btn-primary btn-lg">
                Submit
              </button>
            </span>
          </div>

          <br />
        </form>
        <ul className="list-group">
          {this.props.tasks.map(todo => {
            if (todo.completed.status === 'pending') {
              return (
                <li
                  className={'list-group-item d-flex align-items-center '}
                  key={todo._id}
                  style={{
                    marginBottom: '20px',
                    borderRadius: '5px',
                    backgroundColor: todo._id === this.props.currentTaskId ? '#7386D5' : 'white'
                  }}
                  onClick={() => {
                    this.props.onShowSubTaskPanel();
                    this.props.onSetCurrentTaskId(todo._id);
                    this.props.onFetchSubTasks(this.props.currentListId, todo._id);
                  }}
                >
                  <div className="col-sm-1">
                    <input
                      type="checkbox"
                      aria-label="Checkbox for following text input"
                      key={todo._id}
                      onClick={() => {
                        this.props.onSetCurrentTaskId(todo._id);
                        this.props.onToggleTask(todo._id, this.props.currentListId);
                      }}
                    />
                  </div>
                  <div
                    className="col-sm-9"
                    onClick={() => {
                      this.props.onSetCurrentTaskId(todo._id);
                    }}
                  >
                    <div style={{ float: 'left' }}>{todo.title}</div>
                  </div>
                  <div
                    className="col-sm-1 d-flex justify-content-center"
                    style={{ paddingLeft: '0px', paddingRight: '0px' }}
                  >
                    <button
                      key={todo._id}
                      className="btn btn-sm"
                      style={{ backgroundColor: 'transparent' }}
                      onClick={() => {
                        this.props.onSetCurrentTaskId(todo._id);
                        this.props.onShowEditTaskModal(null, 'true');
                      }}
                    >
                      <i className="fa fa-edit" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="col-sm-1">
                    <button
                      key={todo._id}
                      className="btn btn-sm"
                      style={{ backgroundColor: 'transparent' }}
                      onClick={() => {
                        this.props.onDeleteTask(todo._id, this.props.currentListId);
                      }}
                    >
                      <i className="fa fa-minus-circle" aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            }
          })}
        </ul>
        {this.props.showCompletedTasksArea === 'true' && <CompletedArea />}
        <button
          type="button"
          class="btn btn-primary"
          onClick={() => {
            if (
              this.props.showCompletedTasksArea === 'false' ||
              this.props.showCompletedTasksArea === null
            ) {
              let show = 'true';
              this.props.onShowCompletedTasksArea(show);
            }
            if (this.props.showCompletedTasksArea === 'true') {
              let show = 'false';
              this.props.onShowCompletedTasksArea(show);
            }

            // let show = this.showCompletedTasksArea === null || 'false' ? 'true' : 'false';
            // this.props.onShowCompletedTasksArea(show);
            // console.log(`onclick ${this.props.showCompletedTasksArea}`);
          }}
        >
          Completed <span class="badge badge-light">4</span>
        </button>
      </div>
    );
  }
}

const mapStatetoProps = state => {
  return {
    tasks: state.ListReducer.tasks,
    error: state.error,
    data: state.data,
    currentListId: state.ListReducer.currentListId,
    currentTaskId: state.ListReducer.currentTaskId,
    showSubTaskPanel: state.SubTaskReducer.showSubTaskPanel,
    showCompletedTasksArea: state.ListReducer.showCompletedTasksArea
  };
};

const mapDispatchprops = dispatch => {
  return {
    onAddTodo: (id, taskTitle) => dispatch(addTodo(id, taskTitle)),
    onSetCurrentTaskId: (id, listID) => dispatch(setCurrentTaskId(id, listID)),
    onToggleTask: (taskID, listID) => dispatch(toggleTask(taskID, listID)),
    onDeleteTask: (taskID, listID) => dispatch(deleteTask(taskID, listID)),
    onShowSubTaskPanel: () => dispatch(showSubTaskPanel()),
    onShowEditTaskModal: (id, show) => dispatch(showEditTaskModal(id, show)),
    onShowCompletedTasksArea: show => dispatch(showCompletedTasksArea(show)),
    onFetchSubTasks: (listID, taskID) => dispatch(fetchSubTasks(listID, taskID))
  };
};

export default connect(
  mapStatetoProps,
  mapDispatchprops
)(TaskTable);
