import { useState } from "react";
import Button from "./Button";

export default function FormSplitBill({ selectedFriend: { name }, onSplitBill }) {
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
                onChange={(e) => setBill(Number(e.target.value))} />

            <label>👦 Your expense</label>
            <input
                type="text"
                value={userExpense}
                onChange={(e) => setUserExpense(
                    Number(e.target.value) > bill ? userExpense : Number(e.target.value)
                )} />

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
}
