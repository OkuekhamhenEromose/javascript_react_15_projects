function Greeting({ name, unreadCount }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      {unreadCount > 0 && <p>You have {unreadCount} unread messages.</p>}
    </div>
  );
}

export default Greeting;

// 20 errors
