import { useState } from "react";
import FriendsList from "./FriendsList";
import Button from "./Button";
import FormAddFriend from "./FormAddFriend";
import FormSplitBill from "./FormSplitBill";

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
        setSelectedFriend((currentSelected) => currentSelected?.id === friend.id ? null : friend
        );
        setShowAddFriend(false); // in case of addFriend is opened close it
    }

    function handleSplitBill(newBalance) {
        setFriends((friends) => friends.map((friend) => friend.id === selectedFriend.id
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
                    selectedFriend={selectedFriend} />

                {showAddFriend && <FormAddFriend onAddFriends={handleAddFriend} />}

                <Button onClick={handleShowAddFriend}>
                    {showAddFriend ? "Close" : "Add friend"}
                </Button>
            </div>
            {selectedFriend && (
                <FormSplitBill
                    selectedFriend={selectedFriend}
                    onSplitBill={handleSplitBill} />
            )}
        </div>
    );
}
