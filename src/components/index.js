import React, { Component } from "react";

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    var socketPath = "ws://" + "127.0.0.1:8000" + "/ws/" + "donations";

    const chatSocket = new WebSocket(socketPath);

    chatSocket.onmessage = (e) => {
      let data = JSON.parse(e.data);
      let message = { text: data.message, date: data.utc_time };
      let date = new Date(message.date);
      message.date = date.toString();

      let updated_messages = [...this.state.messages];
      updated_messages.push(message);
      this.setState({ messages: updated_messages });
    };

    chatSocket.onclose = (e) => {
      console.error("Chat socket closed unexpectedly");
    };

    document.querySelector("#chat-message-input").focus();

    document.querySelector("#chat-message-submit").onclick = (e) => {
      var messageInputDom = document.querySelector("#chat-message-input");
      var message = messageInputDom.value;
      if (chatSocket.readyState === WebSocket.OPEN) {
        chatSocket.send(
          JSON.stringify({
            message: message,
          })
        );
      } else {
        console.warn("websocket is not connected");
      }

      messageInputDom.value = "";
    };
  }

  render() {
    return (
      <div>
        {this.state.messages.map(function (item, i) {
          return (
            <div key={i} id="message" className="card">
              <div className="cell large-4">{item.text}</div>
              <div className="cell large-2 text-right">
                <small>{item.date}</small>
              </div>
            </div>
          );
        })}

        <textarea id="chat-message-input" type="text" cols="100" />
        <br />
        <input
          id="chat-message-submit"
          type="button"
          className="button"
          value="Send"
        />
      </div>
    );
  }
}
