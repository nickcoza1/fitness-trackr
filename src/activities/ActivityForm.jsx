import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createActivity } from "../api/activities";
import { useAuth } from "../auth/AuthContext";

export default function ActivityForm() {
  const { token } = useAuth();
  const qc = useQueryClient();
  const [error, setError] = useState(null);

  const add = useMutation({
    mutationFn: ({ name, description }) =>
      createActivity(token, { name, description }),
    onSuccess: () => {
      setError(null);
      qc.invalidateQueries({ queryKey: ["activities"] });
    },
    onError: (e) => setError(e?.message || "Failed to add activity."),
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    add.mutate({
      name: form.get("name"),
      description: form.get("description"),
    });
    e.currentTarget.reset();
  };

  return (
    <>
      <h2>Add a new activity</h2>
      <form onSubmit={onSubmit}>
        <label>
          Name
          <input type="text" name="name" required />
        </label>
        <label>
          Description
          <input type="text" name="description" required />
        </label>
        <button disabled={add.isPending}>
          {add.isPending ? "Adding…" : "Add activity"}
        </button>
      </form>
      {error && <p role="alert" style={{ color: "red" }}>{error}</p>}
    </>
  );
}
