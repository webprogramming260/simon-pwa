const GameEvent = {
  System: 'system',
  End: 'gameEnd',
  Start: 'gameStart',
};

class EventMessage {
  constructor(from, type, value) {
    this.from = from;
    this.type = type;
    this.value = value;
  }
}

class GameEventNotifier {
  events = [];
  handlers = [];

  constructor() {
    // When dev debugging we need to talk to the service and not the React debugger
    let port = window.location.port;
    if (process.env.NODE_ENV !== 'production') {
      port = 3000;
    }

    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    this.socket = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
    this.socket.onopen = (event) => {
      this.receiveEvent(new EventMessage('Simon', GameEvent.System, 'connected'));
    };
    this.socket.onclose = (event) => {
      this.receiveEvent(new EventMessage('Simon', GameEvent.System, 'disconnected'));
    };
    this.socket.onmessage = async (msg) => {
      try {
        const event = JSON.parse(await msg.data.text());
        this.receiveEvent(event);
      } catch {}
    };
  }

  broadcastEvent(from, type, value) {
    const event = new EventMessage(from, type, value);
    this.socket.send(JSON.stringify(event));
  }

  addHandler(handler) {
    this.handlers.push(handler);
    console.log('register handler');
  }

  removeHandler(handler) {
    this.handlers.filter((h) => h !== handler);
    console.log('unregister handler');
  }

  receiveEvent(event) {
    this.events.push(event);

    this.events.forEach((e) => {
      this.handlers.forEach((handler) => {
        handler(e);
      });
    });
  }
}

const GameNotifier = new GameEventNotifier();
export { GameEvent, GameNotifier };
