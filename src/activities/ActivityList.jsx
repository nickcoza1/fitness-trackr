import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteActivity } from "../api/activities";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

export default function ActivityList({ activities }) {
  const { token } = useAuth();
  const qc = useQueryClient();
  const [errMsg, setErrMsg] = useState("");

  const del = useMutation({
    mutationFn: (id) => deleteActivity(token, id),
    onSuccess: () => {
      setErrMsg("");
      qc.invalidateQueries({ queryKey: ["activities"] });
    },
    onError: (e) => {
      setErrMsg(
        e?.message ||
          "You are not authorized to delete that activity."
      );
    },
  });

  return (
    <ul>
      {errMsg && <p style={{ color: "red" }} role="alert">{errMsg}</p>}
      {activities.map((activity) => (
        <li key={activity.id} style={{ marginBottom: 8 }}>
          {activity.name}
          {" "}
          {/** show delete only when logged in */}
          {token && (
            <button
              onClick={() => del.mutate(activity.id)}
              disabled={del.isPending}
              style={{ marginLeft: 8 }}
            >
              {del.isPending ? "Deleting…" : "Delete"}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
