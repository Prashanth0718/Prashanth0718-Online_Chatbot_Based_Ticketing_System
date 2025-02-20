import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! Welcome to the Museum Ticket Booking System. How can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    const userMessage = { text: input, sender: "user" };
    setMessages([...messages, userMessage]);
  
    try {
      const response = await axios.post("http://localhost:5000/api/chatbot", { message: input });
      const botReply = { text: response.data.reply, sender: "bot" };
      setMessages([...messages, userMessage, botReply]);
  
      if (input.toLowerCase().includes("book ticket")) {
        // Ask for user details if booking is requested
        const name = prompt("Enter your name:");
        const email = prompt("Enter your email:");
        const phone = prompt("Enter your phone number:");
        const tickets = prompt("How many tickets do you need?");
        
        if (name && email && phone && tickets) {
          await axios.post("http://localhost:5000/api/bookings", {
            name, email, phone, tickets
          });
          setMessages([...messages, userMessage, { text: "Your booking has been confirmed!", sender: "bot" }]);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  
    setInput("");
  };

  const handlePayment = async () => {
    try {
      // Ensure Razorpay SDK is loaded before using it
      if (typeof window.Razorpay === "undefined") {
        alert("Razorpay SDK is not loaded. Please check your internet connection.");
        return;
      }
  
      const response = await axios.post("http://localhost:5000/api/payment", {
        amount: 500, // Amount in INR
      });
  
      const { order } = response.data;
  
      const options = {
        key: "rzp_test_HaIsNuj5rt1n6d", // Replace with your Razorpay Test Key ID
        amount: order.amount,
        currency: order.currency,
        name: "Museum Ticket Booking",
        description: "Purchase Museum Ticket",
        order_id: order.id,
        handler: function (response) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: "Prashanth",
          email: "prashanthsn6363@gmail.com",
          contact: "6363636363",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  
  
    
  

  return (
    <div className="w-full max-w-lg mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto p-2 border rounded bg-white">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-1 ${msg.sender === "bot" ? "text-left" : "text-right"}`}>
            <span className={`inline-block p-2 rounded-lg ${msg.sender === "bot" ? "bg-blue-200" : "bg-green-200"}`}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
  
      {/* Input & Send Button */}
      <div className="mt-2 flex">
        <input
          type="text"
          className="flex-1 p-2 border rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white p-2 rounded-r">
          Send
        </button>
      </div>
  
      {/* Pay Now Button - Placed Below */}
      <button onClick={handlePayment} className="bg-green-500 text-white p-2 mt-4 rounded w-full">
        Pay Now
      </button>
    </div>
  );  
};

export default Chatbot;
