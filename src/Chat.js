import React, { Component } from 'react';
import io from 'socket.io-client';

class Chat extends Component {
	constructor(props) {
		super(props);

		this.state = {
			'username' : '',
			'message' : '',
			'messages' : []
		};
		this.setUsername = this.setUsername.bind(this);
		this.setMessage = this.setMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.addMessage = this.addMessage.bind(this);
		const self = this;
		this.socket = io('localhost:8080');
		this.socket.on('RECEIVE_MESSAGE', function(data) {
			self.addMessage(data);
		});
	}

	addMessage(data) {
		console.log(data);
		this.setState({messages : [...this.state.messages, data]});
	}

	setUsername(username) {
		this.setState({username});
	}

	setMessage(message) {
		this.setState({message});
	}

	sendMessage(ev) {
		ev.preventDefault();
		this.socket.emit('SEND_MESSAGE', {
			author : this.state.username,
			text : this.state.message
		});
		this.setState({message : ''});
	}

	render() {
		return(
			<div className="container">
				<div className="row">
					<div className="col-4">
						<div className="card">
							<div className="card-body">
								<div className="card-title">
									Global Chat
								</div>
								<hr/>
								<div className="messages">
									{this.state.messages.map(function(message, index) {
										return (
											<div key={index}>{message.author} : {message.text}</div>
										);
									})}
								</div>
							</div>
							<div className="card-footer">
								<input type="text" placeholder="Username" className="form-control"
									value={this.state.username} onChange={ev => this.setUsername(ev.target.value)}
								/>
                                <br/>
                                <input type="text" placeholder="Message" className="form-control"
                                	value={this.state.message} onChange={ev => this.setMessage(ev.target.value)}/>
                                <br/>
                                <button onClick={ev => this.sendMessage(ev)} className="btn btn-primary form-control">Send</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Chat;
