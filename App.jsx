import React, { useState } from "react";
import Button from "./src/components/ui/Button";
import Input from "./src/components/ui/Input";
import Feedback from "./src/components/ui/Feedback";
import Loading from "./src/components/ui/Loading";

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("Jean-Pierre Kasongo");

  return (
    <section style={{ marginTop: "25vh" }}>
      <Loading
        title="En cours de conception..."
        description="L'application est en cours de développement"
      />
    </section>
  );
};

export default App;
