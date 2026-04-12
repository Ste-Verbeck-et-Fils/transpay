import React, { useState } from "react";
import Button from "./src/components/ui/Button";
import Input from "./src/components/ui/Input";
import Feedback from "./src/components/ui/Feedback";
import Loading from "./src/components/ui/Loading";
import Header from "./src/components/layout/Header";
import Footer from "./src/components/layout/Footer";

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("Jean-Pierre Kasongo");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <section>
          <Loading
            title="En cours de conception..."
            description="L'application est en cours de développement"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
};


export default App;
