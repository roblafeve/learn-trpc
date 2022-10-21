import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import "./index.scss";
import { trpc } from "./trpc";

const client = new QueryClient();

const AppContent = () => {
  const messages = trpc.useQuery(["getMessages"]);
  const addMessage = trpc.useMutation(["addMessage"]);

  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  const onAdd = () => {
    addMessage.mutate(
      {
        user,
        message,
      },
      {
        onSuccess: () => client.invalidateQueries(["getMessages"]),
      }
    );
  };

  if (!messages.data) return <div>Loading...</div>;

  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      <div>
        {messages.data.map((m) => (
          <div>
            {m.message} ~ {m.user}
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-4 items-end">
        <input
          type="text"
          value={user}
          placeholder="User"
          onChange={(e) => setUser(e.target.value)}
          className="p-2 border-2 border-gray-300 rounded-lg w-full"
        />
        <input
          type="text"
          value={message}
          placeholder="Message"
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 border-2 border-gray-300 rounded-lg w-full"
        />
        <button className="bg-blue-300 p-2 px-6 rounded-full" onClick={onAdd}>
          Add Message
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({ url: "http://localhost:8080/trpc" })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={client}>
      <QueryClientProvider client={client}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
