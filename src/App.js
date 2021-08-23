import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import './styles/styles.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {input: ''};
    this.updateName = this.updateName.bind(this);
    this.readApi = this.readApi.bind(this);
    this.onClickButton = this.onClickButton.bind(this)

    this.handleClick = this.handleClick.bind(this);
    this.items = [];
  }



  readApi(element){
    let url = process.env.REACT_APP_URL;
    console.log('url: ' ,url);
    axios.get(url).then(resp=>{
      console.log(resp.data);
      let tasks = document.getElementById('tasklist')
      tasks.innerHTML =''
      for(let i =0 ; i < resp.data.length ; i++){
        let li = document.createElement('li')
        if (resp.data[i].done === true){
          li.className = 'done'
        }
        li.id = resp.data[i]._id
        li.innerHTML = resp.data[i].name;
        li.addEventListener("click", toggleDone)
        function toggleDone(){
          let status = resp.data[i].done;
          resp.data[i].done = !status;
          var task = document.getElementById(resp.data[i]._id)
          if (resp.data[i].done === true){
            task.className = 'done';
          }
          else if ( resp.data[i].done === false){
            task.classList.remove('done')
          }
          axios.patch(`${url}/${resp.data[i]._id}`).then(resp=> {
            console.log(resp.data)
            axios.get(url).then(resp=>{console.log(resp.data)})
          })
        }
        let bu = document.createElement('button')
        bu.id = 'remove';

        bu.addEventListener("click", function(){
          console.log('deleted');
          axios.delete(`${url}/${li.id}`).then(resp=>{
            console.log(resp.data);
            var nn= document.getElementById('plus').click()
          })
        })
        bu.innerHTML = '<i class = "fa fa-minus-circle fa-lg"></i>';
        tasks.prepend(li)
        li.appendChild(bu)

      }
    })
  }


  updateName(event) {
    this.setState({value: event.target.value});
    console.log(event.target.value);
  }

  handleClick(e) {
    let url = process.env.REACT_APP_URL
    this.readApi()
    if(this.state.value !== undefined){
    axios.post(`${url}/${this.state.value}`).then(res=>{
      this.readApi()
      console.log('task created: ',res.data.name);
      document.getElementById('input').value = ''
      this.state.value = undefined
    })}
  }
  onClickButton (event) {
    event.preventDefault();
  }


  render() {
    return (
  <div className="layout">
  <h1>ToDo List.</h1>
  <div className="list">
  <form id = 'form' onSubmit = {this.onClickButton}>
      <input id ='input' type="text" placeholder="Add Item..." onChange = {this.updateName}/>
      <button id = 'plus' onClick = {this.handleClick}>
        <i className="fa fa-plus"></i>
      </button>
    </form>

    <ul id='tasklist'>

    </ul>
  </div>
  </div>
  )
  }
  componentDidMount(){
    this.readApi()
  }

}

export default App;
