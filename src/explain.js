import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
    setSelectedFriend(null); // in case of formsplitbill opened close it
  }

  function handleAddFriend(newFriend) {
    setFriends((friends) => setFriends([...friends, newFriend]));
    setShowAddFriend(false); // close the formAddFriend after addding a new friend
  }

  function handleSelectFriend(friend) {
    setSelectedFriend((currentSelected) =>
      currentSelected?.id === friend.id ? null : friend
    );
    setShowAddFriend(false); // in case of addFriend is opened close it
  }

  function handleSplitBill(newBalance) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + newBalance }
          : friend
      )
    );
    setSelectedFriend(null); // close the formsplitbill after split bill
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend onAddFriends={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
      {/* And by the way, whenever this happens, */}
      {/* so whenever we have a component
       that doesn't actually need a prop
       but all it does with the prop is to pass it down
       into one of its children, we say that we are prop drilling.
       So in this case that's not a big problem
       but sometimes we need to pass some prop
       through like five or six levels.
       And so then it becomes really problematic
       and we then need to solve that problem. */}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}

      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}$
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 };

    // We also want an ID. And let's create the ID using the built-in browser crypto.randomUUID.
    // And so this is a very good way of generating random IDs right in the browser. So this is not an external packages,
    // but it won't work in older browsers.

    // this URL, if we open it,it will basically give us a small image with the size of 48.
    // But when we reload, it'll each time give us a different image.
    // But of course we don't want that.
    // So we want each image to be fixed basically to the person.
    // And the way we can do that is to attach something here.
    // So it doesn't matter what string,
    // but now each time that we open this URL,
    // we will always get the exact same image.
    // So it'll always be this one here.

    onAddFriends(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👩🏻‍🤝‍🧑🏼 Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📸 Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend: { name }, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const friendExpense = bill ? bill - userExpense : "";
  const [payer, setPayer] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userExpense) return;

    const balaceToAdd = payer === "user" ? friendExpense : -userExpense;

    onSplitBill(balaceToAdd);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>👦 Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense(
            Number(e.target.value) > bill ? userExpense : Number(e.target.value)
          )
        }
      />

      <label>👩🏻‍🤝‍🧑🏽 {name}'s expense</label>
      <input type="text" disabled value={friendExpense} />

      <label>🤑 Who is paying the bill</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );

  // I actually want to ????
  // quickly show you what happens when we click  on one of these other friends.
  // So let's click here.  And you see that the state has not been reset, right ?
  //     So the state that we had here  before is exactly the same when we click on other friends.
  // Now with the knowledge we have at this point,
  //     we are not yet ready to fix this  and also not really ready to understand it.
  // All I can say for now is  that this happens because this component is rendered
  //     in exactly the same place in the componen tree as before.  I mean, when I click here again,
  //     then the same component is rendered again       in exactly the same position.
  // So the component doesn't disappear in the meantime  and so therefore it is not really re - rendered.
  // And so that means that the state then stays the same.  Of course, if I close this and select the same friend again,
  //     then since the component has disappeared  and then appeared again, then the state is reset.
  // But again, if I do this and select another one,     then the component doesn't really completely re-render,
  // at least not the state in it.  So the state is not reset in this case.
  // But don't worry about that for now,  as we will fix this later, once we have a bit more knowledge
}

// notes
// index.css automatically included in index.js (not in app.js) which make the styles automatically applied in app.js
// which I understand that this file become now global and accesable to all components files wihtout including it in eachone
